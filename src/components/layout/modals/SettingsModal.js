/**
 * @returns {string} - Settings/Preferences Modal HTML template
 */
export function SettingsModal() {
    return `
    <div id="settings-modal" class="fixed inset-0 bg-surface/80 dark:bg-black/80 backdrop-blur-3xl z-[999] hidden items-center justify-center p-4 transition-opacity duration-500 opacity-0 px-4 md:px-8">
        <div class="bg-surface-container-high/90 dark:bg-surface-container-low/60 backdrop-blur-3xl border border-outline-variant/30 dark:border-white/5 w-full max-w-xl p-6 md:p-12 rounded-[2rem] shadow-[0_20px_80px_rgba(0,0,0,0.3)] relative overflow-hidden transition-all transform opacity-100 scale-100">
            <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-surface-variant"></div>
            <button class="absolute top-6 right-6 text-on-surface-variant hover:text-on-surface hover:bg-on-surface/10 rounded-full p-1 transition-all close-modal-button flex items-center justify-center" data-close="settings-modal">
                <span class="material-symbols-outlined" data-icon="close">close</span>
            </button>
            <h2 class="font-headline text-3xl md:text-4xl text-on-surface mb-2 font-light">Preferences</h2>
            <p class="font-body text-sm text-on-surface-variant mb-8">Customize your sanctuary.</p>
            
            <div class="space-y-6">
                <div>
                    <label class="block cursor-pointer">
                        <span class="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-3">Família Tipográfica</span>
                        <div class="relative">
                            <select id="setting-font" class="w-full bg-surface-container-highest/50 border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer" style="background-image: none !important;">
                                <option value="serif">Newsreader (Serifa Clássica)</option>
                                <option value="sans">Manrope (Moderna Sem Serifa)</option>
                                <option value="mono">Monospace (Técnica)</option>
                            </select>
                            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-on-surface-variant">arrow_drop_down</span>
                        </div>
                    </label>
                </div>

                <div>
                    <label class="block cursor-pointer">
                        <span class="block text-xs font-label text-on-surface-variant uppercase tracking-widest mb-3">Tamanho da Leitura</span>
                        <div class="relative">
                            <select id="setting-size" class="w-full bg-surface-container-highest/50 border border-outline-variant/30 rounded-xl py-3 px-4 text-on-surface font-body focus:outline-none focus:border-primary/50 transition-all appearance-none cursor-pointer" style="background-image: none !important;">
                                <option value="small">Pequeno</option>
                                <option value="medium">Médio (Padrão)</option>
                                <option value="large">Grande</option>
                            </select>
                            <span class="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[18px] pointer-events-none text-on-surface-variant">arrow_drop_down</span>
                        </div>
                    </label>
                </div>
            </div>
        </div>
    </div>`;
}
