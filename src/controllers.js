import { Api } from './api.js';
import { State } from './state.js';
import { UI } from './ui.js';
import { DOM } from './dom.js';
import { Utils } from './utils.js';

export const Controllers = {
    loadData: async () => {
        try {
            State.isLoadingCollections = true;
            State.isLoadingTexts = true;
            
            const [collections, texts] = await Promise.all([
                Api.fetchCollections(),
                Api.fetchTexts()
            ]);
            
            State.collections = collections;
            State.texts = texts;

            if (texts.length > 0) {
                State.activeTextId = texts[0].id;
            }

            UI.renderCollections();
            UI.renderTextList();
            UI.renderTextContent();

        } catch (error) {
            console.error("Erro ao carregar os dados", error);
            UI.showError("Falha na comunicação com o servidor.");
        } finally {
            State.isLoadingCollections = false;
            State.isLoadingTexts = false;
        }
    },

    handleCollectionSelect: (collectionId) => {
        State.activeCollectionId = collectionId;
        const filteredTexts = collectionId === 1 
            ? State.texts 
            : State.texts.filter(t => parseInt(t.collectionId, 10) === parseInt(collectionId, 10));
        
        State.activeTextId = filteredTexts.length > 0 ? filteredTexts[0].id : null;
        
        UI.renderCollections();
        UI.renderTextList(DOM.searchBox.value);
        UI.renderTextContent();
    },

    handleTextSelect: (textId) => {
        State.activeTextId = textId;
        UI.renderTextList(DOM.searchBox.value);
        UI.renderTextContent();
    },

    handleLoginSubmit: async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        DOM.loginError.classList.add('hidden');

        const { error } = await Api.login(email, password);

        if (error) {
            DOM.loginError.textContent = 'Credenciais inválidas.';
            DOM.loginError.classList.remove('hidden');
        } else {
            UI.toggleModal(DOM.loginModal, false);
            e.target.reset();
            Utils.toast('Acesso autorizado.', 'success');
        }
    },

    handleNewTextSubmit: async (e) => {
        e.preventDefault();
        if (!State.user) {
            Utils.toast('Você precisa estar logado.', 'error');
            return;
        }

        const title = e.target['new-title'].value;
        const collectionId = parseInt(e.target['new-collection'].value, 10);
        const rawContent = e.target['new-content'].value;
        const editId = DOM.editIdInput ? DOM.editIdInput.value : '';
        
        const paragraphs = rawContent.split('\n\n').filter(p => p.trim() !== '');
        const content = paragraphs.map(p => p.replace(/\n/g, '<br>'));

        try {
            if (editId) {
                await Api.updateText(editId, { title, collectionId, content });
                Utils.toast('Texto atualizado!');
            } else {
                await Api.createText({ title, collectionId, content });
                Utils.toast('Publicado com sucesso!');
            }
            UI.toggleModal(DOM.newTextModal, false);
            e.target.reset();
            if (DOM.editIdInput) DOM.editIdInput.value = '';
            await Controllers.loadData();
        } catch (err) {
            console.error("Falha ao salvar:", err);
            Utils.toast('Falha ao salvar alterações.', 'error');
        }
    },

    handleEditClick: () => {
        if (!State.activeTextId) return;
        const textToEdit = State.texts.find(t => t.id === State.activeTextId);
        if (!textToEdit) return;

        UI.populateDropdown();
        
        // Reverse paragraphs mapping for textarea
        let rawContent = '';
        if (Array.isArray(textToEdit.content)) {
            rawContent = textToEdit.content.map(p => p.replace(/<br>/g, '\n')).join('\n\n');
        } else {
            rawContent = textToEdit.content;
        }

        DOM.newTextForm['new-title'].value = textToEdit.title;
        DOM.newTextForm['new-collection'].value = textToEdit.collectionId;
        DOM.newTextForm['new-content'].value = rawContent;
        
        if (DOM.editIdInput) DOM.editIdInput.value = textToEdit.id;
        if (DOM.saveTextLabel) DOM.saveTextLabel.textContent = 'Update Text';
        
        UI.toggleModal(DOM.newTextModal, true);
    },

    handleDeleteConfirm: async () => {
        if (!State.activeTextId || !State.user) return;
        
        try {
            await Api.deleteText(State.activeTextId);
            Utils.toast('Texto excluído permanentemente.', 'success');
            UI.toggleModal(DOM.deleteModal, false);
            await Controllers.loadData();
        } catch (err) {
            console.error("Falha ao excluir:", err);
            Utils.toast('Falha ao excluir.', 'error');
            UI.toggleModal(DOM.deleteModal, false);
        }
    },

    // ---- Collection CRUD ----

    handleCollectionSubmit: async (e) => {
        e.preventDefault();
        if (!State.user) return;

        const name = DOM.collectionNameInput.value.trim();
        const icon = DOM.collectionIconInput.value || 'folder';
        const editId = DOM.editCollectionIdInput.value;

        if (!name) {
            Utils.toast('O nome é obrigatório.', 'error');
            return;
        }

        try {
            if (editId) {
                await Api.updateCollection(editId, { name, icon });
                Utils.toast('Coleção atualizada!');
            } else {
                await Api.createCollection({ name, icon });
                Utils.toast('Coleção criada!');
            }
            UI.toggleModal(DOM.collectionModal, false);
            DOM.collectionForm.reset();
            DOM.editCollectionIdInput.value = '';
            DOM.collectionIconInput.value = 'folder';
            await Controllers.loadData();
        } catch (err) {
            console.error("Falha ao salvar coleção:", err);
            Utils.toast('Falha ao salvar coleção.', 'error');
        }
    },

    handleCollectionEditClick: (collectionId) => {
        const col = State.collections.find(c => c.id === parseInt(collectionId, 10));
        if (!col) return;

        DOM.collectionNameInput.value = col.name;
        DOM.collectionIconInput.value = col.icon || 'folder';
        DOM.editCollectionIdInput.value = col.id;
        DOM.collectionModalTitle.textContent = 'Editar Coleção';
        DOM.collectionSaveLabel.textContent = 'Salvar Alterações';
        
        // Update icon picker visual state
        Controllers._highlightSelectedIcon(col.icon || 'folder');

        UI.toggleModal(DOM.collectionModal, true);
    },

    handleCollectionDeleteConfirm: async () => {
        if (!State.pendingDeleteCollectionId || !State.user) return;

        try {
            // Delete all texts belonging to this collection first
            const textsInCollection = State.texts.filter(t => parseInt(t.collectionId, 10) === parseInt(State.pendingDeleteCollectionId, 10));
            for (const text of textsInCollection) {
                await Api.deleteText(text.id);
            }
            await Api.deleteCollection(State.pendingDeleteCollectionId);
            Utils.toast('Coleção e seus textos foram excluídos.', 'success');
            UI.toggleModal(DOM.deleteCollectionModal, false);
            State.pendingDeleteCollectionId = null;
            State.activeCollectionId = 1; // Reset to "All"
            await Controllers.loadData();
        } catch (err) {
            console.error("Falha ao excluir coleção:", err);
            Utils.toast('Falha ao excluir coleção.', 'error');
            UI.toggleModal(DOM.deleteCollectionModal, false);
        }
    },

    _highlightSelectedIcon: (iconName) => {
        if (!DOM.iconPicker) return;
        DOM.iconPicker.querySelectorAll('.icon-pick').forEach(btn => {
            if (btn.dataset.icon === iconName) {
                btn.classList.add('border-primary', 'text-primary', 'bg-primary/10');
                btn.classList.remove('border-outline-variant/30', 'text-on-surface-variant');
            } else {
                btn.classList.remove('border-primary', 'text-primary', 'bg-primary/10');
                btn.classList.add('border-outline-variant/30', 'text-on-surface-variant');
            }
        });
    }
};
