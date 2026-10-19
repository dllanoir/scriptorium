/**
 * @returns {string} - Help Modal HTML template
 */
export function HelpModal() {
    return `
    <div id="help-modal" class="fixed inset-0 bg-surface/80 dark:bg-black/80 backdrop-blur-3xl z-[999] hidden items-center justify-center p-3 sm:p-4 overflow-y-auto transition-opacity duration-500 opacity-0">
        <div class="bg-surface-container-high/90 dark:bg-surface-container-high/80 backdrop-blur-3xl border border-outline-variant/30 dark:border-white/10 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.2)] dark:shadow-[0_0_80px_rgba(0,0,0,0.6)] relative overflow-y-auto my-auto max-h-[calc(100vh-2rem)] transition-all transform opacity-100 scale-100">
            <button class="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface transition-colors close-modal-button" data-close="help-modal">
                <span class="material-symbols-outlined" data-icon="close">close</span>
            </button>
            <h2 class="font-headline text-2xl sm:text-3xl text-on-surface mb-2 font-light">Help</h2>
            <p class="font-body text-sm text-on-surface-variant mb-6">Sanctuary Instructions.</p>
            <div class="font-body text-sm text-on-surface space-y-3 mb-6">
                <p>Navegue pelas suas coleções na barra lateral.</p>
                <p>Autentique-se usando o botão Sign In no topo para permitir a criação e gravação de novos textos originais.</p>
            </div>

            <!-- Atalhos de Teclado -->
            <div class="border-t border-outline-variant/20 dark:border-white/5 pt-4 mb-6">
                <h3 class="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-3">Atalhos de Teclado</h3>
                <dl class="space-y-2 text-xs font-body">
                    <div class="flex items-center justify-between py-1 border-b border-white/5">
                        <span class="text-on-surface-variant">Fechar modal / Sair do Modo Foco</span>
                        <kbd class="px-2 py-0.5 font-mono text-[11px] bg-white/5 border border-white/10 rounded text-stone-200">Esc</kbd>
                    </div>
                    <div class="flex items-center justify-between py-1 border-b border-white/5">
                        <span class="text-on-surface-variant">Novo texto</span>
                        <kbd class="px-2 py-0.5 font-mono text-[11px] bg-white/5 border border-white/10 rounded text-stone-200">Alt + N</kbd>
                    </div>
                    <div class="flex items-center justify-between py-1 border-b border-white/5">
                        <span class="text-on-surface-variant">Alternar Modo Foco</span>
                        <kbd class="px-2 py-0.5 font-mono text-[11px] bg-white/5 border border-white/10 rounded text-stone-200">Alt + Z</kbd>
                    </div>
                    <div class="flex items-center justify-between py-1 border-b border-white/5">
                        <span class="text-on-surface-variant">Buscar textos</span>
                        <kbd class="px-2 py-0.5 font-mono text-[11px] bg-white/5 border border-white/10 rounded text-stone-200">/</kbd>
                    </div>
                    <div class="flex items-center justify-between py-1 border-b border-white/5">
                        <span class="text-on-surface-variant">Salvar no editor</span>
                        <kbd class="px-2 py-0.5 font-mono text-[11px] bg-white/5 border border-white/10 rounded text-stone-200">Ctrl + S</kbd>
                    </div>
                </dl>
            </div>

            <div class="flex justify-end">
                <button type="button" class="text-on-surface-variant hover:text-primary font-label uppercase tracking-widest text-xs close-modal-button" data-close="help-modal">Entendido</button>
            </div>
        </div>
    </div>`;
}
