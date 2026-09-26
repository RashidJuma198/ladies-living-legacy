/* =========================================================
   Ladies Living Legacy — site script
   ========================================================= */

/* =========================================================
   ★★★  EVENT CONFIGURATION — EDIT THIS SECTION  ★★★
   ---------------------------------------------------------
   Everything a non-programmer normally needs to change lives
   here. Only edit the text between the quotation marks.
   ========================================================= */
const EVENT_CONFIG = {

  /* ---- GOOGLE FORM (registration) --------------------------------------
     1. Open your Google Form and click "Send".
     2. Click the link icon (🔗), UNTICK "Shorten URL", and copy the link.
        It looks like: https://docs.google.com/forms/d/e/1FAIpQL.../viewform
     3. Paste it below, replacing PASTE_GOOGLE_FORM_URL_HERE.

     That's it. Every "Register" button on the page will open this form,
     and the form is automatically embedded in the "Save your place" section.
     (Short forms.gle links work for the buttons but CANNOT be embedded.)   */
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf3VXv0T8IBuZZzniWOmpod5bLQgGTGFL0LJxVU9XvHuDeLLQ/viewform",

  /* OPTIONAL: only fill this in if you want the embedded form to use a
     different link. In Google Forms: Send → "< >" (Embed HTML) → copy the
     address inside src="...". Leave as-is to build it from googleFormUrl.
     Set to "" (empty) if you do NOT want the form embedded on the page.    */
  googleFormEmbedUrl: "YOUR_GOOGLE_FORM_EMBED_URL",

  /* ---- EVENT DETAILS (shown throughout the page) ---------------------- */
  eventName: "Ladies Living Legacy",
  eventSubtitle: "International Women's Day Summit",
  startDate: "2027-03-04",           // YYYY-MM-DD, drives the "days until" countdown
  endDate: "2027-03-15",             // YYYY-MM-DD
  dateText: "March 4th – 15th, 2027",
  durationText: "11 days, 11 nights",
  venue: "Positive Life Kenya",
  location: "Kenya",
  fee: "$55",

  /* ---- CONTACT DETAILS ------------------------------------------------ */
  contactEmail: "ladieslivinglegacy@gmail.com"
};
/* ===================== END OF CONFIGURATION ===================== */


document.documentElement.classList.add("js");

/** True when a config value is a real web address (not a placeholder). */
const isUrl = (value) => typeof value === "string" && /^https?:\/\//i.test(value.trim());

/** Parse "YYYY-MM-DD" as a local date (avoids timezone off-by-one). */
function parseLocalDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/* ---------- 1. Fill in configurable text & links ---------- */
function applyConfig() {
  document.querySelectorAll("[data-config]").forEach((el) => {
    const value = EVENT_CONFIG[el.dataset.config];
    if (typeof value !== "string" || !value) return;
    el.textContent = value;

    // e.g. data-config-href="mailto:" builds the link from the same value
    const hrefPrefix = el.dataset.configHref;
    if (hrefPrefix !== undefined) {
      el.setAttribute("href", hrefPrefix + value);
    }
  });

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------- 2. Google Form: buttons + embed ---------- */
function setupRegistration() {
  const formUrl = EVENT_CONFIG.googleFormUrl;
  const hasForm = isUrl(formUrl);

  // Every element with class "register-btn" opens the Google Form in a new tab.
  // Until a URL is configured they fall back to scrolling to #register.
  document.querySelectorAll(".register-btn").forEach((button) => {
    if (!hasForm) return;
    button.setAttribute("href", formUrl);
    button.setAttribute("target", "_blank");
    button.setAttribute("rel", "noopener");
  });

  // Work out the embed address
  let embedUrl = EVENT_CONFIG.googleFormEmbedUrl;
  if (embedUrl === "YOUR_GOOGLE_FORM_EMBED_URL") {
    embedUrl = hasForm && /docs\.google\.com\/forms/i.test(formUrl)
      ? formUrl + (formUrl.includes("?") ? "&" : "?") + "embedded=true"
      : "";
  }

  const frame = document.getElementById("form-frame");
  const newTab = document.getElementById("form-newtab");
  if (hasForm && newTab) {
    newTab.href = formUrl;
    newTab.hidden = false;
    const placeholderText = document.querySelector("#form-placeholder p");
    if (placeholderText) placeholderText.textContent = "Use the button below to open the registration form. It only takes a few minutes.";
  }
  if (!isUrl(embedUrl) || !frame) return;

  const iframe = document.createElement("iframe");
  iframe.src = embedUrl;
  iframe.title = `${EVENT_CONFIG.eventName} registration form`;
  iframe.loading = "lazy";
  frame.replaceChildren(iframe);
  frame.classList.add("has-form");
}

/* ---------- 3. Countdown ("159 days until we gather & make history together") ---------- */
function setupCountdown() {
  const el = document.getElementById("countdown");
  if (!el) return;
  const num = el.querySelector(".countdown-num");
  const text = el.querySelector(".countdown-text");

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = parseLocalDate(EVENT_CONFIG.startDate);
  const end = parseLocalDate(EVENT_CONFIG.endDate);
  const days = Math.round((start - today) / 86400000);

  if (days > 1) {
    num.textContent = days;
    text.textContent = "days until we gather & make history together";
  } else if (days === 1) {
    num.textContent = "1";
    text.textContent = "day until we gather & make history together";
  } else if (today <= end) {
    num.textContent = "";
    text.textContent = "The summit is happening now";
  } else {
    num.textContent = "";
    text.textContent = "Thank you for being part of the legacy";
  }
}

/* ---------- 4. Header: mobile menu + scrolled state + active link ---------- */
function setupNavigation() {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.getElementById("site-nav");

  const setMenu = (open) => {
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    nav.classList.toggle("is-open", open);
    document.body.classList.toggle("menu-open", open);
  };

  toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));

  // Close after choosing a link, pressing Escape, clicking outside, or growing to desktop
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("is-open")) { setMenu(false); toggle.focus(); }
  });
  document.addEventListener("click", (e) => {
    if (nav.classList.contains("is-open") && !header.contains(e.target)) setMenu(false);
  });
  window.matchMedia("(min-width: 861px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  // Solid header after scrolling past the top
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Highlight the nav link for the section in view
  const links = [...document.querySelectorAll(".nav-link")];
  const sections = links.map((l) => document.querySelector(l.getAttribute("href"))).filter(Boolean);
  if (!("IntersectionObserver" in window)) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("href") === "#" + entry.target.id));
    });
  }, { rootMargin: "-45% 0px -50% 0px" });
  sections.forEach((s) => observer.observe(s));
}

