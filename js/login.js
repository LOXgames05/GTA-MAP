(async () => {
  const form = document.getElementById("login-form");
  const message = document.getElementById("login-message");
  const forgotButton = document.getElementById("forgot-password");

  const { data: { user } } = await db.auth.getUser();

  if (user) {
    const { data: isAdmin } = await db.rpc("is_admin");

    if (isAdmin) {
      location.href = "admin.html";
      return;
    }
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    message.textContent = "Connexion...";

    const email =
      document.getElementById("email").value.trim();

    const password =
      document.getElementById("password").value;

    const { error } =
      await db.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      message.textContent =
        "Connexion refusée : " + error.message;
      return;
    }

    const {
      data: isAdmin,
      error: adminError
    } = await db.rpc("is_admin");

    if (adminError || !isAdmin) {
      await db.auth.signOut();

      message.textContent =
        "Ce compte n'est pas administrateur.";

      return;
    }

    location.href = "admin.html";
  });


  forgotButton.addEventListener(
    "click",
    async () => {

      const email =
        document.getElementById("email").value.trim();

      if (!email) {
        message.textContent =
          "Entre ton adresse email d'abord.";
        return;
      }

      message.textContent =
        "Envoi du mail de récupération...";

      const { error } =
        await db.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              "https://loxgames05.github.io/GTA-MAP/reset-password.html"
          }
        );

      if (error) {
        message.textContent =
          "Erreur : " + error.message;
        return;
      }

      message.textContent =
        "Mail envoyé. Utilise le nouveau lien reçu.";
    }
  );

})();
