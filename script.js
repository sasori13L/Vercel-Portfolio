/* ============================================================
   Stack data — grouped by category, referencing ICONS (icons-data.js)
============================================================ */
const STACK = [
  { cat: "Backend", items: [
    { slug: "php" }, { slug: "laravel" }, { slug: "cakephp" }, { slug: "codeigniter" },
    { slug: "filament", label: "FilamentPHP" }, { slug: "livewire" }, { slug: "django" },
    { slug: "springboot", label: "Spring Boot" }, { slug: "nodedotjs", label: "Node.js" },
    { text: "PHPUnit" }, { text: "Codeception" },
  ]},
  { cat: "Frontend", items: [
    { slug: "react" }, { slug: "nextdotjs", label: "Next.js" }, { slug: "vuedotjs", label: "Vue.js" },
    { slug: "javascript", label: "JavaScript" }, { slug: "typescript", label: "TypeScript" },
    { slug: "jquery", label: "jQuery" }, { slug: "pinia" }, { slug: "alpinedotjs", label: "Alpine.js" },
  ]},
  { cat: "CSS / UI", items: [
    { slug: "tailwindcss", label: "Tailwind CSS" }, { slug: "bootstrap" }, { slug: "sass" },
    { slug: "materialdesign", label: "Material Design" }, { text: "Foundation" },
  ]},
  { cat: "Database", items: [
    { slug: "mysql", label: "MySQL" }, { slug: "postgresql", label: "PostgreSQL" },
    { slug: "mongodb" }, { slug: "firebase" }, { slug: "supabase" }, { text: "NoSQL" },
  ]},
  { cat: "DevOps / CI-CD", items: [
    { slug: "docker" }, { slug: "jenkins" }, { slug: "git", label: "Git" }, { slug: "github", label: "GitHub" },
    { slug: "bitbucket" }, { slug: "jirasoftware", label: "Jira" }, { text: "SSH / CLI" },
  ]},
  { cat: "Mobile", items: [
    { slug: "flutter" }, { slug: "kotlin" }, { slug: "swift" }, { slug: "dart" },
  ]},
  { cat: "AI / LLM", items: [
    { slug: "claude", label: "Claude" }, { slug: "claudecode", label: "Claude Code" },
    { slug: "googlegemini", label: "Gemini" }, { slug: "githubcopilot", label: "GitHub Copilot" },
    { text: "OpenAI API" }, { text: "Codex" }, { text: "Spec-Driven Dev" },
  ]},
  { cat: "Platform", items: [
    { slug: "wordpress" }, { slug: "shopify" }, { slug: "woocommerce", label: "WooCommerce" },
    { slug: "hostinger" }, { text: "Power Apps" }, { text: "Power Automate" }, { text: "Power BI" },
  ]},
];

const HERO_FEATURED = ["laravel", "vuedotjs", "nextdotjs", "flutter", "claude", "php"];

/* ============================================================
   Build a logo tile
============================================================ */
function makeTile(item, cat) {
  const li = document.createElement("div");
  li.className = "logo-tile";
  li.dataset.cat = cat;

  if (item.slug && ICONS[item.slug]) {
    const icon = ICONS[item.slug];
    const label = item.label || icon.title;
    const hex = "#" + icon.hex;
    li.style.setProperty("--tile-color", hex);
    li.style.setProperty("--tile-shadow", hex + "33");
    li.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icon.path}"/></svg><span>${label}</span>`;
    li.title = label;
  } else {
    li.classList.add("tile--text");
    li.innerHTML = `<span>${item.text}</span>`;
  }
  return li;
}

/* ============================================================
   Render stack grid + category chips
============================================================ */
const logoGrid = document.getElementById("logoGrid");
const chipRow = document.getElementById("chipRow");

if (logoGrid && chipRow) {
  const cats = ["All", ...STACK.map((g) => g.cat)];

  cats.forEach((cat) => {
    const chip = document.createElement("button");
    chip.className = "chip" + (cat === "All" ? " is-active" : "");
    chip.textContent = cat;
    chip.type = "button";
    chip.addEventListener("click", () => {
      document.querySelectorAll(".chip").forEach((c) => c.classList.remove("is-active"));
      chip.classList.add("is-active");
      document.querySelectorAll(".logo-tile").forEach((tile) => {
        const show = cat === "All" || tile.dataset.cat === cat;
        tile.classList.toggle("is-hidden", !show);
      });
    });
    chipRow.appendChild(chip);
  });

  STACK.forEach((group) => {
    group.items.forEach((item) => {
      logoGrid.appendChild(makeTile(item, group.cat));
    });
  });
}

/* Hero featured cloud */
const heroCloud = document.getElementById("heroCloud");
if (heroCloud) {
  HERO_FEATURED.forEach((slug) => {
    if (ICONS[slug]) heroCloud.appendChild(makeTile({ slug }, "featured"));
  });
}

