<script setup lang="ts">
/* Toasts from the service worker (vite.config.ts → VitePWA):
   - "Ready to use offline" once the first visit has downloaded the whole site
   - "New version available" when a deploy lands; the page only reloads when the user taps Reload,
     so an update never interrupts a study session */
import { watch } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';

const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();

// The offline notice is informational, so it clears itself
watch(offlineReady, (ready) => {
    if (ready) {
        setTimeout(() => (offlineReady.value = false), 6000);
    }
});

function close() {
    offlineReady.value = false;
    needRefresh.value = false;
}
</script>

<template>
    <Transition name="toast">
        <div
            v-if="offlineReady || needRefresh"
            class="update-toast"
            role="status"
        >
            <span class="update-toast-text">
                {{ needRefresh ? 'A new version is available.' : 'Ready to use offline.' }}
            </span>
            <button
                v-if="needRefresh"
                class="update-toast-btn reload"
                @click="updateServiceWorker(true)"
            >
                Reload
            </button>
            <button
                class="update-toast-btn"
                aria-label="Dismiss"
                @click="close"
            >
                &times;
            </button>
        </div>
    </Transition>
</template>

<style scoped>
.update-toast {
    position: fixed;
    bottom: calc(1.25rem + env(safe-area-inset-bottom));
    left: 50%;
    z-index: 3000;
    translate: -50% 0;

    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.6rem 0.6rem 0.6rem 1.1rem;
    border-radius: 0.85rem;
    background: color-mix(in srgb, var(--standard-gold) 10%, var(--dark-2));
    border: 1px solid color-mix(in srgb, var(--standard-gold) 60%, transparent);
    box-shadow: 0 0.5rem 1.5rem rgb(0 0 0 / 50%);
    white-space: nowrap;
}
.update-toast-text {
    color: var(--standard-white);
    font-weight: 700;
}
.update-toast-btn {
    padding: 0.35rem 0.6rem;
    border: none;
    border-radius: 0.5rem;
    background: none;
    color: var(--dim-text);
    font-family: inherit;
    font-size: 1rem;
    font-weight: 800;
    cursor: pointer;
    transition: var(--site-transition);

    &:hover {
        color: var(--standard-white);
        background: var(--dark-4);
    }

    &.reload {
        color: var(--standard-white);
        background: var(--dark-4);
    }
}
.toast-enter-active,
.toast-leave-active {
    transition: var(--site-transition);
}
.toast-enter-from,
.toast-leave-to {
    opacity: 0;
    translate: -50% 0.5rem;
}
</style>
