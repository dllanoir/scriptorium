/**
 * @returns {string} - Main content containers HTML template
 */
export function ContentShell() {
    return `
    <!-- Middle Column: Text List Section -->
    <section id="text-list-section" class="fixed md:static inset-y-0 left-0 transform -translate-x-full md:translate-x-0 w-80 md:w-72 h-full border border-outline-variant/30 bg-surface-container-low/70 dark:bg-stone-900/30 backdrop-blur-xl rounded-2xl shadow-xl z-40 transition-transform duration-300 flex flex-col pt-24 md:pt-0 pb-6 md:shadow-xl transition-opacity duration-700">
        <div class="px-6 py-5 font-headline text-2xl text-on-surface border-b border-outline-variant/30 mb-2 sticky top-0 bg-transparent flex items-center justify-between">
            <div class="flex items-center">
                <span class="md:hidden inline-block mr-2 text-primary cursor-pointer material-symbols-outlined align-middle" id="back-to-reading">arrow_back</span>
                Textos
            </div>
        </div>
        <div id="text-list-container" class="flex-1 overflow-y-auto px-3 hide-scrollbar space-y-1">
            <!-- JS Injected Texts -->
        </div>
    </section>

    <!-- Main Reading Pane -->
    <main class="flex-1 bg-surface-container-lowest/80 dark:bg-[#101112] border border-outline-variant/30 dark:border-white/5 backdrop-blur-xl rounded-2xl overflow-y-auto flex flex-col items-center px-4 md:px-12 py-12 hide-scrollbar relative shadow-[inset_0_4px_40px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_4px_40px_rgba(0,0,0,0.3)] shadow-xl" id="reading-pane">
        
        <!-- Default Empty State -->
        <div id="empty-state" class="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto mt-24">
            <div class="w-16 h-16 rounded-full flex items-center justify-center bg-surface-container-high text-primary mb-4">
                <span class="material-symbols-outlined text-4xl">auto_stories</span>
            </div>
            <h3 class="font-headline text-2xl text-on-surface mb-2">Santuário Digital</h3>
            <p class="font-body text-base text-on-surface-variant">Selecione um texto para começar a leitura, ou adicione novos trechos.</p>
        </div>

        <!-- Error State -->
        <div id="error-state" class="flex flex-col items-center justify-center text-center space-y-4 max-w-md mx-auto mt-24 hidden">
            <div class="flex flex-col items-center">
                <span class="material-symbols-outlined text-5xl text-error mb-4">error</span>
                <h3 class="font-headline text-2xl text-on-surface mb-2">Ops! Algo deu errado</h3>
                <p id="error-message" class="font-body text-base text-on-surface-variant">Não foi possível carregar os dados.</p>
                <button id="retry-button" class="mt-8 bg-transparent text-primary border border-outline-variant/20 py-2 px-4 rounded-sm hover:border-primary transition-colors cursor-pointer font-label uppercase tracking-[0.1em] text-xs">Tentar Novamente</button>
            </div>
        </div>

        <article class="max-w-[680px] w-full mt-12 mb-32 hidden" id="content-display">
            <header class="mb-16 text-left relative">
                <div class="absolute -left-12 top-2 h-full w-[2px] bg-gradient-to-b from-primary/40 to-transparent rounded-full hidden md:block"></div>
                <div class="flex items-center justify-between mb-4">
                    <time class="font-label text-on-surface-variant text-sm tracking-[0.15em] uppercase block" id="text-date" datetime=""></time>
                    <div id="text-actions" class="hidden space-x-2">
                        <button class="text-on-surface-variant hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container-highest/50" id="edit-text-button" title="Edit Text">
                            <span class="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button class="text-on-surface-variant hover:text-error transition-colors p-2 rounded-lg hover:bg-error/10" id="delete-text-button" title="Delete Text">
                            <span class="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                    </div>
                </div>
                <h1 class="font-headline text-5xl md:text-6xl lg:text-[4rem] leading-tight tracking-tight text-on-surface font-light mb-8" id="text-title"></h1>
            </header>
            <div class="font-body text-lg md:text-xl leading-relaxed text-on-surface/90 space-y-8 font-light" id="text-body">
                <!-- Text injected here -->
            </div>
        </article>
    </main>`;
}
