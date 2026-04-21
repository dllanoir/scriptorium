/**
 * @returns {string} - Help Modal HTML template
 */
export function HelpModal() {
    return `
    <div id="help-modal" class="fixed inset-0 bg-surface/80 dark:bg-black/80 backdrop-blur-3xl z-[999] hidden items-center justify-center p-4 transition-opacity duration-500 opacity-0">
        <div class="bg-surface-container-high/90 dark:bg-surface-container-high/80 backdrop-blur-3xl border border-outline-variant/30 dark:border-white/10 w-full max-w-lg p-6 md:p-10 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.2)] dark:shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-hidden transition-all transform opacity-100 scale-100">
            <button class="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors close-modal-button" data-close="help-modal">
                <span class="material-symbols-outlined" data-icon="close">close</span>
            </button>
            <h2 class="font-headline text-3xl text-on-surface mb-2 font-light">Help</h2>
            <p class="font-body text-sm text-on-surface-variant mb-6">Sanctuary Instructions.</p>
            <div class="font-body text-base text-on-surface space-y-4 mb-8">
                <p>Navegue pelas suas coleções na barra lateral.</p>
                <p>Autentique-se usando o botão Sign In no topo para permitir a criação e gravação de novos textos originais.</p>
            </div>
            <div class="flex justify-end">
                <button type="button" class="text-on-surface-variant hover:text-primary font-label uppercase tracking-widest text-xs close-modal-button" data-close="help-modal">Entendido</button>
            </div>
        </div>
    </div>`;
}
