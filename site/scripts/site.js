const yearTargets = document.querySelectorAll("[data-current-year]");

for (const target of yearTargets) {
  target.textContent = new Date().getFullYear();
}

const currentPath = window.location.pathname.replace(/\/$/, "") || "/";
const navLinks = document.querySelectorAll("[data-nav-link]");

for (const link of navLinks) {
  const href = link.getAttribute("href");
  if (!href) continue;

  const normalized = href.replace(/\/$/, "") || "/";
  const isSectionMatch =
    normalized !== "/" && currentPath.startsWith(`${normalized}/`);

  if (normalized === currentPath || isSectionMatch) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
}
