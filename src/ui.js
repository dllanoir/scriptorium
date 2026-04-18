import { DOM } from './dom.js';
import { State } from './state.js';
import { Utils, Icons } from './utils.js';

export const UI = {
    renderCollections: () => {
        DOM.collectionsList.innerHTML = '';
        State.collections.forEach(col => {
            const li = document.createElement('li');
            li.className = `collection-item ${col.id === State.activeCollectionId ? 'active' : ''}`;
            li.dataset.collectionId = col.id;
            
            li.innerHTML = `${Icons.collection}<span></span>`;
            li.querySelector('span').textContent = col.name; 
            
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
            DOM.textListContainer.innerHTML = '<div class="text-sm p-4 text-center" style="color:var(--text-muted)">Nenhum texto encontrado.</div>';
            return;
        }

        filtered.forEach(text => {
            const div = document.createElement('div');
            div.className = `text-item ${text.id === State.activeTextId ? 'active' : ''}`;
            div.dataset.textId = text.id;
            
            const title = document.createElement('h3');
            title.textContent = text.title;
            
            const dateP = document.createElement('p');
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
            DOM.userInfo.classList.remove('hidden');
            DOM.userEmail.textContent = session.user.email;
            DOM.authButton.innerHTML = `${Icons.logout}<span>Logout</span>`;
            DOM.newTextBtn.style.display = 'flex';
            State.user = session.user;
        } else {
            DOM.userInfo.classList.add('hidden');
            DOM.userEmail.textContent = '';
            DOM.authButton.innerHTML = `${Icons.login}<span>Login</span>`;
            DOM.newTextBtn.style.display = 'none';
            State.user = null;
        }
    },

    toggleModal: (modalElement, show) => {
        if (show) {
            modalElement.showModal();
            modalElement.classList.add('active');
        } else {
            modalElement.classList.remove('active');
            setTimeout(() => modalElement.close(), 250);
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
