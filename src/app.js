import { initDOM, DOM } from './dom.js';
import { Api } from './api.js';
import { UI } from './ui.js';
import { Controllers } from './controllers.js';
import { State } from './state.js';
import { Utils } from './utils.js';

function attachEventListeners() {
    Api.onAuthStateChange((event, session) => {
        UI.updateAuthUI(session);
    });

    DOM.collectionsList.addEventListener('click', (e) => {
        const item = e.target.closest('.collection-item');
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

    DOM.newTextBtn.addEventListener('click', () => {
        UI.populateDropdown();
        UI.toggleModal(DOM.newTextModal, true);
    });

    DOM.retryBtn.addEventListener('click', Controllers.loadData);

    DOM.mobileMenuToggle.addEventListener('click', UI.toggleMobileSidebar);
    DOM.closeSidebarBtn.addEventListener('click', UI.toggleMobileSidebar);
    DOM.mobileOverlay.addEventListener('click', UI.toggleMobileSidebar);
    
    DOM.backToReadingBtn.addEventListener('click', UI.hideMobileTextList);
    DOM.showTextListBtn.addEventListener('click', UI.showMobileTextList);

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

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 768) {
            DOM.sidebar.classList.remove('-translate-x-full');
            DOM.textListSection.classList.remove('translate-x-full');
            DOM.mobileOverlay.classList.add('hidden');
        }
    });
}

function init() {
    initDOM();
    attachEventListeners();
    Controllers.loadData();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
