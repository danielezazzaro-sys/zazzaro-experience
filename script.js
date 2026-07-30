/* =========================================================
   FORNI ZAZZARO EXPERIENCE — SCRIPT.JS
   Versione completa con timeline a scomparsa
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const hero = document.querySelector(".hero");
  const heroBackground = document.querySelector(".hero__background");
  const heroContent = document.querySelector(".hero__content");
  const currentYear = document.querySelector("#current-year");
  const steps = [...document.querySelectorAll(".experience-step")];

  /* ANNO AUTOMATICO */

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  /* BARRA DI AVANZAMENTO */

  const progressBar = document.createElement("div");
  progressBar.className = "scroll-progress";
  progressBar.setAttribute("aria-hidden", "true");

  const progressInner = document.createElement("div");
  progressInner.className = "scroll-progress__inner";

  progressBar.appendChild(progressInner);
  document.body.prepend(progressBar);

  /* HERO */

  requestAnimationFrame(() => {
    hero?.classList.add("hero-is-loaded");
  });

  /* PREPARAZIONE ANIMAZIONI */

  const introduction = document.querySelector(".section-heading");
  const finalCta = document.querySelector(".final-cta__content");

  introduction?.classList.add("reveal");
  finalCta?.classList.add("reveal");

  steps.forEach((step) => {
    const content = step.querySelector(".experience-step__content");
    const label = step.querySelector(".experience-step__label");
    const title = step.querySelector("h2");
    const paragraph = step.querySelector("p");
    const listItems = step.querySelectorAll("li");
    const number = step.querySelector(".experience-step__number");
    const isReverse = step.classList.contains("experience-step--reverse");

    if (content) {
      content.classList.add(
        "reveal",
        isReverse ? "reveal--left" : "reveal--right"
      );
    }

    label?.style.setProperty("--delay", "80ms");
    title?.style.setProperty("--delay", "160ms");
    paragraph?.style.setProperty("--delay", "240ms");
    number?.style.setProperty("--delay", "180ms");

    listItems.forEach((item, index) => {
      item.style.setProperty("--delay", `${320 + index * 85}ms`);
    });
  });

  /* REVEAL OBSERVER */

  const revealElements = document.querySelectorAll(".reveal");

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  /* ANIMAZIONE IMMAGINI SICURA */

  steps.forEach((step) => {
    const media = step.querySelector(".experience-step__media");

    if (!media || reducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    const mediaObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.animate(
            [
              {
                opacity: 0.72,
                transform: step.classList.contains("experience-step--reverse")
                  ? "translateX(50px)"
                  : "translateX(-50px)",
              },
              {
                opacity: 1,
                transform: "translateX(0)",
              },
            ],
            {
              duration: 900,
              easing: "cubic-bezier(0.22, 1, 0.36, 1)",
              fill: "both",
            }
          );

          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -7% 0px",
      }
    );

    mediaObserver.observe(media);
  });

  /* SEZIONE ATTIVA */

  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) {
          return;
        }

        steps.forEach((step) => step.classList.remove("is-active"));
        visible[0].target.classList.add("is-active");
      },
      {
        threshold: [0.25, 0.4, 0.55],
        rootMargin: "-18% 0px -18% 0px",
      }
    );

    steps.forEach((step) => activeObserver.observe(step));
  }

  /* LUCE AL PASSAGGIO DEL MOUSE */

  if (!reducedMotion && window.matchMedia("(pointer: fine)").matches) {
    document
      .querySelectorAll(".experience-step__media")
      .forEach((media) => {
        media.addEventListener("pointermove", (event) => {
          const bounds = media.getBoundingClientRect();

          const x =
            ((event.clientX - bounds.left) / bounds.width) * 100;

          const y =
            ((event.clientY - bounds.top) / bounds.height) * 100;

          media.style.setProperty("--pointer-x", `${x}%`);
          media.style.setProperty("--pointer-y", `${y}%`);
        });

        media.addEventListener("pointerleave", () => {
          media.style.setProperty("--pointer-x", "50%");
          media.style.setProperty("--pointer-y", "50%");
        });
      });
  }

  /* TIMELINE DESKTOP */

  let timeline = null;
  let timelineTab = null;
  let timelineItems = [];
  let timelineCloseTimer = null;

  const closeTimelineLater = (delay = 1200) => {
    if (!timeline) {
      return;
    }

    window.clearTimeout(timelineCloseTimer);

    timelineCloseTimer = window.setTimeout(() => {
      timeline.classList.remove("is-open");

      if (timeline.classList.contains("is-visible")) {
        timelineTab?.classList.add("is-visible");
      }
    }, delay);
  };

  const openTimeline = (delay = 1200) => {
    if (!timeline) {
      return;
    }

    timeline.classList.add("is-open");
    timelineTab?.classList.remove("is-visible");
    closeTimelineLater(delay);
  };

  if (steps.length) {
    timeline = document.createElement("nav");
    timeline.className = "experience-timeline";
    timeline.setAttribute(
      "aria-label",
      "Navigazione tra le fasi della Zazzaro Experience"
    );

    const title = document.createElement("span");
    title.className = "experience-timeline__title";
    title.textContent = "IL PERCORSO";

    const list = document.createElement("ol");
    list.className = "experience-timeline__list";

    timelineItems = steps.map((step, index) => {
      const number =
        step
          .querySelector(".experience-step__number")
          ?.textContent.trim() ||
        String(index + 1).padStart(2, "0");

      const label =
        step
          .querySelector(".experience-step__label")
          ?.textContent.trim() ||
        `Fase ${index + 1}`;

      const item = document.createElement("li");
      item.className = "experience-timeline__item";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "experience-timeline__button";
      button.setAttribute(
        "aria-label",
        `Vai alla fase ${number}: ${label}`
      );

      const numberSpan = document.createElement("span");
      numberSpan.className = "experience-timeline__number";
      numberSpan.textContent = number;

      const labelSpan = document.createElement("span");
      labelSpan.className = "experience-timeline__label";
      labelSpan.textContent = label;

      const dot = document.createElement("span");
      dot.className = "experience-timeline__dot";
      dot.setAttribute("aria-hidden", "true");

      button.append(numberSpan, labelSpan, dot);

      button.addEventListener("click", () => {
        step.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center",
        });

        openTimeline(2200);
      });

      item.appendChild(button);
      list.appendChild(item);

      return { item, button, step };
    });

    timeline.append(title, list);
    document.body.appendChild(timeline);

    timelineTab = document.createElement("button");
    timelineTab.type = "button";
    timelineTab.className = "experience-timeline-tab";
    timelineTab.textContent = "Percorso";
    timelineTab.setAttribute(
      "aria-label",
      "Apri il percorso della Zazzaro Experience"
    );

    document.body.appendChild(timelineTab);

    timeline.addEventListener("mouseenter", () => {
      window.clearTimeout(timelineCloseTimer);
      timeline.classList.add("is-open");
      timelineTab?.classList.remove("is-visible");
    });

    timeline.addEventListener("mouseleave", () => {
      closeTimelineLater(700);
    });

    timelineTab.addEventListener("mouseenter", () => {
      openTimeline(2500);
    });

    timelineTab.addEventListener("click", () => {
      openTimeline(3000);
    });
  }

  const setTimelineActive = (index) => {
    timelineItems.forEach((entry, itemIndex) => {
      entry.item.classList.toggle("is-active", itemIndex === index);
      entry.item.classList.toggle("is-completed", itemIndex < index);

      if (itemIndex === index) {
        entry.button.setAttribute("aria-current", "step");
      } else {
        entry.button.removeAttribute("aria-current");
      }
    });
  };

  if (timeline && "IntersectionObserver" in window) {
    const timelineObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio
          );

        if (!visible.length) {
          return;
        }

        const index = steps.indexOf(visible[0].target);

        if (index >= 0) {
          setTimelineActive(index);
        }
      },
      {
        threshold: [0.22, 0.38, 0.55],
        rootMargin: "-20% 0px -20% 0px",
      }
    );

    steps.forEach((step) => timelineObserver.observe(step));
  }

  setTimelineActive(0);

  /* SCROLL EFFECTS */

  let latestScrollY = window.scrollY;
  let ticking = false;

  const updateScrollEffects = () => {
    const scrollY = latestScrollY;
    const maxScroll =
      document.documentElement.scrollHeight -
      window.innerHeight;

    const progress =
      maxScroll > 0
        ? Math.min(Math.max(scrollY / maxScroll, 0), 1)
        : 0;

    progressInner.style.transform = `scaleX(${progress})`;

    if (
      !reducedMotion &&
      hero &&
      heroBackground &&
      heroContent
    ) {
      const heroHeight = hero.offsetHeight;
      const heroProgress = Math.min(
        Math.max(scrollY / heroHeight, 0),
        1
      );

      if (scrollY <= heroHeight) {
        heroBackground.style.transform =
          `scale(${1.04 + heroProgress * 0.035}) ` +
          `translate3d(0, ${scrollY * 0.08}px, 0)`;

        heroContent.style.transform =
          `translate3d(0, ${scrollY * 0.045}px, 0)`;

        heroContent.style.opacity = String(
          Math.max(1 - heroProgress * 1.15, 0)
        );
      }
    }

    if (timeline && steps.length) {
      const first = steps[0].getBoundingClientRect();
      const last =
        steps[steps.length - 1].getBoundingClientRect();

      const started = first.top < window.innerHeight * 0.74;
      const finished = last.bottom < window.innerHeight * 0.20;
      const available = started && !finished;

      timeline.classList.toggle("is-visible", available);

      if (!available) {
        timeline.classList.remove("is-open");
        timelineTab?.classList.remove("is-visible");
      } else if (!timeline.classList.contains("is-open")) {
        timelineTab?.classList.add("is-visible");
      }
    }

    ticking = false;
  };

  window.addEventListener(
    "scroll",
    () => {
      latestScrollY = window.scrollY;

      if (
        timeline &&
        timeline.classList.contains("is-visible")
      ) {
        openTimeline(1200);
      }

      if (!ticking) {
        requestAnimationFrame(updateScrollEffects);
        ticking = true;
      }
    },
    { passive: true }
  );

  window.addEventListener("resize", updateScrollEffects);

  updateScrollEffects();
});
