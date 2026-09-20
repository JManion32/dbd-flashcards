<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue';

import GameItemModal from '@/components/gameitem/GameItemModal.vue';
import type { GameItem } from '@/types/GameItem.ts';

const props = defineProps<{
    gameItems: GameItem[];
}>();

/* --- Drum geometry -------------------------------------------------------
   Cards sit on a circle of RADIUS_REM whose centre is RADIUS_REM behind the
   screen, one every ANGLE_STEP degrees. Depth (translateZ) plus the viewport's
   perspective is what actually shrinks the side cards, so the fall-off is a
   real projection rather than a hand-tuned scale ramp. */
const ANGLE_STEP = 15;
const RADIUS_REM = 44;
const TILT = 0.75; // 1 = card lies fully tangent to the drum
const SCALE_STEP = 0.04; // small extra shrink so the fall-off reads clearly
const MIN_SCALE = 0.7;
const WINDOW = 5; // cards rendered either side of centre

/* Opacity falls off on a curve rather than a ramp so the front card reads as
   clearly on top: 1 -> 0.65 -> 0.38 -> 0.19 at one, two and three cards out. */
const FADE_END = 5.6;
const FADE_POWER = 2.2;
const CLICKABLE_OPACITY = 0.12; // below this a card stops taking pointer events

const DRAG_STEP_REM = 10.7; // ≈ horizontal gap between neighbours
const DRAG_THRESHOLD = 6; // px of travel before a drag suppresses the click

const current = ref(0);
const dragOffset = ref(0);
const dragging = ref(false);

const count = computed(() => props.gameItems.length);

watch(count, (n) => {
    if (current.value > n - 1) current.value = Math.max(0, n - 1);
});

