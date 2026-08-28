<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <title>Éditeur GTA MAP</title>

  <link
    rel="stylesheet"
    href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  >

  <link
    rel="stylesheet"
    href="https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.css"
  >

  <style>
    * {
      box-sizing: border-box;
    }

    html,
    body {
      margin: 0;
      width: 100%;
      height: 100%;
      font-family: Arial, sans-serif;
      background: #0d1117;
      color: white;
    }

    body {
      overflow: hidden;
    }

    #topbar {
      height: 60px;

      display: flex;
      align-items: center;
      justify-content: space-between;

      padding: 0 18px;

      background: #161b22;
      border-bottom: 1px solid #30363d;
    }

    #topbar h1 {
      margin: 0;
      font-size: 19px;
    }

    #topbar-right {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #admin-email {
      color: #8b949e;
      font-size: 14px;
    }

    button,
    select,
    input,
    textarea {
      font-family: inherit;
    }

    button {
      border: 0;
      border-radius: 6px;

      padding: 10px 13px;

      cursor: pointer;

      background: #21262d;
      color: white;
    }

    button:hover {
      background: #30363d;
    }

    button.green {
      background: #238636;
    }

    button.green:hover {
      background: #2ea043;
    }

    button.red {
      background: #da3633;
    }

    button:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }

    #app {
      height: calc(100vh - 60px);

      display: grid;
      grid-template-columns: 330px 1fr;
    }

    #sidebar {
      overflow-y: auto;

      padding: 16px;

      background: #161b22;
      border-right: 1px solid #30363d;
    }

    #sidebar h2 {
      margin: 4px 0 12px;
      font-size: 16px;
    }

    .section {
      padding-bottom: 18px;
      margin-bottom: 18px;

      border-bottom: 1px solid #30363d;
    }

    label {
      display: block;

      margin: 12px 0 5px;

      font-size: 13px;
      font-weight: bold;
    }

    input,
    select,
    textarea {
      width: 100%;

      padding: 9px;

      border: 1px solid #30363d;
      border-radius: 6px;

      background: #0d1117;
      color: white;
    }

    textarea {
      resize: vertical;
    }

    input[type="color"] {
      height: 42px;
      padding: 3px;
    }

    input[type="range"] {
      padding: 0;
    }

    .row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }

    .buttons {
      display: grid;
      gap: 8px;

      margin-top: 15px;
    }

    .checkbox {
      display: flex;
      align-items: center;
      gap: 8px;

      font-weight: normal;
    }

    .checkbox input {
      width: auto;
    }

    #status {
      margin-top: 10px;

      padding: 10px;

      background: #0d1117;
      border: 1px solid #30363d;
      border-radius: 6px;

      color: #f2cc60;

      font-size: 13px;
    }

    #map {
      width: 100%;
      height: 100%;

      background: #111;
    }

    .leaflet-control-layers {
      color: #111;
    }

    @media (max-width: 800px) {
      #app {
        grid-template-columns: 1fr;
      }

      #sidebar {
        display: none;
      }
    }
  </style>
</head>

<body>

<header id="topbar">

  <h1>Éditeur GTA MAP</h1>

  <div id="topbar-right">

    <span id="admin-email"></span>

    <button id="public-map">
      Carte publique
    </button>

    <button id="logout" class="red">
      Déconnexion
    </button>

  </div>

</header>


