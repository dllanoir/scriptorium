/**
 * @namespace State
 * @description Centralized application state.
 */
export const State = {
    collections: [],
    texts: [],
    activeCollectionId: 1, // Default ID
    activeTextId: null,
    user: null,
    isLoadingTexts: false,
    isLoadingCollections: false,
    isLoadingData: false,
    pendingDeleteCollectionId: null
};
