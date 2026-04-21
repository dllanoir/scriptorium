import { DOM } from './dom.js';
import { State } from './state.js';
import { Utils, Icons } from './utils.js';

export const UI = {
    renderCollections: () => {
        DOM.collectionsList.innerHTML = '';
        State.collections.forEach((col) => {
            const li = document.createElement('a');
            const isActive = col.id === State.activeCollectionId;
            const baseClass = "collection-link transition-all duration-300 cursor-pointer ease-in-out font-['Manrope'] uppercase tracking-[0.2em] text-[10px] flex items-center p-3 space-x-3 rounded-xl hover:scale-[1.02] active:scale-95 group/col";
            const colorClass = isActive ? "bg-surface-container-highest/80 dark:bg-stone-800/80 text-on-surface dark:text-stone-100 shadow-md border border-outline-variant/30 dark:border-white/5" : "text-on-surface-variant dark:text-stone-500 hover:bg-surface-container-highest/40 dark:hover:bg-stone-800/40 hover:text-on-surface dark:hover:text-stone-200 border border-transparent";
            li.className = `${baseClass} ${colorClass}`;
            li.dataset.collectionId = col.id;
            
            const iconName = col.icon || 'folder';
            const iconHtml = `<span class="material-symbols-outlined text-[18px]">${iconName}</span>`;
            
            const isSystemCollection = col.id === 1;
            const actionsHtml = isSystemCollection ? '' : `
                <span class="collection-actions ml-auto flex space-x-1 opacity-0 group-hover/col:opacity-100 transition-opacity">
                    <span class="collection-edit-btn material-symbols-outlined text-[14px] hover:text-primary cursor-pointer p-0.5 rounded" data-col-id="${col.id}" title="Editar">edit</span>
                    <span class="collection-delete-btn material-symbols-outlined text-[14px] hover:text-error cursor-pointer p-0.5 rounded" data-col-id="${col.id}" title="Excluir">close</span>
                </span>`;
            
            li.innerHTML = `${iconHtml}<span class="collection-title flex-1"></span>${actionsHtml}`;
            li.querySelector('.collection-title').textContent = col.name;
            
            DOM.collectionsList.appendChild(li);
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
            DOM.textListContainer.innerHTML = '<div class="text-sm p-4 text-center text-on-surface-variant">Nenhum texto encontrado.</div>';
            return;
        }

        filtered.forEach(text => {
            const div = document.createElement('div');
            const isActive = text.id === State.activeTextId;
            const baseClass = "text-item p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border mb-1";
            const activeClass = isActive ? "bg-surface-container-highest dark:bg-stone-900/80 border-primary/30 shadow-lg shadow-black/5 dark:shadow-black/20 text-on-surface dark:text-white" : "border-transparent hover:bg-surface-container-highest/50 dark:hover:bg-stone-900/40 hover:border-outline-variant/30 dark:hover:border-white/5";
            div.className = `${baseClass} ${activeClass}`;
            div.dataset.textId = text.id;
            
            const title = document.createElement('h3');
            title.className = "font-headline text-lg text-on-surface mb-1";
            title.textContent = text.title;
            
            const dateP = document.createElement('p');
            dateP.className = "font-label text-xs text-on-surface-variant uppercase tracking-wider";
            dateP.textContent = Utils.formatDate(text.created_at);
            
            div.appendChild(title);
            div.appendChild(dateP);
            
            DOM.textListContainer.appendChild(div);
        });
    },

    renderTextContent: () => {
        const text = State.texts.find(t => t.id === State.activeTextId);
        
        if (!text) {
            DOM.emptyState.classList.remove('hidden');
            DOM.contentDisplay.classList.add('hidden');
            DOM.errorState.classList.add('hidden');
            return;
        }

        DOM.emptyState.classList.add('hidden');
        DOM.errorState.classList.add('hidden');
        DOM.contentDisplay.classList.remove('hidden');

        DOM.textTitle.textContent = text.title;
        DOM.textDate.textContent = Utils.formatDate(text.created_at);
        DOM.textDate.setAttribute('datetime', text.created_at);
        
        let rawContent = Array.isArray(text.content) ? text.content.map(p => `<p>${p}</p>`).join('') : text.content;
        DOM.textBody.innerHTML = Utils.sanitizeAllowlist(rawContent);
    },

    populateDropdown: () => {
        DOM.newCollectionSelect.innerHTML = '';
        const toRender = State.collections.filter(c => c.id !== 1);
        toRender.forEach(col => {
            const option = document.createElement('option');
            option.value = col.id;
            option.textContent = col.name;
            DOM.newCollectionSelect.appendChild(option);
        });
    },

    showError: (message) => {
        DOM.emptyState.classList.add('hidden');
        DOM.contentDisplay.classList.add('hidden');
        DOM.errorState.classList.remove('hidden');
        DOM.errorMessage.textContent = message;
    },

    updateAuthUI: (session) => {
        if (session) {
            if (DOM.sidebar) DOM.sidebar.classList.remove('opacity-0', 'pointer-events-none');
            if (DOM.textListSection) DOM.textListSection.classList.remove('opacity-0', 'pointer-events-none');
            
            DOM.userInfo.classList.remove('hidden');
            DOM.userEmail.textContent = session.user.email;
            DOM.authButton.innerHTML = `${Icons.logout}<span>Logout</span>`;
            DOM.newTextBtn.style.display = 'flex';
            if (DOM.textActions) DOM.textActions.classList.remove('hidden');
            if (DOM.addCollectionBtn) DOM.addCollectionBtn.style.display = 'flex';
            State.user = session.user;
            
            // If the login modal is open, ensure it closes when logged in
            if (!DOM.loginModal.classList.contains('hidden')) {
                UI.toggleModal(DOM.loginModal, false);
            }
        } else {
            // Lock out the UI
            if (DOM.sidebar) DOM.sidebar.classList.add('opacity-0', 'pointer-events-none');
            if (DOM.textListSection) DOM.textListSection.classList.add('opacity-0', 'pointer-events-none');
            
            DOM.userInfo.classList.add('hidden');
            DOM.userEmail.textContent = '';
            DOM.authButton.innerHTML = `${Icons.login}<span>Login</span>`;
            DOM.newTextBtn.style.display = 'none';
            if (DOM.textActions) DOM.textActions.classList.add('hidden');
            if (DOM.addCollectionBtn) DOM.addCollectionBtn.style.display = 'none';
            State.user = null;
            
            // Force the login modal to open and be unclosable
            UI.toggleModal(DOM.loginModal, true);
        }
    },

    toggleModal: (modalElement, show) => {
        if (show) {
            modalElement.classList.remove('hidden');
            modalElement.classList.add('flex');
            // Allow display change to render before triggering opacity transition
            setTimeout(() => {
                modalElement.classList.remove('opacity-0');
            }, 10);
        } else {
            modalElement.classList.add('opacity-0');
            setTimeout(() => {
                modalElement.classList.add('hidden');
                modalElement.classList.remove('flex');
            }, 500); // Wait for transition duration
        }
    },
    
    toggleMobileSidebar: () => {
        DOM.sidebar.classList.toggle('-translate-x-full');
        DOM.mobileOverlay.classList.toggle('hidden');
    },
    
    showMobileTextList: () => {
        DOM.textListSection.classList.remove('translate-x-full');
    },
    
    hideMobileTextList: () => {
        DOM.textListSection.classList.add('translate-x-full');
    }
};
