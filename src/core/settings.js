import { DOM } from './dom.js';
import { Api } from '../api/index.js';

/**
 * @constant ZEN_COLORS
 * @description Default theme tokens.
 */
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

/**
 * @namespace Settings
 * @description Manages user preferences and theme application.
 */
export const Settings = {
    current: {
        theme: 'zen',
        fontFamily: 'serif',
        fontSize: 'medium'
    },

    /**
     * Initializes settings from LocalStorage and Cloud metadata.
     */
    init: async () => {
        const local = localStorage.getItem('scriptorium_settings');
        if (local) {
            Settings.current = { ...Settings.current, ...JSON.parse(local) };
            Settings.apply();
        }

        const user = await Api.getUser();
        if (user && user.user_metadata && user.user_metadata.settings) {
            Settings.current = { ...Settings.current, ...user.user_metadata.settings };
            Settings.apply();
            Settings.saveLocal();
        }

        Settings.bindUI();
    },

    /**
     * Saves settings to Supabase user metadata.
     */
    saveCloud: async () => {
        const user = await Api.getUser();
        if (user) {
            await Api.updateUserMetadata({ settings: Settings.current });
        }
    },

    /**
     * Saves settings to Browser LocalStorage.
     */
    saveLocal: () => {
        localStorage.setItem('scriptorium_settings', JSON.stringify(Settings.current));
    },

    /**
     * Updates a specific setting and applies it.
     * @param {string} key 
     * @param {any} value 
     */
    update: async (key, value) => {
        Settings.current[key] = value;
        Settings.apply();
        Settings.saveLocal();
        await Settings.saveCloud();
    },

    /**
     * Applies the current settings to the DOM.
     */
    apply: () => {
        const root = document.documentElement;
        
        Object.entries(ZEN_COLORS).forEach(([k, v]) => {
            root.style.setProperty(`--${k}`, v);
        });

        const fontMap = {
            'sans': { headline: 'Manrope, sans-serif', body: 'Manrope, sans-serif', label: 'Manrope, sans-serif' },
            'mono': { headline: 'monospace', body: 'monospace', label: 'monospace' },
            'serif': { headline: 'Newsreader, serif', body: 'Manrope, sans-serif', label: 'Manrope, sans-serif' }
        };
        
        const fns = fontMap[Settings.current.fontFamily] || fontMap['serif'];
        
        root.style.setProperty('--font-headline', fns.headline);
        root.style.setProperty('--font-body', fns.body);
        root.style.setProperty('--font-label', fns.label);
                                      
        const baseSize = Settings.current.fontSize === 'small' ? '14px' :
                         Settings.current.fontSize === 'large' ? '18px' : '16px';
        root.style.fontSize = baseSize;
    },

    /**
     * Binds UI events for the settings modal.
     */
    bindUI: () => {
        if (DOM.settingFont) {
            DOM.settingFont.value = Settings.current.fontFamily;
            DOM.settingFont.addEventListener('change', (e) => Settings.update('fontFamily', e.target.value));
        }
        if (DOM.settingSize) {
            DOM.settingSize.value = Settings.current.fontSize;
            DOM.settingSize.addEventListener('change', (e) => Settings.update('fontSize', e.target.value));
        }
    }
};
