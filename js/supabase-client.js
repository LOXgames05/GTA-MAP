(() => {
  const cfg = window.APP_CONFIG || {};

  if (!window.supabase) {
    throw new Error("La librairie Supabase n'est pas chargée.");
  }

  if (!cfg.SUPABASE_URL || !cfg.SUPABASE_PUBLISHABLE_KEY) {
    throw new Error("Configuration Supabase manquante dans js/config.js.");
  }

  window.db = window.supabase.createClient(
    cfg.SUPABASE_URL,
    cfg.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );
})();
