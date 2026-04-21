import { DOM } from '../core/dom.js';
import { State } from '../core/state.js';
import { Utils } from '../utils/index.js';

/**
 * Manages the reading pane content and its states.
 */
export const ReadingPane = {
    /**
     * Renders the active text content into the reading pane.
     */
    render: () => {
        const text = State.texts.find(t => t.id === State.activeTextId);
        
        if (!text) {
            DOM.emptyState.classList.remove('hidden');
            DOM.contentDisplay.classList.add('hidden');
            DOM.errorState.classList.add('hidden');
            return;
        }

        DOM.emptyState.classList.add('hidden');
        DOM.errorState.classList.add('hidden');
        DOM.contentDisplay.classList.remove('hidden');

        DOM.textTitle.textContent = text.title;
        DOM.textDate.textContent = Utils.formatDate(text.created_at);
        DOM.textDate.setAttribute('datetime', text.created_at);
        
        // Convert content to HTML safely
        let htmlContent = '';
        if (Array.isArray(text.content)) {
            // Legacy support
            htmlContent = text.content.map(p => `<p>${p}</p>`).join('');
        } else {
            // New format: text with newlines
            const paragraphs = text.content.split('\n').filter(p => p.trim() !== '');
            htmlContent = paragraphs.map(p => `<p>${p}</p>`).join('');
        }
            
        // Final Sanitization before injection
        DOM.textBody.innerHTML = Utils.sanitize(htmlContent);
    },

    /**
     * Shows an error message in the reading pane.
     * @param {string} message 
     */
    showError: (message) => {
        DOM.emptyState.classList.add('hidden');
        DOM.contentDisplay.classList.add('hidden');
        DOM.errorState.classList.remove('hidden');
        DOM.errorMessage.textContent = message;
    }
};
