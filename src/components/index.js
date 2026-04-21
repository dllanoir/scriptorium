import { DOM } from '../core/dom.js';
import { State } from '../core/state.js';
import { Icons } from '../utils/index.js';
import { CollectionItem } from './collection-item.js';
import { TextItem } from './text-item.js';
import { ReadingPane } from './reading-pane.js';
import { Navbar } from './layout/Navbar.js';
import { Sidebar } from './layout/Sidebar.js';
import { ContentShell } from './layout/ContentShell.js';
import { Modals } from './layout/Modals.js';
import { LandingPage } from './layout/LandingPage.js';

/**
 * @namespace UI
 * @description Centralized UI orchestration using functional components.
 */
export const UI = {
    renderCollections: () => {
        DOM.collectionsList.innerHTML = '';
        State.collections.forEach(col => {
            DOM.collectionsList.appendChild(CollectionItem({ collection: col }));
        });
    },

    renderTextList: (searchTerm = '') => {
        DOM.textListContainer.innerHTML = '';
        let filtered = State.texts;

        if (State.activeCollectionId !== 1) {
            filtered = filtered.filter(t => parseInt(t.collectionId, 10) === parseInt(State.activeCollectionId, 10));
        }

        if (searchTerm) {
            const termLower = searchTerm.toLowerCase();
            filtered = filtered.filter(t => t.title.toLowerCase().includes(termLower));
        }

        if (filtered.length === 0 && !State.isLoadingTexts) {
            const emptyMsg = document.createElement('div');
            emptyMsg.className = "text-sm p-4 text-center text-on-surface-variant";
            emptyMsg.textContent = 'Nenhum texto encontrado.';
            DOM.textListContainer.appendChild(emptyMsg);
            return;
        }

        filtered.forEach(text => {
            DOM.textListContainer.appendChild(TextItem({ text }));
        });
    },

    renderTextContent: () => ReadingPane.render(),
    
    showError: (msg) => ReadingPane.showError(msg),

    populateDropdown: () => {
        DOM.newCollectionSelect.innerHTML = '';
        State.collections
            .filter(c => c.id !== 1)
            .forEach(col => {
                const option = document.createElement('option');
                option.value = col.id;
                option.textContent = col.name;
                DOM.newCollectionSelect.appendChild(option);
            });
    },

    updateAuthUI: (session) => {
        if (session) {
            // Logged In: Reveal Sanctuary
            if (DOM.authGate) {
                DOM.authGate.classList.add('opacity-0', 'pointer-events-none');
                setTimeout(() => DOM.authGate.classList.add('hidden'), 1000);
            }
            
            DOM.app?.classList.remove('opacity-0', 'hidden');
            const navbar = document.querySelector('nav');
            if (navbar) navbar.classList.remove('opacity-0', 'hidden');
            
            DOM.userInfo.classList.remove('hidden');
            DOM.userEmail.textContent = session.user.email;
            DOM.authButton.innerHTML = `${Icons.logout}<span>Logout</span>`;
            DOM.newTextBtn.style.display = 'flex';
            if (DOM.textActions) DOM.textActions.classList.remove('hidden');
            if (DOM.addCollectionBtn) DOM.addCollectionBtn.style.display = 'flex';
            State.user = session.user;
        } else {
            // Logged Out: Show Gate
            if (DOM.authGate) {
                DOM.authGate.classList.remove('hidden');
                setTimeout(() => DOM.authGate.classList.remove('opacity-0', 'pointer-events-none'), 10);
            }
            
            DOM.app?.classList.add('opacity-0', 'hidden');
            const navbar = document.querySelector('nav');
            if (navbar) navbar.classList.add('opacity-0', 'hidden');
            
            DOM.userInfo.classList.add('hidden');
            DOM.userEmail.textContent = '';
            DOM.authButton.innerHTML = `${Icons.login}<span>Login</span>`;
            DOM.newTextBtn.style.display = 'none';
            if (DOM.textActions) DOM.textActions.classList.add('hidden');
            if (DOM.addCollectionBtn) DOM.addCollectionBtn.style.display = 'none';
            State.user = null;
        }
    },

    toggleModal: (modalElement, show) => {
        if (show) {
            modalElement.classList.remove('hidden');
            modalElement.classList.add('flex');
            setTimeout(() => modalElement.classList.remove('opacity-0'), 10);
        } else {
            modalElement.classList.add('opacity-0');
            setTimeout(() => {
                modalElement.classList.add('hidden');
                modalElement.classList.remove('flex');
            }, 500);
        }
    },
    
    toggleMobileSidebar: () => {
        DOM.sidebar.classList.toggle('-translate-x-full');
        DOM.mobileOverlay.classList.toggle('hidden');
    },
    
    showMobileTextList: () => DOM.textListSection.classList.remove('translate-x-full'),
    
    hideMobileTextList: () => DOM.textListSection.classList.add('translate-x-full'),

    /**
     * Injects the static layout components into the DOM.
     */
    initLayout: () => {
        const app = document.getElementById('app');
        const gate = document.getElementById('auth-gate');
        if (!app || !gate) return;

        // Injetar Landing Page no Gate
        gate.innerHTML = LandingPage();

        // Injetar Navbar antes do #app
        document.body.insertAdjacentHTML('afterbegin', Navbar());
        
        // Injetar Sidebar e Content Shell dentro do #app
        app.innerHTML = Sidebar() + ContentShell();
        
        // Injetar Modals no final
        document.body.insertAdjacentHTML('beforeend', Modals());
        
        // Esconder App inicialmente para evitar flash de conteúdo
        app.classList.add('opacity-0', 'hidden', 'transition-opacity', 'duration-1000');
        const nav = document.querySelector('nav');
        if (nav) nav.classList.add('opacity-0', 'hidden', 'transition-opacity', 'duration-1000');
    }
};
