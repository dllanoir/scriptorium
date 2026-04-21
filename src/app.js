import { initDOM, DOM } from './core/dom.js';
import { Api } from './api/index.js';
import { UI } from './components/index.js';
import { Controllers } from './core/controllers.js';
import { State } from './core/state.js';
import { Utils } from './utils/index.js';
import { Settings } from './core/settings.js';

/**
 * Attaches all global event listeners.
 */
function attachEventListeners() {
    // Auth State Change Observer
    Api.onAuthStateChange(async (event, session) => {
        // Broadened to handle INITIAL_SESSION and other state changes consistently
        if (session) {
            UI.updateAuthUI(session);
            await Controllers.loadData();
        } else {
            UI.updateAuthUI(null);
        }
    });

    // Collection Navigation and Actions
    DOM.collectionsList.addEventListener('click', (e) => {
        const editBtn = e.target.closest('.collection-edit-btn');
        if (editBtn) {
            e.stopPropagation();
            Controllers.handleCollectionEditClick(editBtn.dataset.colId);
            return;
        }

        const deleteBtn = e.target.closest('.collection-delete-btn');
        if (deleteBtn) {
            e.stopPropagation();
            State.pendingDeleteCollectionId = parseInt(deleteBtn.dataset.colId, 10);
            UI.toggleModal(DOM.deleteCollectionModal, true);
            return;
        }

        const item = e.target.closest('.collection-link');
        if (item) {
            const id = parseInt(item.dataset.collectionId, 10);
            Controllers.handleCollectionSelect(id);
            if (window.innerWidth < 768) {
                UI.toggleMobileSidebar();
                UI.showMobileTextList();
            }
        }
    });

    // Text Selection
    DOM.textListContainer.addEventListener('click', (e) => {
        const item = e.target.closest('.text-item');
        if (item) {
            const id = parseInt(item.dataset.textId, 10);
            Controllers.handleTextSelect(id);
            if (window.innerWidth < 768) {
                UI.hideMobileTextList();
            }
        }
    });

    // Search
    DOM.searchBox.addEventListener('input', (e) => {
        UI.renderTextList(e.target.value);
    });

    // Generic Modal Close
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.close;
            const modal = document.getElementById(targetId);
            if (modal) UI.toggleModal(modal, false);
        });
    });

    // Auth Button Login/Logout (EVENT DELEGATION for persistence)
    document.addEventListener('click', async (e) => {
        const authBtn = e.target.closest('#auth-button');
        if (authBtn) {
            if (State.user) {
                await Api.logout();
                Utils.toast('Sessão encerrada.');
            } else {
                UI.updateAuthUI(null);
            }
        }
    });

    // Forms
    if (DOM.landingLoginForm) DOM.landingLoginForm.addEventListener('submit', Controllers.handleLoginSubmit);
    if (DOM.loginForm) DOM.loginForm.addEventListener('submit', Controllers.handleLoginSubmit);
    DOM.newTextForm.addEventListener('submit', Controllers.handleNewTextSubmit);
    
    // CRUD Buttons
    if (DOM.editBtn) DOM.editBtn.addEventListener('click', Controllers.handleEditClick);
    
    if (DOM.deleteBtn) {
        DOM.deleteBtn.addEventListener('click', () => {
            if (State.activeTextId) UI.toggleModal(DOM.deleteModal, true);
        });
    }

    if (DOM.confirmDeleteBtn) DOM.confirmDeleteBtn.addEventListener('click', Controllers.handleDeleteConfirm);

    DOM.newTextBtn.addEventListener('click', () => {
        UI.populateDropdown();
        DOM.newTextForm.reset();
        if (DOM.editIdInput) DOM.editIdInput.value = '';
        if (DOM.saveTextLabel) DOM.saveTextLabel.textContent = 'Save Draft';
        UI.toggleModal(DOM.newTextModal, true);
    });

    DOM.retryBtn.addEventListener('click', Controllers.loadData);

    // Mobile Navigation
    if (DOM.mobileMenuToggle) DOM.mobileMenuToggle.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.closeSidebarBtn) DOM.closeSidebarBtn.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.mobileOverlay) DOM.mobileOverlay.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.backToReadingBtn) DOM.backToReadingBtn.addEventListener('click', UI.hideMobileTextList);
    if (DOM.showTextListBtn) DOM.showTextListBtn.addEventListener('click', () => Controllers.handleCollectionSelect(1));

    // Settings and Help
    if (DOM.settingsBtn && DOM.settingsModal) {
        DOM.settingsBtn.addEventListener('click', () => UI.toggleModal(DOM.settingsModal, true));
    }
    
    if (DOM.helpBtn && DOM.helpModal) {
        DOM.helpBtn.addEventListener('click', () => UI.toggleModal(DOM.helpModal, true));
    }

    // Collection CRUD
    if (DOM.addCollectionBtn) {
        DOM.addCollectionBtn.addEventListener('click', () => {
            DOM.collectionForm.reset();
            DOM.editCollectionIdInput.value = '';
            DOM.collectionIconInput.value = 'folder';
            DOM.collectionModalTitle.textContent = 'Nova Coleção';
            DOM.collectionSaveLabel.textContent = 'Criar Coleção';
            Controllers._highlightSelectedIcon('folder');
            UI.toggleModal(DOM.collectionModal, true);
        });
    }

    if (DOM.collectionForm) DOM.collectionForm.addEventListener('submit', Controllers.handleCollectionSubmit);
    
    if (DOM.confirmDeleteCollectionBtn) {
        DOM.confirmDeleteCollectionBtn.addEventListener('click', Controllers.handleCollectionDeleteConfirm);
    }

    // Icon Picker
    if (DOM.iconPicker) {
        DOM.iconPicker.addEventListener('click', (e) => {
            const btn = e.target.closest('.icon-pick');
            if (btn) {
                DOM.collectionIconInput.value = btn.dataset.icon;
                Controllers._highlightSelectedIcon(btn.dataset.icon);
            }
        });
    }

    // Character Counter
    if (DOM.newTextForm && DOM.newTextForm['new-content']) {
        DOM.newTextForm['new-content'].addEventListener('input', (e) => {
            const current = e.target.value.length;
            if (DOM.charCounter) {
                DOM.charCounter.textContent = `${current} / 5000`;
                if (current > 4500) {
                    DOM.charCounter.classList.add('text-error');
                    DOM.charCounter.classList.remove('text-on-surface-variant/50');
                } else {
                    DOM.charCounter.classList.remove('text-error');
                    DOM.charCounter.classList.add('text-on-surface-variant/50');
                }
            }
        });
    }

    // Resize Handler
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            DOM.sidebar?.classList.remove('-translate-x-full');
            DOM.textListSection?.classList.remove('translate-x-full');
            DOM.mobileOverlay?.classList.add('hidden');
        }
    });
}

/**
 * Core Initialization.
 */
async function init() {
    UI.initLayout();
    initDOM();
    
    // Auth Check: Immediate verification
    const user = await Api.getUser();
    if (user) {
        State.user = user;
    }

    // Add appearance transitions
    if (DOM.sidebar) DOM.sidebar.classList.add('transition-opacity', 'duration-700');
    if (DOM.textListSection) DOM.textListSection.classList.add('transition-opacity', 'duration-700');
    
    Settings.init();
    attachEventListeners();
    
    // Hydrate UI based on resolved state
    if (State.user) {
        UI.updateAuthUI({ user: State.user });
        await Controllers.loadData();
    } else {
        UI.updateAuthUI(null);
    }
    
    // ARCHITECTURE FIX: "Inspect-Shield" removed for accessibility and real security (RLS).
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
