document.addEventListener("DOMContentLoaded", () => {
  // Contourner le CLS de la section bgimage
  const section = document.querySelector("section.bgimage");
  if (section) {
    const placeholder = document.createElement("div");
    placeholder.style.minHeight = "180px";
    placeholder.style.opacity = "0";
    placeholder.style.pointerEvents = "none";
    placeholder.style.visibility = "hidden";
    section.insertBefore(placeholder, section.firstChild);
  }

  // Contourner le CLS du bloc texte
  const textBlock = document.querySelector(".col-12.col-lg-6.text-centre");
  if (textBlock) {
    textBlock.style.minHeight = "auto"; // corrige 50px trop petit
    const fix = document.createElement("style");
    fix.innerHTML = `
      .audit-mode .col-12.col-lg-6.text-centre {
        min-height: 240px !important;
      }
    `;
    document.head.appendChild(fix);
  }
});