// Navbar scroll effect
// Gère l'effet de scroll sur la navbar (ajoute ou retire la classe navbarDark selon la position de la page)
function handleNavbarScroll() {
  const header = document.querySelector(".navbar");
  window.onscroll = function () {
    const top = window.scrollY;
    if (top >= 100) {
      header.classList.add("navbarDark");
    } else {
      header.classList.remove("navbarDark");
    }
  };
}

// Collapse navbar on link click
function handleNavbarCollapse() {
  const navLinks = document.querySelectorAll(".nav-item");
  const menuToggle = document.getElementById("navbarSupportedContent");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      new bootstrap.Collapse(menuToggle).toggle();
    });
  });
}

// Crée les cartes de compétences depuis le JSON// Fonction qui génère dynamiquement les cartes de compétences à partir d'un fichier JSON
function createSkillsFromJSON() {
  const container = document.querySelector("#skills .container"); // Sélectionne le conteneur principal de la section compétences
  const filterContainer = document.getElementById("filter-buttons"); // Sélectionne le conteneur des boutons de filtre
  let allCards = []; // Tableau pour stocker toutes les cartes de compétences

  fetch("data/skills.json") // Récupère le fichier JSON contenant les compétences
    .then((response) => response.json()) // Convertit la réponse en objet JavaScript
    .then((data) => {
      const categories = new Set(); // Ensemble pour stocker les différentes catégories de compétences

      data.forEach((item) => {
        // Parcourt chaque compétence du fichier JSON
        categories.add(item.category); // Ajoute la catégorie de la compétence à l'ensemble des catégories dans notre Set.

        const col = document.createElement("div"); // Crée une nouvelle card conteneur Bootstrap
        col.classList.add("col-lg-4", "mt-4"); // Ajoute les classes de mise en page

        col.innerHTML = `
          <div class="card skillsText" data-category="${item.category}">
            <div class="card-body">
              <img 
              src="./images/${item.image.replace(".webp", "-1024.webp")}"
              srcset="
              ./images/${item.image.replace(".webp", "-400.webp")} 400w,
              ./images/${item.image.replace(".webp", "-600.webp")} 600w"
                sizes="(max-width: 576px) 200px, (max-width: 992px) 400px, 600px"
                alt="${item.title}" 
                loading="lazy" />
              <h3 class="card-title mt-3">${item.title}</h3>
              <p class="card-text mt-3">${item.text}</p>
            </div>
          </div>
        `; // Définit le contenu HTML de la carte de compétence

        allCards.push(col); // Ajoute la carte au contenur des cartes => allCards []
      });

      // Création des boutons de filtre pour chaque catégorie, on commence par le bouton "Tout"
      let btns = `<button class="btn btn-outline-primary mx-2 filter-btn" data-filter="all">Tout</button>`;
      categories.forEach((cat) => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1); // Met la première lettre en majuscule
        btns += `<button class="btn btn-outline-primary mx-2 filter-btn" data-filter="${cat}">${label}</button>`; // Crée un bouton pour chaque catégorie
      });
      filterContainer.innerHTML = btns; // Ajoute les boutons de filtre dans le DOM

      // Affichage initial de toutes les cartes de compétences
      displayCards("all");

      // Ajoute un événement sur chaque bouton de filtre pour afficher les cartes correspondantes à la catégorie sélectionnée
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.getAttribute("data-filter");
          displayCards(filter);
        });
      });

      // Fonction interne pour afficher les cartes selon le filtre sélectionné
      function displayCards(filter) {
        const oldRows = container.querySelectorAll(".row"); // Sélectionne les anciennes lignes
        oldRows.forEach((row) => row.remove()); // Supprime les anciennes lignes du DOM

        let newRow = document.createElement("div"); // Crée une nouvelle ligne Bootstrap
        newRow.classList.add("row");
        let count = 0; // Compteur pour gérer le nombre de cartes par ligne

        allCards.forEach((col) => {
          const category = col
            .querySelector(".skillsText")
            .getAttribute("data-category"); // Récupère la catégorie de la carte

          if (filter === "all" || category === filter) {
            // Vérifie si la carte doit être affichée selon le filtre
            newRow.appendChild(col.cloneNode(true)); // Ajoute la carte à la ligne et on duplique la carte, sinon elle disparaîtrait de allCards
            count++;

            if (count % 3 === 0) {
              // Dès qu'on a trois cartes dans la ligne on l'insére dans le DOM & on crée une nouvelle ligne
              container.appendChild(newRow);
              newRow = document.createElement("div");
              newRow.classList.add("row");
            }
          }
        });

        if (newRow.children.length > 0) {
          // Ajoute la dernière ligne si elle contient des cartes
          container.appendChild(newRow);
        }
      }
    });
}

// Fonction pour forcer le rechargement des images responsives
function reloadResponsiveImages() {
  // Sélectionne toutes les images qui utilisent l'attribut srcset (images adaptatives)
  const sources = document.querySelectorAll("img[srcset]");
  // Parcourt chaque image sélectionnée
  sources.forEach((img) => {
    // Sauvegarde la source actuelle de l'image
    const currentSrc = img.src;
    // Vide la source de l'image pour forcer le navigateur à la recharger
    img.src = "";
    // Réattribue la source initiale pour déclencher le rechargement selon la taille de l'écran
    img.src = currentSrc;
  });
}

