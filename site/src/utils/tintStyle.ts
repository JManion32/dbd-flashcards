/* Tinted surface for cards and modals: a dark wash of the color with a matching border */

export function getTintStyle(color?: string) {
    if (!color) {
        return {};
    }
    return {
        background: `color-mix(in srgb, ${color} 16%, var(--standard-black))`,
        border: `1px solid ${color}`,
    };
}
