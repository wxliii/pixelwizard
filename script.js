const toast = document.querySelector(".toast");
const year = document.querySelector("#year");
const bibtex = document.querySelector("#bibtex");

const citations = {
  pixelwizard:
    bibtex?.textContent.trim() ||
    `@inproceedings{li2026pixelwizard,
  title={PixelWizard: Towards Efficient High-Fidelity Video Generation at Ultra-Large Spatial Resolution},
  author={Li, Wenxue and Ren, Jingjing and Zhang, Peng and Ye, Tian and Zhou, Daiguo and Luan, Jian and Zhu, Lei},
  booktitle={International Conference on Machine Learning},
  year={2026}
}`,
};

if (year) {
  year.textContent = String(new Date().getFullYear());
}

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
