import { supabaseClient } from './config.js';

export const Api = {
    fetchCollections: async () => {
        const { data, error } = await supabaseClient.from('collections').select('*');
        if (error) throw error;
        return data;
    },
    createCollection: async (payload) => {
        const { data, error } = await supabaseClient.from('collections').insert([payload]).select().single();
        if (error) throw error;
        return data;
    },
    updateCollection: async (id, payload) => {
        const { data, error } = await supabaseClient.from('collections').update(payload).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    deleteCollection: async (id) => {
        const { error } = await supabaseClient.from('collections').delete().eq('id', id);
        if (error) throw error;
        return true;
    },
    fetchTexts: async () => {
        const { data, error } = await supabaseClient.from('texts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    createText: async (payload) => {
        const { data, error } = await supabaseClient.from('texts').insert([payload]).select().single();
        if (error) throw error;
        return data;
    },
    updateText: async (id, payload) => {
        const { data, error } = await supabaseClient.from('texts').update(payload).eq('id', id).select().single();
        if (error) throw error;
        return data;
    },
    deleteText: async (id) => {
        const { error } = await supabaseClient.from('texts').delete().eq('id', id);
        if (error) throw error;
        return true;
    },
    login: async (email, password) => {
        return await supabaseClient.auth.signInWithPassword({ email, password });
    },
    logout: async () => {
        return await supabaseClient.auth.signOut();
    },
    getUser: async () => {
        const { data } = await supabaseClient.auth.getUser();
        return data.user;
    },
    onAuthStateChange: (callback) => {
        return supabaseClient.auth.onAuthStateChange(callback);
    },
    updateUserMetadata: async (data) => {
        return await supabaseClient.auth.updateUser({ data });
    }
};
