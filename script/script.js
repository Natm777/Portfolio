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
              <img src="./images/${item.image}" alt="${item.title}" loading="lazy" />
              <h3 class="card-title mt-3">${item.title}</h3>
              <p class="card-text mt-3">${item.text}</p>
            </div>
          </div>
        `;

        allCards.push(col); // ← stocker chaque carte
      });

      // Boutons de filtre
      let btns = `<button class="btn btn-outline-primary mx-2 filter-btn" data-filter="all">Tout</button>`;
      categories.forEach(cat => {
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
        oldRows.forEach(row => row.remove());

        let newRow = document.createElement("div");
        newRow.classList.add("row");
        let count = 0;

        allCards.forEach(col => {
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

        // Ajouter la dernière ligne même si incomplète
        if (newRow.children.length > 0) {
          container.appendChild(newRow);
        }
      }
    });
}

  // Function to dynamically create HTML elements from the JSON file
  function createPortfolioFromJSON() {
    const container = document.querySelector("#portfolio .container");
    let row = document.createElement("div");
    row.classList.add("row");
  
    // Load the JSON file
    fetch("data/portfolio.json")
      .then((response) => response.json())
      .then((data) => {
        // Iterate through the JSON data and create HTML elements
        data.forEach((item, index) => {
          const card = document.createElement("div");
          card.classList.add("col-lg-4", "mt-4");
          card.innerHTML = `
                      <div class="card portfolioContent">
                      <img class="card-img-top" src="images/${item.image}" alt="Projet ${item.title}" loading="lazy" style="width:100%">
                      <div class="card-body">
                          <h3 class="card-title">${item.title}</h3>
                          <p class="card-text">${item.text}</p>
                          <div class="text-center">
                              <a href="${item.link}" class="btn btn-success">Lien</a>
                          </div>
                      </div>
                  </div>
                  `;
  
          // Append the card to the current row
          row.appendChild(card);
          
  
          // If the index is a multiple of 3 or it's the last element, create a new row
          if ((index + 1) % 3 === 0 || index === data.length - 1) {
            container.appendChild(row);
            row = document.createElement("div");
            row.classList.add("row");
          }
        });
      });
  }
  
  // Call the functions to execute the code
  handleNavbarScroll();
  handleNavbarCollapse();
  createSkillsFromJSON();
  createPortfolioFromJSON();