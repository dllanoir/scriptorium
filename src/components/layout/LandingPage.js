/**
 * Landing Page component - The Digital Sanctuary Entry.
 * Design System: Monastic Night (Stitch generated tokens)
 * @returns {string} - Landing Page HTML template
 */
export function LandingPage() {
    return `
    <div class="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-[#0e0e0e]">
        <!-- Ambient Background Gradients -->
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#1f2020] blur-[150px]"></div>
        
        <div class="z-10 w-full max-w-lg px-8 py-12 flex flex-col items-center">
            <!-- Branding -->
            <div class="text-center mb-16 animate-fade-in">
                <h1 class="font-headline text-7xl font-extralight tracking-[0.2em] text-on-surface mb-4">SCRIPTORIUM</h1>
                <p class="font-body text-on-surface-variant text-sm uppercase tracking-[0.4em] opacity-80">Focus on your thoughts, your digital sanctuary.</p>
            </div>
            
            <!-- Auth Card (Glassmorphism) -->
            <div class="w-full bg-surface-container-high/40 backdrop-blur-[20px] border border-white/5 rounded-[2.5rem] p-12 shadow-[0_20px_50px_rgba(0,0,0,0.5)] transform transition-all duration-700">
                <h2 class="font-headline text-2xl text-on-surface mb-8 font-light text-center">Enter the Sanctuary</h2>
                
                <form id="landing-login-form" class="space-y-8">
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
                        <label class="block cursor-pointer">
                            <span class="block text-[10px] font-label text-on-surface-variant uppercase tracking-[0.2em] mb-1">Password</span>
                            <input class="w-full bg-transparent text-on-surface font-body focus:outline-none placeholder-on-surface-variant/30" 
                                   id="landing-password" 
                                   name="password"
                                   placeholder="••••••••" 
                                   type="password" 
                                   autocomplete="current-password"
                                   required/>
                        </label>
                    </div>
                    
                    <button type="submit" class="w-full bg-primary text-on-primary font-label uppercase text-[11px] tracking-[0.3em] py-5 mt-10 rounded-2xl hover:bg-primary-dim active:scale-[0.98] transition-all shadow-xl shadow-primary/10 font-bold">
                        Enter Sanctuary
                    </button>
                    
                    <div id="landing-login-error" class="hidden text-error font-body text-xs mt-6 text-center italic"></div>
                </form>
            </div>
            
            <p class="mt-12 text-[10px] text-on-surface-variant/40 font-label uppercase tracking-widest">Minimalist Writing Experience • Encrypted • Private</p>
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
