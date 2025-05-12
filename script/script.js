// Function to add the "navbarDark" class to the navbar on scroll
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

// Function to handle navbar collapse on small devices after a click
function handleNavbarCollapse() {
  const navLinks = document.querySelectorAll(".nav-item");
  const menuToggle = document.getElementById("navbarSupportedContent");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      new bootstrap.Collapse(menuToggle).toggle();
    });
  });
}

// Function to dynamically create HTML elements from the JSON file
function createSkillsFromJSON() {
  const container = document.querySelector("#skills .container");
  const filterContainer = document.getElementById("filter-buttons");
  let allCards = []; // ← stockage de toutes les cartes

  fetch("data/skills.json")
    .then((response) => response.json())
    .then((data) => {
      const categories = new Set();

      data.forEach((item) => {
        categories.add(item.category);

        const col = document.createElement("div");
        col.classList.add("col-lg-4", "mt-4");

        col.innerHTML = `
          <div class="card skillsText" data-category="${item.category}">
            <div class="card-body">
              <img 
              src="./images/${item.image.replace(".webp", "-400.webp")}" 
               srcset="
              ./images/${item.image.replace(".webp", "-200.webp")} 200w,
              ./images/${item.image.replace(".webp", "-400.webp")} 400w,
              ./images/${item.image.replace(".webp", "-600.webp")} 600w"
              sizes="(max-width: 576px) 200px, (max-width: 992px) 400px, 600px"
               alt="${item.title}" 
                loading="lazy" />
              <h3 class="card-title mt-3">${item.title}</h3>
              <p class="card-text mt-3">${item.text}</p>
            </div>
          </div>
        `;

        allCards.push(col); // ← stocker chaque carte
      });

      // Boutons de filtre
      let btns = `<button class="btn btn-outline-primary mx-2 filter-btn" data-filter="all">Tout</button>`;
      categories.forEach((cat) => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        btns += `<button class="btn btn-outline-primary mx-2 filter-btn" data-filter="${cat}">${label}</button>`;
      });
      filterContainer.innerHTML = btns;

      // Affichage initial (tout)
      displayCards("all");

      // Filtrage dynamique
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.getAttribute("data-filter");
          displayCards(filter);
        });
      });

      // Fonction qui recrée les rows sans vide
      function displayCards(filter) {
        // Supprimer les anciennes lignes
        const oldRows = container.querySelectorAll(".row");
        oldRows.forEach((row) => row.remove());

        let newRow = document.createElement("div");
        newRow.classList.add("row");
        let count = 0;

        allCards.forEach((col) => {
          const category = col
            .querySelector(".skillsText")
            .getAttribute("data-category");

          if (filter === "all" || category === filter) {
            newRow.appendChild(col.cloneNode(true));
            count++;

            if (count % 3 === 0) {
              container.appendChild(newRow);
              newRow = document.createElement("div");
              newRow.classList.add("row");
            }
          }
        });

        // Ajouter la dernière ligne même si incomplète
        if (newRow.children.length > 0) {
          container.appendChild(newRow);
        }
      }
    });
}

// Function to dynamically create HTML elements from the JSON file
function createPortfolioFromJSON() {
  const carouselInner = document.querySelector(
    "#portfolioCarousel .carousel-inner"
  );
  fetch("data/portfolio.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item, index) => {
        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) carouselItem.classList.add("active");

        carouselItem.innerHTML = `
            <div class="d-flex justify-content-center">
              <div class="portfolio-card" style="width: 70vw; height: 400px;">
                <img src="images/${item.image}" alt="${
          item.title
        }" class="img-fluid">
                <div class="portfolio-overlay">
                  <h3>${item.title}</h3>
                  <p><strong>Technos :</strong> ${
                    item.technos || "Non spécifié"
                  }</p>
                  <p>${item.text}</p>
                  <a href="${
                    item.link
                  }" class="btn btn-success mt-2" target="_blank">Voir le projet</a>
                </div>
              </div>
            </div>
          `;

        carouselInner.appendChild(carouselItem);
      });
    });
}

// Call the functions to execute the code
handleNavbarScroll();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
