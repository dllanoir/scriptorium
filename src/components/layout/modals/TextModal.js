/**
 * @returns {string} - New/Edit Text Modal HTML template
 */
export function TextModal() {
    return `
    <div id="new-text-modal" class="fixed inset-0 bg-surface/80 dark:bg-black/80 backdrop-blur-3xl z-[999] hidden items-center justify-center p-3 sm:p-4 overflow-y-auto transition-opacity duration-500 opacity-0">
        <form id="new-text-form" class="w-full max-w-4xl h-full md:h-[90vh] md:max-h-[calc(100vh-2rem)] my-auto bg-surface-container-high/90 dark:bg-surface-container-low/20 backdrop-blur-3xl border-none md:border md:border-outline-variant/30 md:dark:border-white/5 rounded-none md:rounded-[2rem] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-y-auto relative transition-all shadow-none md:shadow-[0_40px_120px_rgba(0,0,0,0.4)]">
            <input type="hidden" id="edit-text-id" value="">
            
            <!-- Zona 1: Controles Superiores -->
            <div class="flex items-center justify-end space-x-4 mb-2">
                <div class="relative min-w-[140px]">
                    <label for="new-collection" class="sr-only">Selecionar Coleção</label>
                    <select id="new-collection" name="new-collection" class="w-full bg-surface-container-highest/50 dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 rounded-xl text-on-surface dark:text-stone-300 font-label text-[10px] uppercase tracking-widest py-2.5 px-4 focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all appearance-none cursor-pointer pr-10 shadow-sm" style="background-image: none !important;">
                        <!-- Populado via JS -->
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-on-surface-variant">arrow_drop_down</span>
                </div>
                
                <button type="button" class="text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 rounded-xl px-3 py-2 transition-all flex items-center space-x-2 font-label text-[10px] uppercase tracking-widest close-modal-button" data-close="new-text-modal" title="Discard Changes">
                    <span class="hidden sm:inline">Discard</span>
                    <span class="material-symbols-outlined text-[20px]" data-icon="close">close</span>
                </button>
            </div>
            
            <!-- Zona 2: Título -->
            <div class="mb-4">
                <label for="new-title" class="sr-only">Título do Texto</label>
                <input id="new-title" name="new-title" class="w-full bg-transparent border-none text-2xl sm:text-3xl md:text-5xl font-headline text-on-surface placeholder-on-surface-variant/30 focus:ring-0 p-0 leading-tight" placeholder="Your Title..." type="text" autocomplete="off" required/>
                <div class="h-[1px] w-full bg-gradient-to-r from-primary/30 via-outline-variant/10 to-transparent mt-2"></div>
            </div>
            
            <!-- Zona 3: Corpo e Ferramentas Markdown -->
            <div class="relative flex-1 flex flex-col min-h-0">
                <div id="markdown-toolbar" class="flex flex-wrap items-center gap-1 mb-2 p-1 bg-surface-container-highest/30 dark:bg-white/5 rounded-xl border border-outline-variant/20 dark:border-white/5">
                    <button type="button" data-md="bold" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-colors" title="Negrito (**texto**)">
                        <span class="material-symbols-outlined text-[18px]">format_bold</span>
                    </button>
                    <button type="button" data-md="italic" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-colors" title="Itálico (*texto*)">
                        <span class="material-symbols-outlined text-[18px]">format_italic</span>
                    </button>
                    <button type="button" data-md="h3" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-colors" title="Subtítulo (###)">
                        <span class="material-symbols-outlined text-[18px]">title</span>
                    </button>
                    <button type="button" data-md="quote" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-colors" title="Citação (>)">
                        <span class="material-symbols-outlined text-[18px]">format_quote</span>
                    </button>
                    <button type="button" data-md="list" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-colors" title="Lista (-)">
                        <span class="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                    </button>
                    <button type="button" data-md="code" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-colors" title="Código inline">
                        <span class="material-symbols-outlined text-[18px]">code</span>
                    </button>
                    <button type="button" data-md="hr" class="p-1.5 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 transition-colors" title="Divisor (---)">
                        <span class="material-symbols-outlined text-[18px]">horizontal_rule</span>
                    </button>
                </div>
                <label for="new-content" class="sr-only">Conteúdo do Texto</label>
                <textarea id="new-content" name="new-content" class="w-full flex-1 bg-transparent border-none text-base sm:text-lg md:text-xl font-headline font-light text-on-surface/90 placeholder-on-surface-variant/30 focus:ring-0 resize-none p-0 leading-relaxed hide-scrollbar overflow-y-auto min-h-[160px]" placeholder="Begin drafting your masterwork..." required maxlength="5000"></textarea>
            </div>
            
            <!-- Zona 4: Rodapé -->
            <div class="mt-4 sm:mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 sm:pt-6 border-t border-outline-variant/20 dark:border-white/5">
                <div class="flex items-center gap-3 flex-wrap">
                    <div id="char-counter" class="text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">0 / 5000</div>
                    <span id="editor-metrics" class="text-[11px] font-label text-on-surface-variant/60">0 palavras • ~1 min de leitura</span>
                    <span id="draft-status" class="text-[11px] font-label text-primary/70 hidden">Rascunho salvo localmente</span>
                </div>
                
                <button type="submit" class="bg-primary text-on-primary font-label uppercase tracking-widest text-[11px] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center space-x-2 shadow-sm ml-auto">
                    <span class="material-symbols-outlined text-[18px]" data-icon="save">save</span>
                    <span id="save-text-label">Save Draft</span>
                </button>
            </div>
        </form>
    </div>`;
}
