/**
 * @namespace Utils
 * @description Utility functions for sanitization, formatting and UI feedback.
 */
export const Utils = {
    /**
     * Sanitizes HTML content using DOMPurify.
     * @param {string} html - The raw HTML string.
     * @returns {string} - The sanitized HTML.
     */
    sanitize: (html) => {
        return DOMPurify.sanitize(html, {
            ALLOWED_TAGS: ['p', 'br', 'em', 'strong', 'h1', 'h2', 'h3'],
            ALLOWED_ATTR: []
        });
    },

    /**
     * Displays a toast notification.
     * @param {string} message - Message to display.
     * @param {'success'|'error'|'info'} [type='success'] - Type of toast.
     */
    toast: (message, type = 'success') => {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            style: {
                background: type === 'success' ? '#6366f1' : type === 'error' ? '#ef4444' : '#3b82f6'
            },
            stopOnFocus: true,
            className: "custom-toast"
        }).showToast();
    },

    /**
     * Formats a date string to pt-BR long format.
     * @param {string} dateString - ISO date string.
     * @returns {string} - Formatted date.
     */
    formatDate: (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    }
};

/**
 * @namespace Icons
 * @description Constant icons for the application.
 */
export const Icons = {
    login: '<span class="material-symbols-outlined text-[18px]">login</span>',
    logout: '<span class="material-symbols-outlined text-[18px]">logout</span>',
    collection: '<span class="material-symbols-outlined text-[18px]">folder</span>',
    menu_book: '<span class="material-symbols-outlined text-[18px]">menu_book</span>',
    auto_stories: '<span class="material-symbols-outlined text-[18px]">auto_stories</span>',
    history: '<span class="material-symbols-outlined text-[18px]">history</span>',
    edit_note: '<span class="material-symbols-outlined text-[18px]">edit_note</span>'
};
