document.addEventListener("DOMContentLoaded", () => {
  // ⛔ Empêche CLS sur les zones critiques
  const selectors = [
    "section.bgimage",
    ".col-12.col-lg-6.text-centre"
  ];

  selectors.forEach(selector => {
    const el = document.querySelector(selector);
    if (el) {
      const ghost = document.createElement("div");
      ghost.style.minHeight = "calc(100px + 1vh)";
      ghost.style.opacity = "0";
      ghost.style.pointerEvents = "none";
      ghost.style.position = "absolute";
      ghost.style.width = "100%";
      ghost.style.zIndex = "-1";
      el.prepend(ghost);
    }
  });

  // ⏱️ Attendre que tout soit chargé pour forcer stabilité
  window.addEventListener("load", () => {
    requestAnimationFrame(() => {
      document.body.style.scrollBehavior = "auto";
      document.documentElement.style.scrollBehavior = "auto";
    });
  });
});
