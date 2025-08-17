document.addEventListener('DOMContentLoaded', () => {

    // 1. Configuração do Cliente Supabase
    const SUPABASE_URL = config.SUPABASE_URL || 'https://wqizowhlldxdjqrlnhem.supabase.co';
    const SUPABASE_ANON_KEY = config.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndxaXpvd2hsbGR4ZGpxcmxuaGVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzNjc3ODgsImV4cCI6MjA3MDk0Mzc4OH0.pePf3lEU5a6YthPV7j7VJeXI4FbBJxMeYCRthJ08JGk';

    const { createClient } = supabase;
    const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // --- ESTADO DA APLICAÇÃO ---
    let collections = [];
    let texts = [];
    let activeCollectionId = 1;
    let activeTextId = null;

    // --- ELEMENTOS DO DOM ---
    const collectionsList = document.getElementById('collections-list');
    const textListContainer = document.getElementById('text-list-container');
    const textTitle = document.getElementById('text-title');
    const textDate = document.getElementById('text-date');
    const textBody = document.getElementById('text-body');
    const emptyState = document.getElementById('empty-state');
    const contentDisplay = document.getElementById('content-display');
    const authButton = document.getElementById('auth-button');
    const loginModal = document.getElementById('login-modal');
    const closeLoginButton = document.getElementById('close-login-button');
    const loginOverlay = document.getElementById('login-overlay');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');

    // --- ÍCONES ---
    const loginIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3h12" />
    </svg>`;
    const logoutIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="24" height="24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
    </svg>`;

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    function renderCollections() {
        collectionsList.innerHTML = '';
        collections.forEach(col => {
            const li = document.createElement('li');
            li.className = `collection-item ${col.id === activeCollectionId ? 'active' : ''}`;
            li.dataset.collectionId = col.id;
            li.innerHTML = `${col.icon}<span>${col.name}</span>`;
            collectionsList.appendChild(li);
        });
    }

    function renderTextList(collectionId, searchTerm = '') {
        textListContainer.innerHTML = '';
        let textsToRender = texts;

        if (collectionId !== 1) {
            textsToRender = textsToRender.filter(t => parseInt(t.collectionId, 10) === parseInt(collectionId, 10));
        }

        if (searchTerm) {
            textsToRender = textsToRender.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        textsToRender.forEach(text => {
            const div = document.createElement('div');
            div.className = `text-item ${text.id === activeTextId ? 'active' : ''}`;
            div.dataset.textId = text.id;
            div.innerHTML = `
                <h3>${text.title}</h3>
                <p>${text.date}</p>
            `;
            textListContainer.appendChild(div);
        });
    }

    function renderTextContent(textId) {
        const text = texts.find(t => t.id === textId);
        if (!text) {
            emptyState.style.display = 'flex';
            contentDisplay.style.display = 'none';
            return;
        }
        emptyState.style.display = 'none';
        contentDisplay.style.display = 'block';

        textTitle.textContent = text.title;
        textDate.textContent = text.date;
        textBody.innerHTML = text.content.map(p => `<p>${p}</p>`).join('');
    }

    // --- FUNÇÕES DE ATUALIZAÇÃO ---
    function setActiveCollection(collectionId) {
        activeCollectionId = collectionId;
        let textsInCollection = texts;
        if(collectionId !== 1) {
            textsInCollection = texts.filter(t => parseInt(t.collectionId, 10) === parseInt(collectionId, 10));
        }
        activeTextId = textsInCollection[0]?.id || null;
        
        updateUI();
    }

    function setActiveText(textId) {
        activeTextId = textId;
        updateUI();
    }

    function updateUI() {
        renderCollections();
        renderTextList(activeCollectionId, document.getElementById('search-box').value);
        renderTextContent(activeTextId);
    }
    
    async function initializeApp() {
        try {
            const { data: collectionsData, error: collectionsError } = await _supabase
                .from('collections')
                .select('*');

            if (collectionsError) {
                console.error('Erro ao buscar coleções:', collectionsError);
                return;
            }
            collections = collectionsData;

            const { data: textsData, error: textsError } = await _supabase
                .from('texts')
                .select('*');

            if (textsError) {
                console.error('Erro ao buscar textos:', textsError);
                return;
            }
            
            texts = textsData.map(text => ({
                ...text,
                date: new Date(text.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })
            }));

            if (texts.length > 0) {
                setActiveCollection(1);
            }

            // --- EVENT LISTENERS ---
            collectionsList.addEventListener('click', (e) => {
                const collectionItem = e.target.closest('.collection-item');
                if (collectionItem) {
                    const id = parseInt(collectionItem.dataset.collectionId);
                    setActiveCollection(id);
                }
            });

            textListContainer.addEventListener('click', (e) => {
                const textItem = e.target.closest('.text-item');
                if (textItem) {
                    const id = parseInt(textItem.dataset.textId);
                    setActiveText(id);
                }
            });

            document.getElementById('search-box').addEventListener('input', (e) => {
                renderTextList(activeCollectionId, e.target.value);
            });

            authButton.addEventListener('click', async () => {
                const { data: { session } } = await _supabase.auth.getSession();
                if (session) {
                    await _supabase.auth.signOut();
                } else {
                    loginModal.style.display = 'flex';
                }
            });

            closeLoginButton.addEventListener('click', () => {
                loginModal.style.display = 'none';
            });

            loginOverlay.addEventListener('click', () => {
                loginModal.style.display = 'none';
            });

            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                const email = e.target.email.value;
                const password = e.target.password.value;

                const { error } = await _supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error) {
                    loginError.textContent = 'Usuário ou senha inválidos';
                    loginError.classList.remove('hidden');
                } else {
                    loginModal.style.display = 'none';
                    loginError.classList.add('hidden');
                }
            });

            _supabase.auth.onAuthStateChange((event, session) => {
                if (session) {
                    authButton.innerHTML = `${logoutIcon}<span>Logout</span>`;
                } else {
                    authButton.innerHTML = `${loginIcon}<span>Login</span>`;
                }
            });

            // --- MOBILE NAVIGATION ---
            const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
            const sidebar = document.querySelector('aside');
            const mobileOverlay = document.getElementById('mobile-overlay');
            const closeSidebarButton = document.getElementById('close-sidebar');
            const textListSection = document.getElementById('text-list-section');
            const backToReadingButton = document.getElementById('back-to-reading');

            function toggleSidebar() {
                sidebar.classList.toggle('-translate-x-full');
                mobileOverlay.classList.toggle('hidden');
                document.body.classList.toggle('overflow-hidden');
            }

            function showTextList() {
                textListSection.classList.remove('translate-x-full');
                document.body.classList.add('overflow-hidden');
            }

            function hideTextList() {
                textListSection.classList.add('translate-x-full');
                document.body.classList.remove('overflow-hidden');
            }

            mobileMenuToggle.addEventListener('click', toggleSidebar);
            closeSidebarButton.addEventListener('click', toggleSidebar);
            mobileOverlay.addEventListener('click', toggleSidebar);

            // Em dispositivos móveis, ao clicar em uma coleção, feche o sidebar
            collectionsList.addEventListener('click', (e) => {
                if (window.innerWidth < 768) {
                    toggleSidebar();
                    showTextList();
                }
            });

            // Em dispositivos móveis, ao clicar em um texto, esconda a lista
            textListContainer.addEventListener('click', (e) => {
                if (window.innerWidth < 768) {
                    hideTextList();
                }
            });

            backToReadingButton.addEventListener('click', hideTextList);

            // Botão para mostrar a lista de textos em dispositivos móveis
            document.getElementById('show-text-list').addEventListener('click', showTextList);

            // Ajuste o layout quando o tamanho da tela mudar
            window.addEventListener('resize', () => {
                if (window.innerWidth >= 768) {
                    sidebar.classList.remove('-translate-x-full');
                    textListSection.classList.remove('translate-x-full');
                    mobileOverlay.classList.add('hidden');
                    document.body.classList.remove('overflow-hidden');
                }
            });

            // --- INICIALIZAÇÃO ---
            updateUI();
        } catch (error) {
            console.error('Error loading data:', error);
            // Opcional: Mostrar uma mensagem de erro para o usuário na UI
        }
    }

    initializeApp();
});