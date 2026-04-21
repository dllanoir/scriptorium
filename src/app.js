import { initDOM, DOM } from './dom.js';
import { Api } from './api.js';
import { UI } from './ui.js';
import { Controllers } from './controllers.js';
import { State } from './state.js';
import { Utils } from './utils.js';
import { Settings } from './settings.js';

function attachEventListeners() {
    Api.onAuthStateChange(async (event, session) => {
        // Only update UI for real auth events, not metadata changes like Settings
        if (event === 'SIGNED_IN') {
            UI.updateAuthUI(session);
            await Controllers.loadData();
        } else if (event === 'SIGNED_OUT') {
            UI.updateAuthUI(null);
        }
        // Ignore USER_UPDATED, TOKEN_REFRESHED, etc. to prevent logout button breakage
    });

    DOM.collectionsList.addEventListener('click', (e) => {
        // Handle edit button click
        const editBtn = e.target.closest('.collection-edit-btn');
        if (editBtn) {
            e.stopPropagation();
            Controllers.handleCollectionEditClick(editBtn.dataset.colId);
            return;
        }
        // Handle delete button click
        const deleteBtn = e.target.closest('.collection-delete-btn');
        if (deleteBtn) {
            e.stopPropagation();
            State.pendingDeleteCollectionId = parseInt(deleteBtn.dataset.colId, 10);
            UI.toggleModal(DOM.deleteCollectionModal, true);
            return;
        }
        // Handle collection navigation
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

    DOM.searchBox.addEventListener('input', (e) => {
        UI.renderTextList(e.target.value);
    });

    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.close;
            const modal = document.getElementById(targetId);
            if (modal) UI.toggleModal(modal, false);
        });
    });

    DOM.authButton.addEventListener('click', async () => {
        if (State.user) {
            await Api.logout();
            Utils.toast('Sessão encerrada.');
        } else {
            UI.toggleModal(DOM.loginModal, true);
        }
    });

    DOM.loginForm.addEventListener('submit', Controllers.handleLoginSubmit);
    DOM.newTextForm.addEventListener('submit', Controllers.handleNewTextSubmit);
    
    if (DOM.editBtn) {
        DOM.editBtn.addEventListener('click', Controllers.handleEditClick);
    }
    if (DOM.deleteBtn) {
        DOM.deleteBtn.addEventListener('click', () => {
            if (State.activeTextId) {
                UI.toggleModal(DOM.deleteModal, true);
            }
        });
    }
    if (DOM.confirmDeleteBtn) {
        DOM.confirmDeleteBtn.addEventListener('click', Controllers.handleDeleteConfirm);
    }

    DOM.newTextBtn.addEventListener('click', () => {
        UI.populateDropdown();
        DOM.newTextForm.reset();
        if (DOM.editIdInput) DOM.editIdInput.value = '';
        if (DOM.saveTextLabel) DOM.saveTextLabel.textContent = 'Save Draft';
        UI.toggleModal(DOM.newTextModal, true);
    });

    DOM.retryBtn.addEventListener('click', Controllers.loadData);

    if (DOM.mobileMenuToggle) DOM.mobileMenuToggle.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.closeSidebarBtn) DOM.closeSidebarBtn.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.mobileOverlay) DOM.mobileOverlay.addEventListener('click', UI.toggleMobileSidebar);
    
    if (DOM.backToReadingBtn) DOM.backToReadingBtn.addEventListener('click', UI.hideMobileTextList);
    if (DOM.showTextListBtn) DOM.showTextListBtn.addEventListener('click', UI.showMobileTextList);

    if (DOM.settingsBtn && DOM.settingsModal) {
        DOM.settingsBtn.addEventListener('click', () => {
            UI.toggleModal(DOM.settingsModal, true);
        });
    }
    
    if (DOM.helpBtn && DOM.helpModal) {
        DOM.helpBtn.addEventListener('click', () => {
            UI.toggleModal(DOM.helpModal, true);
        });
    }

    // Collection CRUD listeners
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
    if (DOM.collectionForm) {
        DOM.collectionForm.addEventListener('submit', Controllers.handleCollectionSubmit);
    }
    if (DOM.confirmDeleteCollectionBtn) {
        DOM.confirmDeleteCollectionBtn.addEventListener('click', Controllers.handleCollectionDeleteConfirm);
    }
    // Icon picker interactivity
    if (DOM.iconPicker) {
        DOM.iconPicker.addEventListener('click', (e) => {
            const btn = e.target.closest('.icon-pick');
            if (btn) {
                DOM.collectionIconInput.value = btn.dataset.icon;
                Controllers._highlightSelectedIcon(btn.dataset.icon);
            }
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            DOM.sidebar.classList.remove('-translate-x-full');
            DOM.textListSection.classList.remove('translate-x-full');
            DOM.mobileOverlay.classList.add('hidden');
        }
    });
}

async function init() {
    initDOM();
    
    // Add Transition classes for smooth reveal
    if (DOM.sidebar) DOM.sidebar.classList.add('transition-opacity', 'duration-700');
    if (DOM.textListSection) DOM.textListSection.classList.add('transition-opacity', 'duration-700');
    
    Settings.init();
    attachEventListeners();
    
    // Check Auth Status & Bind Observer
    const session = await Api.getUser();
    
    if (session) {
        UI.updateAuthUI({ user: session });
        await Controllers.loadData();
    } else {
        UI.updateAuthUI(null);
    }
    
    // Inspect-Shield (Block Context menu and DevTools shotcuts)
    document.addEventListener('contextmenu', (e) => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        // F12
        if (e.key === 'F12') e.preventDefault();
        // Ctrl+Shift+I / J / C
        if (e.ctrlKey && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) e.preventDefault();
        // Ctrl+U (View Source)
        if (e.ctrlKey && e.key.toUpperCase() === 'U') e.preventDefault();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
