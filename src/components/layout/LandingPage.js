/**
 * Landing Page component - The Digital Sanctuary Entry.
 * Design System: Monastic Night (Stitch generated tokens)
 * @returns {string} - Landing Page HTML template
 */
export function LandingPage() {
    return `
    <div class="min-h-screen w-full flex flex-col justify-center items-center relative overflow-x-hidden bg-[#0e0e0e] py-4 sm:py-8 px-4">
        <!-- Ambient Background Gradients -->
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px] pointer-events-none"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1f2020] blur-[150px] pointer-events-none"></div>
        
        <div class="z-10 w-full max-w-md md:max-w-lg px-2 sm:px-6 py-2 sm:py-4 my-auto flex flex-col items-center">
            <!-- Branding -->
            <div class="text-center mb-5 sm:mb-8 animate-fade-in px-4">
                <h1 class="font-headline text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extralight tracking-[0.2em] text-on-surface mb-2 sm:mb-3">SCRIPTORIUM</h1>
                <p class="font-body text-on-surface-variant text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.3em] md:tracking-[0.4em] opacity-80 leading-relaxed">Focus on your thoughts, your digital sanctuary.</p>
            </div>
            
            <!-- Auth Card (Glassmorphism) -->
            <div class="w-full bg-surface-container-high/40 backdrop-blur-[20px] border border-white/5 rounded-3xl p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-700">
                <h2 class="font-headline text-xl sm:text-2xl text-on-surface mb-5 sm:mb-6 font-light text-center">Enter the Sanctuary</h2>
                
                <form id="landing-login-form" class="space-y-4 sm:space-y-6">
                    <div class="group border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                        <label class="block cursor-pointer">
                            <span class="block text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em] mb-1">Email Address</span>
                            <input class="w-full bg-transparent text-on-surface font-body focus:outline-none placeholder-on-surface-variant/30" 
                                   id="landing-email" 
                                   name="email"
                                   placeholder="your@email.com" 
                                   type="email" 
                                   autocomplete="email"
                                   required/>
                        </label>
                    </div>
                    
                    <div class="group border-b border-outline-variant transition-all focus-within:border-primary pb-2">
                        <label for="landing-password" class="block text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em] mb-1 cursor-pointer">Password</label>
                        <div class="flex items-center gap-2">
                            <input class="w-full bg-transparent text-on-surface font-body focus:outline-none placeholder-on-surface-variant/30" 
                                   id="landing-password" 
                                   name="password"
                                   placeholder="••••••••" 
                                   type="password" 
                                   autocomplete="current-password"
                                   required/>
                            <button type="button" 
                                    id="toggle-landing-password" 
                                    aria-label="Mostrar ou ocultar senha" 
                                    class="text-on-surface-variant hover:text-on-surface focus:outline-none transition-colors p-1" 
                                    title="Mostrar ou ocultar senha">
                                <span class="material-symbols-outlined text-[18px]">visibility</span>
                            </button>
                        </div>
                    </div>
                    
                    <button id="landing-submit-btn" 
                            type="submit" 
                            class="w-full bg-primary text-on-primary font-label uppercase text-[11px] tracking-[0.3em] py-3.5 sm:py-4 mt-5 sm:mt-7 rounded-2xl hover:bg-primary-dim active:scale-[0.98] transition-all shadow-xl shadow-primary/10 font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                        Enter Sanctuary
                    </button>
                    
                    <div id="landing-login-error" class="hidden text-error font-body text-xs mt-4 text-center italic"></div>
                </form>
            </div>
            
            <p class="mt-5 sm:mt-8 text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest text-center">Minimalist Writing Experience • Encrypted • Private</p>
        </div>
    </div>
    <style>
        @keyframes fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
            animation: fade-in 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
        }
    </style>`;
}
