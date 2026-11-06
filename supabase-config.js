// Add your Supabase project's public Project URL and publishable/anon key here.
// These values identify the project; never put a service-role key or a password in this file.
window.SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
window.SUPABASE_ANON_KEY = "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY";
window.supabaseClient = null;
if (window.SUPABASE_URL.startsWith("https://") && window.SUPABASE_ANON_KEY !== "YOUR_SUPABASE_PUBLISHABLE_OR_ANON_KEY" && window.supabase?.createClient) {
  window.supabaseClient = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
}
