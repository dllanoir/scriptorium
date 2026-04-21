/**
 * @returns {string} - Help Modal HTML template
 */
export function HelpModal() {
    return `
    <div id="help-modal" class="fixed inset-0 bg-surface/90 backdrop-blur-2xl z-[100] hidden items-center justify-center p-4 transition-opacity duration-500 opacity-0">
        <div class="bg-surface-container-high w-full max-w-md p-12 rounded-sm shadow-2xl relative overflow-hidden">
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