/** Shortest signed distance from centre to index, wrapping around the drum. */
function wrapOffset(raw: number, n: number) {
    if (n <= 1) return raw;
    let d = ((raw % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
}

const visible = computed(() => {
    const n = count.value;
    const centre = current.value + dragOffset.value;
    return props.gameItems
        .map((gameItem, index) => ({ gameItem, index, offset: wrapOffset(index - centre, n) }))
        .filter((card) => Math.abs(card.offset) <= WINDOW);
});

function fadeFor(distance: number) {
    return Math.max(0, Math.pow(Math.max(0, 1 - distance / FADE_END), FADE_POWER));
}

/* Front card gets the deepest, widest shadow; it tightens with distance so the
   stack reads as layered instead of one flat sheet of cards. Both alphas are
   scaled by `visibility` so a card that has faded into the background cannot
   leave an orphaned shadow floating behind it. */
function shadowFor(distance: number, visibility: number) {
    const t = Math.min(1, distance / 4);

    // Ambient halo hugging the card edge. Blurred and spread-less on purpose:
    // a 0-blur spread reads as a hard drawn ring rather than a shadow.
    const ambientBlur = 0.7 - 0.3 * t;
    const ambientAlpha = Math.round((0.4 - 0.18 * t) * visibility * 100);

    // Cast shadow, which is what actually lifts the front card off the page.
    const y = 1.2 - 0.85 * t;
    const blur = 2.6 - 1.5 * t;
    const alpha = Math.round((0.7 - 0.4 * t) * visibility * 100);

    return `0 0 ${ambientBlur.toFixed(2)}rem rgb(0 0 0 / ${ambientAlpha}%), 0 ${y.toFixed(2)}rem ${blur.toFixed(2)}rem rgb(0 0 0 / ${alpha}%)`;
}

function cardStyle(offset: number) {
    const theta = offset * ANGLE_STEP;
    const rad = (theta * Math.PI) / 180;
    const x = RADIUS_REM * Math.sin(rad);
    const z = RADIUS_REM * Math.cos(rad) - RADIUS_REM;

    const distance = Math.abs(offset);
    const scale = Math.max(MIN_SCALE, 1 - distance * SCALE_STEP);
    const visibility = fadeFor(distance);

    /* Deliberately NOT wrapper opacity: a translucent card lets the card and
       shadow behind it show through wherever they overlap. Instead each card
       stays fully opaque and is dimmed by an overlay of the page background,
       which looks the same but still occludes what is behind it. */
    return {
        transform: `translate(-50%, -50%) translateX(${x}rem) translateZ(${z}rem) rotateY(${theta * TILT}deg) scale(${scale})`,
        zIndex: 1000 - Math.round(distance * 10),
        pointerEvents: visibility < CLICKABLE_OPACITY ? 'none' : 'auto',
        '--card-dim': 1 - visibility,
        '--card-shadow': shadowFor(distance, visibility),
    } as const;
}

function go(delta: number) {
    const n = count.value;
    if (n === 0) return;
    current.value = (((current.value + delta) % n) + n) % n;
}

/* --- Pointer drag ---------------------------------------------------------
   Deliberately no setPointerCapture: capturing retargets the follow-up click
   to the viewport, which would stop cards ever receiving it — no modal, and no
   click-to-centre. Window listeners keep the click landing on the card. */
let startX = 0;
let suppressClick = false;

function rootFontPx() {
    const size = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return Number.isFinite(size) && size > 0 ? size : 16;
}

function onWindowPointerMove(event: PointerEvent) {
    const dx = event.clientX - startX;
    if (Math.abs(dx) > DRAG_THRESHOLD) {
        suppressClick = true;
        dragging.value = true;
    }
    dragOffset.value = -dx / (DRAG_STEP_REM * rootFontPx());
}

function endDrag() {
    window.removeEventListener('pointermove', onWindowPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
    dragging.value = false;
    go(Math.round(dragOffset.value));
    dragOffset.value = 0;
}

function onPointerDown(event: PointerEvent) {
    if (event.button !== 0 || count.value === 0) return;
    startX = event.clientX;
    suppressClick = false;
    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', endDrag);
    window.addEventListener('pointercancel', endDrag);
}

onUnmounted(() => {
    window.removeEventListener('pointermove', onWindowPointerMove);
    window.removeEventListener('pointerup', endDrag);
    window.removeEventListener('pointercancel', endDrag);
});

/* A click on an off-centre card rotates the drum to it instead of opening its
   modal, so intercept in the capture phase before GameItemModal sees it. The
   centre card falls through untouched and opens as normal. */
function onCardClickCapture(event: MouseEvent, offset: number) {
    const wasDrag = suppressClick;
    suppressClick = false;
    if (wasDrag || Math.round(offset) !== 0) {
        event.stopPropagation();
        event.preventDefault();
        if (!wasDrag) go(Math.round(offset));
    }
}
</script>

<template>
    <div
        v-if="count > 0"
        class="game-item-carousel"
    >
        <button
            class="carousel-btn carousel-btn-left"
            aria-label="Previous item"
            @click="go(-1)"
        >
            ‹
        </button>

        <div
            class="carousel-viewport"
            :class="{ dragging }"
            tabindex="0"
            role="group"
            aria-label="Game item carousel"
            @pointerdown="onPointerDown"
            @keydown.left.prevent="go(-1)"
            @keydown.right.prevent="go(1)"
        >
            <div
                v-for="card in visible"
                :key="card.gameItem.id"
                class="carousel-card"
                :class="{ 'is-active': Math.round(card.offset) === 0 }"
                :style="cardStyle(card.offset)"
                :aria-hidden="Math.round(card.offset) !== 0 ? 'true' : undefined"
                @click.capture="onCardClickCapture($event, card.offset)"
            >
                <GameItemModal :game-item="card.gameItem" />
            </div>
        </div>

        <button
            class="carousel-btn carousel-btn-right"
            aria-label="Next item"
            @click="go(1)"
        >
            ›
        </button>
    </div>
</template>

<style scoped>
.game-item-carousel {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
}
.carousel-viewport {
    position: relative;
    width: 100%;
    height: 17rem;
    perspective: 75rem;
    overflow: hidden;
    cursor: grab;
    touch-action: pan-y;
    outline: none;
}
.carousel-viewport.dragging {
    cursor: grabbing;
}
.carousel-viewport:focus-visible {
    outline: 2px solid var(--standard-gray);
    outline-offset: 4px;
    border-radius: 1rem;
}
.carousel-card {
    position: absolute;

    /* Sits above centre: the cast shadow is thrown downwards, so it needs more
       clearance below the card than above. A fixed rem offset rather than a
       percentage, so it holds if the viewport height changes. */
    top: calc(50% - 1.2rem);
    left: 50%;
    transform-origin: center center;
    transition: transform 0.45s cubic-bezier(0.22, 0.61, 0.36, 1);
    will-change: transform;
}

/* The dimming veil. Painted in the page background over an opaque card, so a
   receding card blends into the page without ever becoming see-through. */
.carousel-card::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 1;
    border-radius: 1rem; /* matches .display-card */
    background: var(--site-bg);
    opacity: var(--card-dim, 0);
    transition: opacity 0.45s ease;
    pointer-events: none;
}
.carousel-viewport.dragging .carousel-card,
.carousel-viewport.dragging .carousel-card::after {
    transition: none;
}

/* GameItemDisplay dims every card to 60% by default; on the drum the veil
   above owns that job, so the card itself must stay fully opaque. */
.carousel-card :deep(.display-card) {
    opacity: 1;
}
/* Only the focused card reacts to hover — side cards are click-to-centre. */
.carousel-card:not(.is-active) :deep(.display-card:hover) {
    scale: 1;
    cursor: pointer;
}
/* Depth-scaled shadow, handed down as a custom property by cardStyle(). */
.carousel-card :deep(.display-card) {
    box-shadow: var(--card-shadow);
}

.carousel-btn {
    position: absolute;
    top: 50%;
    z-index: 2000;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: var(--dark-222);
    color: var(--standard-dim);
    font-size: 2rem;
    line-height: 1;
    transition: var(--site-transition);
    cursor: pointer;
}
.carousel-btn:hover {
    background: var(--dark-333);
    color: var(--standard-white);
    scale: 1.08;
}
.carousel-btn-left {
    left: 0;
}
.carousel-btn-right {
    right: 0;
}
</style>
