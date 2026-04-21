/**
 * @returns {string} - Collection Create/Edit Modal HTML template
 */
export function CollectionModal() {
    return `
    <div id="collection-modal" class="fixed inset-0 bg-surface/80 dark:bg-black/80 backdrop-blur-2xl z-[999] hidden items-center justify-center p-4 transition-opacity duration-500 opacity-0">
        <div class="bg-surface-container-high/90 dark:bg-surface-container-high/80 backdrop-blur-3xl border border-outline-variant/30 dark:border-white/10 w-full max-w-md p-6 md:p-10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.2)] dark:shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all transform opacity-100 scale-100">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-surface-variant"></div>
            <button class="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 rounded-full p-1 transition-all close-modal-button flex items-center justify-center" data-close="collection-modal">
                <span class="material-symbols-outlined" data-icon="close">close</span>
            </button>
            <h2 id="collection-modal-title" class="font-headline text-2xl md:text-3xl text-on-surface mb-2 font-light">Nova Coleção</h2>
            <p class="font-body text-sm text-on-surface-variant mb-8">Organize seu relicário.</p>
            <form id="collection-form" class="space-y-6">
                <input type="hidden" id="edit-collection-id" value="">
                <div>
                    <label class="block cursor-pointer">
                        <span class="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-3">Nome</span>
                        <input id="collection-name" class="w-full bg-surface-container-highest/50 border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-all placeholder-on-surface-variant/50" placeholder="Ex: Filosofia Estoica" type="text" required />
                    </label>
                </div>
                <div>
                    <span class="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-3">Ícone</span>
                    <div id="icon-picker" class="grid grid-cols-6 gap-2">
                        <button type="button" data-icon="folder" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">folder</span></button>
                        <button type="button" data-icon="menu_book" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">menu_book</span></button>
                        <button type="button" data-icon="auto_stories" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">auto_stories</span></button>
                        <button type="button" data-icon="history" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">history</span></button>
                        <button type="button" data-icon="edit_note" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">edit_note</span></button>
                        <button type="button" data-icon="bookmark" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">bookmark</span></button>
                        <button type="button" data-icon="favorite" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">favorite</span></button>
                        <button type="button" data-icon="star" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">star</span></button>
                        <button type="button" data-icon="lightbulb" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">lightbulb</span></button>
                        <button type="button" data-icon="psychology" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">psychology</span></button>
                        <button type="button" data-icon="science" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">science</span></button>
                        <button type="button" data-icon="code" class="icon-pick p-3 rounded-xl border border-outline-variant/30 hover:border-primary/50 transition-all text-on-surface-variant hover:text-primary flex items-center justify-center"><span class="material-symbols-outlined">code</span></button>
                    </div>
                    <input type="hidden" id="collection-icon" value="folder">
                </div>
                <button type="submit" class="w-full bg-primary text-on-primary font-label uppercase tracking-widest text-[11px] px-8 py-3.5 rounded-xl hover:bg-primary/90 active:scale-95 transition-all flex items-center justify-center space-x-2 shadow-sm mt-4">
                    <span class="material-symbols-outlined text-[18px]">add_circle</span>
                    <span id="collection-save-label">Criar Coleção</span>
                </button>
            </form>
        </div>
    </div>`;
}
