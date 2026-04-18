/**
 * Scriptorium - Script Principal
 * Padrão: IIFE (Immediately Invoked Function Expression) para encapsulamento modular.
 */
(function() {
    'use strict';

    // ==========================================
    // 1. CONFIGURAÇÃO E AMBIENTE
    // ==========================================
    const Config = {
        getSupabaseUrl: () => typeof window.SUPABASE_URL !== 'undefined' ? window.SUPABASE_URL : 'https://wqizowhlldxdjqrlnhem.supabase.co',
        getSupabaseKey: () => typeof window.SUPABASE_ANON_KEY !== 'undefined' ? window.SUPABASE_ANON_KEY : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXpvd2hsbGR4ZGpxcmxuaGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNjc3ODgsImV4cCI6MjA3MDk0Mzc4OH0.pePf3lEU5a6YthPV7j7VJeXI4FbBJxMeYCRthJ08JGk'
    };

    const supabaseClient = supabase.createClient(Config.getSupabaseUrl(), Config.getSupabaseKey());

    // ==========================================
    // 2. ESTADO DA APLICAÇÃO (STORE)
    // ==========================================
    const State = {
        collections: [],
        texts: [],
        activeCollectionId: 1, // ID padrão para 'Todas' ou coleção principal
        activeTextId: null,
        user: null,
        isLoadingTexts: false,
        isLoadingCollections: false
    };

    // ==========================================
    // 3. UTILITÁRIOS E SEGURANÇA
    // ==========================================
    const Utils = {
        /**
         * Sanitiza HTML, permitindo apenas P, BR, EM, STRONG
         */
        sanitizeAllowlist: (html) => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const allowedTags = ['p', 'br', 'em', 'strong'];
            
            function cleanNode(node) {
                if (node.nodeType === Node.TEXT_NODE) return;
                
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const tag = node.tagName.toLowerCase();
                    if (!allowedTags.includes(tag)) {
                        // Se não for permitida, salva apenas o texto e remove a tag
                        const text = document.createTextNode(node.textContent || '');
                        node.parentNode.replaceChild(text, node);
                    } else {
                        // Remove todos os atributos para evitar scripts inline ou style injects
                        while (node.attributes.length > 0) {
                            node.removeAttribute(node.attributes[0].name);
                        }
                        // Limpa os filhos recursivamente
                        Array.from(node.childNodes).forEach(cleanNode);
                    }
                }
            }
            
            Array.from(doc.body.childNodes).forEach(cleanNode);
            return doc.body.innerHTML; 
        },

        toast: (message, type = 'success') => {
            Toastify({
                text: message,
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                backgroundColor: type === 'success' ? '#6366f1' : '#ef4444',
                stopOnFocus: true,
                className: "custom-toast"
            }).showToast();
        },

        formatDate: (dateString) => {
            return new Date(dateString).toLocaleDateString('pt-BR', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
        }
    };

    // Ícones SVGs estáticos 
    const Icons = {
        login: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3h12" /></svg>',
        logout: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>',
        collection: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>'
    };

    // ==========================================
    // 4. CAMADA DE SERVIÇO (API)
    // ==========================================
    const Api = {
        fetchCollections: async () => {
            const { data, error } = await supabaseClient.from('collections').select('*');
            if (error) throw error;
            return data;
        },
        fetchTexts: async () => {
            const { data, error } = await supabaseClient.from('texts').select('*').order('created_at', { ascending: false });
            if (error) throw error;
            return data;
        },
        createText: async (payload) => {
            const { data, error } = await supabaseClient.from('texts').insert([payload]);
            if (error) throw error;
            return data;
        },
        login: async (email, password) => {
            return await supabaseClient.auth.signInWithPassword({ email, password });
        },
        logout: async () => {
            return await supabaseClient.auth.signOut();
        },
        getUser: async () => {
            const { data } = await supabaseClient.auth.getUser();
            return data.user;
        }
    };

    // ==========================================
    // 5. CACHE DE ELEMENTOS DO DOM
    // ==========================================
    const DOM = {
        collectionsList: document.getElementById('collections-list'),
        textListContainer: document.getElementById('text-list-container'),
        searchBox: document.getElementById('search-box'),
        
        // Panels and States
        readingPane: document.getElementById('reading-pane'),
        emptyState: document.getElementById('empty-state'),
        errorState: document.getElementById('error-state'),
        contentDisplay: document.getElementById('content-display'),
        errorMessage: document.getElementById('error-message'),
        
        // Reading Content
        textTitle: document.getElementById('text-title'),
        textDate: document.getElementById('text-date'),
        textBody: document.getElementById('text-body'),
        
        // Buttons
        authButton: document.getElementById('auth-button'),
        newTextBtn: document.getElementById('new-text-button'),
        retryBtn: document.getElementById('retry-button'),
        
        // User
        userInfo: document.getElementById('user-info'),
        userEmail: document.getElementById('user-email'),
        
        // Modals
        loginModal: document.getElementById('login-modal'),
        loginForm: document.getElementById('login-form'),
        loginError: document.getElementById('login-error'),
        
        newTextModal: document.getElementById('new-text-modal'),
        newTextForm: document.getElementById('new-text-form'),
        newCollectionSelect: document.getElementById('new-collection'),

        // Mobile
        mobileOverlay: document.getElementById('mobile-overlay'),
        sidebar: document.querySelector('aside'),
        textListSection: document.getElementById('text-list-section'),
    };

    // ==========================================
    // 6. RENDERIZADORES (UI)
    // ==========================================
    const UI = {
        renderCollections: () => {
            DOM.collectionsList.innerHTML = '';
            State.collections.forEach(col => {
                const li = document.createElement('li');
                li.className = `collection-item ${col.id === State.activeCollectionId ? 'active' : ''}`;
                li.dataset.collectionId = col.id;
                
                // Evita XSS ignorando col.icon de fonte nâo confiável, 
                // fixando um icone global ou renderizando innerText seguro para o título.
                // Como icones eram SVG puro do DB, é melhor injetar padrão:
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
            
            // Sanitização do conteúdo
            let rawContent = '';
            if (Array.isArray(text.content)) {
                rawContent = text.content.map(p => `<p>${p}</p>`).join('');
            } else {
                rawContent = text.content;
            }
            
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
                setTimeout(() => modalElement.close(), 250); // delay for animation
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

    // ==========================================
    // 7. CONTROLADORES (LÓGICA)
    // ==========================================
    const Controllers = {
        loadData: async () => {
            try {
                State.isLoadingCollections = true;
                State.isLoadingTexts = true;
                
                const [collections, texts] = await Promise.all([
                    Api.fetchCollections(),
                    Api.fetchTexts()
                ]);
                
                State.collections = collections;
                State.texts = texts;

                if (texts.length > 0) {
                    State.activeTextId = texts[0].id; // Opcional: auto-select primeiro
                }

                UI.renderCollections();
                UI.renderTextList();
                UI.renderTextContent();

            } catch (error) {
                console.error("Erro ao carregar os dados", error);
                UI.showError("Falha na comunicação com o servidor.");
            } finally {
                State.isLoadingCollections = false;
                State.isLoadingTexts = false;
            }
        },

        handleCollectionSelect: (collectionId) => {
            State.activeCollectionId = collectionId;
            const filteredTexts = collectionId === 1 
                ? State.texts 
                : State.texts.filter(t => parseInt(t.collectionId, 10) === parseInt(collectionId, 10));
            
            State.activeTextId = filteredTexts.length > 0 ? filteredTexts[0].id : null;
            
            UI.renderCollections();
            UI.renderTextList(DOM.searchBox.value);
            UI.renderTextContent();
        },

        handleTextSelect: (textId) => {
            State.activeTextId = textId;
            UI.renderTextList(DOM.searchBox.value);
            UI.renderTextContent();
        },

        handleLoginSubmit: async (e) => {
            e.preventDefault();
            const email = e.target.email.value;
            const password = e.target.password.value;
            DOM.loginError.classList.add('hidden');

            const { error } = await Api.login(email, password);

            if (error) {
                DOM.loginError.textContent = 'Credenciais inválidas.';
                DOM.loginError.classList.remove('hidden');
            } else {
                UI.toggleModal(DOM.loginModal, false);
                e.target.reset();
                Utils.toast('Acesso autorizado.', 'success');
            }
        },

        handleNewTextSubmit: async (e) => {
            e.preventDefault();
            if (!State.user) {
                Utils.toast('Você precisa estar logado.', 'error');
                return;
            }

            const title = e.target['new-title'].value;
            const collectionId = parseInt(e.target['new-collection'].value, 10);
            const rawContent = e.target['new-content'].value;
            
            // Substitui newlines por <p> no ato do insert, porém as tags não permitidas cairão no filtro de sanitização
            const paragraphs = rawContent.split('\n\n').filter(p => p.trim() !== '');
            const content = paragraphs.map(p => p.replace(/\n/g, '<br>'));

            try {
                await Api.createText({ title, collectionId, content });
                Utils.toast('Publicado com sucesso!');
                UI.toggleModal(DOM.newTextModal, false);
                e.target.reset();
                await Controllers.loadData();
            } catch (err) {
                console.error("Falha ao salvar:", err);
                Utils.toast('Falha ao publicar.', 'error');
            }
        }
    };

    // ==========================================
    // 8. EVENT LISTENERS
    // ==========================================
    function attachEventListeners() {
        // Auth State
        supabaseClient.auth.onAuthStateChange((event, session) => {
            UI.updateAuthUI(session);
        });

        // Event Delegation for Collections List
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

        // Event Delegation for Texts List
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

        // Search Filter
        DOM.searchBox.addEventListener('input', (e) => {
            UI.renderTextList(e.target.value);
        });

        // Modals global close handlers
        document.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const targetId = e.currentTarget.dataset.close;
                const modal = document.getElementById(targetId);
                if (modal) UI.toggleModal(modal, false);
            });
        });

        // Auth Button Action
        DOM.authButton.addEventListener('click', async () => {
            if (State.user) {
                await Api.logout();
                Utils.toast('Sessão encerrada.');
            } else {
                UI.toggleModal(DOM.loginModal, true);
            }
        });

        // Form submits
        DOM.loginForm.addEventListener('submit', Controllers.handleLoginSubmit);
        DOM.newTextForm.addEventListener('submit', Controllers.handleNewTextSubmit);

        // New Text button action
        DOM.newTextBtn.addEventListener('click', () => {
            UI.populateDropdown();
            UI.toggleModal(DOM.newTextModal, true);
        });

        // Error retry
        DOM.retryBtn.addEventListener('click', Controllers.loadData);

        // Mobile Controls
        document.getElementById('mobile-menu-toggle').addEventListener('click', UI.toggleMobileSidebar);
        document.getElementById('close-sidebar').addEventListener('click', UI.toggleMobileSidebar);
        DOM.mobileOverlay.addEventListener('click', UI.toggleMobileSidebar);
        
        document.getElementById('back-to-reading').addEventListener('click', UI.hideMobileTextList);
        document.getElementById('show-text-list').addEventListener('click', UI.showMobileTextList);

        // Resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                DOM.sidebar.classList.remove('-translate-x-full');
                DOM.textListSection.classList.remove('translate-x-full');
                DOM.mobileOverlay.classList.add('hidden');
            }
        });
    }

    // ==========================================
    // 9. INICIALIZAÇÃO
    // ==========================================
    function init() {
        attachEventListeners();
        Controllers.loadData();
    }

    // Execute when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();