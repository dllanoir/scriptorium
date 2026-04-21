import { State } from '../core/state.js';
import { Utils } from '../utils/index.js';

/**
 * Renders a single text card for the list.
 * @param {Object} props
 * @param {Object} props.text - Text data.
 * @returns {HTMLElement}
 */
export function TextItem({ text }) {
    const div = document.createElement('div');
    const isActive = text.id === State.activeTextId;
    
    const baseClass = "text-item p-4 rounded-2xl cursor-pointer transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] border mb-1";
    const activeClass = isActive 
        ? "bg-surface-container-highest dark:bg-stone-900/80 border-primary/30 shadow-lg shadow-black/5 dark:shadow-black/20 text-on-surface dark:text-white" 
        : "border-transparent hover:bg-surface-container-highest/50 dark:hover:bg-stone-900/40 hover:border-outline-variant/30 dark:hover:border-white/5";
    
    div.className = `${baseClass} ${activeClass}`;
    div.dataset.textId = text.id;
    
    const title = document.createElement('h3');
    title.className = "font-headline text-lg text-on-surface mb-1";
    title.textContent = text.title; // Secure Injection
    
    const dateP = document.createElement('p');
    dateP.className = "font-label text-xs text-on-surface-variant uppercase tracking-wider";
    dateP.textContent = Utils.formatDate(text.created_at);
    
    div.appendChild(title);
    div.appendChild(dateP);
    
    return div;
}
