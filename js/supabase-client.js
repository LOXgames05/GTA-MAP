(() => {

  const config = window.APP_CONFIG;

  if (!config) {
    console.error("APP_CONFIG introuvable");
    alert("Erreur : config.js n'est pas chargé.");
    return;
  }

  if (!window.supabase) {
    console.error("Supabase JS introuvable");
    alert("Erreur : la librairie Supabase n'est pas chargée.");
    return;
  }

  console.log("Connexion Supabase vers :", config.SUPABASE_URL);

  window.db = window.supabase.createClient(
    config.SUPABASE_URL,
    config.SUPABASE_PUBLISHABLE_KEY,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
      }
    }
  );

})();
