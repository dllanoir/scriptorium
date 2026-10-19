/**
 * @namespace State
 * @description Centralized reactive application state.
 */

const listeners = new Set();

export const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
};

const notify = (prop, value, target) => {
    for (const listener of listeners) {
        listener(prop, value, target);
    }
};

const targetState = {
    collections: [],
    texts: [],
    activeCollectionId: 1, // Default ID
    activeTextId: null,
    user: null,
    isLoadingTexts: false,
    isLoadingCollections: false,
    isLoadingData: false,
    pendingDeleteCollectionId: null,
    isZenMode: false,
    sortOrder: (typeof localStorage !== 'undefined' && localStorage.getItem('scriptorium_sort_order')) || 'newest'
};

export const State = new Proxy(targetState, {
    set(target, prop, value) {
        if (target[prop] === value) return true;
        target[prop] = value;
        notify(prop, value, target);
        return true;
    }
});
