const focusHandlers = new WeakMap();

function settings(target) {
    const date = new Date(target);
    const pad = value => String(value).padStart(2, "0");
    return {
        targetMilliseconds: target,
        localValue: `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
    };
}

export function load(storageKey, initialTarget) {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) {
        const target = Number(saved);
        if (!saved.trim() || !Number.isFinite(target) || !Number.isFinite(new Date(target).getTime())) {
            throw new Error("The saved countdown date is invalid.");
        }
        return settings(target);
    }
    const target = initialTarget ?? Date.now() + ((11 * 24 + 4) * 60 * 60 + 25 * 60 + 58) * 1000;
    localStorage.setItem(storageKey, String(target));
    return settings(target);
}

export function save(storageKey, localValue) {
    const target = new Date(localValue).getTime();
    if (!Number.isFinite(target) || target <= Date.now()) {
        throw new Error("Choose a valid future date.");
    }
    localStorage.setItem(storageKey, String(target));
    return settings(target);
}

// Keep native Tab behavior, wrapping only at the modal's boundaries.
function trapFocus(root, event) {
    if (event.key !== "Tab") return;
    const dialog = root.querySelector(".date-editor");
    if (!dialog || !dialog.contains(event.target)) return;
    const controls = [...dialog.querySelectorAll("input, button")];
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
    }
}

export function attach(root) {
    if (focusHandlers.has(root)) return;
    const handler = event => trapFocus(root, event);
    focusHandlers.set(root, handler);
    root.addEventListener("keydown", handler);
}

export function dispose(root) {
    const handler = focusHandlers.get(root);
    if (handler) {
        root.removeEventListener("keydown", handler);
        focusHandlers.delete(root);
    }
}
