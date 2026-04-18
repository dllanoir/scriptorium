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
    login: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m-3 0l-3-3m0 0l3-3m-3 3h12" /></svg>',
    logout: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" /></svg>',
    collection: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" /></svg>'
};
