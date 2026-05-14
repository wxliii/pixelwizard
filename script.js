const toast = document.querySelector(".toast");
const yearEl = document.querySelector("#year");
const bibtex = document.querySelector("#bibtex");
const navbar = document.querySelector(".navbar");

const citations = {
  pixelwizard:
    bibtex?.textContent.trim() ||
    `@misc{li2026pixelwizard,
  title={PixelWizard: Towards Efficient High-Fidelity Video Generation at Ultra-Large Spatial Resolution},
  author={Li, Wenxue and Ren, Jingjing and Zhang, Peng and Ye, Tian and Zhou, Daiguo and Luan, Jian and Zhu, Lei},
  year={2026}
}`,
};

// Footer year
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Navbar shadow on scroll
if (navbar) {
  const onScroll = () => navbar.classList.toggle("scrolled", window.scrollY > 10);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Scroll fade-in
const fadeEls = document.querySelectorAll(".fade-in");
if (fadeEls.length && "IntersectionObserver" in window) {
  const obs = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add("visible");
          obs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.08 }
  );
  requestAnimationFrame(() => fadeEls.forEach((el) => obs.observe(el)));
} else {
  fadeEls.forEach((el) => el.classList.add("visible"));
}

// BibTeX copy
document.querySelectorAll("[data-copy]").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const key = btn.dataset.copy;
    const text = citations[key];
    if (!text) return showToast("Citation not configured.");
    try {
      await copyText(text);
      showToast("BibTeX copied!");
    } catch {
      showToast("Copy failed — select text manually.");
    }
  });
});

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add("visible");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("visible"), 2200);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.cssText = "position:fixed;left:-9999px";
  document.body.appendChild(ta);
  ta.select();
  try {
    if (!document.execCommand("copy")) throw new Error();
  } finally {
    document.body.removeChild(ta);
  }
}
