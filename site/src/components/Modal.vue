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

watch(
    () => props.visible,
    (visible) => {
        document.body.style.overflow = visible ? 'hidden' : '';
    }
);

onMounted(() => {
    window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
    window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
    <Teleport to="body">
        <Transition :name="transition">
            <div
                v-if="visible"
                class="modal-backdrop"
                @click.self="emit('close')"
            >
                <div class="modal-container">
                    <div class="modal-close-container">
                        <button
                            class="modal-close-btn"
                            @click.self="emit('close')"
                        >
                            &times;
                        </button>
                    </div>
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
    width: var(--modal-width);
    background: var(--site-bg);
    border-radius: 1rem;
    padding: var(--modal-padding);
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
.modal-close-container {
    display: flex;
    flex-direction: row;
    width: 100%;
    height: 1.5rem;
}
.modal-close-btn {
    margin-left: auto;
    height: 1.5rem;
    width: 1.5rem;
    font-weight: 900;
    color: var(--scroll-thumb);
    transition: var(--site-transition);
    background: none;
    border: none;
    padding: none;
    font-size: 1.75rem;
}
.modal-close-btn:hover {
    cursor: pointer;
    scale: 1.05;
    color: #353535;
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
