"use client";

import Lenis from "lenis";
import { type ReactNode, useEffect } from "react";
import "lenis/dist/lenis.css";

type SmoothScrollProps = {
  children: ReactNode;
};

const scrollKeys = new Set([
  "ArrowUp",
  "ArrowDown",
  "PageUp",
  "PageDown",
  "Home",
  "End",
  " ",
]);

export function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarsePointer = window.matchMedia("(pointer: coarse)");
    let lenis: Lenis | undefined;
    let frame = 0;
    let disposed = false;

    function stopFrame() {
      if (frame) window.cancelAnimationFrame(frame);
      frame = 0;
    }

    function raf(time: number) {
      frame = 0;
      const current = lenis;
      if (disposed || !current || document.hidden) return;
      current.raf(time);
      if (!disposed && lenis === current && !document.hidden) {
        frame = window.requestAnimationFrame(raf);
      }
    }

    function startFrame() {
      if (disposed || !lenis || frame || document.hidden) return;
      // Avoid advancing an animation by the time spent in a background tab.
      lenis.time = performance.now();
      frame = window.requestAnimationFrame(raf);
    }

    function cancelInertia() {
      if (!lenis) return;
      // These public methods reset pending momentum to the actual scroll position.
      // The browser still handles the key, hash change, or history navigation.
      lenis.stop();
      lenis.start();
    }

    function updatePreferences() {
      if (reducedMotion.matches || coarsePointer.matches) {
        stopFrame();
        lenis?.destroy();
        lenis = undefined;
        return;
      }
      if (!lenis) {
        lenis = new Lenis({
          // Lower lerp = longer, silkier glide after each wheel/trackpad input.
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.95,
          autoRaf: false,
          anchors: false,
          allowNestedScroll: true,
          stopInertiaOnNavigate: true,
          prevent: (node) =>
            node.matches("input, textarea, select, [contenteditable='true']"),
        });
      }
      startFrame();
    }

    function updateVisibility() {
      if (document.hidden) {
        stopFrame();
        cancelInertia();
      } else {
        startFrame();
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (scrollKeys.has(event.key) && !event.metaKey && !event.ctrlKey && !event.altKey) {
        cancelInertia();
      }
    }

    function headerClearance() {
      const header = document.querySelector<HTMLElement>("header");
      let height = header?.offsetHeight ?? 0;
      // A menu closes on link activation; clear the collapsed header below it.
      const mobileMenu = header?.querySelector<HTMLElement>("#mobile-navigation");
      if (mobileMenu) {
        height -= mobileMenu.offsetHeight +
          (Number.parseFloat(getComputedStyle(mobileMenu).marginTop) || 0);
      }
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
      return Math.max(rootFontSize * 7, height + 12);
    }

    function handleAnchorClick(event: MouseEvent) {
      const current = lenis;
      if (!current || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.composedPath().find(
        (node): node is HTMLAnchorElement => node instanceof HTMLAnchorElement,
      );
      if (!link || link.hasAttribute("download") ||
        (link.target && link.target !== "_self") ||
        link.closest("[data-lenis-prevent]")) return;
      if (link.classList.contains("skip-link")) {
        cancelInertia();
        return;
      }
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin ||
        destination.pathname !== window.location.pathname ||
        destination.search !== window.location.search || !destination.hash) return;
      let target: HTMLElement | null;
      try {
        target = document.getElementById(decodeURIComponent(destination.hash.slice(1)));
      } catch {
        return;
      }
      if (!target) return;

      // Capture precedes Next Link's handler, preventing a second native jump.
      // Propagation continues so navbar links can still close their mobile menu.
      event.preventDefault();
      if (window.location.hash !== destination.hash) {
        window.history.pushState(window.history.state, "", destination.hash);
      }
      const distance = Math.abs(target.getBoundingClientRect().top);
      current.scrollTo(target, {
        offset: target.id === "top" ? 0 : -headerClearance(),
        duration: Math.min(0.85, Math.max(0.45, distance / 3000)),
        easing: (progress) => 1 - Math.pow(1 - progress, 3),
        onComplete: () => {
          if (disposed || lenis !== current || event.detail !== 0) return;
          // Keyboard-activated anchors retain their normal focus destination.
          const hadTabIndex = target.hasAttribute("tabindex");
          if (!hadTabIndex) target.setAttribute("tabindex", "-1");
          target.focus({ preventScroll: true });
          if (!hadTabIndex) target.removeAttribute("tabindex");
        },
      });
    }

    reducedMotion.addEventListener("change", updatePreferences);
    coarsePointer.addEventListener("change", updatePreferences);
    document.addEventListener("visibilitychange", updateVisibility);
    window.addEventListener("keydown", handleKeyDown, true);
    window.addEventListener("click", handleAnchorClick, true);
    window.addEventListener("popstate", cancelInertia);
    window.addEventListener("hashchange", cancelInertia);
    updatePreferences();

    return () => {
      disposed = true;
      stopFrame();
      lenis?.destroy();
      lenis = undefined;
      reducedMotion.removeEventListener("change", updatePreferences);
      coarsePointer.removeEventListener("change", updatePreferences);
      document.removeEventListener("visibilitychange", updateVisibility);
      window.removeEventListener("keydown", handleKeyDown, true);
      window.removeEventListener("click", handleAnchorClick, true);
      window.removeEventListener("popstate", cancelInertia);
      window.removeEventListener("hashchange", cancelInertia);
    };
  }, []);

  return <>{children}</>;
}
