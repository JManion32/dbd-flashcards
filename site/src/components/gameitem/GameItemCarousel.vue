<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

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
const WINDOW = 4; // cards rendered either side of centre (beyond this they are invisible)

/* Brightness is picked per SLOT, not from the exact distance. A card occupies
   exactly one slot — it can never be half in two — so its brightness is fixed
   the whole time it is in that slot and changes once, when it crosses, with a
   CSS transition carrying it across. Sampling a continuous curve every frame
   instead meant every card's brightness was drifting at all times, which is
   what read as flashing. Index is |slot|; the front card is always 1. */
const SLOT_VISIBILITY = [1, 0.73, 0.35, 0.13, 0.03];
const CLICKABLE_OPACITY = 0.12; // below this a card stops taking pointer events

const DRAG_STEP_REM = 10.7; // ≈ horizontal gap between neighbours
const DRAG_THRESHOLD = 6; // px of travel before a drag suppresses the click

/* Flick-to-scroll. Releasing mid-drag hands the drum whatever speed the finger
   had and lets it coast, so a hard swipe travels a long way instead of pinning
   to the next card — which is how a touch list is expected to behave. Coasting
   distance is roughly velocity / FLING_FRICTION, so the cap puts the ceiling at
   about nine cards per flick. */
const FLING_MIN = 0.8; // cards/sec below which a release just settles
const FLING_MAX = 18; // cards/sec ceiling, so one wild swipe cannot bolt
const FLING_FRICTION = 2; // per second, exponential decay
const FLING_STOP = 0.3; // cards/sec at which coasting gives way to settling

const AUTOPLAY_CARDS_PER_SEC = 0.252; // ≈4.0s to travel one card
const SPEED_RAMP = 4; // how quickly the drift eases in and out (per second)
const NAV_EASE = 9; // how quickly a button press / card click settles

/* Cap on how often the drum is stepped. Motion is already refresh-rate
   independent (every step is scaled by real elapsed time), but the *cost* is
   not: a 240Hz display would otherwise re-render four times as often as a 60Hz
   one for no visible gain. Frames under this budget are skipped and their time
   rolls into the next step, so the speed is unchanged. */
const MIN_FRAME_MS = 1000 / 60;

/* Position is continuous, measured in cards, not an index. The drum is driven
   a fraction of a card per frame, which is what makes the motion a glide
   rather than a tick. */
const position = ref(0);
const dragging = ref(false);
const engaged = ref(false); // pointer over, or keyboard focus inside

const count = computed(() => props.gameItems.length);

watch(count, (n) => {
    if (n > 0) position.value = ((position.value % n) + n) % n;
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
    const centre = position.value;
    const cards = props.gameItems
        .map((gameItem, index) => ({ gameItem, index, offset: wrapOffset(index - centre, n), layer: 0 }))
        .filter((card) => Math.abs(card.offset) <= WINDOW);

    /* Stack by depth *rank*, not by a quantised distance. Rounding distance to
       a z-index let the two cards nearest the centre share a value for about a
       third of a second on every pass; tied elements paint in DOM order, which
       is array order and unrelated to depth, so the back card jumped in front
       and then snapped back once per card. A rank cannot tie, and it only
       changes when the depth order genuinely changes. */
    [...cards]
        .sort((a, b) => Math.abs(b.offset) - Math.abs(a.offset))
        .forEach((card, i) => {
            card.layer = i + 1;
        });

    return cards;
});

