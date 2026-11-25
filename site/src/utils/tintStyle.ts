/* Tinted surface for cards and modals: a dark wash of the color with a matching border, and
   scrollbars inside it in the same color (base.css reads --scroll-thumb; children inherit it) */

export function getTintStyle(color?: string) {
    if (!color) {
        return {};
    }
    return {
        background: `color-mix(in srgb, ${color} 16%, var(--standard-black))`,
        border: `1px solid ${color}`,
        '--scroll-thumb': `color-mix(in srgb, ${color} 30%, var(--dark-2))`,
    };
}
