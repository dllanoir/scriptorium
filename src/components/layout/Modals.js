import { TextModal } from './modals/TextModal.js';
import { DeleteTextModal } from './modals/DeleteTextModal.js';
import { CollectionModal } from './modals/CollectionModal.js';
import { DeleteCollectionModal } from './modals/DeleteCollectionModal.js';
import { SettingsModal } from './modals/SettingsModal.js';
import { HelpModal } from './modals/HelpModal.js';

/**
 * Aggregates all modals into a single layout component.
 * @returns {string} - Combined Modals HTML template
 */
export function Modals() {
    return `
        ${TextModal()}
        ${DeleteTextModal()}
        ${CollectionModal()}
        ${DeleteCollectionModal()}
        ${SettingsModal()}
        ${HelpModal()}
    `;
}
