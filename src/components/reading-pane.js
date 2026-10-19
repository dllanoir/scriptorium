import { DOM } from '../core/dom.js';
import { State } from '../core/state.js';
import { Utils } from '../utils/index.js';

/**
 * Parses basic markdown blocks and inline formats into safe HTML.
 * @param {string} rawText 
 * @returns {string}
 */
function parseMarkdown(rawText = '') {
    const formatInline = (str) => {
        return str
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
            .replace(/\*([^*]+)\*/g, '<em>$1</em>');
    };

    const lines = rawText.split('\n');
    const htmlBlocks = [];
    let currentList = [];

    const flushList = () => {
        if (currentList.length > 0) {
            htmlBlocks.push(`<ul>${currentList.map(item => `<li>${formatInline(item)}</li>`).join('')}</ul>`);
            currentList = [];
        }
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) {
            flushList();
            continue;
        }

        if (line === '---' || line === '***') {
            flushList();
            htmlBlocks.push('<hr>');
        } else if (line.startsWith('### ')) {
            flushList();
            htmlBlocks.push(`<h3>${formatInline(line.slice(4).trim())}</h3>`);
        } else if (line.startsWith('> ')) {
            flushList();
            htmlBlocks.push(`<blockquote>${formatInline(line.slice(2).trim())}</blockquote>`);
        } else if (line.startsWith('- ') || line.startsWith('* ')) {
            currentList.push(line.slice(2).trim());
        } else {
            flushList();
            htmlBlocks.push(`<p>${formatInline(line)}</p>`);
        }
    }
    flushList();

    return htmlBlocks.join('');
}

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
            if (DOM.textMetrics) DOM.textMetrics.textContent = '';
            return;
        }

        DOM.emptyState.classList.add('hidden');
        DOM.errorState.classList.add('hidden');
        DOM.contentDisplay.classList.remove('hidden');

        DOM.textTitle.textContent = text.title;
        DOM.textDate.textContent = Utils.formatDate(text.created_at);
        DOM.textDate.setAttribute('datetime', text.created_at || '');
        
        const contentStr = Array.isArray(text.content)
            ? text.content.join('\n\n')
            : (text.content || '');

        const metrics = Utils.calculateMetrics(contentStr);
        if (DOM.textMetrics) DOM.textMetrics.textContent = metrics.formatted;

        // Convert content to HTML safely with basic markdown support
        const htmlContent = parseMarkdown(contentStr);
            
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
        if (DOM.textMetrics) DOM.textMetrics.textContent = '';
    }
};
