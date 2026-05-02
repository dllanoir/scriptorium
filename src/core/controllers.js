import { Api } from '../api/index.js';
import { State } from './state.js';
import { UI } from '../components/index.js';
import { DOM } from './dom.js';
import { Utils } from '../utils/index.js';

/**
 * @namespace Controllers
 * @description Coordinate logic between the UI, API and State.
 */
export const Controllers = {
    /**
     * Loads texts and collections from Supabase.
     */
    loadData: async () => {
        if (State.isLoadingData) return;
        
        try {
            State.isLoadingData = true;
            State.isLoadingCollections = true;
            State.isLoadingTexts = true;
            
            const [collections, texts] = await Promise.all([
                Api.fetchCollections(),
                Api.fetchTexts()
            ]);
            
            State.collections = collections;
            State.texts = texts;

            if (texts.length > 0 && !State.activeTextId) {
                State.activeTextId = texts[0].id;
            }

        } catch (error) {
            console.error("Erro ao carregar os dados:", error);
            UI.showError("Falha na comunicação com o servidor.");
        } finally {
            State.isLoadingCollections = false;
            State.isLoadingTexts = false;
            State.isLoadingData = false;
        }
    },

    /**
     * @param {string|number} collectionId 
     */
    handleCollectionSelect: (collectionId) => {
        State.activeCollectionId = collectionId;
        const filteredTexts = collectionId === 1 
            ? State.texts 
            : State.texts.filter(t => parseInt(t.collectionId, 10) === parseInt(collectionId, 10));
        
        State.activeTextId = filteredTexts.length > 0 ? filteredTexts[0].id : null;

        // Mobile: Show text list after selecting collection
        if (window.innerWidth < 1024) {
            UI.showMobileTextList();
            UI.toggleMobileSidebar(); // Close sidebar drawer
        }
    },

    /**
     * @param {string|number} textId 
     */
    handleTextSelect: (textId) => {
        State.activeTextId = textId;

        // Mobile: Hide text list after selecting text to focus on reading pane
        if (window.innerWidth < 1024 && textId) {
            UI.hideMobileTextList();
        }
    },

    /**
     * @param {Event} e 
     */
    handleLoginSubmit: async (e) => {
        e.preventDefault();
        const email = e.target.email.value;
        const password = e.target.password.value;
        
        const errorDisplay = DOM.landingLoginError || DOM.loginError;
        if (errorDisplay) errorDisplay.classList.add('hidden');

        const { error } = await Api.login(email, password);

        if (error) {
            if (errorDisplay) {
                errorDisplay.textContent = 'Credenciais inválidas ou erro de conexão.';
                errorDisplay.classList.remove('hidden');
            }
        } else {
            e.target.reset();
            Utils.toast('Acesso autorizado.', 'success');
            // Transition is handled by Api.onAuthStateChange -> UI.updateAuthUI
        }
    },

    /**
     * @param {Event} e 
     */
    handleNewTextSubmit: async (e) => {
        e.preventDefault();
        if (!State.user) {
            Utils.toast('Você precisa estar logado.', 'error');
            return;
        }

        const title = e.target['new-title'].value.trim();
        const collectionId = parseInt(e.target['new-collection'].value, 10);
        const content = e.target['new-content'].value;
        const editId = DOM.editIdInput ? DOM.editIdInput.value : '';
        
        if (content.length > 5000) {
            Utils.toast('O texto excede o limite de 5000 caracteres.', 'error');
            return;
        }

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
            if (DOM.charCounter) DOM.charCounter.textContent = '0 / 5000';
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
        
        let rawContent = '';
        if (Array.isArray(textToEdit.content)) {
            // Legacy support for array format
            rawContent = textToEdit.content.map(p => p.replace(/<br>/g, '\n')).join('\n\n');
        } else {
            rawContent = textToEdit.content || '';
        }

        DOM.newTextForm['new-title'].value = textToEdit.title;
        DOM.newTextForm['new-collection'].value = textToEdit.collectionId;
        DOM.newTextForm['new-content'].value = rawContent;
        
        if (DOM.charCounter) DOM.charCounter.textContent = `${rawContent.length} / 5000`;
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
            State.activeTextId = null;
            await Controllers.loadData();
        } catch (err) {
            console.error("Falha ao excluir:", err);
            Utils.toast('Falha ao excluir.', 'error');
        } finally {
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

    /**
     * @param {string|number} collectionId 
     */
    handleCollectionEditClick: (collectionId) => {
        const col = State.collections.find(c => c.id === parseInt(collectionId, 10));
        if (!col) return;

        DOM.collectionNameInput.value = col.name;
        DOM.collectionIconInput.value = col.icon || 'folder';
        DOM.editCollectionIdInput.value = col.id;
        DOM.collectionModalTitle.textContent = 'Editar Coleção';
        DOM.collectionSaveLabel.textContent = 'Salvar Alterações';
        
        Controllers._highlightSelectedIcon(col.icon || 'folder');
        UI.toggleModal(DOM.collectionModal, true);
    },

    handleCollectionDeleteConfirm: async () => {
        if (!State.pendingDeleteCollectionId || !State.user) return;

        try {
            // REDUNDANT LOOP REMOVED: Supabase ON DELETE CASCADE handles this now.
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

    /**
     * @private
     * @param {string} iconName 
     */
    _highlightSelectedIcon: (iconName) => {
        if (!DOM.iconPicker) return;
        DOM.iconPicker.querySelectorAll('.icon-pick').forEach(btn => {
            if (btn.dataset.icon === iconName) {
                btn.classList.add('bg-primary', 'text-on-primary', 'border-primary', 'scale-110', 'shadow-lg');
                btn.classList.remove('bg-primary/10', 'text-on-surface-variant', 'border-outline-variant/30', 'text-primary');
            } else {
                btn.classList.remove('bg-primary', 'text-on-primary', 'border-primary', 'scale-110', 'shadow-lg');
                btn.classList.add('border-outline-variant/30', 'text-on-surface-variant');
            }
        });
    }
};