function cardStyle(offset: number, layer: number) {
    const theta = offset * ANGLE_STEP;
    const rad = (theta * Math.PI) / 180;
    const x = RADIUS_REM * Math.sin(rad);
    const z = RADIUS_REM * Math.cos(rad) - RADIUS_REM;

    const distance = Math.abs(offset);
    const scale = Math.max(MIN_SCALE, 1 - distance * SCALE_STEP);

    /* The slot this card is in. Position and scale stay continuous — that is
       the motion — while everything that paints is keyed off the slot, so it
       holds still between crossings instead of being rewritten every frame. */
    const slot = Math.min(WINDOW, Math.abs(Math.round(offset)));
    const visibility = SLOT_VISIBILITY[slot] ?? 0;

    /* Deliberately NOT wrapper opacity: a translucent card lets the card and
       shadow behind it show through wherever they overlap. Instead each card
       stays fully opaque and is dimmed by an overlay of the page background,
       which looks the same but still occludes what is behind it. */
    return {
        transform: `translate(-50%, -50%) translateX(${x}rem) translateZ(${z}rem) rotateY(${theta * TILT}deg) scale(${scale})`,
        zIndex: layer,
        pointerEvents: visibility < CLICKABLE_OPACITY ? 'none' : 'auto',
        '--card-dim': 1 - visibility,
        '--card-shadow-opacity': visibility,

        /* Asymmetric on purpose. A symmetric crossfade dips the front of the
           drum: halfway through, the card leaving and the card arriving are
           both at half brightness, so the brightest thing on screen is dimmer
           than either end state — a dip exactly on the changeover. Arriving at
           the front is instant, so the front is never less than fully lit;
           everything else eases, so nothing visibly snaps. */
        '--card-fade': slot === 0 ? '0ms' : '500ms',
    } as const;
}

function go(delta: number) {
    if (count.value === 0) return;
    flinging = false;
    flingVelocity = 0;
    navTarget = (navTarget ?? position.value) + delta;
}

/* --- Motion ---------------------------------------------------------------
   One requestAnimationFrame loop owns all movement, so drift, button presses
   and drag-release all share the same continuous position and never fight one
   another. It yields to the viewer rather than fighting them: hovering,
   focusing, dragging, opening a card's modal, or backgrounding the tab all
   bring it to rest, so a card is never pulled out from under a click. */
let navTarget: number | null = null;
let speed = 0; // cards per second, eased towards the desired drift
let flingVelocity = 0; // cards per second, while coasting after a flick
let flinging = false;
let rafId = 0;
let lastFrame = 0;

const reducedMotion =
    typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

/* Modal.vue teleports its backdrop to <body>, so its presence is the one
   signal available here that a card has been opened. A backdrop playing its
   leave transition is already on its way out, so it does not count: treating
   it as open would stall autoplay for good if that transition never ended. */
function modalIsOpen() {
    const backdrop = document.querySelector('.modal-backdrop');
    return !!backdrop && !backdrop.className.includes('leave-active');
}

function driftBlocked() {
    return engaged.value || dragging.value || document.hidden || modalIsOpen() || !!reducedMotion?.matches;
}

function frame(now: number) {
    rafId = requestAnimationFrame(frame);

    if (!lastFrame) {
        lastFrame = now;
        return;
    }
    const elapsed = now - lastFrame;
    if (elapsed < MIN_FRAME_MS) return; // skip; the time rolls into the next step
    lastFrame = now;

    const dt = Math.min(elapsed / 1000, 0.1);
    const n = count.value;
    if (n === 0) return;

    // While dragging, the pointer writes position directly.
    if (dragging.value) {
        speed = 0;
        return;
    }

    // Coasting after a flick: let it run down, then settle onto a card.
    if (flinging) {
        position.value += flingVelocity * dt;
        flingVelocity *= Math.exp(-FLING_FRICTION * dt);
        if (Math.abs(flingVelocity) < FLING_STOP) {
            flinging = false;
            flingVelocity = 0;
            navTarget = Math.round(position.value);
        }
        speed = 0;
        return;
    }

    // A button press or a clicked card glides to its target, drift suspended.
    if (navTarget !== null) {
        const remaining = navTarget - position.value;
        if (Math.abs(remaining) < 0.001) {
            position.value = navTarget;
            navTarget = null;
        } else {
            position.value += remaining * (1 - Math.exp(-NAV_EASE * dt));
        }
        speed = 0;
        return;
    }

    const desired = n > 1 && !driftBlocked() ? AUTOPLAY_CARDS_PER_SEC : 0;
    speed += (desired - speed) * (1 - Math.exp(-SPEED_RAMP * dt));

    // Once it has coasted to a stop, tidy onto the nearest card so a paused
    // drum never sits frozen between two of them.
    if (desired === 0 && Math.abs(speed) < 0.02) {
        speed = 0;
        const nearest = Math.round(position.value);
        if (Math.abs(nearest - position.value) > 0.001) navTarget = nearest;
        return;
    }

    position.value = (position.value + speed * dt) % n;
}

