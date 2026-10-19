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
            ALLOWED_TAGS: ['p', 'br', 'b', 'i', 'em', 'strong', 'h3', 'blockquote', 'ul', 'li', 'code', 'hr'],
            ALLOWED_ATTR: []
        });
    },

    /**
     * Calculates text statistics and metrics.
     * @param {string} text 
     * @returns {{ chars: number, words: number, readingTimeMin: number, formatted: string }}
     */
    calculateMetrics: (text = '') => {
        const str = typeof text === 'string' ? text : '';
        const chars = str.length;
        const words = str.trim() ? str.trim().split(/\s+/).filter(Boolean).length : 0;
        const readingTimeMin = Math.max(1, Math.ceil(words / 200));
        return {
            chars,
            words,
            readingTimeMin,
            formatted: `${words} ${words === 1 ? 'palavra' : 'palavras'} • ~${readingTimeMin} min de leitura`
        };
    },

    /**
     * Triggers file download in the browser.
     * @param {string} filename 
     * @param {string} content 
     * @param {string} [mimeType='text/plain;charset=utf-8'] 
     */
    downloadFile: (filename, content, mimeType = 'text/plain;charset=utf-8') => {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Applies markdown formatting to the current selection in a textarea.
     * @param {HTMLTextAreaElement} textarea 
     * @param {'bold'|'italic'|'h3'|'quote'|'list'|'code'|'hr'} type 
     */
    applyMarkdownFormat: (textarea, type) => {
        if (!textarea) return;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const value = textarea.value;
        const selected = value.substring(start, end);

        let replacement = '';
        let prefixLen = 0;
        let suffixLen = 0;

        switch (type) {
            case 'bold':
                replacement = selected ? `**${selected}**` : '**texto**';
                prefixLen = 2;
                suffixLen = 2;
                break;
            case 'italic':
                replacement = selected ? `*${selected}*` : '*texto*';
                prefixLen = 1;
                suffixLen = 1;
                break;
            case 'h3':
                replacement = selected ? `### ${selected}` : '### Título';
                prefixLen = 4;
                suffixLen = 0;
                break;
            case 'quote':
                replacement = selected ? `> ${selected}` : '> Citação';
                prefixLen = 2;
                suffixLen = 0;
                break;
            case 'list':
                replacement = selected ? `- ${selected}` : '- Item';
                prefixLen = 2;
                suffixLen = 0;
                break;
            case 'code':
                replacement = selected ? `\`${selected}\`` : '`código`';
                prefixLen = 1;
                suffixLen = 1;
                break;
            case 'hr':
                replacement = '\n---\n';
                prefixLen = replacement.length;
                suffixLen = 0;
                break;
            default:
                return;
        }

        textarea.focus();
        textarea.setRangeText(replacement, start, end, 'end');
        if (!selected) {
            if (type === 'hr') {
                textarea.setSelectionRange(start + replacement.length, start + replacement.length);
            } else {
                textarea.setSelectionRange(start + prefixLen, start + replacement.length - suffixLen);
            }
        } else {
            textarea.setSelectionRange(start + replacement.length, start + replacement.length);
        }
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
    },

    /**
     * Displays a toast notification.
     * @param {string} message - Message to display.
     * @param {'success'|'error'|'info'} [type='success'] - Type of toast.
     */
    toast: (message, type = 'success') => {
        if (typeof Toastify === 'function') {
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
        } else {
            console.log(`[Toast ${type}]: ${message}`);
        }
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
