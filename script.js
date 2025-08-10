document.addEventListener('DOMContentLoaded', () => {
    // --- BANCO DE DADOS ---
    let collections = [];
    let texts = [];

    // --- ESTADO DA APLICAÇÃO ---
    let activeCollectionId = 1;
    let activeTextId = null; // Será definido após carregar os dados

    // --- ELEMENTOS DO DOM ---
    const collectionsList = document.getElementById('collections-list');
    const textListContainer = document.getElementById('text-list-container');
    const textTitle = document.getElementById('text-title');
    const textDate = document.getElementById('text-date');
    const textBody = document.getElementById('text-body');
    const emptyState = document.getElementById('empty-state');
    const contentDisplay = document.getElementById('content-display');

    // --- FUNÇÕES DE RENDERIZAÇÃO ---

    function renderCollections() {
        collectionsList.innerHTML = '';
        collections.forEach(col => {
            const li = document.createElement('li');
            li.className = `collection-item flex items-center space-x-3 font-semibold text-gray-300 rounded-md cursor-pointer px-3 py-2 transition-colors ${col.id === activeCollectionId ? 'active' : 'hover:bg-[#3a3a4a] hover:text-white'}`;
            li.dataset.collectionId = col.id;
            li.innerHTML = `${col.icon}<span>${col.name}</span>`;
            collectionsList.appendChild(li);
        });
    }

    function renderTextList(collectionId, searchTerm = '') {
        textListContainer.innerHTML = '';
        let textsToRender = texts;

        if (collectionId !== 1) {
            textsToRender = textsToRender.filter(t => t.collectionId === collectionId);
        }

        if (searchTerm) {
            textsToRender = textsToRender.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()));
        }

        textsToRender.forEach(text => {
            const div = document.createElement('div');
            div.className = `text-item border border-transparent p-3 rounded-lg cursor-pointer mb-2 ${text.id === activeTextId ? 'active' : 'hover:bg-[#2a2a34]'}`;
            div.dataset.textId = text.id;
            div.innerHTML = `
                <h3 class="font-semibold text-white truncate">${text.title}</h3>
                <p class="text-sm text-gray-400">${text.date}</p>
            `;
            textListContainer.appendChild(div);
        });
    }

    function renderTextContent(textId) {
        const text = texts.find(t => t.id === textId);
        if (!text) {
            emptyState.classList.remove('hidden');
            emptyState.classList.add('flex');
            contentDisplay.classList.add('hidden');
            return;
        }
        emptyState.classList.add('hidden');
        emptyState.classList.remove('flex');
        contentDisplay.classList.remove('hidden');

        textTitle.textContent = text.title;
        textDate.textContent = text.date;
        textBody.innerHTML = text.content.map(p => `<p>${p}</p>`).join('');
    }

    // --- FUNÇÕES DE ATUALIZAÇÃO ---
    function setActiveCollection(collectionId) {
        activeCollectionId = collectionId;
        let textsInCollection = texts;
        if(collectionId !== 1) {
            textsInCollection = texts.filter(t => t.collectionId === collectionId);
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
            const response = await fetch('database.json');
            const data = await response.json();
            collections = data.collections;
            texts = data.texts;

            // Definir estado inicial depois que os dados são carregados
            if (texts.length > 0) {
                activeTextId = 1;
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
