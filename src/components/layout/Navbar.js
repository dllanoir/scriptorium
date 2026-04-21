/**
 * @returns {string} - Navbar HTML template
 */
export function Navbar() {
    return `
    <nav class="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-[1600px] px-8 pt-4 z-50">
        <div class="rounded-2xl bg-stone-900/70 backdrop-blur-2xl shadow-2xl border border-white/5 flex justify-between items-center px-8 py-3 transition-all">
            <div class="font-headline italic text-2xl tracking-widest text-stone-100 drop-shadow-md">Scriptorium</div>
            <div class="hidden md:flex space-x-8">
                <a class="text-stone-100 font-headline tracking-tight text-lg hover:-translate-y-0.5 transition-transform drop-shadow-sm" style="text-shadow: 0 0 10px rgba(255,255,255,0.2)" href="#">Essays</a>
                <a class="text-stone-500 hover:text-stone-200 transition-all duration-500 font-headline tracking-tight text-lg hover:-translate-y-0.5" href="#">Library</a>
                <a class="text-stone-500 hover:text-stone-200 transition-all duration-500 font-headline tracking-tight text-lg hover:-translate-y-0.5" href="#">Archives</a>
            </div>
            <div class="flex items-center space-x-6">
                <button class="bg-white/5 hover:bg-white/10 px-4 py-2 rounded-xl text-stone-200 hover:text-white transition-all duration-300 active:scale-95 font-label text-sm uppercase tracking-widest flex items-center space-x-2 border border-white/5 hover:border-white/20 shadow-lg" id="new-text-button" style="display: none;">
                    <span class="material-symbols-outlined text-[18px]" data-icon="edit">edit</span>
                    <span>New Text</span>
                </button>
                <div id="user-info" class="hidden items-center space-x-3">
                    <span id="user-email" class="text-xs font-label uppercase tracking-widest text-stone-400"></span>
                </div>
                <button class="bg-transparent hover:bg-white/5 px-4 py-2 rounded-xl text-stone-300 hover:text-white transition-all duration-300 active:scale-95 font-label text-sm uppercase tracking-widest flex items-center space-x-2" id="auth-button">
                    <span class="material-symbols-outlined text-[18px]">login</span>
                    <span>Sign In</span>
                </button>
            </div>
        </div>
    </nav>`;
}
