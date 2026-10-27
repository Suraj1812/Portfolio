"use client";

import { useEffect, useRef } from "react";
import type * as ThreeTypes from "three";

import { createToonKit, GUIDE_EVENT, lightScene } from "@/components/hero-toy-avatar";
import { createMover, createRobotPoser, loadRobot, type RobotRig } from "@/components/robot-model";
import "./scroll-guide.css";

/**
 * Scroll guide: the robot from the hero leaves its hover-pad and follows the
 * reader.
 *
 * - Scrolling down, it jumps with a spin into each section, turns toward
 *   something there, points at it and explains it in a speech bubble.
 * - Scrolling up, it flies backward on a little jetpack with sparkles and
 *   smoke, and finally lands home on the pad.
 * - It reacts: looks at hovered cards, waves when clicked, salutes filter
 *   picks, claps with confetti when the email is copied, wobbles on very fast
 *   scrolls, and kneels to wait when the reader pauses.
 * - In dark mode the element it points at gets a spotlight.
 */
type Stop = { id: string; text: string; target: string };
const STOPS: Stop[] = [
  { id: "work", text: "These are my projects. Try the search, or just press /", target: "#project-search" },
  { id: "experience", text: "Where I've worked. Each card is a real role.", target: ".experience-chapter-card" },
  { id: "about", text: "That's me in a nutshell. Powered by coffee and code!", target: ".about-narrative" },
  { id: "stack", text: "My toolbox. Dark chips are my everyday go-tos.", target: ".skills-grid" },
  { id: "resume", text: "One page, no fluff. Hover the paper!", target: ".rshow-viewer" },
  { id: "contact", text: "Building something with AI? Say hello!", target: ".contact-talk" },
];
const CLICK_LINES = ["Hi there! 👋", "Keep scrolling, there's more!", "Built with three.js ✨", "Beep boop. Need a hand?"];
const HOVER_TARGETS =
  ".rich-project-card, .experience-chapter-card, .skill-card, .contact-channel, .rshow-viewer, .about-narrative, .rich-project-filters button, .rp-card";

type Point = { x: number; y: number };
type Travel = { from: Point; to: number; t: number; duration: number; mode: "jump" | "fly" };
type Gesture = { kind: "wave" | "thumbs" | "cheer"; t: number; duration: number };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const envelope = (t: number, edge = 0.2) => smooth(t < edge ? t / edge : t > 1 - edge ? Math.max(0, (1 - t) / edge) : 1);

