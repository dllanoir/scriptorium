/**
 * @returns {string} - Sidebar HTML template
 */
export function Sidebar() {
    return `
    <aside class="w-72 border border-white/5 bg-stone-900/30 backdrop-blur-xl rounded-2xl shadow-xl hidden lg:flex flex-col h-full p-6 gap-6 overflow-y-auto transition-opacity duration-700">
        <div class="relative group mt-2">
            <label for="search-box" class="sr-only">Pesquisar textos</label>
            <input id="search-box" class="w-full bg-black/20 rounded-xl border border-white/5 focus:border-primary/50 focus:bg-black/40 text-on-surface font-body text-sm py-2.5 pl-10 focus:ring-0 transition-all duration-300 placeholder-on-surface-variant/50" placeholder="Search..." type="text"/>
            <span class="material-symbols-outlined absolute left-3 top-3 text-on-surface-variant/50 group-focus-within:text-primary transition-colors text-[18px]" data-icon="search">search</span>
        </div>
        
        <div class="flex flex-col space-y-1">
            <div class="flex items-center justify-between">
                <div class="font-headline text-xl text-on-surface mb-1">Collections</div>
                <button id="add-collection-button" class="text-on-surface-variant hover:text-primary transition-colors p-1 rounded-lg hover:bg-surface-container-highest/50 active:scale-90" title="New Collection" style="display:none;">
                    <span class="material-symbols-outlined text-[18px]">add</span>
                </button>
            </div>
            <div class="text-on-surface-variant/80 text-xs uppercase tracking-widest mb-6 font-label">Personal Reliquary</div>
            
            <nav class="flex flex-col space-y-2" id="collections-list">
                <!-- JS Injected Collections -->
            </nav>
        </div>

        <div class="mt-auto flex flex-col space-y-2 pt-8 border-t border-outline-variant/10">
            <a id="settings-button" class="text-stone-500 hover:text-stone-200 transition-all duration-300 cursor-pointer font-['Manrope'] uppercase tracking-[0.2em] text-[10px] flex items-center p-2 space-x-4">
                <span class="material-symbols-outlined text-[16px]" data-icon="settings">settings</span>
                <span>Settings</span>
            </a>
            <a id="help-button" class="text-stone-500 hover:text-stone-200 transition-all duration-300 cursor-pointer font-['Manrope'] uppercase tracking-[0.2em] text-[10px] flex items-center p-2 space-x-4">
                <span class="material-symbols-outlined text-[16px]" data-icon="help_outline">help_outline</span>
                <span>Help</span>
            </a>
        </div>
    </aside>`;
}
