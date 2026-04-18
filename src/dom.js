// Os elementos só estarão disponíveis estaticamente se importados após o DOMContentLoaded, 
// ou encapsulados em um get getter (ou chamados de app.js na injeção).
// A abordagem mais limpa: O App.js chama a inicialização do DOM que popula esse cache.

export const DOM = {};

export function initDOM() {
    Object.assign(DOM, {
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
        
        loginModal: document.getElementById('login-modal'),
        loginForm: document.getElementById('login-form'),
        loginError: document.getElementById('login-error'),
        
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
        helpModal: document.getElementById('help-modal')
    });
}
