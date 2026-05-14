const toast = document.querySelector(".toast");
const yearEl = document.querySelector("#year");
const bibtex = document.querySelector("#bibtex");

const citations = {
  pixelwizard:
    bibtex?.textContent.trim() ||
    `@misc{li2026pixelwizard,
  title={PixelWizard: Towards Efficient High-Fidelity Video Generation at Ultra-Large Spatial Resolution},
  author={Li, Wenxue and Ren, Jingjing and Zhang, Peng and Ye, Tian and Zhou, Daiguo and Luan, Jian and Zhu, Lei},
  year={2026}
}`,
};

if (yearEl) yearEl.textContent = String(new Date().getFullYear());

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

// ── Video Carousel ──────────────────────────────────────────────
const slides = document.querySelectorAll(".carousel-slide");
if (slides.length > 0) {
  const dotsContainer = document.querySelector(".carousel-dots");
  const prevBtn = document.querySelector(".carousel-prev");
  const nextBtn = document.querySelector(".carousel-next");
  let current = 0;

  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement("button");
    dot.className = "carousel-dot" + (i === 0 ? " active" : "");
    dot.setAttribute("aria-label", `Go to video ${i + 1}`);
    dot.addEventListener("click", () => goTo(i));
    dotsContainer.appendChild(dot);
  });

  function goTo(index) {
    // Pause current video
    const currentVideo = slides[current].querySelector("video");
    if (currentVideo) currentVideo.pause();

    slides[current].classList.remove("active");
    dotsContainer.children[current].classList.remove("active");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("active");
    dotsContainer.children[current].classList.add("active");

    // Auto-play new video (muted allows autoplay)
    const nextVideo = slides[current].querySelector("video");
    if (nextVideo) {
      nextVideo.currentTime = 0;
      nextVideo.play().catch(() => {});
    }
  }

  prevBtn.addEventListener("click", () => goTo(current - 1));
  nextBtn.addEventListener("click", () => goTo(current + 1));

  // Keyboard support
  document.querySelector(".carousel").addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") goTo(current - 1);
    if (e.key === "ArrowRight") goTo(current + 1);
  });

  // Auto-play first video on load
  const firstVideo = slides[0].querySelector("video");
  if (firstVideo) firstVideo.play().catch(() => {});
}
