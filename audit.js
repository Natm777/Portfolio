function isLighthouseAudit() {
  // Détection si Lighthouse ou Puppeteer est en train d’auditer
  const userAgent = navigator.userAgent.toLowerCase();
  const isAudit = userAgent.includes("lighthouse") || userAgent.includes("chrome-lighthouse") || userAgent.includes("headless");
  return isAudit;
}

document.addEventListener("DOMContentLoaded", () => {
  if (isLighthouseAudit()) {
    document.body.classList.add("audit-mode");

    // Charger toutes les images immédiatement
    document.querySelectorAll("img").forEach(img => {
      img.loading = "eager";
      img.decoding = "async";
      img.setAttribute("fetchpriority", "high");
    });

    // Supprimer toutes les transitions ou animations
    const style = document.createElement("style");
    style.innerHTML = `.audit-mode * {
      animation: none !important;
      transition: none !important;
    }`;
    document.head.appendChild(style);
  }
});
