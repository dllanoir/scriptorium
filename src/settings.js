import { DOM } from './dom.js';
import { Api } from './api.js';

export const ZEN_COLORS = {
    "surface": "#0e0e0e",
    "on-surface": "#e7e5e5",
    "primary": "#c6c6c6",
    "on-primary": "#3f4041",
    "outline-variant": "#484848",
    "surface-container-low": "#131313",
    "surface-container-high": "#1f2020",
    "error": "#ee7d77"
};

export const Settings = {
    current: {
        theme: 'zen',
        fontFamily: 'serif',
        fontSize: 'medium'
    },

    init: async () => {
        // Load from local storage for instant render (FOUC combat)
        const local = localStorage.getItem('scriptorium_settings');
        if (local) {
            Settings.current = { ...Settings.current, ...JSON.parse(local) };
            Settings.apply();
        }

        // Try getting from Supabase user metadata
        const user = await Api.getUser();
        if (user && user.user_metadata && user.user_metadata.settings) {
            Settings.current = { ...Settings.current, ...user.user_metadata.settings };
            Settings.apply();
            Settings.saveLocal(); // sync local with cloud
        }

        Settings.bindUI();
    },

    saveCloud: async () => {
        const user = await Api.getUser();
        if (user) {
            await Api.updateUserMetadata({ settings: Settings.current });
        }
    },

    saveLocal: () => {
        localStorage.setItem('scriptorium_settings', JSON.stringify(Settings.current));
    },

    update: async (key, value) => {
        Settings.current[key] = value;
        Settings.apply();
        Settings.saveLocal();
        await Settings.saveCloud();
    },

    apply: () => {
        const root = document.documentElement;
        
        // Enforce Default Theme variables
        Object.entries(ZEN_COLORS).forEach(([k, v]) => {
            root.style.setProperty(`--${k}`, v);
        });

        // Font Family (Global)
        const fontMap = {
            'sans': { headline: 'Manrope, sans-serif', body: 'Manrope, sans-serif', label: 'Manrope, sans-serif' },
            'mono': { headline: 'monospace', body: 'monospace', label: 'monospace' },
            'serif':{ headline: 'Newsreader, serif', body: 'Manrope, sans-serif', label: 'Manrope, sans-serif' }
        };
        
        const fns = fontMap[Settings.current.fontFamily] || fontMap['serif'];
        tailwind.config.theme.extend.fontFamily = { ...tailwind.config.theme.extend.fontFamily, ...fns };
        
        document.body.style.fontFamily = fns.body;
        // Elements specifically using font-headline or font-label will pick up from CDN class, but wait, tailwind cdn doesn't react.
        // Instead, we just assign native CSS variables for Tailwind to read:
        // tailwind.config already has font-families in index.html, let's just make it read CSS variables:
        root.style.setProperty('--font-headline', fns.headline);
        root.style.setProperty('--font-body', fns.body);
        root.style.setProperty('--font-label', fns.label);
                                      
        // Font Size (Global root em scale)
        const baseSize = Settings.current.fontSize === 'small' ? '14px' :
                         Settings.current.fontSize === 'large' ? '18px' : '16px';
        root.style.fontSize = baseSize;
    },

    bindUI: () => {
        const fontSelect = document.getElementById('setting-font');
        const sizeSelect = document.getElementById('setting-size');

        if (fontSelect) {
            fontSelect.value = Settings.current.fontFamily;
            fontSelect.addEventListener('change', (e) => Settings.update('fontFamily', e.target.value));
        }
        if (sizeSelect) {
            sizeSelect.value = Settings.current.fontSize;
            sizeSelect.addEventListener('change', (e) => Settings.update('fontSize', e.target.value));
        }
    }
};
