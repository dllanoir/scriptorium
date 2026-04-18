export const Config = {
    getSupabaseUrl: () => typeof window.SUPABASE_URL !== 'undefined' ? window.SUPABASE_URL : 'https://gbfjkzmwpibclhmnqjpe.supabase.co',
    getSupabaseKey: () => typeof window.SUPABASE_ANON_KEY !== 'undefined' ? window.SUPABASE_ANON_KEY : 'sb_publishable_Eo7X6WGKVMClycl92V_0OQ_MfGW-BwE'
};

export const supabaseClient = supabase.createClient(Config.getSupabaseUrl(), Config.getSupabaseKey());