<div id="app">

  <aside id="sidebar">

    <div class="section">

      <h2>Outils de dessin</h2>

      <div id="status">
        Chargement...
      </div>

      <p style="font-size:13px;color:#8b949e;">
        Utilise les boutons directement sur la carte pour dessiner
        un polygone, un rectangle ou une frontière.
      </p>

    </div>


    <div class="section">

      <h2>Zone sélectionnée</h2>

      <label for="shape-layer">
        Couche
      </label>

      <select id="shape-layer"></select>


      <label for="shape-name">
        Nom
      </label>

      <input
        id="shape-name"
        type="text"
        placeholder="Ex. Ballas, Strawberry..."
      >


      <label for="shape-description">
        Description
      </label>

      <textarea
        id="shape-description"
        rows="3"
        placeholder="Description optionnelle"
      ></textarea>


      <div class="row">

        <div>

          <label for="shape-color">
            Couleur
          </label>

          <input
            id="shape-color"
            type="color"
            value="#8a3ffc"
          >

        </div>

        <div>

          <label for="shape-opacity">
            Opacité
          </label>

          <input
            id="shape-opacity"
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value="0.35"
          >

        </div>

      </div>


      <label class="checkbox">

        <input
          id="shape-published"
          type="checkbox"
          checked
        >

        Visible publiquement

      </label>


      <div class="buttons">

        <button
          id="save-shape"
          class="green"
          disabled
        >
          Enregistrer la zone
        </button>

        <button
          id="edit-shape"
          disabled
        >
          Modifier les points
        </button>

        <button
          id="finish-edit"
          disabled
        >
          Terminer modification
        </button>

        <button
          id="delete-shape"
          class="red"
          disabled
        >
          Supprimer
        </button>

      </div>

    </div>


    <div class="section">

      <h2>Créer une couche</h2>

      <label for="layer-name">
        Nom
      </label>

      <input
        id="layer-name"
        type="text"
        placeholder="Ex. Factions"
      >


      <label for="layer-kind">
        Type
      </label>

      <select id="layer-kind">

        <option value="faction">
          Factions
        </option>

        <option value="quartier">
          Quartiers
        </option>

        <option value="frontiere">
          Frontières
        </option>

        <option value="autre">
          Autre
        </option>

      </select>


      <div class="row">

        <div>

          <label for="layer-color">
            Couleur
          </label>

          <input
            id="layer-color"
            type="color"
            value="#8a3ffc"
          >

        </div>

        <div>

          <label for="layer-opacity">
            Opacité
          </label>

          <input
            id="layer-opacity"
            type="range"
            min="0"
            max="0.8"
            step="0.05"
            value="0.35"
          >

        </div>

      </div>


      <div class="buttons">

        <button
          id="create-layer"
          class="green"
        >
          + Créer la couche
        </button>

      </div>

    </div>

  </aside>


  <main>
    <div id="map"></div>
  </main>

</div>


<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>

<script src="https://unpkg.com/@geoman-io/leaflet-geoman-free@latest/dist/leaflet-geoman.js"></script>

<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<script src="js/config.js"></script>

<script src="js/supabase-client.js"></script>


<script>

