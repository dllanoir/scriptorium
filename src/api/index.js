import { supabaseClient } from './supabase.js';

/**
 * @namespace Api
 * @description API service layer to interact with Supabase.
 */
export const Api = {
    /**
     * @returns {Promise<Array>}
     */
    fetchCollections: async () => {
        const { data, error } = await supabaseClient.from('collections').select('*');
        if (error) throw error;
        return data;
    },

    /**
     * @param {Object} payload 
     * @returns {Promise<Object>}
     */
    createCollection: async (payload) => {
        const { data, error } = await supabaseClient.from('collections').insert([payload]).select().single();
        if (error) throw error;
        return data;
    },

    /**
     * @param {string|number} id 
     * @param {Object} payload 
     * @returns {Promise<Object>}
     */
    updateCollection: async (id, payload) => {
        const { data, error } = await supabaseClient.from('collections').update(payload).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    /**
     * @param {string|number} id 
     * @returns {Promise<boolean>}
     */
    deleteCollection: async (id) => {
        const { error } = await supabaseClient.from('collections').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    /**
     * @returns {Promise<Array>}
     */
    fetchTexts: async () => {
        const { data, error } = await supabaseClient.from('texts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },

    /**
     * @param {Object} payload 
     * @returns {Promise<Object>}
     */
    createText: async (payload) => {
        const { data, error } = await supabaseClient.from('texts').insert([payload]).select().single();
        if (error) throw error;
        return data;
    },

    /**
     * @param {string|number} id 
     * @param {Object} payload 
     * @returns {Promise<Object>}
     */
    updateText: async (id, payload) => {
        const { data, error } = await supabaseClient.from('texts').update(payload).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },

    /**
     * @param {string|number} id 
     * @returns {Promise<boolean>}
     */
    deleteText: async (id) => {
        const { error } = await supabaseClient.from('texts').delete().eq('id', id);
        if (error) throw error;
        return true;
    },

    /**
     * @param {string} email 
     * @param {string} password 
     */
    login: async (email, password) => {
        return await supabaseClient.auth.signInWithPassword({ email, password });
    },

    logout: async () => {
        return await supabaseClient.auth.signOut();
    },

    /**
     * @returns {Promise<Object|null>}
     */
    getUser: async () => {
        // Use getSession first to check local state silently.
        // This avoids the 401 console error triggered by getUser() when no session exists.
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (!session) return null;

        // If session exists, validate with server for security (recomended by Supabase)
        const { data: { user } } = await supabaseClient.auth.getUser();
        return user;
    },

    /**
     * @param {Function} callback 
     */
    onAuthStateChange: (callback) => {
        return supabaseClient.auth.onAuthStateChange(callback);
    },

    /**
     * @param {Object} data 
     */
    updateUserMetadata: async (data) => {
        return await supabaseClient.auth.updateUser({ data });
    }
};
