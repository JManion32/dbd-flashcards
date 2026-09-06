<script setup lang="ts">
import { onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
    visible: boolean;
    transition: 'slide-up' | 'fade' | 'scale';
}>();
const emit = defineEmits<{
    close: [];
}>();

function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && props.visible) {
        emit('close');
    }
}

function lockScroll() {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = `${scrollbarWidth}px`;
}

function unlockScroll() {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
}

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
    unlockScroll();
});

watch(
    () => props.visible,
    (visible) => {
        if (visible) {
            lockScroll();
        }
    }
);
</script>

<template>
    <Teleport to="body">
        <Transition
            :name="transition"
            @after-leave="unlockScroll"
        >
            <div
                v-if="visible"
                class="modal-backdrop"
                @click.self="emit('close')"
            >
                <div class="modal-container">
                    <slot />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgb(0 0 0 / 95%);
    z-index: 1000;
}
.modal-container {
    height: 52rem;
    width: 48rem;
    background: var(--site-bg);
    border-radius: 1rem;
    padding: 2rem;
}

/* Slide up */
.slide-up-enter-active,
.slide-up-leave-active {
    transition: opacity 0.35s ease;
}

.slide-up-enter-active .modal-container,
.slide-up-leave-active .modal-container {
    transition: transform 0.35s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
    opacity: 0;
}

.slide-up-enter-from .modal-container,
.slide-up-leave-to .modal-container {
    transform: translateY(24rem);
}

/* Fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* Scale */
.scale-enter-active,
.scale-leave-active {
    transition: opacity 0.2s ease;
}

.scale-enter-active .modal-container,
.scale-leave-active .modal-container {
    transition: transform 0.2s ease;
}

.scale-enter-from,
.scale-leave-to {
    opacity: 0;
}

.scale-enter-from .modal-container,
.scale-leave-to .modal-container {
    transform: scale(0.9);
}
</style>
