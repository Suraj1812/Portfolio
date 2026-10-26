"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lightweight, AOS-compatible scroll reveals.
 *
 * Supported attributes:
 *   data-aos="fade-up | fade-down | fade-left | fade-right | zoom-in | zoom-out | flip-up | blur-up | fade"
 *   data-aos-delay="120"     (ms)
 *   data-aos-duration="700"  (ms)
 *
 * Elements added later (filters, pagination) are picked up automatically.
 */
export function ScrollAnimationObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer: IntersectionObserver | undefined;
    let mutations: MutationObserver | undefined;
    let tracked = new WeakSet<Element>();
    const timers: number[] = [];

    function applyTiming(element: HTMLElement) {
      const { aosDelay, aosDuration } = element.dataset;
      if (aosDelay) element.style.setProperty("--aos-delay", `${aosDelay}ms`);
      if (aosDuration) element.style.setProperty("--aos-duration", `${aosDuration}ms`);
    }

    // Once the reveal finishes, hand transitions back to the element so its
    // own hover effects are not slowed down by the reveal timing.
    function reveal(element: HTMLElement) {
      element.classList.add("aos-visible");
      const delay = Number(element.dataset.aosDelay ?? 0);
      const duration = Number(element.dataset.aosDuration ?? 760);
      timers.push(window.setTimeout(() => element.classList.add("aos-done"), delay + duration + 60));
    }

    function track(element: HTMLElement) {
      if (tracked.has(element)) return;
      tracked.add(element);
      applyTiming(element);
      if (!element.classList.contains("aos-visible")) observer?.observe(element);
    }

    function teardown() {
      timers.forEach(window.clearTimeout);
      timers.length = 0;
      observer?.disconnect();
      mutations?.disconnect();
      root.classList.remove("aos-ready");
    }

    function setup() {
      teardown();
      tracked = new WeakSet<Element>();
      if (reducedMotion.matches || !("IntersectionObserver" in window)) return;

      const elements = Array.from(document.querySelectorAll<HTMLElement>("[data-aos]"));
      const visibleEdge = window.innerHeight * 0.92;

      // Anything already on screen stays visible, so nothing flickers on load.
      for (const element of elements) {
        const rect = element.getBoundingClientRect();
        if (rect.top < visibleEdge && rect.bottom > 0) element.classList.add("aos-visible", "aos-done");
      }

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            reveal(entry.target as HTMLElement);
            observer?.unobserve(entry.target);
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.08 },
      );

      root.classList.add("aos-ready");
      elements.forEach(track);

      mutations = new MutationObserver((records) => {
        for (const record of records) {
          record.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;
            if (node.matches("[data-aos]")) track(node);
            node.querySelectorAll<HTMLElement>("[data-aos]").forEach(track);
          });
        }
      });
      mutations.observe(document.body, { childList: true, subtree: true });
    }

    setup();
    reducedMotion.addEventListener("change", setup);

    return () => {
      teardown();
      reducedMotion.removeEventListener("change", setup);
    };
  }, [pathname]);

  return null;
}
