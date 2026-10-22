/* Shyam Sathish Kumar · site interactions.
   Plain JavaScript, no libraries. Everything here is extra polish: the page
   reads fine without it, and motion is skipped for visitors who ask for less. */
(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasIO = "IntersectionObserver" in window;

  /* Hero builds in on load */
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add("is-loaded"); });
  });

  /* Stagger children inside [data-stagger] */
  document.querySelectorAll("[data-stagger]").forEach(function (group) {
    group.querySelectorAll("[data-reveal]").forEach(function (el, i) {
      el.style.setProperty("--d", (i * 0.08).toFixed(2) + "s");
    });
  });

  /* Cards rise in, Kanban cards slide in, status meters fill */
  var reveals = document.querySelectorAll("[data-reveal]");

  function reveal(el) {
    el.classList.add("is-in");
    if (reduceMotion) { el.removeAttribute("data-reveal"); return; }
    el.addEventListener("transitionend", function done(e) {
      if (e.target !== el || e.propertyName !== "transform") return;
      el.removeEventListener("transitionend", done);
      el.removeAttribute("data-reveal");
      el.style.removeProperty("--d");
    });
  }

  if (hasIO && !reduceMotion) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
    reveals.forEach(function (el) { revealObserver.observe(el); });
  } else {
    reveals.forEach(reveal);
  }

  /* Key results count up */
  function countUp(el) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    var duration = 1400;
    var start = null;
    function tick(now) {
      if (start === null) start = now;
      var t = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - t, 3);
      el.textContent = String(Math.round(target * eased));
      if (t < 1) requestAnimationFrame(tick);
    }
    el.textContent = "0";
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll("[data-count]");
  if (hasIO && !reduceMotion) {
    var countObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        countUp(entry.target);
        countObserver.unobserve(entry.target);
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { countObserver.observe(el); });
  }

  /* Milestone nav ticks off as you scroll, and the bar under the header shows progress */
  var header = document.querySelector(".site-header");
  var items = Array.prototype.slice.call(document.querySelectorAll(".miles li"));
  var sections = items.map(function (li) {
    return document.querySelector(li.querySelector("a").getAttribute("href"));
  });
  var nav = document.querySelector(".miles");
  var lastCurrent = -1;
  var ticking = false;

  function update() {
    ticking = false;
    var scrollable = root.scrollHeight - window.innerHeight;
    var y = window.scrollY;
    root.style.setProperty("--progress", scrollable > 0 ? Math.min(y / scrollable, 1).toFixed(4) : "0");

    var line = header.offsetHeight + window.innerHeight * 0.3;
    var current = 0;
    sections.forEach(function (section, i) {
      if (section && section.getBoundingClientRect().top <= line) current = i;
    });
    if (y >= scrollable - 4) current = sections.length - 1;

    /* On narrow screens the milestone row scrolls sideways: keep the current one in view */
    if (current !== lastCurrent && nav.scrollWidth > nav.clientWidth) {
      var target = items[current];
      nav.scrollTo({
        left: target.offsetLeft - (nav.clientWidth - target.offsetWidth) / 2,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    }
    lastCurrent = current;

    items.forEach(function (li, i) {
      var link = li.querySelector("a");
      li.classList.toggle("is-done", i < current);
      li.classList.toggle("is-current", i === current);
      if (i === current) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }

  function onScroll() {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  update();
})();
