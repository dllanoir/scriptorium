import { initDOM, DOM } from './core/dom.js';
import { Api } from './api/index.js';
import { UI } from './components/index.js';
import { Controllers } from './core/controllers.js';
import { State, subscribe } from './core/state.js';
import { Utils } from './utils/index.js';
import { Settings } from './core/settings.js';

/**
 * Attaches all global event listeners.
 */
function attachEventListeners() {
    // Reactive State Subscriptions
    subscribe((prop, value) => {
        if (prop === 'user') {
            UI.updateAuthUI(value);
        }
        if (prop === 'collections' || prop === 'activeCollectionId') {
            UI.renderCollections();
        }
        if (prop === 'texts' || prop === 'activeCollectionId' || prop === 'activeTextId' || prop === 'sortOrder') {
            UI.renderTextList(DOM.searchBox?.value || '');
            UI.renderTextContent();
        }
        if (prop === 'isZenMode') {
            UI.toggleZenMode(value);
        }
    });

    // Auth State Change Observer
    Api.onAuthStateChange(async (event, session) => {
        State.user = session?.user || null;
        if (session) {
            await Controllers.loadData();
        }
    });

    // Collection Navigation and Actions
    if (DOM.collectionsList) {
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
                if (window.innerWidth < 1024) {
                    UI.toggleMobileSidebar();
                    UI.showMobileTextList();
                }
            }
        });
    }

    // Text Selection
    if (DOM.textListContainer) {
        DOM.textListContainer.addEventListener('click', (e) => {
            const item = e.target.closest('.text-item');
            if (item) {
                const id = parseInt(item.dataset.textId, 10);
                Controllers.handleTextSelect(id);
                if (window.innerWidth < 1024) {
                    UI.hideMobileTextList();
                }
            }
        });
    }

    // Search
    if (DOM.searchBox) {
        DOM.searchBox.addEventListener('input', (e) => {
            UI.renderTextList(e.target.value);
        });
    }

    // Generic Modal Close via [data-close]
    document.querySelectorAll('[data-close]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.dataset.close;
            const modal = document.getElementById(targetId);
            if (modal) UI.toggleModal(modal, false);
        });
    });

    // Backdrop click modal close
    [DOM.newTextModal, DOM.deleteModal, DOM.collectionModal, DOM.deleteCollectionModal, DOM.settingsModal, DOM.helpModal].filter(Boolean).forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                UI.toggleModal(modal, false);
            }
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

    // Password Toggle Delegation
    document.addEventListener('click', (e) => {
        const toggleBtn = e.target.closest('#toggle-landing-password');
        if (toggleBtn) {
            const passwordInput = document.getElementById('landing-password');
            if (passwordInput) {
                const isPassword = passwordInput.getAttribute('type') === 'password';
                passwordInput.setAttribute('type', isPassword ? 'text' : 'password');
                const icon = toggleBtn.querySelector('.material-symbols-outlined') || toggleBtn;
                icon.textContent = isPassword ? 'visibility_off' : 'visibility';
            }
        }
    });

    // Forms
    if (DOM.landingLoginForm) DOM.landingLoginForm.addEventListener('submit', Controllers.handleLoginSubmit);
    if (DOM.newTextForm) DOM.newTextForm.addEventListener('submit', Controllers.handleNewTextSubmit);
    
    // Text Action Buttons
    if (DOM.editBtn) DOM.editBtn.addEventListener('click', Controllers.handleEditClick);
    
    if (DOM.deleteBtn) {
        DOM.deleteBtn.addEventListener('click', () => {
            if (State.activeTextId) UI.toggleModal(DOM.deleteModal, true);
        });
    }

    if (DOM.confirmDeleteBtn) DOM.confirmDeleteBtn.addEventListener('click', Controllers.handleDeleteConfirm);

    // Feature Buttons: Copy, Export MD, Export TXT, Zen Mode
    if (DOM.copyTextBtn) DOM.copyTextBtn.addEventListener('click', Controllers.handleCopyText);
    if (DOM.exportMdBtn) DOM.exportMdBtn.addEventListener('click', Controllers.handleExportMarkdown);
    if (DOM.exportTxtBtn) DOM.exportTxtBtn.addEventListener('click', Controllers.handleExportTxt);
    if (DOM.zenToggleBtn) DOM.zenToggleBtn.addEventListener('click', Controllers.toggleZenMode);

    // Sort Select
    if (DOM.sortSelect) {
        DOM.sortSelect.value = State.sortOrder;
        DOM.sortSelect.addEventListener('change', (e) => Controllers.handleSortChange(e.target.value));
    }

    // Markdown Toolbar delegation
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#markdown-toolbar [data-md], #markdown-toolbar [data-format]');
        if (btn && DOM.newTextForm && DOM.newTextForm['new-content']) {
            e.preventDefault();
            Utils.applyMarkdownFormat(DOM.newTextForm['new-content'], btn.dataset.md || btn.dataset.format);
        }
    });

    // New Text Button & Draft Restoration
    if (DOM.newTextBtn) {
        DOM.newTextBtn.addEventListener('click', () => {
            UI.populateDropdown();
            DOM.newTextForm.reset();
            if (DOM.editIdInput) DOM.editIdInput.value = '';
            if (DOM.saveTextLabel) DOM.saveTextLabel.textContent = 'Save Draft';

            // Restore draft if exists
            const savedDraft = localStorage.getItem('scriptorium_draft_text');
            if (savedDraft) {
                try {
                    const draft = JSON.parse(savedDraft);
                    if (draft.title && DOM.newTextForm['new-title']) {
                        DOM.newTextForm['new-title'].value = draft.title;
                    }
                    if (draft.content && DOM.newTextForm['new-content']) {
                        DOM.newTextForm['new-content'].value = draft.content;
                    }
                    if (draft.collectionId && DOM.newTextForm['new-collection']) {
                        DOM.newTextForm['new-collection'].value = draft.collectionId;
                    }
                    if (DOM.draftStatus) DOM.draftStatus.classList.remove('hidden');
                } catch (err) {
                    console.error('Falha ao restaurar rascunho:', err);
                }
            } else {
                if (DOM.draftStatus) DOM.draftStatus.classList.add('hidden');
            }

            const currentText = DOM.newTextForm['new-content']?.value || '';
            if (DOM.charCounter) DOM.charCounter.textContent = `${currentText.length} / 5000`;
            if (DOM.editorMetrics) {
                const metrics = Utils.calculateMetrics(currentText);
                DOM.editorMetrics.textContent = metrics.formatted;
            }

            UI.toggleModal(DOM.newTextModal, true);
        });
    }

    if (DOM.retryBtn) DOM.retryBtn.addEventListener('click', Controllers.loadData);

    // Mobile Navigation
    if (DOM.mobileMenuToggle) DOM.mobileMenuToggle.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.closeSidebarBtn) DOM.closeSidebarBtn.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.mobileOverlay) DOM.mobileOverlay.addEventListener('click', UI.toggleMobileSidebar);
    if (DOM.backToReadingBtn) DOM.backToReadingBtn.addEventListener('click', UI.hideMobileTextList);
    if (DOM.showTextListBtn) DOM.showTextListBtn.addEventListener('click', UI.showMobileTextList);

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

    // Editor Auto-save Draft & Live Metrics
    const handleEditorInput = () => {
        const title = DOM.newTextForm?.['new-title']?.value || '';
        const content = DOM.newTextForm?.['new-content']?.value || '';
        const rawCol = parseInt(DOM.newTextForm?.['new-collection']?.value, 10);
        const collectionId = Number.isNaN(rawCol) ? 1 : rawCol;
        const isEdit = Boolean(DOM.editIdInput?.value);

        const currentLen = content.length;
        if (DOM.charCounter) {
            DOM.charCounter.textContent = `${currentLen} / 5000`;
            if (currentLen > 4500) {
                DOM.charCounter.classList.add('text-error');
                DOM.charCounter.classList.remove('text-on-surface-variant/50');
            } else {
                DOM.charCounter.classList.remove('text-error');
                DOM.charCounter.classList.add('text-on-surface-variant/50');
            }
        }

        if (DOM.editorMetrics) {
            const metrics = Utils.calculateMetrics(content);
            DOM.editorMetrics.textContent = metrics.formatted;
        }

        if (!isEdit) {
            if (title.trim() || content.trim()) {
                localStorage.setItem('scriptorium_draft_text', JSON.stringify({ title, content, collectionId }));
                if (DOM.draftStatus) DOM.draftStatus.classList.remove('hidden');
            } else {
                localStorage.removeItem('scriptorium_draft_text');
                if (DOM.draftStatus) DOM.draftStatus.classList.add('hidden');
            }
        }
    };

    if (DOM.newTextForm) {
        DOM.newTextForm['new-title']?.addEventListener('input', handleEditorInput);
        DOM.newTextForm['new-content']?.addEventListener('input', handleEditorInput);
        DOM.newTextForm['new-collection']?.addEventListener('change', () => {
            if (!DOM.editIdInput?.value) {
                handleEditorInput();
            }
        });
    }

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
        // Escape: close open modal or exit Zen mode
        if (e.key === 'Escape') {
            const visibleModals = [
                DOM.newTextModal,
                DOM.deleteModal,
                DOM.collectionModal,
                DOM.deleteCollectionModal,
                DOM.settingsModal,
                DOM.helpModal
            ].filter(m => m && !m.classList.contains('hidden'));

            if (visibleModals.length > 0) {
                visibleModals.forEach(m => UI.toggleModal(m, false));
            } else if (State.isZenMode) {
                Controllers.toggleZenMode();
            }
        }

        // Alt+N: New Text Modal
        if ((e.altKey && (e.key === 'n' || e.key === 'N')) && State.user) {
            e.preventDefault();
            DOM.newTextBtn?.click();
        }

        // Alt+Z: Toggle Zen Mode
        if ((e.altKey && (e.key === 'z' || e.key === 'Z')) && State.user) {
            e.preventDefault();
            Controllers.toggleZenMode();
        }

        // /: Focus Search Box
        if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) {
            e.preventDefault();
            DOM.searchBox?.focus();
        }

        // Ctrl+S / Meta+S: Submit New Text form
        if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'S')) {
            if (DOM.newTextModal && !DOM.newTextModal.classList.contains('hidden')) {
                e.preventDefault();
                if (DOM.newTextForm) {
                    DOM.newTextForm.requestSubmit();
                }
            }
        }
    });

    // Resize Handler: unified breakpoint 1024
    window.addEventListener('resize', () => {
        if (window.innerWidth >= 1024) {
            DOM.sidebar?.classList.remove('-translate-x-full');
            DOM.textListSection?.classList.remove('-translate-x-full');
            DOM.mobileOverlay?.classList.add('hidden');
        }
    });
}

/**
 * Core Initialization.
 */
async function init() {
    // Register Service Worker for PWA
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('./sw.js');
        } catch (e) {
            console.error('Service Worker registration failed', e);
        }
    }

    UI.initLayout();
    initDOM();
    
    // Add appearance transitions
    if (DOM.sidebar) DOM.sidebar.classList.add('transition-opacity', 'duration-700');
    if (DOM.textListSection) DOM.textListSection.classList.add('transition-opacity', 'duration-700');
    
    Settings.init();
    attachEventListeners();
    
    // Auth Check: Immediate verification
    const user = await Api.getUser();
    State.user = user || null;
    UI.updateAuthUI(State.user);

    if (State.user) {
        await Controllers.loadData();
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
