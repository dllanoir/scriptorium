/**
 * @returns {string} - New/Edit Text Modal HTML template
 */
export function TextModal() {
    return `
    <div id="new-text-modal" class="fixed inset-0 bg-surface/80 dark:bg-black/80 backdrop-blur-3xl z-[100] hidden items-center justify-center p-4 transition-opacity duration-500 opacity-0 px-8">
        <form id="new-text-form" class="w-full max-w-4xl h-[85vh] bg-surface-container-high/90 dark:bg-surface-container-low/20 backdrop-blur-3xl border border-outline-variant/30 dark:border-white/5 rounded-[2rem] p-12 flex flex-col relative transition-all shadow-[0_0_80px_rgba(0,0,0,0.2)] dark:shadow-[0_0_120px_rgba(0,0,0,0.5)]">
            <input type="hidden" id="edit-text-id" value="">
            <div class="absolute top-8 right-10 flex items-center space-x-6">
                <div class="relative">
                    <label for="new-collection" class="sr-only">Selecionar Coleção</label>
                    <select id="new-collection" class="bg-surface-container-highest/50 dark:bg-black/30 border border-outline-variant/30 dark:border-white/10 rounded-xl text-on-surface dark:text-stone-300 font-label text-xs uppercase tracking-widest py-3 px-4 focus:outline-none focus:border-primary/50 focus:bg-surface-container transition-all appearance-none cursor-pointer pr-10 shadow-lg form-select">
                        <!-- Populated by JS -->
                    </select>
                    <span class="material-symbols-outlined absolute right-3 top-3 text-[18px] pointer-events-none text-on-surface-variant">arrow_drop_down</span>
                </div>
                
                <button type="button" class="text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 rounded-xl px-4 py-2 transition-all flex items-center space-x-2 font-label text-sm uppercase tracking-widest close-modal-button" data-close="new-text-modal">
                    <span>Discard</span>
                    <span class="material-symbols-outlined" data-icon="close">close</span>
                </button>
            </div>
            
            <label for="new-title" class="sr-only">Título do Texto</label>
            <input id="new-title" class="w-full bg-transparent border-none text-5xl font-headline text-on-surface placeholder-on-surface-variant/50 focus:ring-0 mb-10 p-0" placeholder="Title..." type="text" autocomplete="off" required/>
            
            <div class="relative flex-1 flex flex-col">
                <label for="new-content" class="sr-only">Conteúdo do Texto</label>
                <textarea id="new-content" class="w-full flex-1 bg-transparent border-none text-xl font-headline font-light text-on-surface/90 placeholder-on-surface-variant/50 focus:ring-0 resize-none p-0 leading-relaxed hide-scrollbar" placeholder="Begin drafting..." required maxlength="5000"></textarea>
                <!-- Character Counter -->
                <div id="char-counter" class="absolute bottom-2 right-2 text-[10px] font-label uppercase tracking-widest text-on-surface-variant/50">0 / 5000</div>
            </div>
            
            <div class="mt-8 flex justify-end items-center pt-8 border-t border-outline-variant/30 dark:border-white/5">
                <button type="submit" class="bg-primary text-on-primary font-label uppercase tracking-widest text-xs px-8 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-2 shadow-lg hover:shadow-primary/20">
                    <span class="material-symbols-outlined text-[18px]" data-icon="save">save</span>
                    <span id="save-text-label">Save Draft</span>
                </button>
            </div>
        </form>
    </div>`;
}
