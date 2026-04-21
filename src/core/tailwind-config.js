function initTailwind() {
    tailwind.config = {
        darkMode: "class",
        theme: {
            extend: {
                colors: {
                    "on-tertiary-fixed": "#2c4655",
                    "outline-variant": "var(--outline-variant, #484848)",
                    "surface-dim": "#0e0e0e",
                    "on-tertiary-container": "#3e5868",
                    "surface-container-lowest": "#000000",
                    "on-tertiary": "#466170",
                    "tertiary-fixed": "#d0ecff",
                    "primary-fixed-dim": "#d4d4d4",
                    "on-secondary": "#202020",
                    "on-error-container": "#ff9993",
                    "inverse-surface": "#fcf9f8",
                    "on-background": "#e7e5e5",
                    "on-surface": "var(--on-surface, #e7e5e5)",
                    "primary-container": "#454747",
                    "primary-dim": "#b8b9b9",
                    "surface-bright": "#2b2c2c",
                    "secondary-fixed-dim": "#d6d4d3",
                    "inverse-primary": "#5e5f5f",
                    "secondary-fixed": "#e4e2e1",
                    "tertiary-container": "#d0ecff",
                    "background": "#0e0e0e",
                    "on-primary": "var(--on-primary, #3f4041)",
                    "outline": "#767575",
                    "surface-container-low": "var(--surface-container-low, #131313)",
                    "surface-tint": "#c6c6c6",
                    "on-primary-fixed": "#3e4040",
                    "surface-container-highest": "#252626",
                    "secondary": "#9f9d9d",
                    "primary": "var(--primary, #c6c6c6)",
                    "error": "var(--error, #ee7d77)",
                    "error-container": "#7f2927",
                    "tertiary-dim": "#c2def0",
                    "surface-variant": "#252626",
                    "primary-fixed": "#e2e2e2",
                    "secondary-container": "#3b3b3b",
                    "error-dim": "#bb5551",
                    "on-secondary-fixed": "#3f3f3f",
                    "on-error": "#490106",
                    "on-surface-variant": "#acabaa",
                    "on-secondary-fixed-variant": "#5c5b5b",
                    "inverse-on-surface": "#565555",
                    "tertiary": "#eff8ff",
                    "surface": "var(--surface, #0e0e0e)",
                    "on-primary-fixed-variant": "#5a5c5c",
                    "on-primary-container": "#d0d0d0",
                    "tertiary-fixed-dim": "#c2def0",
                    "on-secondary-container": "#c1bfbe",
                    "secondary-dim": "#9f9d9d",
                    "on-tertiary-fixed-variant": "#486272",
                    "surface-container": "#191a1a",
                    "surface-container-high": "var(--surface-container-high, #1f2020)"
                },
                borderRadius: {
                    DEFAULT: "0.125rem",
                    lg: "0.25rem",
                    xl: "0.5rem",
                    full: "0.75rem"
                },
                fontFamily: {
                    headline: ["var(--font-headline, Newsreader)", "serif"],
                    body: ["var(--font-body, Manrope)", "sans-serif"],
                    label: ["var(--font-label, Manrope)", "sans-serif"]
                }
            }
        }
    };
}

initTailwind();
