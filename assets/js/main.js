const cursor = document.querySelector(".custom-cursor");
const hoverTargets = document.querySelectorAll("a, button");

document.body.classList.add("js-ready");

if (cursor && window.matchMedia("(pointer: fine)").matches) {
  let currentX = -100;
  let currentY = -100;
  let targetX = -100;
  let targetY = -100;

  window.addEventListener("mousemove", (event) => {
    targetX = event.clientX - 14;
    targetY = event.clientY - 15;
  });

  const drawCursor = () => {
    currentX += (targetX - currentX) * 0.28;
    currentY += (targetY - currentY) * 0.28;
    cursor.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    requestAnimationFrame(drawCursor);
  };

  drawCursor();

  hoverTargets.forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });
}

const revealItems = document.querySelectorAll("[data-reveal]");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0, rootMargin: "0px 0px -8% 0px" }
);

revealItems.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 70, 280)}ms`;
  revealObserver.observe(item);
});

const categoryButtons = document.querySelectorAll("[data-filter]");
const workGrid = document.querySelector(".work-grid");
const workCards = [...document.querySelectorAll(".work-card")];

const workLayouts = {
  all: {
    theme: "cream",
    order: [
      ["parking-a", "regular"],
      ["akaba-a", "tall"],
      ["mhap-a", "regular"],
      ["treku-a", "regular"],
      ["akaba-b", "regular"],
      ["parking-b", "regular"],
      ["treku-b", "tall"],
      ["mhap-b", "tall"],
      ["mhap-c", "regular"],
      ["treku-c", "regular"],
      ["parking-c", "regular"],
      ["alejandro-a", "regular"],
    ],
  },
  cgi: {
    theme: "cream",
    order: [
      ["parking-a", "regular"],
      ["akaba-a", "tall"],
      ["treku-a", "regular"],
      ["akaba-b", "regular"],
      ["treku-b", "tall"],
      ["mhap-b", "tall"],
      ["parking-c", "regular"],
      ["alejandro-a", "regular"],
    ],
  },
  art: {
    theme: "cream",
    order: [
      ["akaba-b", "regular"],
      ["parking-b", "regular"],
      ["treku-a", "regular"],
      ["mhap-a", "regular"],
    ],
  },
  branding: {
    theme: "cream",
    order: [
      ["alejandro-a", "regular"],
      ["akaba-b", "regular"],
      ["parking-a", "regular"],
      ["treku-a", "regular"],
    ],
  },
  photography: {
    theme: "blue",
    order: [
      ["mhap-a", "regular"],
      ["parking-b", "regular"],
      ["mhap-c", "regular"],
      ["treku-c", "regular"],
    ],
  },
};

function getVisibleCardRects() {
  const rects = new Map();
  workCards.forEach((card) => {
    if (!card.hidden) {
      rects.set(card.dataset.id, card.getBoundingClientRect());
    }
  });
  return rects;
}

function applyWorkLayout(filter) {
  if (!workGrid) return;

  const layout = workLayouts[filter] || workLayouts.all;
  const firstRects = getVisibleCardRects();
  const visibleIds = new Set(layout.order.map(([id]) => id));
  const cardsById = new Map(workCards.map((card) => [card.dataset.id, card]));

  categoryButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === filter);
    button.setAttribute("aria-pressed", button.dataset.filter === filter ? "true" : "false");
  });

  document.body.classList.toggle("work-photography", layout.theme === "blue");

  layout.order.forEach(([id, size], index) => {
    const card = cardsById.get(id);
    if (!card) return;
    card.style.order = index;
    card.classList.toggle("tall", size === "tall");
    card.classList.remove("is-hidden");
    card.hidden = false;
    workGrid.appendChild(card);
  });

  workCards.forEach((card) => {
    const isVisible = visibleIds.has(card.dataset.id);
    card.classList.remove("is-entering");
    if (!isVisible) {
      card.classList.add("is-hidden");
      card.hidden = true;
    }
  });

  const lastRects = getVisibleCardRects();

  workCards.forEach((card) => {
    const last = lastRects.get(card.dataset.id);
    if (!last) return;

    const first = firstRects.get(card.dataset.id);
    if (!first) {
      void card.offsetWidth;
      card.classList.add("is-entering");
      card.addEventListener("animationend", () => card.classList.remove("is-entering"), { once: true });
      return;
    }

    const deltaX = first.left - last.left;
    const deltaY = first.top - last.top;

    if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return;

    card.animate(
      [
        { transform: `translate(${deltaX}px, ${deltaY}px)` },
        { transform: "translate(0, 0)" },
      ],
      { duration: 720, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }
    );
  });
}

categoryButtons.forEach((button) => {
  button.addEventListener("click", () => applyWorkLayout(button.dataset.filter));
});

if (workGrid) {
  applyWorkLayout("all");
}