// ======================= Component =======================
export function ScrollGuide() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const fxRef = useRef<HTMLDivElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const host = hostRef.current;
    const bubble = bubbleRef.current;
    const fx = fxRef.current;
    const hit = hitRef.current;
    if (!wrap || !host || !bubble || !fx || !hit) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let disposed = false;
    let destroy = () => {};

    async function build() {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: ThreeTypes.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
      } catch {
        return;
      }
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = "guide-canvas";
      host!.appendChild(renderer.domElement);

      const { builder, disposables } = createToonKit(THREE);
      disposables.add(renderer);
      const { part, toon, flat } = builder;

      const scene = new THREE.Scene();
      const pivot = new THREE.Group(); // pivot at the hips for natural spins and tilts
      pivot.position.y = 0.95;
      const body = new THREE.Group();
      body.position.y = -0.95;
      pivot.add(body);
      scene.add(pivot);

      const lighting = await lightScene(THREE, renderer, scene, { environmentIntensity: 0.6 });
      if (disposed) {
        lighting.dispose();
        return;
      }
      disposables.add(lighting);

      // ---------- Robot (loads in the background) ----------
      let robot: { rig: RobotRig; mover: ReturnType<typeof createMover>; poser: ReturnType<typeof createRobotPoser> } | null = null;
      loadRobot(THREE, (item) => disposables.add(item))
        .then((rig) => {
          if (disposed) return;
          body.add(rig.root);
          robot = { rig, mover: createMover(THREE, rig), poser: createRobotPoser(THREE, rig, body) };
        })
        .catch(() => {
          // Without the model the guide simply stays hidden.
        });

      // ---------- Jetpack on its back ----------
      const jetpack = new THREE.Group();
      jetpack.position.set(0, 0.42, -0.2);
      pivot.add(jetpack);
      const flames: ThreeTypes.Object3D[] = [];
      for (const x of [-0.065, 0.065]) {
        jetpack.add(part(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 16), toon(0x3b4456), { position: [x, 0, 0] }));
        jetpack.add(part(new THREE.SphereGeometry(0.05, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0x9aa6bd), { position: [x, 0.11, 0] }));
        jetpack.add(part(new THREE.CylinderGeometry(0.03, 0.045, 0.04, 14), toon(0x1f2533), { position: [x, -0.13, 0] }));
        const flame = new THREE.Group();
        flame.position.set(x, -0.15, 0);
        flame.add(part(new THREE.ConeGeometry(0.05, 0.3, 12), flat(0x5ee7ff), { position: [0, -0.15, 0], rotation: [Math.PI, 0, 0] }));
        flame.add(part(new THREE.ConeGeometry(0.028, 0.18, 10), flat(0xffffff), { position: [0, -0.1, 0.005], rotation: [Math.PI, 0, 0] }));
        jetpack.add(flame);
        flames.push(flame);
      }
      jetpack.add(part(new THREE.BoxGeometry(0.2, 0.16, 0.05), toon(0x1f2533), { position: [0, 0.01, 0.05] }));
      jetpack.scale.setScalar(0.001);

      let night = false;
      const applyTheme = () => {
        night = document.documentElement.dataset.theme === "dark";
      };
      applyTheme();
      const themeObserver = new MutationObserver(applyTheme);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      // ---------- Camera and sizing ----------
      const VIEW_HEIGHT = 2.6;
      const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
      let size = { w: 220, h: 230 };
      const isSmall = () => window.innerWidth < 760;
      function layout() {
        size = isSmall() ? { w: 116, h: 158 } : { w: 170, h: 230 };
        wrap!.style.setProperty("--guide-w", `${size.w}px`);
        wrap!.style.setProperty("--guide-h", `${size.h}px`);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(size.w, size.h, false);
        camera.aspect = size.w / size.h;
        const distance = VIEW_HEIGHT / 2 / Math.tan(THREE.MathUtils.degToRad(15));
        camera.position.set(0, 1.05, distance);
        camera.lookAt(0, 1.05, 0);
        camera.updateProjectionMatrix();
      }
      layout();

      // ---------- Positions ----------
      function anchor(index: number): Point {
        if (index < 0) return home();
        const margin = isSmall() ? 6 : 8;
        const right = isSmall() || index % 2 === 0;
        return {
          x: right ? window.innerWidth - size.w - margin : margin,
          y: window.innerHeight - size.h - (isSmall() ? 8 : 12),
        };
      }
      /** Where the robot stands on the hero's hover-pad, in viewport pixels. */
      function home(): Point {
        const stage = document.querySelector(".hero-stage");
        if (!stage) return { x: window.innerWidth / 2 - size.w / 2, y: -size.h };
        const rect = stage.getBoundingClientRect();
        return { x: rect.left + rect.width / 2 - size.w / 2, y: rect.top + rect.height * 0.32 };
      }
      function sectionIndex() {
        const line = window.innerHeight * 0.6;
        let found = -1;
        STOPS.forEach((stop, index) => {
          const element = document.getElementById(stop.id);
          if (element && element.getBoundingClientRect().top <= line) found = index;
        });
        return found;
      }

      // ---------- Speech bubble ----------
      let typing = 0;
      let bubbleTimer = 0;
      let charScreenX = size.w / 2;
      function placeBubble() {
        const onRight = pos.x + size.w / 2 > window.innerWidth / 2;
        bubble!.dataset.side = onRight ? "left" : "right";
        if (onRight) {
          bubble!.style.right = `${size.w - charScreenX + 8}px`;
          bubble!.style.left = "auto";
        } else {
          bubble!.style.left = `${charScreenX + 8}px`;
          bubble!.style.right = "auto";
        }
      }
      function say(text: string, hold = 0) {
        window.clearInterval(typing);
        window.clearTimeout(bubbleTimer);
        placeBubble();
        bubble!.textContent = "";
        bubble!.classList.add("is-visible");
        let shown = 0;
        typing = window.setInterval(() => {
          shown += 1;
          bubble!.textContent = text.slice(0, shown);
          if (shown >= text.length) window.clearInterval(typing);
        }, 24);
        const autoHide = hold || (isSmall() ? 4200 : 0);
        if (autoHide) bubbleTimer = window.setTimeout(hush, autoHide);
      }
      function hush() {
        window.clearInterval(typing);
        window.clearTimeout(bubbleTimer);
        bubble!.classList.remove("is-visible");
      }

      // ---------- Effects ----------
      function particle(
        kind: "spark" | "dust" | "smoke" | "confetti" | "mail",
        x: number,
        y: number,
        options: { dx?: number; dy?: number; duration?: number; color?: string } = {},
      ) {
        const dot = document.createElement("span");
        dot.className = `guide-fx guide-fx-${kind}`;
        dot.style.left = `${x}px`;
        dot.style.top = `${y}px`;
        if (options.color) dot.style.background = options.color;
        if (kind === "mail") dot.textContent = "✉️";
        fx!.appendChild(dot);
        const dx = options.dx ?? 0;
        const dy = options.dy ?? 0;
        const frames =
          kind === "confetti"
            ? [
                { transform: "translate(-50%, -50%) rotate(0deg)", opacity: 1 },
                { transform: `translate(calc(-50% + ${dx * 0.7}px), calc(-50% + ${dy}px)) rotate(${dx * 4}deg)`, opacity: 1, offset: 0.45 },
                { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy + 220}px)) rotate(${dx * 8}deg)`, opacity: 0 },
              ]
            : [
                { transform: "translate(-50%, -50%) scale(1) rotate(0deg)", opacity: 1 },
                { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${kind === "mail" ? 0.9 : 0.2}) rotate(${kind === "mail" ? 18 : 0}deg)`, opacity: kind === "mail" ? 0.2 : 0 },
              ];
        dot
          .animate(frames, { duration: options.duration ?? 700, easing: kind === "confetti" ? "cubic-bezier(0.2, 0.7, 0.4, 1)" : "cubic-bezier(0.16, 1, 0.3, 1)" })
          .finished.then(() => dot.remove())
          .catch(() => dot.remove());
      }
      function confetti() {
        const colors = ["#ffe45e", "#63e6ff", "#85e2b4", "#ff8b3d", "#5f7cff", "#ff8fb1"];
        const cx = pos.x + charScreenX;
        const cy = pos.y + size.h * 0.25;
        for (let i = 0; i < 40; i += 1) {
          particle("confetti", cx, cy, {
            dx: (Math.random() - 0.5) * 360,
            dy: -80 - Math.random() * 160,
            duration: 1100 + Math.random() * 600,
            color: colors[i % colors.length],
          });
        }
      }

      // ---------- State ----------
      const pos: Point = home();
      let active = -1;
      let goal = -1;
      let travel: Travel | null = null;
      let landing = 0;
      let gesture: Gesture | null = null;
      let windy = 0;
      let lastWindyLine = -100;
      let sit = 0;
      let sitting = false;
      let elapsed = 0;
      let lastActivity = 0;
      let sparkClock = 0;
      let mailClock = 0;
      let visible = false;
      let clickLine = 0;
      let hoverElement: Element | null = null;
      let hoverAt = -100;
      let litElement: Element | null = null;
      let talkUntil = 0;
      let faceYaw = 0;

      function setVisible(next: boolean) {
        if (visible === next) return;
        visible = next;
        wrap!.classList.toggle("is-out", next);
      }
      function startTravel(to: number) {
        const leavingHome = active === -1 && !travel;
        const from = leavingHome ? home() : { ...pos };
        if (leavingHome) {
          pos.x = from.x;
          pos.y = from.y;
          window.dispatchEvent(new CustomEvent(GUIDE_EVENT, { detail: { away: true } }));
          setVisible(true);
        }
        const forward = to > (travel ? travel.to : active);
        travel = { from, to, t: 0, duration: forward ? 0.95 : 1.3, mode: forward ? "jump" : "fly" };
        // Stand up from a held kneel and stop talking before setting off.
        sitting = false;
        talkUntil = 0;
        robot?.mover.release(0.2);
        robot?.mover.setBase("Idle", 0.2);
        hush();
      }
      function arrive(index: number) {
        const mode = travel?.mode;
        active = index;
        travel = null;
        lastActivity = elapsed;
        if (index === -1) {
          setVisible(false);
          window.dispatchEvent(new CustomEvent(GUIDE_EVENT, { detail: { away: false } }));
          return;
        }
        if (mode === "jump") {
          landing = 0.35;
          for (let i = 0; i < 7; i += 1) {
            particle("dust", pos.x + charScreenX, pos.y + size.h - 8, { dx: (Math.random() - 0.5) * 80, dy: -14 - Math.random() * 14, duration: 520 });
          }
        }
        say(STOPS[index].text);
        // Turn toward the target, point at it, then keep talking for a bit.
        robot?.mover.release(0.25);
        robot?.mover.play("Pointing Forward");
        robot?.mover.setBase("Talking");
        talkUntil = elapsed + 5.5;
      }
      const GESTURE_MOVES: Record<Gesture["kind"], string> = { wave: "Waving", thumbs: "Salute", cheer: "Standing Clap" };
      function startGesture(kind: Gesture["kind"], duration: number) {
        gesture = { kind, t: 0, duration };
        lastActivity = elapsed;
        if (sitting) sitting = false;
        robot?.mover.release(0.2);
        robot?.mover.play(GESTURE_MOVES[kind]);
      }

      // ---------- Reactions ----------
      function onHitClick() {
        startGesture("wave", 1.6);
        clickLine = (clickLine + 1) % CLICK_LINES.length;
        say(CLICK_LINES[clickLine], 3200);
      }
      function onPageClick(event: MouseEvent) {
        lastActivity = elapsed;
        if (!visible || !(event.target instanceof Element)) return;
        if (event.target.closest(".rich-project-filters button")) {
          startGesture("thumbs", 1.6);
          say("Nice pick! 🫡", 2600);
        } else if (event.target.closest(".contact-copy")) {
          startGesture("cheer", 1.8);
          confetti();
          say("Copied! Talk soon 🎉", 3000);
        }
      }
      function onPointerOver(event: PointerEvent) {
        if (!(event.target instanceof Element)) return;
        const card = event.target.closest(HOVER_TARGETS);
        if (card) {
          hoverElement = card;
          hoverAt = elapsed;
        }
      }
      let lastScrollY = window.scrollY;
      let lastScrollTime = performance.now();
      function onScroll() {
        const now = performance.now();
        const dt = Math.max(1, now - lastScrollTime);
        const speed = (Math.abs(window.scrollY - lastScrollY) / dt) * 1000;
        lastScrollY = window.scrollY;
        lastScrollTime = now;
        lastActivity = elapsed;
        if (visible && speed > 3200) {
          windy = 1.1;
          if (!travel && elapsed - lastWindyLine > 8) {
            lastWindyLine = elapsed;
            say("Whoa, slow down! 💨", 1800);
          }
        }
        wake();
      }
      function onPointerMove() {
        lastActivity = elapsed;
      }

      // ---------- Pose ----------
      function rectLook(element: Element, fromX: number, fromY: number) {
        const rect = element.getBoundingClientRect();
        const tx = clamp(rect.left + rect.width / 2, 0, window.innerWidth);
        const ty = clamp(rect.top + Math.min(rect.height / 2, 120), 0, window.innerHeight);
        return { dx: tx - fromX, dy: ty - fromY };
      }

      function pose(delta: number) {
        elapsed += delta;
        const follow = 1 - Math.exp(-delta * 10);
        charScreenX = size.w / 2;
        hit!.style.left = `${charScreenX - size.w * 0.16}px`;
        hit!.style.width = `${size.w * 0.32}px`;

        // ----- Travel arcs -----
        let spin = 0;
        let tiltZ = 0;
        let tiltX = 0;
        let tuck = 0;
        let jetOn = 0;
        let lookX = 0;
        let lookY = 0;
        if (travel) {
          travel.t = Math.min(1, travel.t + delta / travel.duration);
          const to = anchor(travel.to);
          const t = travel.t;
          if (travel.mode === "jump") {
            const e = smooth(t);
            const height = 130 + Math.hypot(to.x - travel.from.x, to.y - travel.from.y) * 0.18;
            pos.x = travel.from.x + (to.x - travel.from.x) * e;
            pos.y = travel.from.y + (to.y - travel.from.y) * e - Math.sin(Math.PI * t) * height;
            spin = easeInOut(clamp((t - 0.1) / 0.8, 0, 1)) * Math.PI * 2;
            tuck = Math.sin(Math.PI * t);
            tiltZ = -Math.sign(to.x - travel.from.x) * Math.sin(Math.PI * t) * 0.2;
          } else {
            // Jetpack flight backward through a raised control point.
            const e = easeInOut(t);
            const control = {
              x: (travel.from.x + to.x) / 2 + (to.x > travel.from.x ? -60 : 60),
              y: Math.min(travel.from.y, to.y) - 200,
            };
            const u = 1 - e;
            pos.x = u * u * travel.from.x + 2 * u * e * control.x + e * e * to.x;
            pos.y = u * u * travel.from.y + 2 * u * e * control.y + e * e * to.y;
            const dir = Math.sign(to.x - travel.from.x) || 1;
            const flight = Math.sin(Math.PI * t);
            tiltZ = -dir * flight * 0.35;
            tiltX = -flight * 0.25;
            // Turn three-quarters so the jetpack and its flames are on show.
            spin = -dir * flight * 2.2;
            jetOn = clamp(flight * 3, 0, 1);
            sparkClock += delta;
            if (sparkClock > 0.05) {
              sparkClock = 0;
              const bx = pos.x + charScreenX;
              const by = pos.y + size.h * 0.62;
              particle("spark", bx + (Math.random() - 0.5) * 30, by, { dx: (Math.random() - 0.5) * 24, dy: 18 + Math.random() * 20 });
              particle("smoke", bx + (Math.random() - 0.5) * 16, by + 10, { dx: (Math.random() - 0.5) * 30, dy: 30 + Math.random() * 20, duration: 800 });
            }
          }
          lookX = clamp((to.x - pos.x) / 400, -1, 1);
          if (travel.t >= 1) arrive(travel.to);
        } else if (active >= 0) {
          const to = anchor(active);
          pos.x += (to.x - pos.x) * (1 - Math.exp(-delta * 8));
          pos.y += (to.y - pos.y) * (1 - Math.exp(-delta * 8));
        }

        // ----- Kneeling to wait when the reader pauses -----
        const shouldSit = visible && active >= 0 && !travel && elapsed - lastActivity > 12;
        if (shouldSit && !sitting) {
          sitting = true;
          say("Take your time, I'll wait here ⏳");
          robot?.mover.setBase("Idle");
          robot?.mover.play("Kneeling Pointing", { hold: true, fade: 0.5 });
        } else if (!shouldSit && sitting) {
          sitting = false;
          hush();
          robot?.mover.release();
        }
        sit += ((sitting ? 1 : 0) - sit) * (1 - Math.exp(-delta * 5));

        // Stop talking after a while.
        if (talkUntil && elapsed > talkUntil) {
          talkUntil = 0;
          robot?.mover.setBase("Idle");
        }

        // ----- Gestures and wind -----
        let g = 0;
        if (gesture) {
          gesture.t += delta;
          g = envelope(gesture.t / gesture.duration);
          if (gesture.t >= gesture.duration) gesture = null;
        }
        if (windy > 0) windy = Math.max(0, windy - delta);
        const wind = smooth(clamp(windy / 0.3, 0, 1));

        // ----- Facing the section target -----
        let pointSide = 0;
        const chestX = pos.x + charScreenX;
        const chestY = pos.y + size.h * 0.37;
        const target = active >= 0 && !travel ? document.querySelector(STOPS[active].target) : null;
        if (target && sit < 0.5) {
          const { dx, dy } = rectLook(target, chestX, chestY);
          pointSide = dx >= 0 ? 1 : -1;
          lookX = clamp(dx / (window.innerWidth * 0.4), -1, 1);
          lookY = clamp(-dy / (window.innerHeight * 0.5), -1, 1);
        }
        // Hovered cards win its attention for a moment.
        if (hoverElement && elapsed - hoverAt < 2.5 && !travel) {
          const { dx, dy } = rectLook(hoverElement, chestX, chestY - 30);
          lookX = clamp(dx / (window.innerWidth * 0.4), -1, 1);
          lookY = clamp(-dy / (window.innerHeight * 0.5), -1, 1);
        }
        if (sit > 0.5) {
          lookX = 0;
          lookY = -0.3;
        }
        // Body turns toward what it points at; gestures face the reader.
        const wantYaw = gesture ? 0 : pointSide * 0.75;
        faceYaw += (wantYaw - faceYaw) * (1 - Math.exp(-delta * 4));

        // Night: spotlight the element it points at.
        const lit = night && pointSide !== 0 && !gesture ? target : null;
        if (lit !== litElement) {
          litElement?.classList.remove("guide-lit");
          lit?.classList.add("guide-lit");
          litElement = lit;
        }
        // Contact: little envelopes fly toward the button.
        if (active >= 0 && STOPS[active].id === "contact" && !travel && sit < 0.5 && target) {
          mailClock += delta;
          if (mailClock > 0.9) {
            mailClock = 0;
            const hx = pos.x + charScreenX + pointSide * 30;
            const hy = pos.y + size.h * 0.45;
            const { dx, dy } = rectLook(target, hx, hy);
            particle("mail", hx, hy, { dx: dx * 0.85, dy: dy * 0.85, duration: 1300 });
          }
        }

        // ----- Robot animation and head look -----
        if (robot) {
          robot.rig.mixer.update(delta);
          const glance = travel?.mode === "fly" ? clamp(-spin * 0.3, -0.7, 0.7) : 0;
          robot.poser.apply((lookX - faceYaw * 0.6) * 0.8 + glance, -lookY * 0.4);
        }

        // ----- Jetpack -----
        const jetScale = jetpack.scale.x + (jetOn - jetpack.scale.x) * (1 - Math.exp(-delta * 12));
        jetpack.scale.setScalar(Math.max(0.001, jetScale));
        jetpack.visible = jetScale > 0.02;
        flames.forEach((flame, index) => {
          flame.scale.set(1, 0.7 + Math.abs(Math.sin(elapsed * 30 + index * 2)) * 0.6, 1);
        });

        // ----- Body: spin, tilt, landing squash, hover bob, wind wobble -----
        if (landing > 0) landing = Math.max(0, landing - delta);
        const squash = Math.sin((landing / 0.35) * Math.PI) * 0.12 + tuck * 0.06;
        const cheerHop = gesture?.kind === "cheer" ? Math.abs(Math.sin(gesture.t * 7)) * 0.1 * g : 0;
        const wobble = wind * Math.sin(elapsed * 18) * 0.12;
        pivot.rotation.x += (tiltX - wind * 0.25 - pivot.rotation.x) * follow;
        pivot.rotation.y = spin + faceYaw;
        pivot.rotation.z = tiltZ + wobble;
        pivot.scale.set(1 + squash * 0.6, 1 - squash, 1 + squash * 0.6);
        pivot.position.y = 0.95 + cheerHop + (travel ? 0 : Math.sin(elapsed * 2) * 0.012 * (1 - sit));

        wrap!.style.transform = `translate3d(${pos.x.toFixed(1)}px, ${pos.y.toFixed(1)}px, 0)`;
      }

      // ---------- Loop ----------
      const clock = new THREE.Clock();
      let rafId = 0;
      function checkGoal() {
        const want = sectionIndex();
        if (want !== goal) {
          goal = want;
          if (want !== active || travel) startTravel(want);
        }
      }
      function tick() {
        rafId = 0;
        if (disposed) return;
        checkGoal();
        const delta = Math.min(clock.getDelta(), 0.05);
        if (visible || travel) {
          pose(delta);
          renderer.render(scene, camera);
          rafId = requestAnimationFrame(tick);
        }
      }
      function wake() {
        if (!rafId && !document.hidden) {
          clock.getDelta();
          rafId = requestAnimationFrame(tick);
        }
      }
      function onResize() {
        layout();
        wake();
      }

      hit!.addEventListener("click", onHitClick);
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onResize);
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerover", onPointerOver, { passive: true });
      document.addEventListener("click", onPageClick, true);
      document.addEventListener("visibilitychange", wake);
      wake();

      if (process.env.NODE_ENV !== "production") {
        Object.assign(window, {
          __scrollGuide: {
            step(seconds: number) {
              for (let t = 0; t < seconds; t += 1 / 30) {
                checkGoal();
                if (visible || travel) pose(1 / 30);
              }
              renderer.render(scene, camera);
              return { active, travel: travel?.mode ?? null, t: travel?.t, x: Math.round(pos.x), y: Math.round(pos.y), sitting, night, jet: jetpack.scale.x, move: robot?.mover.currentName ?? null, loaded: Boolean(robot) };
            },
            gesture(kind: Gesture["kind"]) {
              startGesture(kind, 1.6);
              if (kind === "cheer") confetti();
            },
            idle() {
              lastActivity = elapsed - 20;
            },
            wind() {
              windy = 1.1;
            },
          },
        });
      }

      destroy = () => {
        cancelAnimationFrame(rafId);
        window.clearInterval(typing);
        window.clearTimeout(bubbleTimer);
        themeObserver.disconnect();
        litElement?.classList.remove("guide-lit");
        hit!.removeEventListener("click", onHitClick);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("pointermove", onPointerMove);
        document.removeEventListener("pointerover", onPointerOver);
        document.removeEventListener("click", onPageClick, true);
        document.removeEventListener("visibilitychange", wake);
        window.dispatchEvent(new CustomEvent(GUIDE_EVENT, { detail: { away: false } }));
        disposables.forEach((item) => item.dispose());
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };
    }

    void build();
    return () => {
      disposed = true;
      destroy();
    };
  }, []);

  return (
    <>
      <div ref={fxRef} className="guide-fx-layer" aria-hidden="true" />
      <div ref={wrapRef} className="guide" aria-hidden="true">
        <div ref={bubbleRef} className="guide-bubble" />
        <div ref={hostRef} className="guide-host" />
        {/* Only the robot's body is clickable, so the canvas never blocks the page. */}
        <button ref={hitRef} type="button" className="guide-hit" tabIndex={-1} aria-hidden="true" />
      </div>
    </>
  );
}
