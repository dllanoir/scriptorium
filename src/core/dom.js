/**
 * @namespace DOM
 * @description Centralized DOM element cache.
 */
export const DOM = {};

/**
 * Initializes the DOM element cache.
 */
export function initDOM() {
    Object.assign(DOM, {
        app: document.getElementById('app'),
        collectionsList: document.getElementById('collections-list'),
        textListContainer: document.getElementById('text-list-container'),
        searchBox: document.getElementById('search-box'),
        
        readingPane: document.getElementById('reading-pane'),
        emptyState: document.getElementById('empty-state'),
        errorState: document.getElementById('error-state'),
        contentDisplay: document.getElementById('content-display'),
        errorMessage: document.getElementById('error-message'),
        
        textTitle: document.getElementById('text-title'),
        textDate: document.getElementById('text-date'),
        textBody: document.getElementById('text-body'),
        
        authButton: document.getElementById('auth-button'),
        newTextBtn: document.getElementById('new-text-button'),
        retryBtn: document.getElementById('retry-button'),
        
        userInfo: document.getElementById('user-info'),
        userEmail: document.getElementById('user-email'),
        
        authGate: document.getElementById('auth-gate'),
        landingLoginForm: document.getElementById('landing-login-form'),
        landingEmail: document.getElementById('landing-email'),
        landingPassword: document.getElementById('landing-password'),
        landingLoginError: document.getElementById('landing-login-error'),
        landingSubmitBtn: document.getElementById('landing-submit-btn'),
        togglePasswordBtn: document.getElementById('toggle-landing-password'),
        zenToggleBtn: document.getElementById('zen-mode-toggle'),
        textMetrics: document.getElementById('text-metrics'),
        editorMetrics: document.getElementById('editor-metrics'),
        draftStatus: document.getElementById('draft-status'),
        copyTextBtn: document.getElementById('copy-text-button'),
        exportMdBtn: document.getElementById('export-md-button'),
        exportTxtBtn: document.getElementById('export-txt-button'),
        sortSelect: document.getElementById('sort-texts-select'),
        textListCount: document.getElementById('text-list-count'),
        markdownToolbar: document.getElementById('markdown-toolbar'),
        
        newTextModal: document.getElementById('new-text-modal'),
        newTextForm: document.getElementById('new-text-form'),
        newCollectionSelect: document.getElementById('new-collection'),

        mobileOverlay: document.getElementById('mobile-overlay'),
        sidebar: document.querySelector('aside'),
        textListSection: document.getElementById('text-list-section'),
        
        mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
        closeSidebarBtn: document.getElementById('close-sidebar'),
        backToReadingBtn: document.getElementById('back-to-reading'),
        showTextListBtn: document.getElementById('show-text-list'),
        
        settingsBtn: document.getElementById('settings-button'),
        helpBtn: document.getElementById('help-button'),
        settingsModal: document.getElementById('settings-modal'),
        helpModal: document.getElementById('help-modal'),
        
        // Settings Selectors
        settingFont: document.getElementById('setting-font'),
        settingSize: document.getElementById('setting-size'),
        
        // Edit and Delete
        textActions: document.getElementById('text-actions'),
        editBtn: document.getElementById('edit-text-button'),
        deleteBtn: document.getElementById('delete-text-button'),
        deleteModal: document.getElementById('delete-modal'),
        confirmDeleteBtn: document.getElementById('confirm-delete-button'),
        editIdInput: document.getElementById('edit-text-id'),
        saveTextLabel: document.getElementById('save-text-label'),
        charCounter: document.getElementById('char-counter'),
        
        // Collection CRUD
        addCollectionBtn: document.getElementById('add-collection-button'),
        collectionModal: document.getElementById('collection-modal'),
        collectionModalTitle: document.getElementById('collection-modal-title'),
        collectionForm: document.getElementById('collection-form'),
        collectionNameInput: document.getElementById('collection-name'),
        collectionIconInput: document.getElementById('collection-icon'),
        editCollectionIdInput: document.getElementById('edit-collection-id'),
        collectionSaveLabel: document.getElementById('collection-save-label'),
        iconPicker: document.getElementById('icon-picker'),
        deleteCollectionModal: document.getElementById('delete-collection-modal'),
        confirmDeleteCollectionBtn: document.getElementById('confirm-delete-collection-button')
    });
}
