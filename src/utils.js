export const Utils = {
    sanitizeAllowlist: (html) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        const allowedTags = ['p', 'br', 'em', 'strong'];
        
        function cleanNode(node) {
            if (node.nodeType === Node.TEXT_NODE) return;
            
            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toLowerCase();
                if (!allowedTags.includes(tag)) {
                    const text = document.createTextNode(node.textContent || '');
                    node.parentNode.replaceChild(text, node);
                } else {
                    while (node.attributes.length > 0) {
                        node.removeAttribute(node.attributes[0].name);
                    }
                    Array.from(node.childNodes).forEach(cleanNode);
                }
            }
        }
        
        Array.from(doc.body.childNodes).forEach(cleanNode);
        return doc.body.innerHTML; 
    },

    toast: (message, type = 'success') => {
        Toastify({
            text: message,
            duration: 3000,
            close: true,
            gravity: "top",
            position: "right",
            backgroundColor: type === 'success' ? '#6366f1' : '#ef4444',
            stopOnFocus: true,
            className: "custom-toast"
        }).showToast();
    },

    formatDate: (dateString) => {
        return new Date(dateString).toLocaleDateString('pt-BR', { 
            day: 'numeric', 
            month: 'long', 
            year: 'numeric' 
        });
    }
};

export const Icons = {
    login: '<span class="material-symbols-outlined text-[18px]">login</span>',
    logout: '<span class="material-symbols-outlined text-[18px]">logout</span>',
    collection: '<span class="material-symbols-outlined text-[18px]">folder</span>',
    menu_book: '<span class="material-symbols-outlined text-[18px]">menu_book</span>',
    auto_stories: '<span class="material-symbols-outlined text-[18px]">auto_stories</span>',
    history: '<span class="material-symbols-outlined text-[18px]">history</span>',
    edit_note: '<span class="material-symbols-outlined text-[18px]">edit_note</span>'
};
