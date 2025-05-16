// Navbar scroll effect
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

// Crée les cartes de compétences depuis le JSON
function createSkillsFromJSON() {
  const container = document.querySelector("#skills .container");
  const filterContainer = document.getElementById("filter-buttons");
  let allCards = [];

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

        allCards.push(col);
      });

      // Création des boutons de filtre
      let btns = `<button class="btn btn-outline-primary mx-2 filter-btn" data-filter="all">Tout</button>`;
      categories.forEach((cat) => {
        const label = cat.charAt(0).toUpperCase() + cat.slice(1);
        btns += `<button class="btn btn-outline-primary mx-2 filter-btn" data-filter="${cat}">${label}</button>`;
      });
      filterContainer.innerHTML = btns;

      // Affichage initial
      displayCards("all");

      // Filtrage dynamique
      document.querySelectorAll(".filter-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          const filter = btn.getAttribute("data-filter");
          displayCards(filter);
        });
      });

      function displayCards(filter) {
        const oldRows = container.querySelectorAll(".row");
        oldRows.forEach((row) => row.remove());

        let newRow = document.createElement("div");
        newRow.classList.add("row");
        let count = 0;

        allCards.forEach((col) => {
          const category = col.querySelector(".skillsText").getAttribute("data-category");

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

        if (newRow.children.length > 0) {
          container.appendChild(newRow);
        }
      }
    });
}

// Carrousel dynamique (portfolio)
function createPortfolioFromJSON() {
  const carouselInner = document.querySelector("#portfolioCarousel .carousel-inner");
  carouselInner.innerHTML = "";

  fetch("data/portfolio.json")
    .then((response) => response.json())
    .then((data) => {
      data.forEach((item, index) => {
        const baseImage = item.image.replace(".webp", "");

        const carouselItem = document.createElement("div");
        carouselItem.classList.add("carousel-item");
        if (index === 0) carouselItem.classList.add("active");

        carouselItem.innerHTML = `
          <div class="d-flex justify-content-center">
            <div class="portfolio-card" style="width: 70vw; position: relative;">              
            <img 
                src="images/${baseImage}-1024.webp"
                srcset="
                  images/${baseImage}-640.webp 640w,
                  images/${baseImage}-1024.webp 1024w,
                  images/${baseImage}-1600.webp 1600w"
                sizes="(max-width: 576px) 100vw, (max-width: 992px) 70vw, 50vw"
                alt="${item.title}" 
                class="img-fluid"
                width="1024" height="600"
                loading="lazy">

              <div class="portfolio-overlay">
                <h3>${item.title}</h3>
                <p><strong>Technos :</strong> ${item.technos || "Non spécifié"}</p>
                <p>${item.text}</p>
                <a href="${item.link}" class="btn btn-success mt-2" target="_blank">Voir le projet</a>
              </div>

              <button class="carousel-btn prev" onclick="moveCarousel(-1)" aria-label="Diapositive précédente">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" viewBox="0 0 16 16">
                  <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                </svg>
              </button>

              <button class="carousel-btn next" onclick="moveCarousel(1)" aria-label="Diapositive suivante">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="black" viewBox="0 0 16 16">
                  <path d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                </svg>
              </button>
            </div>
          </div>
        `;

        carouselInner.appendChild(carouselItem);
      });
    });
}

// Navigation carrousel
function moveCarousel(direction) {
  const carousel = document.querySelector('#portfolioCarousel');
  const instance = bootstrap.Carousel.getInstance(carousel) || new bootstrap.Carousel(carousel);

  direction === 1 ? instance.next() : instance.prev();
}

// Appels initiaux
handleNavbarScroll();
handleNavbarCollapse();
createSkillsFromJSON();
createPortfolioFromJSON();