// Carrousel dynamique (portfolio)
function createPortfolioFromJSON() {
  // Sélectionne le conteneur interne du carrousel Bootstrap pour les projets
  const carouselInner = document.querySelector(
    "#portfolioCarousel .carousel-inner"
  );
  // Sélectionne le conteneur des cartes de projets pour l'affichage mobile/tablette
  const cardsContainer = document.getElementById("portfolioCards");

  // Vide le contenu actuel du carrousel et des cartes pour éviter les doublons
  carouselInner.innerHTML = "";
  cardsContainer.innerHTML = "";

  // Récupère les données du portfolio depuis le fichier JSON
  fetch("data/portfolio.json")
    .then((response) => response.json())
    .then((data) => {
      // Détermine si l'affichage doit être en mode desktop (large écran)
      const isDesktop = window.innerWidth >= 992;

      if (isDesktop) {
        // Affiche le carrousel et masque les cartes
        document.getElementById("portfolioCarousel").classList.remove("d-none");
        cardsContainer.classList.add("d-none");

        // Parcourt chaque projet du JSON pour créer un élément du carrousel
        data.forEach((item, index) => {
          // Prépare le nom de base de l'image pour les différentes résolutions
          const baseImage = item.image.replace(".webp", ".v1");
          // Crée un nouvel élément de carrousel Bootstrap
          const carouselItem = document.createElement("div");
          carouselItem.classList.add("carousel-item");
          // Le premier élément du carrousel reçoit la classe active.
          if (index === 0) carouselItem.classList.add("active");

          // Définit le contenu HTML de l'élément du carrousel avec image, titre, description et boutons
          carouselItem.innerHTML = `
            <div class="d-flex justify-content-center">
              <div class="portfolio-card" style="width: 70vw; position: relative;">
                <img 
                  src="images/${baseImage}-1024.webp"
                  srcset="images/${baseImage}-640.webp 640w, images/${baseImage}-1024.webp 1024w, images/${baseImage}-1600.webp 1600w"
                  sizes="(max-width: 576px) 100vw, (max-width: 992px) 70vw, 50vw"
                  alt="${item.title}" class="img-fluid" loading="lazy">
                <div class="portfolio-overlay">
                  <h3>${item.title}</h3>
                  <p><strong>Technos :</strong> ${
                    item.technos || "Non spécifié"
                  }</p>
                  <p>${item.text}</p>
                  <a href="${
                    item.link
                  }" class="btn btn-success mt-2" target="_blank">Voir GitHub <i class="fab fa-github me-2"></i></a>
                </div>
                <button class="carousel-btn prev" onclick="moveCarousel(1)" aria-label="Diapositive précédente">
                  &#8249;
                </button>
                <button class="carousel-btn next" onclick="moveCarousel(-1)" aria-label="Diapositive suivante">
                  &#8250;
                </button>
              </div>
            </div>`;
          // Ajoute l'élément au carrousel
          carouselInner.appendChild(carouselItem);
        });
      } else {
        // Mode mobile/tablette : masque le carrousel et affiche les cartes
        document.getElementById("portfolioCarousel").classList.add("d-none");
        cardsContainer.classList.remove("d-none");
        cardsContainer.innerHTML = ""; // Nettoie le conteneur des cartes

        // Parcourt chaque projet pour créer une carte individuelle
        data.forEach((item) => {
          // Prépare le nom de base de l'image pour la carte
          const baseImage = item.image.replace(".webp", ".v1");
          // Crée un élément de carte Bootstrap
          const card = document.createElement("div");
          card.className = "col-12 col-sm-6 col-md-4 mb-4";
          // Définit le contenu HTML de la carte avec image, description et bouton GitHub
          card.innerHTML = `
      <div class="card portfolioContent h-100">
        <img src="images/${baseImage}-640.webp" class="card-img-top" alt="${
            item.title
          }">
        <div class="card-overlay">
          <p><strong>Technos :</strong> ${item.technos || "Non spécifié"}</p>
          <p>${item.text}</p>
          <a href="${
            item.link
          }" class="btn btn-outline-light mt-2" target="_blank">Voir GitHub <i class="fab fa-github me-2"></i></a>
        </div>
      </div>`;
          // Ajoute la carte au conteneur
          cardsContainer.appendChild(card);
        });
      }
    });
}

// Boutons de navigation du carrousel
function moveCarousel(direction) {
  // Sélectionne le carrousel Bootstrap dans la page
  const carousel = document.querySelector("#portfolioCarousel");
  // Récupère l'instance Bootstrap du carrousel ou en crée une nouvelle si elle n'existe pas
  const instance =
    bootstrap.Carousel.getInstance(carousel) ||
    new bootstrap.Carousel(carousel);
  // Selon la direction passée en paramètre, affiche la diapositive suivante ou précédente
  direction === 1 ? instance.next() : instance.prev();
}

// Ajoute un écouteur d'événement sur le redimensionnement de la fenêtre
window.addEventListener("resize", () => {
  // Recharge les images responsives pour s'adapter à la nouvelle taille d'écran
  reloadResponsiveImages();
  // Recharge dynamiquement le portfolio (carrousel ou cartes) selon la taille de l'écran
  createPortfolioFromJSON();
});

// Appelle les fonctions principales lors du chargement initial de la page
handleNavbarScroll();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
