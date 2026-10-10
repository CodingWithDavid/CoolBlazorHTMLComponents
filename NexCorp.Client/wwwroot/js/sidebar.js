function reducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function open(dialog) {
    dialog.showModal();
    if (!reducedMotion()) {
        dialog.animate(
            [{ transform: "translateX(-100%)" }, { transform: "translateX(0)" }],
            { duration: 280, easing: "cubic-bezier(.22, 1, .36, 1)" }
        );
    }
}

export async function close(dialog) {
    if (!dialog.open) return;
    if (!reducedMotion()) {
        await dialog.animate(
            [{ transform: "translateX(0)" }, { transform: "translateX(-100%)" }],
            { duration: 200, easing: "ease-in", fill: "forwards" }
        ).finished;
    }
    dispose(dialog);
}

export function isOutside(dialog, x, y) {
    const bounds = dialog.getBoundingClientRect();
    return x < bounds.left || x > bounds.right || y < bounds.top || y > bounds.bottom;
}

export function dispose(dialog) {
    dialog.close();
    for (const animation of dialog.getAnimations()) animation.cancel();
}
