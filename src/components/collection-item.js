import { State } from '../core/state.js';

/**
 * Renders a single collection link.
 * @param {Object} props
 * @param {Object} props.collection - Collection data.
 * @returns {HTMLElement}
 */
export function CollectionItem({ collection }) {
    const li = document.createElement('a');
    const isActive = collection.id === State.activeCollectionId;
    
    const baseClass = "collection-link transition-all duration-300 cursor-pointer ease-in-out font-['Manrope'] uppercase tracking-[0.2em] text-[10px] flex items-center p-3 space-x-3 rounded-xl hover:scale-[1.02] active:scale-95 group/col";
    const colorClass = isActive 
        ? "bg-surface-container-highest/80 dark:bg-stone-800/80 text-on-surface dark:text-stone-100 shadow-md border border-outline-variant/30 dark:border-white/5" 
        : "text-on-surface-variant dark:text-stone-500 hover:bg-surface-container-highest/40 dark:hover:bg-stone-800/40 hover:text-on-surface dark:hover:text-stone-200 border border-transparent";
    
    li.className = `${baseClass} ${colorClass}`;
    li.dataset.collectionId = collection.id;
    
    const iconName = collection.icon || 'folder';
    
    // Icon (Material Symbols)
    const iconSpan = document.createElement('span');
    iconSpan.className = "material-symbols-outlined text-[18px]";
    iconSpan.textContent = iconName; // Secure Text Injection
    
    // Title
    const titleSpan = document.createElement('span');
    titleSpan.className = "collection-title flex-1";
    titleSpan.textContent = collection.name; // Secure Text Injection
    
    li.appendChild(iconSpan);
    li.appendChild(titleSpan);
    
    // Actions (Edit/Delete) - only for non-system collections
    if (collection.id !== 1) {
        const actionsSpan = document.createElement('span');
        actionsSpan.className = "collection-actions ml-auto flex space-x-1 opacity-0 group-hover/col:opacity-100 transition-opacity";
        
        const editBtn = document.createElement('span');
        editBtn.className = "collection-edit-btn material-symbols-outlined text-[14px] hover:text-primary cursor-pointer p-0.5 rounded";
        editBtn.dataset.colId = collection.id;
        editBtn.title = "Editar";
        editBtn.textContent = "edit";
        
        const deleteBtn = document.createElement('span');
        deleteBtn.className = "collection-delete-btn material-symbols-outlined text-[14px] hover:text-error cursor-pointer p-0.5 rounded";
        deleteBtn.dataset.colId = collection.id;
        deleteBtn.title = "Excluir";
        deleteBtn.textContent = "close";
        
        actionsSpan.appendChild(editBtn);
        actionsSpan.appendChild(deleteBtn);
        li.appendChild(actionsSpan);
    }
    
    return li;
}
