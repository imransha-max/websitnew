const filterButtons = document.querySelectorAll(".filter-button");
const projectCards = document.querySelectorAll(".project-card");
const themeToggle = document.querySelector("#theme-toggle");
const menuToggle = document.querySelector("#menu-toggle");
const mobileNav = document.querySelector("#mobile-nav");
const commandToggle = document.querySelector("#command-toggle");
const commandMenu = document.querySelector("#command-menu");
const train = document.querySelector("#metro-train");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isSelected = filterButton === button;
      filterButton.classList.toggle("active", isSelected);
      filterButton.setAttribute("aria-pressed", String(isSelected));
    });

    projectCards.forEach((card) => {
      const categories = card.dataset.category.split(" ");
      card.hidden = selectedFilter !== "all" && !categories.includes(selectedFilter);
    });
  });
});

function setTheme(isLight) {
  document.body.classList.toggle("light-theme", isLight);
  themeToggle.setAttribute("aria-label", isLight ? "Switch to dark theme" : "Switch to light theme");
  themeToggle.title = isLight ? "Switch to dark theme" : "Switch to light theme";
  themeToggle.querySelector("span").textContent = isLight ? "☾" : "☼";
  document.querySelector('meta[name="theme-color"]').content = isLight ? "#EAE7DC" : "#244746";
}

try {
  setTheme(localStorage.getItem("sakib-theme") !== "dark");
} catch {
  setTheme(true);
}

themeToggle.addEventListener("click", () => {
  const isLight = !document.body.classList.contains("light-theme");
  setTheme(isLight);
  try {
    localStorage.setItem("sakib-theme", isLight ? "light" : "dark");
  } catch {
    // Theme switching still works when browser storage is unavailable.
  }
});

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
  menuToggle.title = isOpen ? "Open menu" : "Close menu";
  menuToggle.querySelector(".menu-glyph").textContent = isOpen ? "☰" : "×";
  mobileNav.hidden = isOpen;
});

function closeMobileNav() {
  mobileNav.hidden = true;
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation menu");
  menuToggle.title = "Open menu";
  menuToggle.querySelector(".menu-glyph").textContent = "☰";
}

function setCommandMenuOpen(isOpen) {
  commandMenu.hidden = !isOpen;
  commandToggle.setAttribute("aria-expanded", String(isOpen));
}

function toggleCommandMenu() {
  setCommandMenuOpen(commandMenu.hidden);
}

commandToggle.addEventListener("click", toggleCommandMenu);

document.querySelectorAll(".desktop-nav a, .mobile-nav a, .command-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMobileNav();
    setCommandMenuOpen(false);
  });
});

document.addEventListener("keydown", (event) => {
  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
    event.preventDefault();
    toggleCommandMenu();
  }
  if (event.key === "Escape") {
    closeMobileNav();
    setCommandMenuOpen(false);
  }
});

const sectionLinks = document.querySelectorAll(".desktop-nav a, .mobile-nav a, .command-menu a");
const sections = [...new Set([...sectionLinks].map((link) => document.querySelector(link.hash)))];
const sectionObserver = new IntersectionObserver((entries) => {
  const visibleSections = entries.filter((entry) => entry.isIntersecting);
  if (!visibleSections.length) return;
  const activeId = visibleSections.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0].target.id;
  sectionLinks.forEach((link) => {
    const isActive = link.hash === `#${activeId}`;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
}, { rootMargin: "-22% 0px -58% 0px", threshold: [0, 0.2, 0.5, 0.8] });
sections.forEach((section) => {
  if (section) sectionObserver.observe(section);
});

window.addEventListener("hashchange", () => {
  const activeId = window.location.hash || "#home";
  sectionLinks.forEach((link) => {
    const isActive = link.hash === activeId;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
    else link.removeAttribute("aria-current");
  });
});

if (window.location.hash) {
  sectionLinks.forEach((link) => {
    const isActive = link.hash === window.location.hash;
    link.classList.toggle("active", isActive);
    if (isActive) link.setAttribute("aria-current", "location");
  });
}

document.addEventListener("click", (event) => {
  if (!commandMenu.hidden && !commandMenu.contains(event.target) && !commandToggle.contains(event.target)) {
    setCommandMenuOpen(false);
  }
});

const backToTop = document.querySelector("#back-to-top");
window.addEventListener("scroll", () => {
  backToTop.classList.toggle("visible", window.scrollY > 600);
}, { passive: true });
backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

document.querySelector("#current-year").textContent = new Date().getFullYear();
document.querySelector("#print-resume").addEventListener("click", () => window.print());