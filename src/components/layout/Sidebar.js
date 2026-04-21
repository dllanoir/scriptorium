/**
 * @returns {string} - Sidebar HTML template
 */
export function Sidebar() {
    return `
    <aside id="sidebar" class="fixed inset-y-0 left-0 z-[60] w-72 border-r border-white/5 bg-stone-900/90 backdrop-blur-2xl shadow-2xl flex flex-col p-6 gap-6 overflow-y-auto transform -translate-x-full lg:translate-x-0 lg:static lg:bg-stone-900/30 lg:shadow-xl lg:rounded-2xl lg:h-full transition-transform duration-500 ease-in-out">
        <div class="flex items-center justify-between lg:hidden mb-2">
            <div class="font-headline italic text-xl text-stone-100">Coleções</div>
            <button id="close-sidebar" class="text-stone-400 hover:text-white p-2">
                <span class="material-symbols-outlined">close</span>
            </button>
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
    </aside>
    <!-- Mobile Overlay -->
    <div id="mobile-overlay" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] hidden lg:hidden transition-opacity duration-500 opacity-0"></div>`;
}
