import { onMounted, onUnmounted, ref, type Ref } from 'vue';

/**
 * Returns a flag that flips to true the first time `el` scrolls into view.
 * Pair with the `.reveal` / `.reveal.visible` classes in base.css.
 */
export function useRevealOnScroll(el: Ref<HTMLElement | null>, threshold = 0.15) {
    const isVisible = ref(false);

    let observer: IntersectionObserver | null = null;

    onMounted(() => {
        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    isVisible.value = true;
                    observer?.disconnect();
                }
            },
            { threshold }
        );

        if (el.value) {
            observer.observe(el.value);
        }
    });

    onUnmounted(() => {
        observer?.disconnect();
    });

    return isVisible;
}
