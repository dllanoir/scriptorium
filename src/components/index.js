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

        // Sort filtered list according to State.sortOrder
        const sortOrder = State.sortOrder || 'newest';
        filtered = [...filtered].sort((a, b) => {
            if (sortOrder === 'oldest') {
                const dateA = a.created_at || '';
                const dateB = b.created_at || '';
                return dateA.localeCompare(dateB) || (Number(a.id) - Number(b.id));
            }
            if (sortOrder === 'alpha_asc') {
                return (a.title || '').localeCompare(b.title || '', 'pt-BR', { sensitivity: 'base' });
            }
            if (sortOrder === 'alpha_desc') {
                return (b.title || '').localeCompare(a.title || '', 'pt-BR', { sensitivity: 'base' });
            }
            // Default 'newest'
            const dateA = a.created_at || '';
            const dateB = b.created_at || '';
            return dateB.localeCompare(dateA) || (Number(b.id) - Number(a.id));
        });

        if (DOM.textListCount) {
            DOM.textListCount.textContent = `${filtered.length} ${filtered.length === 1 ? 'texto' : 'textos'}`;
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
        if (!DOM.newCollectionSelect) return;
        DOM.newCollectionSelect.innerHTML = '';
        let available = State.collections.filter(c => c.id !== 1);
        if (available.length === 0) {
            available = State.collections.length > 0 ? State.collections : [{ id: 1, name: 'Geral' }];
        }
        available.forEach(col => {
            const option = document.createElement('option');
            option.value = col.id;
            option.textContent = col.name;
            option.className = "bg-stone-900 text-stone-100";
            DOM.newCollectionSelect.appendChild(option);
        });

        if (State.activeCollectionId && State.activeCollectionId !== 1) {
            DOM.newCollectionSelect.value = State.activeCollectionId;
        }
    },

    updateAuthUI: (sessionOrUser) => {
        const user = sessionOrUser?.user || sessionOrUser || null;

        if (DOM.authGate) {
            clearTimeout(DOM.authGate._hideTimer);
        }

        if (user) {
            // Logged In: Reveal Sanctuary
            if (DOM.authGate) {
                DOM.authGate.classList.add('opacity-0', 'pointer-events-none');
                DOM.authGate._hideTimer = setTimeout(() => DOM.authGate.classList.add('hidden'), 1000);
            }
            
            if (DOM.app) DOM.app.classList.remove('opacity-0', 'hidden');
            const navbar = document.querySelector('nav');
            if (navbar) navbar.classList.remove('opacity-0', 'hidden');
            
            if (DOM.userInfo) DOM.userInfo.classList.remove('hidden');
            if (DOM.userEmail && user?.email) DOM.userEmail.textContent = user.email;
            if (DOM.authButton) DOM.authButton.innerHTML = `${Icons.logout}<span>Logout</span>`;
            if (DOM.newTextBtn) DOM.newTextBtn.style.display = 'flex';
            if (DOM.textActions) DOM.textActions.classList.remove('hidden');
            if (DOM.addCollectionBtn) DOM.addCollectionBtn.style.display = 'flex';
        } else {
            // Logged Out: Show Gate
            if (DOM.authGate) {
                DOM.authGate.classList.remove('hidden');
                DOM.authGate._hideTimer = setTimeout(() => DOM.authGate.classList.remove('opacity-0', 'pointer-events-none'), 10);
            }
            
            if (DOM.app) DOM.app.classList.add('opacity-0', 'hidden');
            const navbar = document.querySelector('nav');
            if (navbar) navbar.classList.add('opacity-0', 'hidden');
            
            if (DOM.userInfo) DOM.userInfo.classList.add('hidden');
            if (DOM.userEmail) DOM.userEmail.textContent = '';
            if (DOM.authButton) DOM.authButton.innerHTML = `${Icons.login}<span>Login</span>`;
            if (DOM.newTextBtn) DOM.newTextBtn.style.display = 'none';
            if (DOM.textActions) DOM.textActions.classList.add('hidden');
            if (DOM.addCollectionBtn) DOM.addCollectionBtn.style.display = 'none';
        }
    },

    toggleZenMode: (isZen) => {
        if (isZen) {
            DOM.sidebar?.classList.add('lg:hidden');
            DOM.textListSection?.classList.add('lg:hidden');
            if (DOM.zenToggleBtn) {
                DOM.zenToggleBtn.classList.add('bg-primary/20', 'text-primary');
                DOM.zenToggleBtn.setAttribute('aria-pressed', 'true');
            }
        } else {
            DOM.sidebar?.classList.remove('lg:hidden');
            DOM.textListSection?.classList.remove('lg:hidden');
            if (DOM.zenToggleBtn) {
                DOM.zenToggleBtn.classList.remove('bg-primary/20', 'text-primary');
                DOM.zenToggleBtn.setAttribute('aria-pressed', 'false');
            }
        }
    },

    toggleModal: (modalElement, show) => {
        if (!modalElement) return;
        clearTimeout(modalElement._hideTimer);
        if (show) {
            modalElement.classList.remove('hidden');
            modalElement.classList.add('flex');
            modalElement._hideTimer = setTimeout(() => modalElement.classList.remove('opacity-0'), 10);
        } else {
            modalElement.classList.add('opacity-0');
            modalElement._hideTimer = setTimeout(() => {
                modalElement.classList.add('hidden');
                modalElement.classList.remove('flex');
            }, 500);
            if (modalElement === DOM.deleteCollectionModal) {
                State.pendingDeleteCollectionId = null;
            }
        }
    },
    
    toggleMobileSidebar: () => {
        const isOpen = !DOM.sidebar.classList.contains('-translate-x-full');
        if (isOpen) {
            DOM.sidebar.classList.add('-translate-x-full');
            DOM.mobileOverlay.classList.add('opacity-0');
            setTimeout(() => DOM.mobileOverlay.classList.add('hidden'), 500);
        } else {
            DOM.mobileOverlay.classList.remove('hidden');
            setTimeout(() => {
                DOM.sidebar.classList.remove('-translate-x-full');
                DOM.mobileOverlay.classList.remove('opacity-0');
            }, 10);
        }
    },
    
    showMobileTextList: () => {
        DOM.textListSection.classList.remove('-translate-x-full');
        DOM.textListSection.classList.add('translate-x-0');
    },
    
    hideMobileTextList: () => {
        DOM.textListSection.classList.add('-translate-x-full');
        DOM.textListSection.classList.remove('translate-x-0');
    },

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
