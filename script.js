const toast = document.querySelector(".toast");
const year = document.querySelector("#year");
const bibtex = document.querySelector("#bibtex");
const header = document.querySelector(".site-header");

const citations = {
  pixelwizard:
    bibtex?.textContent.trim() ||
    `@misc{li2026pixelwizard,
  title={PixelWizard: Towards Efficient High-Fidelity Video Generation at Ultra-Large Spatial Resolution},
  author={Li, Wenxue and Ren, Jingjing and Zhang, Peng and Ye, Tian and Zhou, Daiguo and Luan, Jian and Zhu, Lei},
  year={2026}
}`,
};

// Update footer year
if (year) {
  year.textContent = String(new Date().getFullYear());
}

// Header shadow on scroll
if (header) {
  const onScroll = () => {
    header.classList.toggle("scrolled", window.scrollY > 8);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Scroll-driven fade-in animations
const animatedElements = document.querySelectorAll(".animate");

if (animatedElements.length && "IntersectionObserver" in window) {
  // Opt-in: only hide elements once JS is ready
  document.body.classList.add("js-animate");

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.08 }
  );

  // Small delay so the browser paints the hidden state before observing
  requestAnimationFrame(() => {
    animatedElements.forEach((el) => observer.observe(el));
  });
} else {
  animatedElements.forEach((el) => el.classList.add("visible"));
}

// BibTeX copy
document.querySelectorAll("[data-copy]").forEach((button) => {
  button.addEventListener("click", async () => {
    const key = button.dataset.copy;
    const citation = citations[key];

    if (!citation) {
      showToast("Citation is not configured yet.");
      return;
    }

    try {
      await copyText(citation);
      showToast("BibTeX copied.");
    } catch {
      showToast("Copy failed. Select the BibTeX text manually.");
    }
  });
});

function showToast(message) {
  if (!toast) return;

  toast.textContent = message;
  toast.classList.add("visible");

  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => {
    toast.classList.remove("visible");
  }, 2100);
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const success = document.execCommand("copy");
    if (!success) throw new Error("execCommand copy failed");
  } finally {
    document.body.removeChild(textarea);
  }
}