(async function () {

  const status =
    document.getElementById("status");

  const adminEmail =
    document.getElementById("admin-email");


  const shapeLayer =
    document.getElementById("shape-layer");

  const shapeName =
    document.getElementById("shape-name");

  const shapeDescription =
    document.getElementById("shape-description");

  const shapeColor =
    document.getElementById("shape-color");

  const shapeOpacity =
    document.getElementById("shape-opacity");

  const shapePublished =
    document.getElementById("shape-published");


  const saveShapeButton =
    document.getElementById("save-shape");

  const editShapeButton =
    document.getElementById("edit-shape");

  const finishEditButton =
    document.getElementById("finish-edit");

  const deleteShapeButton =
    document.getElementById("delete-shape");


  let map;

  let mapLayers = [];

  let layerGroups = {};

  let selectedLayer = null;

  let selectedDatabaseShape = null;

  let temporaryLayer = null;


  /*
  ================================
  AUTH
  ================================
  */

  status.textContent =
    "Vérification du compte admin...";


  const {
    data: { user }
  } =
    await db.auth.getUser();


  if (!user) {

    window.location.href =
      "login.html";

    return;

  }


  const {
    data: isAdmin,
    error: adminError
  } =
    await db.rpc("is_admin");


  if (
    adminError ||
    !isAdmin
  ) {

    await db.auth.signOut();

    window.location.href =
      "login.html";

    return;

  }


  adminEmail.textContent =
    user.email || "";


  /*
  ================================
  LOGOUT
  ================================
  */

  document
    .getElementById("logout")
    .addEventListener(
      "click",
      async () => {

        await db.auth.signOut();

        window.location.href =
          "login.html";

      }
    );


  document
    .getElementById("public-map")
    .addEventListener(
      "click",
      () => {

        window.open(
          "index.html",
          "_blank"
        );

      }
    );


  /*
  ================================
  IMAGE SIZE
  ================================
  */

  function loadImageSize(src) {

    return new Promise(
      (resolve, reject) => {

        const image =
          new Image();

        image.onload =
          () => {

            resolve({
              width: image.naturalWidth,
              height: image.naturalHeight
            });

          };

        image.onerror =
          reject;

        image.src =
          src;

      }
    );

  }


  status.textContent =
    "Chargement de la carte...";


  const mapImage =
    window.APP_CONFIG.MAP_IMAGE;


  const imageSize =
    await loadImageSize(
      mapImage
    );


  /*
  ================================
  MAP
  ================================
  */

  const bounds = [

    [0, 0],

    [
      imageSize.height,
      imageSize.width
    ]

  ];


  map =
    L.map(
      "map",
      {

        crs:
          L.CRS.Simple,

        minZoom:
          -6,

        maxZoom:
          4,

        zoomSnap:
          0.25,

        attributionControl:
          false

      }
    );


  L.imageOverlay(
    mapImage,
    bounds,
    {
      pmIgnore: true
    }
  ).addTo(map);


  map.fitBounds(
    bounds
  );


  /*
  ================================
  GEOMAN
  ================================
  */

  map.pm.addControls({

    position:
      "topleft",

    drawMarker:
      false,

    drawCircleMarker:
      false,

    drawCircle:
      false,

    drawText:
      false,

    drawPolygon:
      true,

    drawRectangle:
      true,

    drawPolyline:
      true,

    editMode:
      false,

    dragMode:
      false,

    cutPolygon:
      false,

    removalMode:
      false,

    rotateMode:
      false

  });


  map.pm.setGlobalOptions({

    allowSelfIntersection:
      false,

    snappable:
      true,

    snapDistance:
      15

  });


  /*
  ================================
  COUCHES
  ================================
  */

  async function loadLayers() {

    const {
      data,
      error
    } =
      await db
        .from("map_layers")
        .select("*")
        .order("sort_order")
        .order("name");


    if (error) {

      status.textContent =
        "Erreur couches : " +
        error.message;

      return;

    }


    mapLayers =
      data || [];


    shapeLayer.innerHTML =
      "";


    for (
      const layer of mapLayers
    ) {

      const option =
        document.createElement(
          "option"
        );

      option.value =
        layer.id;

      option.textContent =
        layer.name;

      shapeLayer.appendChild(
        option
      );

    }

  }


  /*
  ================================
  FORMES
  ================================
  */

  async function loadShapes() {

    for (
      const group
      of Object.values(
        layerGroups
      )
    ) {

      map.removeLayer(
        group
      );

    }


    layerGroups =
      {};


    for (
      const layer
      of mapLayers
    ) {

      layerGroups[
        layer.id
      ] =
        L.layerGroup()
          .addTo(map);

    }


    const {
      data,
      error
    } =
      await db
        .from("map_shapes")
        .select("*")
        .order("created_at");


    if (error) {

      status.textContent =
        "Erreur zones : " +
        error.message;

      return;

    }


    for (
      const shape
      of data || []
    ) {

      const parentLayer =
        mapLayers.find(
          item =>
            item.id ===
            shape.layer_id
        );


      if (!parentLayer) {
        continue;
      }


      const style =
        {

          color:
            shape.style?.color ||
            parentLayer.color,

          fillColor:
            shape.style?.color ||
            parentLayer.color,

          fillOpacity:
            shape.style?.opacity ??
            parentLayer.opacity,

          weight:
            3

        };


      const geo =
        L.geoJSON(
          {

            type:
              "Feature",

            geometry:
              shape.geometry,

            properties:
              {}

          },
          {

            style:
              () => style

          }
        );


      geo.eachLayer(
        leafletLayer => {

          leafletLayer.databaseShape =
            shape;


          leafletLayer.on(
            "click",
            event => {

              L.DomEvent.stopPropagation(
                event
              );

              selectExistingShape(
                leafletLayer,
                shape
              );

            }
          );


          leafletLayer.addTo(
            layerGroups[
              shape.layer_id
            ]
          );

        }
      );

    }


    status.textContent =
      "Éditeur prêt.";

  }


  /*
  ================================
  SELECTION
  ================================
  */

  function selectExistingShape(
    leafletLayer,
    shape
  ) {

    selectedLayer =
      leafletLayer;

    selectedDatabaseShape =
      shape;

    temporaryLayer =
      null;


    shapeLayer.value =
      shape.layer_id;

    shapeName.value =
      shape.name || "";

    shapeDescription.value =
      shape.description || "";

    shapePublished.checked =
      shape.published;


    shapeColor.value =
      shape.style?.color ||
      "#8a3ffc";

    shapeOpacity.value =
      shape.style?.opacity ??
      0.35;


    status.textContent =
      "Zone sélectionnée : " +
      shape.name;


    updateButtons();

  }


  /*
  ================================
  NOUVELLE FORME
  ================================
  */

  map.on(
    "pm:create",
    event => {

      selectedLayer =
        event.layer;

      temporaryLayer =
        event.layer;

      selectedDatabaseShape =
        null;


      shapeName.value =
        "";

      shapeDescription.value =
        "";

      shapePublished.checked =
        true;


      if (
        mapLayers.length > 0
      ) {

        shapeLayer.value =
          mapLayers[0].id;

        shapeColor.value =
          mapLayers[0].color;

        shapeOpacity.value =
          mapLayers[0].opacity;

      }


      applyPreviewStyle();


      selectedLayer.on(
        "click",
        () => {

          selectedLayer =
            event.layer;

          updateButtons();

        }
      );


      status.textContent =
        "Nouvelle forme dessinée. Donne-lui un nom puis enregistre.";


      updateButtons();

    }
  );


  /*
  ================================
  STYLE
  ================================
  */

  function applyPreviewStyle() {

    if (!selectedLayer) {
      return;
    }


    if (
      typeof
      selectedLayer.setStyle
      !== "function"
    ) {
      return;
    }


    selectedLayer.setStyle({

      color:
        shapeColor.value,

      fillColor:
        shapeColor.value,

      fillOpacity:
        Number(
          shapeOpacity.value
        ),

      weight:
        3

    });

  }


  shapeColor.addEventListener(
    "input",
    applyPreviewStyle
  );


  shapeOpacity.addEventListener(
    "input",
    applyPreviewStyle
  );


  /*
  ================================
  SAVE SHAPE
  ================================
  */

  saveShapeButton.addEventListener(
    "click",
    async () => {

      if (!selectedLayer) {
        return;
      }


      if (!shapeLayer.value) {

        status.textContent =
          "Crée d'abord une couche.";

        return;

      }


      const payload =
        {

          layer_id:
            shapeLayer.value,

          name:
            shapeName.value.trim()
            || "Zone sans nom",

          description:
            shapeDescription.value.trim(),

          geometry:
            selectedLayer
              .toGeoJSON()
              .geometry,

          style:
            {

              color:
                shapeColor.value,

              opacity:
                Number(
                  shapeOpacity.value
                ),

              weight:
                3

            },

          published:
            shapePublished.checked

        };


      let result;


      if (
        selectedDatabaseShape
      ) {

        result =
          await db
            .from("map_shapes")
            .update(payload)
            .eq(
              "id",
              selectedDatabaseShape.id
            );

      } else {

        result =
          await db
            .from("map_shapes")
            .insert(payload);

      }


      if (result.error) {

        status.textContent =
          "Erreur : " +
          result.error.message;

        return;

      }


      if (
        temporaryLayer &&
        map.hasLayer(
          temporaryLayer
        )
      ) {

        map.removeLayer(
          temporaryLayer
        );

      }


      selectedLayer =
        null;

      selectedDatabaseShape =
        null;

      temporaryLayer =
        null;


      await loadShapes();


      updateButtons();


      status.textContent =
        "Zone enregistrée.";

    }
  );


  /*
  ================================
  EDIT SHAPE
  ================================
  */

  editShapeButton.addEventListener(
    "click",
    () => {

      if (
        !selectedLayer ||
        !selectedLayer.pm
      ) {
        return;
      }


      selectedLayer.pm.enable({

        allowSelfIntersection:
          false,

        snappable:
          true

      });


      status.textContent =
        "Déplace les points de la zone puis clique sur Terminer modification.";


      updateButtons();

    }
  );


  finishEditButton.addEventListener(
    "click",
    () => {

      if (
        !selectedLayer ||
        !selectedLayer.pm
      ) {
        return;
      }


      selectedLayer.pm.disable();


      status.textContent =
        "Modification terminée. Clique sur Enregistrer la zone.";


      updateButtons();

    }
  );


  /*
  ================================
  DELETE
  ================================
  */

  deleteShapeButton.addEventListener(
    "click",
    async () => {

      if (
        !selectedDatabaseShape
      ) {
        return;
      }


      const confirmation =
        confirm(
          "Supprimer cette zone ?"
        );


      if (!confirmation) {
        return;
      }


      const {
        error
      } =
        await db
          .from("map_shapes")
          .delete()
          .eq(
            "id",
            selectedDatabaseShape.id
          );


      if (error) {

        status.textContent =
          "Erreur suppression : " +
          error.message;

        return;

      }


      selectedLayer =
        null;

      selectedDatabaseShape =
        null;


      await loadShapes();


      updateButtons();


      status.textContent =
        "Zone supprimée.";

    }
  );


  /*
  ================================
  CREATE LAYER
  ================================
  */

  document
    .getElementById(
      "create-layer"
    )
    .addEventListener(
      "click",
      async () => {

        const name =
          document
            .getElementById(
              "layer-name"
            )
            .value
            .trim();


        if (!name) {

          status.textContent =
            "Entre un nom de couche.";

          return;

        }


        const {
          error
        } =
          await db
            .from("map_layers")
            .insert({

              name:
                name,

              kind:
                document
                  .getElementById(
                    "layer-kind"
                  )
                  .value,

              color:
                document
                  .getElementById(
                    "layer-color"
                  )
                  .value,

              opacity:
                Number(
                  document
                    .getElementById(
                      "layer-opacity"
                    )
                    .value
                ),

              visible:
                true

            });


        if (error) {

          status.textContent =
            "Erreur : " +
            error.message;

          return;

        }


        document
          .getElementById(
            "layer-name"
          )
          .value =
            "";


        await loadLayers();

        await loadShapes();


        status.textContent =
          "Couche créée.";

      }
    );


  /*
  ================================
  BUTTON STATES
  ================================
  */

  function updateButtons() {

    saveShapeButton.disabled =
      !selectedLayer;

    editShapeButton.disabled =
      !selectedLayer;

    deleteShapeButton.disabled =
      !selectedDatabaseShape;


    finishEditButton.disabled =
      !(
        selectedLayer &&
        selectedLayer.pm &&
        selectedLayer.pm.enabled()
      );

  }


  /*
  ================================
  START
  ================================
  */

  await loadLayers();

  await loadShapes();

  updateButtons();

})();

</script>

</body>
</html>
