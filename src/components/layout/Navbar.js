/**
 * @returns {string} - Navbar HTML template
 */
export function Navbar() {
    return `
    <nav class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] px-2 md:px-8 pt-2 md:pt-4 z-50">
        <div class="rounded-2xl bg-stone-900/80 backdrop-blur-2xl shadow-2xl border border-white/5 flex justify-between items-center px-3 md:px-8 py-2 md:py-3 transition-all relative">
            <div class="flex items-center space-x-2 md:space-x-4">
                <button id="mobile-menu-toggle" class="lg:hidden text-stone-300 hover:text-white p-1">
                    <span class="material-symbols-outlined text-2xl">menu</span>
                </button>
                <div class="font-headline italic text-lg md:text-2xl tracking-normal md:tracking-widest text-stone-100 drop-shadow-md truncate max-w-[100px] md:max-w-none">Scriptorium</div>
            </div>
            
            <div class="flex items-center space-x-2 md:space-x-4">
                <button id="show-text-list" class="md:hidden text-stone-300 hover:text-white p-1" title="Ver Textos">
                    <span class="material-symbols-outlined">description</span>
                </button>
                <button class="bg-white/5 hover:bg-white/10 px-3 md:px-4 py-2 rounded-xl text-stone-200 hover:text-white transition-all duration-300 active:scale-95 font-label text-[10px] md:text-sm uppercase tracking-widest flex items-center space-x-2 border border-white/5 hover:border-white/20 shadow-lg" id="new-text-button" style="display: none;">
                    <span class="material-symbols-outlined text-[16px] md:text-[18px]" data-icon="edit">edit</span>
                    <span class="hidden md:inline">New Text</span>
                </button>
                <div id="user-info" class="hidden items-center">
                    <span id="user-email" class="hidden lg:inline text-xs font-label uppercase tracking-widest text-stone-400 mr-2"></span>
                </div>
                <button class="bg-transparent hover:bg-white/5 px-3 md:px-4 py-2 rounded-xl text-stone-300 hover:text-white transition-all duration-300 active:scale-95 font-label text-[10px] md:text-sm uppercase tracking-widest flex items-center space-x-2" id="auth-button">
                    <span class="material-symbols-outlined text-[16px] md:text-[18px]" data-icon="login">login</span>
                    <span class="hidden md:inline">Sign In</span>
                </button>
            </div>
        </div>
    </nav>`;
}
