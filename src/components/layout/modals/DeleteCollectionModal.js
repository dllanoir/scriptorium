/**
 * @returns {string} - Delete Collection Modal HTML template
 */
export function DeleteCollectionModal() {
    return `
    <div id="delete-collection-modal" class="fixed inset-0 bg-surface/80 dark:bg-black/80 backdrop-blur-2xl z-[100] hidden items-center justify-center p-4 transition-opacity duration-500 opacity-0">
        <div class="bg-surface-container-high/90 dark:bg-surface-container-high/80 backdrop-blur-3xl border border-error/30 w-full max-w-sm p-8 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.2)] relative overflow-hidden transition-all transform opacity-100 scale-100 text-center">
            <span class="material-symbols-outlined text-4xl text-error mb-4">folder_delete</span>
            <h2 class="font-headline text-2xl text-on-surface mb-2">Excluir Coleção?</h2>
            <p class="font-body text-sm text-on-surface-variant mb-8">Todos os textos desta coleção serão perdidos permanentemente.</p>
            <div class="flex space-x-4">
                <button type="button" class="flex-1 bg-surface-container-highest/50 text-on-surface font-label uppercase tracking-widest text-xs px-4 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all close-modal-button" data-close="delete-collection-modal">
                    Cancelar
                </button>
                <button type="button" id="confirm-delete-collection-button" class="flex-1 bg-error text-on-error font-label uppercase tracking-widest text-xs px-4 py-3 rounded-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(238,125,119,0.2)]">
                    Excluir
                </button>
            </div>
        </div>
    </div>`;
}
