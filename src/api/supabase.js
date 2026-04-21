/**
 * @namespace Supabase
 * @description Supabase client initialization.
 */
export const Config = {
    url: 'https://gbfjkzmwpibclhmnqjpe.supabase.co',
    // In production, this should be an environment variable if using a bundler.
    // For this vanilla project, it's defined here.
    anonKey: 'sb_publishable_Eo7X6WGKVMClycl92V_0OQ_MfGW-BwE'
};

/** @type {import('@supabase/supabase-js').SupabaseClient} */
export const supabaseClient = supabase.createClient(Config.url, Config.anonKey);
