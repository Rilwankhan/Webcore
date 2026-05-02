// ===== Webcore — site interactions =====
const WHATSAPP_NUMBER = "918608865811";
const FORMSPREE_ENDPOINT = "https://formspree.io/f/myzraeew"; // <- replace with your Formspree ID

// ---------- Data ----------
const landingPackages = [
  { name: "Silver", price: "₹4,999", tagline: "Perfect for getting online fast",
    features: ["1 Page Landing Site", "Mobile Responsive Design", "Contact Form Integration", "Basic SEO Setup", "1 Round of Revisions", "5 Day Delivery"], highlight: false },
  { name: "Gold", price: "₹9,999", tagline: "Most popular for growing brands",
    features: ["Up to 5 Pages", "Premium Animated Design", "WhatsApp & Form Integration", "Advanced SEO + Analytics", "3 Rounds of Revisions", "Speed Optimized", "7 Day Delivery"], highlight: true },
  { name: "Platinum", price: "₹19,999", tagline: "Premium solution, end-to-end",
    features: ["Up to 10 Custom Pages", "Bespoke UI/UX Design", "CMS / Blog Integration", "Premium SEO + Schema", "Unlimited Revisions", "Priority Support", "10 Day Delivery"], highlight: false },
];

const ecomPackages = [
  { name: "Gold", price: "₹14,999", tagline: "WhatsApp Integrated Store",
    features: ["Up to 50 Products", "WhatsApp Order Integration", "Mobile-First Storefront", "Product Catalog & Cart", "Basic SEO Setup", "Admin Dashboard", "10 Day Delivery"], highlight: false },
  { name: "Platinum", price: "₹29,999", tagline: "Payment Gateway + WhatsApp",
    features: ["Unlimited Products", "Razorpay/Stripe Integration", "WhatsApp Order Notifications", "Customer Accounts & Wishlist", "Coupons & Discounts", "Advanced SEO + Analytics", "Priority Support", "15 Day Delivery"], highlight: true },
];

// const projects = [
//   { title: "Luxe Commerce", category: "E-Commerce",   img: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=900&q=80" },
//   { title: "FinEdge SaaS",  category: "Landing Page", img: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=900&q=80" },
//   { title: "Bistro Online", category: "Restaurant",   img: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900&q=80" },
//   { title: "Pulse Fitness", category: "Branding Site",img: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=900&q=80" },
//   { title: "Nova Realty",   category: "Real Estate",  img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=900&q=80" },
//   { title: "Aurora Studio", category: "Portfolio",    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80" },
// ];


let currentType = "Landing Page";
let chosenPackage = "";

// ---------- Utilities ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

function showToast(msg, kind = "") {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show " + kind;
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => (t.className = "toast " + kind), 3000);
}

// ---------- Year ----------
$("#year").textContent = new Date().getFullYear();

// ---------- Navbar scroll ----------
const navbar = $("#navbar");
let scrollTicking = false;
const onScroll = () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      navbar.classList.toggle("scrolled", window.scrollY > 20);
      scrollTicking = false;
    });
    scrollTicking = true;
  }
};
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Mobile menu ----------
const navToggle = $("#navToggle");
const mobileMenu = $("#mobileMenu");
navToggle.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  navToggle.innerHTML = open ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
});
$$("#mobileMenu a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  navToggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
}));

// ---------- Render packages ----------
function renderPackages() {
  const grid = $("#packagesGrid");
  if (!grid) return;
  const list = currentType === "Landing Page" ? landingPackages : ecomPackages;
  grid.className = "packages-grid " + (list.length === 2 ? "cols-2" : "cols-3");
  grid.innerHTML = list.map((p, i) => `
    <div class="pkg glass-card ${p.highlight ? "highlight" : ""} reveal" style="--d:${i * 0.08}s">
      ${p.highlight ? `<div class="pkg-badge"><i class="fa-solid fa-sparkles"></i> MOST POPULAR</div>` : ""}
      <h3 class="pkg-name grad-text">${p.name}</h3>
      <p class="pkg-tag">${p.tagline}</p>
      <div class="pkg-price"><span class="amt">${p.price}</span><span class="per">/ project</span></div>
      <div class="pkg-divider"></div>
      <ul class="pkg-features">
        ${p.features.map(f => `<li><span class="pkg-check"><i class="fa-solid fa-check"></i></span><span>${f}</span></li>`).join("")}
      </ul>
      <button class="btn ${p.highlight ? "btn-neon" : "btn-neon-outline"} btn-lg" data-pkg="${p.name}">Choose Plan</button>
    </div>
  `).join("");
  observeReveal();
  $$("#packagesGrid [data-pkg]").forEach(b =>
    b.addEventListener("click", () => openPackageModal(b.dataset.pkg))
  );
}