onMounted(() => {
    rafId = requestAnimationFrame(frame);
});

onUnmounted(() => {
    cancelAnimationFrame(rafId);
});

/* --- Pointer drag ---------------------------------------------------------
   Deliberately no setPointerCapture: capturing retargets the follow-up click
   to the viewport, which would stop cards ever receiving it — no modal, and no
   click-to-centre. Window listeners keep the click landing on the card. */
let startX = 0;
let dragStartPosition = 0;
let suppressClick = false;
let lastMoveAt = 0;
let lastMovePosition = 0;

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
    const next = dragStartPosition - dx / (DRAG_STEP_REM * rootFontPx());

    /* Track the finger's speed so a release can hand it to the coast. Smoothed,
       because one jittery sample right before lift-off would otherwise decide
       how far the whole flick travels. */
    const now = performance.now();
    const elapsed = (now - lastMoveAt) / 1000;
    if (lastMoveAt && elapsed > 0) {
        flingVelocity = flingVelocity * 0.7 + ((next - lastMovePosition) / elapsed) * 0.3;
    }
    lastMoveAt = now;
    lastMovePosition = next;

    position.value = next;
}

function stopDragListening() {
    window.removeEventListener('pointermove', onWindowPointerMove);
    window.removeEventListener('pointerup', onDragRelease);
    window.removeEventListener('pointercancel', onDragCancel);
    dragging.value = false;
}

function onDragRelease() {
    stopDragListening();
    const v = Math.max(-FLING_MAX, Math.min(FLING_MAX, flingVelocity));
    if (Math.abs(v) >= FLING_MIN) {
        flingVelocity = v;
        flinging = true; // frame() takes it from here
    } else {
        flingVelocity = 0;
        navTarget = Math.round(position.value); // settle onto the nearest card
    }
}

/* A cancel is the browser taking the gesture over (a vertical page scroll, say)
   rather than the user letting go, so it settles instead of coasting. */
function onDragCancel() {
    stopDragListening();
    flingVelocity = 0;
    navTarget = Math.round(position.value);
}

function onPointerDown(event: PointerEvent) {
    if (event.button !== 0 || count.value === 0) return;
    startX = event.clientX;
    dragStartPosition = position.value;
    navTarget = null;
    suppressClick = false;

    // Grabbing mid-coast catches the drum, the way a touch list does.
    flinging = false;
    flingVelocity = 0;
    lastMoveAt = 0;
    lastMovePosition = position.value;

    window.addEventListener('pointermove', onWindowPointerMove);
    window.addEventListener('pointerup', onDragRelease);
    window.addEventListener('pointercancel', onDragCancel);
}

onUnmounted(() => {
    window.removeEventListener('pointermove', onWindowPointerMove);
    window.removeEventListener('pointerup', onDragRelease);
    window.removeEventListener('pointercancel', onDragCancel);
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
        @pointerenter="engaged = true"
        @pointerleave="engaged = false"
        @focusin="engaged = true"
        @focusout="engaged = false"
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
                :style="cardStyle(card.offset, card.layer)"
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

    /* No CSS transition on purpose: the rAF loop writes a new transform every
       frame, and a transition would lag a frame behind and smear the motion. */
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

    /* Only fires when a card changes slot, which is the whole point: the value
       is otherwise constant, so this is a handful of transitions per card
       rather than a fresh opacity on every frame. */
    transition: opacity var(--card-fade, 500ms) ease;
    pointer-events: none;
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
/* The shadow is painted once, at full strength, and never changes — only its
   opacity does. Animating box-shadow itself re-rasterises the card's layer on
   every frame of the transition, and at a crossing every card transitions at
   once, so that burst landed exactly on the changeover. Opacity is cheap and
   compositable, and the shadow still fades out with the card. */
.carousel-card::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 1rem; /* matches .display-card, so the shadow follows it */
    box-shadow:
        0 0 0.7rem rgb(0 0 0 / 40%),
        0 1.2rem 2.6rem rgb(0 0 0 / 70%);
    opacity: var(--card-shadow-opacity, 1);
    transition: opacity var(--card-fade, 500ms) ease;
    pointer-events: none;
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
