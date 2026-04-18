import { supabaseClient } from './config.js';

export const Api = {
    fetchCollections: async () => {
        const { data, error } = await supabaseClient.from('collections').select('*');
        if (error) throw error;
        return data;
    },
    fetchTexts: async () => {
        const { data, error } = await supabaseClient.from('texts').select('*').order('created_at', { ascending: false });
        if (error) throw error;
        return data;
    },
    createText: async (payload) => {
        const { data, error } = await supabaseClient.from('texts').insert([payload]);
        if (error) throw error;
        return data;
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
    }
};