/* ---------- 5. Sunrise timeline (built from the day list) ---------- */
function setupTimeline() {
  const stage = document.getElementById("sunrise-stage");
  const days = [...document.querySelectorAll(".day[data-day]")];
  if (!stage || !days.length) return;

  // Geometry must match the SVG arc path in index.html: "M9 86 A41 66 0 0 1 91 86"
  const CX = 50, RX = 41, HORIZON = 86, RY = 66;
  const last = days.length - 1;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  days.forEach((day, i) => {
    const angle = Math.PI - (i / last) * Math.PI;   // left horizon → right horizon
    const x = CX + RX * Math.cos(angle);
    const y = HORIZON - RY * Math.sin(angle);
    const n = day.dataset.day;
    const title = day.querySelector("h3").textContent;

    const stop = document.createElement("button");
    stop.type = "button";
    stop.className = "sunrise-stop" + (day.dataset.kind === "summit" ? " sunrise-stop--summit" : "");
    stop.style.left = x + "%";
    stop.style.top = y + "%";
    // The departure stop shows a plane icon instead of a day number
    if (day.dataset.kind === "departure") {
      stop.classList.add("sunrise-stop--departure");
      stop.innerHTML = '<svg class="icon" aria-hidden="true"><use href="#i-plane"/></svg>';
      stop.setAttribute("aria-label", `Departure, ${day.dataset.date}`);
    } else {
      stop.textContent = n;
      stop.setAttribute("aria-label", `Day ${n}, ${day.dataset.date}: ${title}`);
    }
    stop.addEventListener("click", () => {
      stage.querySelectorAll(".sunrise-stop").forEach((s) => s.removeAttribute("aria-current"));
      stop.setAttribute("aria-current", "true");
      day.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "center" });
      day.classList.add("is-flash");
      setTimeout(() => day.classList.remove("is-flash"), 1600);
    });

    // Label placement: sides at the horizon, above-outward elsewhere
    const label = document.createElement("span");
    let pos = x < 50 ? "left" : "right";
    if (i === 0) pos = "side-left";
    else if (i === last) pos = "side-right";
    else if (day.dataset.kind === "iwd") pos = "top";
    label.className = `sunrise-label sunrise-label--${pos}`
      + (day.dataset.label ? " sunrise-label--flag" : "")
      + (day.dataset.kind === "summit" ? " sunrise-label--summit" : "");
    label.style.left = x + "%";
    label.style.top = y + "%";
    label.setAttribute("aria-hidden", "true");
    if (day.dataset.label) {
      const em = document.createElement("em");
      em.textContent = day.dataset.label;
      label.append(em);
    }
    label.append(day.dataset.date);

    stage.append(label, stop);
  });
}

/* ---------- 6. FAQ accordion ---------- */
function setupAccordion() {
  document.querySelectorAll(".acc-trigger").forEach((button) => {
    const panel = document.getElementById(button.getAttribute("aria-controls"));
    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      panel.classList.toggle("is-open", open);
    });
  });
}

/* ---------- 7. Reveal-on-scroll animations ---------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      obs.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
  items.forEach((el) => observer.observe(el));
}

/* ---------- Start ---------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  setupRegistration();
  setupCountdown();
  setupNavigation();
  setupTimeline();
  setupAccordion();
  setupReveal();
});
