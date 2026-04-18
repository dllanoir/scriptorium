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
        
        const paragraphs = rawContent.split('\n\n').filter(p => p.trim() !== '');
        const content = paragraphs.map(p => p.replace(/\n/g, '<br>'));

        try {
            await Api.createText({ title, collectionId, content });
            Utils.toast('Publicado com sucesso!');
            UI.toggleModal(DOM.newTextModal, false);
            e.target.reset();
            await Controllers.loadData();
        } catch (err) {
            console.error("Falha ao salvar:", err);
            Utils.toast('Falha ao publicar.', 'error');
        }
    }
};
