export function initScrollReveal() {
  const elements = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    {
      threshold: 0.15, // 15% visible = trigger
    }
  );

  elements.forEach((el) => observer.observe(el));
}
export const initCountUp = () => {
  const counters = document.querySelectorAll(".count-up");

  const animateCount = (el) => {
    const target = +el.dataset.count;
    let current = 0;
    const increment = Math.ceil(target / 80);

    const update = () => {
      current += increment;
      if (current >= target) {
        el.textContent = target + "+";
      } else {
        el.textContent = current;
        requestAnimationFrame(update);
      }
    };

    update();
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          obs.unobserve(entry.target); // 🔒 run once
        }
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((c) => observer.observe(c));
};