/* ============================================================
   Sticky nav: scrolled state + active section highlight
============================================================ */
const nav = document.getElementById("nav");
const progressBar = document.getElementById("progress");

window.addEventListener("scroll", () => {
  nav.classList.toggle("is-scrolled", window.scrollY > 8);
  const h = document.documentElement;
  const scrolled = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
  progressBar.style.width = scrolled + "%";
}, { passive: true });

const navLinks = document.querySelectorAll(".nav-links a");
const sections = document.querySelectorAll("main > section[id]");

if ("IntersectionObserver" in window && sections.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.toggle("active", link.dataset.nav === entry.target.id);
          });
        }
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  );
  sections.forEach((s) => observer.observe(s));
}

/* ============================================================
   Accordion (experience)
============================================================ */
document.querySelectorAll(".acc-trigger").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".acc-item");
    const willOpen = !item.classList.contains("is-open");
    item.classList.toggle("is-open", willOpen);
    btn.setAttribute("aria-expanded", String(willOpen));
  });
});

/* ============================================================
   Copy email to clipboard
============================================================ */
const copyBtn = document.getElementById("copyEmail");
const toast = document.getElementById("toast");
let toastTimer;

if (copyBtn) {
  copyBtn.addEventListener("click", async () => {
    const value = copyBtn.dataset.value;
    try {
      await navigator.clipboard.writeText(value);
    } catch (e) {
      /* clipboard API unavailable — silently ignore */
    }
    toast.textContent = "Email copied — " + value;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2200);
  });
}

/* ============================================================
   Command palette
============================================================ */
const paletteOverlay = document.getElementById("paletteOverlay");
const paletteInput = document.getElementById("paletteInput");
const paletteList = document.getElementById("paletteList");
const paletteOpenBtn = document.getElementById("paletteOpen");

const COMMANDS = [
  { name: "About", tag: "section", action: () => scrollToId("about") },
  { name: "Experience", tag: "section", action: () => scrollToId("work") },
  { name: "Stack", tag: "section", action: () => scrollToId("stack") },
  { name: "Contact", tag: "section", action: () => scrollToId("contact") },
  { name: "Email Lemuel", tag: "mailto:lemueldecastro13@gmail.com", action: () => (window.location.href = "mailto:lemueldecastro13@gmail.com") },
  { name: "Copy email address", tag: "clipboard", action: () => copyBtn && copyBtn.click() },
  { name: "Open LinkedIn", tag: "linkedin.com", action: () => window.open("https://www.linkedin.com/in/lemuel-de-castro-a19524194", "_blank", "noopener") },
  { name: "Call", tag: "+63 916 512 6146", action: () => (window.location.href = "tel:+639165126146") },
];

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

let activeIndex = 0;
let filtered = COMMANDS;

function renderPalette() {
  paletteList.innerHTML = "";
  filtered.forEach((cmd, i) => {
    const li = document.createElement("li");
    li.className = i === activeIndex ? "is-active" : "";
    li.innerHTML = `<span class="p-name">${cmd.name}</span><span class="p-tag">${cmd.tag}</span>`;
    li.addEventListener("mouseenter", () => { activeIndex = i; renderPalette(); });
    li.addEventListener("click", () => runActive());
    paletteList.appendChild(li);
  });
}

function runActive() {
  const cmd = filtered[activeIndex];
  if (cmd) {
    cmd.action();
    closePalette();
  }
}

function openPalette() {
  paletteOverlay.hidden = false;
  paletteInput.value = "";
  filtered = COMMANDS;
  activeIndex = 0;
  renderPalette();
  setTimeout(() => paletteInput.focus(), 10);
}

function closePalette() {
  paletteOverlay.hidden = true;
}

paletteOpenBtn.addEventListener("click", openPalette);

paletteOverlay.addEventListener("click", (e) => {
  if (e.target === paletteOverlay) closePalette();
});

paletteInput.addEventListener("input", () => {
  const q = paletteInput.value.toLowerCase().trim();
  filtered = COMMANDS.filter((c) => c.name.toLowerCase().includes(q));
  activeIndex = 0;
  renderPalette();
});

document.addEventListener("keydown", (e) => {
  const isOpen = !paletteOverlay.hidden;

  if (!isOpen && e.key === "/" && document.activeElement.tagName !== "INPUT") {
    e.preventDefault();
    openPalette();
    return;
  }

  if (isOpen) {
    if (e.key === "Escape") { closePalette(); }
    else if (e.key === "ArrowDown") { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); renderPalette(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); renderPalette(); }
    else if (e.key === "Enter") { e.preventDefault(); runActive(); }
  }
});