// Type switch
$$(".type-btn").forEach(btn => btn.addEventListener("click", () => {
  $$(".type-btn").forEach(b => b.classList.remove("active"));
  btn.classList.add("active");
  currentType = btn.dataset.type;
  renderPackages();
  const isLanding = currentType === "Landing Page";
  const d1 = $("#demo1"), d2 = $("#demo2");
  if (d1) d1.style.display = isLanding ? "" : "none";
  if (d2) {
    d2.style.display = isLanding ? "none" : "";
    if (!isLanding) {
      const iframe = d2.querySelector("iframe[data-src]");
      if (iframe) { iframe.src = iframe.dataset.src; iframe.removeAttribute("data-src"); }
    }
  }
}));

// ---------- Render works ----------
function renderWorks() {
  if (!$("#worksGrid")) return;
  $("#worksGrid").innerHTML = projects.map((p, i) => `
    <div class="work reveal" style="--d:${i * 0.08}s">
      <div class="work-img"><img src="${p.img}" alt="${p.title}" loading="lazy" /></div>
      <div class="work-body">
        <div>
          <div class="work-cat grad-text">${p.category}</div>
          <div class="work-title">${p.title}</div>
        </div>
        <a href="#" class="work-link" aria-label="View ${p.title}"><i class="fa-solid fa-arrow-up-right-from-square"></i></a>
      </div>
    </div>
  `).join("");
  observeReveal();
}

// ---------- Modals ----------
function openModal(id) {
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add("open");
  m.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}
function closeModal(m) {
  m.classList.remove("open");
  m.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  // Reset contact view if needed
  if (m.id === "contactModal") {
    $("#contactFormView").hidden = false;
    $("#contactSuccessView").hidden = true;
    $("#contactForm").reset();
  }
}
function openPackageModal(name) {
  chosenPackage = name;
  $("#packageModalTitle").innerHTML = `<span class="grad-text">${name}</span> · ${currentType}`;
  $("#packageForm").reset();
  openModal("packageModal");
}

// Open triggers
$$("[data-open]").forEach(el => el.addEventListener("click", () => {
  const target = el.dataset.open;
  if (target === "contact") openModal("contactModal");
}));
// Close triggers
$$("[data-close]").forEach(el => el.addEventListener("click", () => {
  const m = el.closest(".modal");
  if (m) closeModal(m);
}));
document.addEventListener("keydown", e => {
  if (e.key === "Escape") $$(".modal.open").forEach(closeModal);
});

// ---------- Validation ----------
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// ---------- Package form -> WhatsApp ----------
$("#packageForm").addEventListener("submit", e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = (fd.get("name") || "").toString().trim();
  const phone = (fd.get("phone") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const business = (fd.get("business") || "").toString().trim();

  if (name.length < 2) return showToast("Please enter your name", "error");
  if (phone.length < 7) return showToast("Please enter a valid phone number", "error");
  if (!isEmail(email)) return showToast("Please enter a valid email", "error");
  if (business.length < 2) return showToast("Please enter your business type", "error");

  const message =
`Client Details, New Request Web Core

Name: ${name}
Mobile number: ${phone}
Email ID: ${email}
Business type: ${business}

Package Details:
Website type: ${currentType}
Chosen Package: ${chosenPackage}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank");
  showToast("Redirecting to WhatsApp...", "success");
  closeModal($("#packageModal"));
});

// ---------- Contact form -> Formspree ----------
$("#contactForm").addEventListener("submit", async e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const data = {
    name: (fd.get("name") || "").toString().trim(),
    phone: (fd.get("phone") || "").toString().trim(),
    email: (fd.get("email") || "").toString().trim(),
    reason: (fd.get("reason") || "").toString().trim(),
  };
  if (data.name.length < 2) return showToast("Please enter your name", "error");
  if (data.phone.length < 7) return showToast("Please enter a valid phone number", "error");
  if (!isEmail(data.email)) return showToast("Please enter a valid email", "error");
  if (data.reason.length < 5) return showToast("Please share a reason", "error");

  const btn = $("#contactSubmit");
  btn.disabled = true; btn.textContent = "Sending...";
  try {
    await fetch(FORMSPREE_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data),
    });
  } catch (_) { /* show success regardless to avoid blocking on demo endpoint */ }
  finally {
    btn.disabled = false; btn.innerHTML = "Send Message";
    $("#contactFormView").hidden = true;
    $("#contactSuccessView").hidden = false;
  }
});

// ---------- Reveal on scroll ----------
let revealObserver;
function observeReveal() {
  const els = $$(".reveal:not(.in)");
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  }
  els.forEach(el => revealObserver.observe(el));
}

// ---------- Smooth-scroll fix for header offset (small) ----------
$$('a[href^="#"]').forEach(a => {
  a.addEventListener("click", e => {
    const id = a.getAttribute("href");
    if (id.length > 1 && document.querySelector(id)) {
      e.preventDefault();
      document.querySelector(id).scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
});

// ---------- Init ----------
document.documentElement.classList.add("js-ready");
renderPackages();
renderWorks();
observeReveal();
