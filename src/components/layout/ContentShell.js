/**
 * @returns {string} - Main content containers HTML template
 */
export function ContentShell() {
    return `
    <!-- Middle Column: Text List Section -->
    <section id="text-list-section" class="fixed inset-0 lg:static transform -translate-x-full lg:translate-x-0 w-full lg:w-72 h-full border-r border-outline-variant/30 bg-surface-container-low dark:bg-stone-900/90 lg:bg-stone-900/30 backdrop-blur-xl z-[60] transition-transform duration-500 ease-in-out flex flex-col pt-0 lg:pt-0 pb-6 lg:rounded-2xl lg:shadow-xl">
        <div class="px-6 py-5 font-headline text-2xl text-on-surface border-b border-outline-variant/30 mb-2 sticky top-0 bg-transparent flex items-center justify-between">
            <div class="flex items-center">
                <button id="back-to-reading" class="lg:hidden mr-2 text-primary cursor-pointer p-1 rounded-full hover:bg-primary/10 transition-colors flex items-center justify-center">
                    <span class="material-symbols-outlined align-middle">close</span>
                </button>
                Textos
            </div>
        </div>
        
        <div class="px-6 mb-4">
            <div class="relative group">
                <label for="search-box" class="sr-only">Pesquisar textos</label>
                <input id="search-box" class="w-full bg-surface-container-highest/50 dark:bg-black/20 rounded-xl border border-outline-variant/30 dark:border-white/5 focus:border-primary/50 focus:bg-surface-container transition-all duration-300 text-on-surface font-body text-sm py-2.5 pl-10 focus:ring-0 placeholder-on-surface-variant/50" placeholder="Search in collection..." type="text"/>
                <span class="material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-[18px]">search</span>
            </div>
            <div class="flex items-center justify-between mt-3 px-1">
                <span id="text-list-count" class="text-[10px] font-label uppercase tracking-wider text-on-surface-variant/50">0 textos</span>
                <select id="sort-texts-select" aria-label="Ordenar textos" class="bg-transparent text-[11px] font-label text-on-surface-variant border-none focus:ring-0 cursor-pointer py-0 pr-6 pl-1">
                    <option value="newest">Mais recentes</option>
                    <option value="oldest">Mais antigos</option>
                    <option value="alpha_asc">A–Z</option>
                    <option value="alpha_desc">Z–A</option>
                </select>
            </div>
        </div>

        <div id="text-list-container" class="flex-1 overflow-y-auto px-3 hide-scrollbar space-y-1">
            <!-- JS Injected Texts -->
        </div>
    </section>

    <!-- Main Reading Pane -->
    <main id="reading-pane" class="flex-1 bg-surface-container-lowest/80 dark:bg-[#101112] border border-outline-variant/30 dark:border-white/5 backdrop-blur-xl rounded-2xl overflow-y-auto flex flex-col items-center px-4 sm:px-6 md:px-10 lg:px-12 py-6 md:py-10 hide-scrollbar relative shadow-[inset_0_4px_40px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_4px_40px_rgba(0,0,0,0.3)] shadow-xl transition-all duration-700">
       
        <!-- Default Empty State -->
        <div id="empty-state" class="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-auto py-8">
            <div class="w-16 h-16 rounded-full flex items-center justify-center bg-surface-container-high text-primary mb-4">
                <span class="material-symbols-outlined text-4xl">auto_stories</span>
            </div>
            <h3 class="font-headline text-2xl text-on-surface mb-2">Santuário Digital</h3>
            <p class="font-body text-base text-on-surface-variant">Selecione um texto para começar a leitura, ou adicione novos trechos.</p>
        </div>

        <!-- Error State -->
        <div id="error-state" class="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto my-auto py-8 hidden">
            <div class="flex flex-col items-center">
                <span class="material-symbols-outlined text-5xl text-error mb-4">error</span>
                <h3 class="font-headline text-2xl text-on-surface mb-2">Ops! Algo deu errado</h3>
                <p id="error-message" class="font-body text-base text-on-surface-variant">Não foi possível carregar os dados.</p>
                <button id="retry-button" class="mt-8 bg-transparent text-primary border border-outline-variant/20 py-2 px-4 rounded-sm hover:border-primary transition-colors cursor-pointer font-label uppercase tracking-[0.1em] text-xs">Tentar Novamente</button>
            </div>
        </div>

        <article class="max-w-[680px] w-full mt-4 md:mt-8 mb-16 md:mb-24 hidden" id="content-display">
            <header class="mb-10 md:mb-16 text-left relative">
                <div class="absolute -left-12 top-2 h-full w-[2px] bg-gradient-to-b from-primary/40 to-transparent rounded-full hidden md:block"></div>
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3 flex-wrap">
                        <time class="font-label text-on-surface-variant text-sm tracking-[0.15em] uppercase block" id="text-date" datetime=""></time>
                        <span id="text-metrics" class="font-label text-xs uppercase tracking-wider text-on-surface-variant/60"></span>
                    </div>
                    <div id="text-actions" class="hidden space-x-1 sm:space-x-2">
                        <button id="copy-text-button" type="button" class="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container-high" title="Copiar texto"><span class="material-symbols-outlined text-[18px]">content_copy</span></button>
                        <button id="export-md-button" type="button" class="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container-high" title="Exportar Markdown (.md)"><span class="material-symbols-outlined text-[18px]">download</span></button>
                        <button id="export-txt-button" type="button" class="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container-high" title="Exportar TXT (.txt)"><span class="material-symbols-outlined text-[18px]">description</span></button>
                        <button class="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container-highest/50" id="edit-text-button" title="Edit Text">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button class="text-on-surface-variant hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10" id="delete-text-button" title="Delete Text">
                            <span class="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                </div>
                <h1 class="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 md:mb-6 leading-tight tracking-tight text-on-surface font-light" id="text-title"></h1>
            </header>
            <div class="font-body text-lg md:text-xl leading-relaxed text-on-surface/90 space-y-8 font-light" id="text-body">
                <!-- Text injected here -->
            </div>
        </article>
    </main>`;
}
