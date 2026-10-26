"use client";

import { useEffect, useRef } from "react";
import type * as ThreeTypes from "three";

import {
  buildCharacter,
  buildPuppy,
  C,
  createToonKit,
  GUIDE_EVENT,
  type Builder,
} from "@/components/hero-toy-avatar";
import "./scroll-guide.css";

/**
 * Scroll guide: a small 3D Suraj (with his puppy) that leaves the hero island
 * and follows the reader.
 *
 * - Scrolling down, he jumps with a spin into each section, pulls out a prop,
 *   points at something there and explains it in a speech bubble.
 * - Scrolling up, he flies backward on a little jetpack with sparkles and smoke,
 *   and finally lands home on the island.
 * - He reacts: looks at hovered cards, thumbs-up on filter picks, confetti when
 *   the email is copied, holds his head on very fast scrolls, and sits down to
 *   check his phone when the reader pauses.
 * - In dark mode he wears a hoodie and points with a flashlight that lights up
 *   the element he's pointing at.
 */
type PropName = "magnifier" | "briefcase" | "mug" | "wrench" | "paper" | "envelope" | "phone";
type Stop = { id: string; text: string; target: string; prop: PropName };
const STOPS: Stop[] = [
  { id: "work", text: "These are my projects. Try the search, or just press /", target: "#project-search", prop: "magnifier" },
  { id: "experience", text: "Where I've worked. Each card is a real role.", target: ".experience-chapter-card", prop: "briefcase" },
  { id: "about", text: "That's me in a nutshell. Coffee helps!", target: ".about-narrative", prop: "mug" },
  { id: "stack", text: "My toolbox. Dark chips are my everyday go-tos.", target: ".skills-grid", prop: "wrench" },
  { id: "resume", text: "One page, no fluff. Hover the paper!", target: ".rshow-viewer", prop: "paper" },
  { id: "contact", text: "Building something with AI? Say hello!", target: ".contact-talk", prop: "envelope" },
];
const CLICK_LINES = ["Hi there! 👋", "Keep scrolling, there's more!", "Built with three.js ✨", "Need a hand? I'm right here."];
const HOVER_TARGETS =
  ".rich-project-card, .experience-chapter-card, .skill-card, .contact-channel, .rshow-viewer, .about-narrative, .rich-project-filters button, .rp-card";
const HOODIE = 0x5b6475;

type Point = { x: number; y: number };
type Travel = { from: Point; to: number; t: number; duration: number; mode: "jump" | "fly" };
type Gesture = { kind: "wave" | "thumbs" | "cheer"; t: number; duration: number };

const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const smooth = (t: number) => t * t * (3 - 2 * t);
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const envelope = (t: number, edge = 0.2) => smooth(t < edge ? t / edge : t > 1 - edge ? Math.max(0, (1 - t) / edge) : 1);

// ======================= Props =======================
function buildProps({ THREE, part, toon, flat }: Builder) {
  const dark = toon(0x2b2b2b);
  const wood = toon(0x7a4b2e);
  const leather = toon(0x8b5a2b);
  const gold = toon(0xffc94a);
  const silver = toon(0xb8c0cc);
  const white = toon(0xffffff);
  const paperLine = flat(0x9aa3b2);

  const props: Record<PropName, ThreeTypes.Group> = {
    magnifier: new THREE.Group(),
    briefcase: new THREE.Group(),
    mug: new THREE.Group(),
    wrench: new THREE.Group(),
    paper: new THREE.Group(),
    envelope: new THREE.Group(),
    phone: new THREE.Group(),
  };

  props.magnifier.add(part(new THREE.TorusGeometry(0.06, 0.013, 10, 28), dark, { position: [0, 0.07, 0] }));
  props.magnifier.add(part(new THREE.CircleGeometry(0.058, 28), flat(0xbdf3ff, 0.55, true), { outline: false, position: [0, 0.07, 0] }));
  props.magnifier.add(part(new THREE.CapsuleGeometry(0.013, 0.08, 6, 10), wood, { position: [0, -0.03, 0] }));

  props.briefcase.add(part(new THREE.BoxGeometry(0.2, 0.14, 0.06), leather, { position: [0, -0.06, 0] }));
  props.briefcase.add(part(new THREE.TorusGeometry(0.032, 0.009, 8, 16, Math.PI), dark, { position: [0, 0.012, 0] }));
  for (const x of [-0.055, 0.055]) {
    props.briefcase.add(part(new THREE.BoxGeometry(0.022, 0.016, 0.012), gold, { outline: false, position: [x, -0.005, 0.032] }));
  }

  props.mug.add(part(new THREE.CylinderGeometry(0.045, 0.04, 0.095, 20), white, { position: [0, 0.03, 0] }));
  props.mug.add(part(new THREE.CylinderGeometry(0.046, 0.046, 0.022, 20), toon(0x63e6ff), { outline: false, position: [0, 0.03, 0] }));
  props.mug.add(part(new THREE.CircleGeometry(0.04, 20), flat(0x5a3420), { outline: false, position: [0, 0.075, 0], rotation: [-Math.PI / 2, 0, 0] }));
  props.mug.add(part(new THREE.TorusGeometry(0.026, 0.008, 8, 16), white, { position: [0.05, 0.03, 0] }));

  props.wrench.add(part(new THREE.BoxGeometry(0.026, 0.17, 0.012), silver, { position: [0, 0.0, 0] }));
  props.wrench.add(part(new THREE.TorusGeometry(0.034, 0.013, 8, 18, Math.PI * 1.5), silver, { position: [0, 0.11, 0], rotation: [0, 0, Math.PI * 0.75] }));

  props.paper.add(part(new THREE.BoxGeometry(0.15, 0.2, 0.004), white, { position: [0, 0.04, 0] }));
  props.paper.add(part(new THREE.BoxGeometry(0.1, 0.018, 0.002), flat(0x5f7cff), { outline: false, position: [-0.012, 0.115, 0.003] }));
  for (let i = 0; i < 5; i += 1) {
    props.paper.add(part(new THREE.BoxGeometry(0.11 - (i % 2) * 0.03, 0.007, 0.002), paperLine, { outline: false, position: [-0.008, 0.08 - i * 0.025, 0.003] }));
  }

  props.envelope.add(part(new THREE.BoxGeometry(0.17, 0.11, 0.012), white, { position: [0, 0.02, 0] }));
  const flap = new THREE.Shape([new THREE.Vector2(-0.085, 0.075), new THREE.Vector2(0.085, 0.075), new THREE.Vector2(0, 0.01)]);
  props.envelope.add(part(new THREE.ShapeGeometry(flap), toon(0xe9e4da), { outline: false, position: [0, 0, 0.008] }));
  props.envelope.add(part(new THREE.CircleGeometry(0.014, 16), flat(0xff6b6b), { outline: false, position: [0, 0.012, 0.01] }));

  props.phone.add(part(new THREE.BoxGeometry(0.065, 0.12, 0.012), dark, { position: [0, 0.02, 0] }));
  props.phone.add(part(new THREE.PlaneGeometry(0.052, 0.098), flat(0x63e6ff), { outline: false, position: [0, 0.02, 0.0065] }));

  // Flashlight held along the pointing arm, with a soft glowing beam.
  const flashlight = new THREE.Group();
  flashlight.add(part(new THREE.CylinderGeometry(0.018, 0.018, 0.12, 14), dark, { position: [0, -0.05, 0] }));
  flashlight.add(part(new THREE.CylinderGeometry(0.028, 0.02, 0.035, 16), silver, { position: [0, -0.125, 0] }));
  flashlight.add(part(new THREE.CircleGeometry(0.025, 16), flat(0xfff3a0), { outline: false, position: [0, -0.144, 0], rotation: [Math.PI / 2, 0, 0] }));
  const beamMaterial = new THREE.MeshBasicMaterial({ color: 0xfff1a0, transparent: true, opacity: 0.22, depthWrite: false, side: THREE.DoubleSide });
  const beam = part(new THREE.ConeGeometry(0.28, 1.1, 28, 1, true), beamMaterial, { outline: false, position: [0, -0.145 - 0.55, 0] });
  flashlight.add(beam);

  return { props, flashlight, beamMaterial };
}

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
      const { character, torso, head, eyes, brows, arms, legs, mouth } = buildCharacter(builder);

      const scene = new THREE.Scene();
      const pivot = new THREE.Group(); // pivot at the hips for natural spins and tilts
      pivot.position.y = 0.95;
      character.position.y = -0.95;
      pivot.add(character);
      scene.add(pivot);

      const { puppy, body: puppyBody, head: puppyHead, tail, tongue } = buildPuppy(builder);
      puppy.scale.setScalar(1.05);
      scene.add(puppy);

      const key = new THREE.DirectionalLight(0xffffff, 2.5);
      key.position.set(-2, 3, 4);
      scene.add(key, new THREE.AmbientLight(0xffffff, 1.15));

      // ---------- Props in each hand ----------
      const handProps = new Map<number, ReturnType<typeof buildProps>>();
      arms.forEach(({ hand, side }) => {
        const set = buildProps(builder);
        disposables.add(set.beamMaterial);
        const grip = new THREE.Group();
        grip.position.set(0, -0.1, 0.01);
        grip.rotation.x = Math.PI / 2; // upright and facing the viewer in the holding pose
        grip.scale.setScalar(1.35);
        hand.add(grip);
        Object.values(set.props).forEach((prop) => {
          prop.visible = false;
          grip.add(prop);
        });
        set.flashlight.visible = false;
        hand.add(set.flashlight);
        handProps.set(side, set);
      });

      // ---------- Jetpack ----------
      const jetpack = new THREE.Group();
      jetpack.position.set(0, 0.36, -0.2);
      torso.add(jetpack);
      const flames: ThreeTypes.Object3D[] = [];
      for (const x of [-0.065, 0.065]) {
        jetpack.add(part(new THREE.CylinderGeometry(0.05, 0.05, 0.22, 16), toon(0xff8b3d), { position: [x, 0, 0] }));
        jetpack.add(part(new THREE.SphereGeometry(0.05, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2), toon(0xb8c0cc), { position: [x, 0.11, 0] }));
        jetpack.add(part(new THREE.CylinderGeometry(0.03, 0.045, 0.04, 14), toon(0x3a3a3a), { position: [x, -0.13, 0] }));
        const flame = new THREE.Group();
        flame.position.set(x, -0.15, 0);
        flame.add(part(new THREE.ConeGeometry(0.05, 0.3, 12), flat(0xff8b3d), { outline: false, position: [0, -0.15, 0], rotation: [Math.PI, 0, 0] }));
        flame.add(part(new THREE.ConeGeometry(0.028, 0.18, 10), flat(0xffe45e), { outline: false, position: [0, -0.1, 0.005], rotation: [Math.PI, 0, 0] }));
        jetpack.add(flame);
        flames.push(flame);
      }
      jetpack.scale.setScalar(0.001);

      // ---------- Night outfit: hoodie with hood, drawstrings and pocket ----------
      const suitMaterial = toon(C.suit) as ThreeTypes.MeshToonMaterial;
      const lapelMaterial = toon(C.lapel);
      const pocketMaterial = toon(0x63e6ff);
      const hoodie = new THREE.Group();
      const hoodieMaterial = toon(0x4a5263);
      hoodie.add(part(new THREE.SphereGeometry(0.17, 28, 16, 0, Math.PI * 2, 0, Math.PI / 2), hoodieMaterial, { position: [0, 0.57, -0.11], rotation: [-0.9, 0, 0], scale: [1.35, 0.75, 1] }));
      for (const x of [-0.04, 0.04]) {
        hoodie.add(part(new THREE.CapsuleGeometry(0.006, 0.12, 4, 8), flat(0xffffff), { outline: false, position: [x, 0.47, 0.17] }));
      }
      hoodie.add(part(new THREE.BoxGeometry(0.22, 0.1, 0.02), hoodieMaterial, { position: [0, 0.12, 0.142] }));
      torso.add(hoodie);
      let night = false;
      function applyOutfit() {
        night = document.documentElement.dataset.theme === "dark";
        suitMaterial.color.setHex(night ? HOODIE : C.suit);
        lapelMaterial.visible = !night;
        pocketMaterial.visible = !night;
        hoodie.visible = night;
      }
      applyOutfit();
      const themeObserver = new MutationObserver(applyOutfit);
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      // ---------- Camera and sizing ----------
      const VIEW_HEIGHT = 2.6;
      const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 30);
      let size = { w: 250, h: 230 };
      let withPuppy = true;
      const isSmall = () => window.innerWidth < 760;
      function layout() {
        withPuppy = !isSmall();
        size = isSmall() ? { w: 116, h: 158 } : { w: 220, h: 230 };
        puppy.visible = withPuppy;
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
      const toScreenX = (sceneX: number) => size.w / 2 + (sceneX / (VIEW_HEIGHT * camera.aspect)) * size.w;

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
      /** Where the island character stands in the hero, in viewport pixels. */
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
      let propShow = 0;
      let charX = 0;
      let puppyLag = 0;
      let previousX = pos.x;

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
        sitting = false;
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
      }
      function startGesture(kind: Gesture["kind"], duration: number) {
        gesture = { kind, t: 0, duration };
        lastActivity = elapsed;
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
          say("Nice pick! 👍", 2600);
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
      const pointAt = new THREE.Vector2();
      function rectLook(element: Element, fromX: number, fromY: number) {
        const rect = element.getBoundingClientRect();
        const tx = clamp(rect.left + rect.width / 2, 0, window.innerWidth);
        const ty = clamp(rect.top + Math.min(rect.height / 2, 120), 0, window.innerHeight);
        return { dx: tx - fromX, dy: ty - fromY };
      }

      function pose(delta: number) {
        elapsed += delta;
        const follow = 1 - Math.exp(-delta * 10);
        const breathe = Math.sin(elapsed * 1.7);
        torso.scale.set(1 + breathe * 0.006, 1 + breathe * 0.01, 1);

        // Where he and the puppy stand inside the canvas: puppy on the inner side.
        const onRight = pos.x + size.w / 2 > window.innerWidth / 2;
        const targetCharX = withPuppy ? (onRight ? 0.3 : -0.3) : 0;
        charX += (targetCharX - charX) * (1 - Math.exp(-delta * 5));
        pivot.position.x = charX;
        charScreenX = toScreenX(charX);
        hit!.style.left = `${charScreenX - size.w * 0.11}px`;
        hit!.style.width = `${size.w * 0.22}px`;

        // Blink.
        const cycle = (elapsed + 0.4) % 3.9;
        const blink = Math.exp(-Math.pow((cycle - 3.5) / 0.06, 2));
        eyes.forEach(({ group }) => group.scale.set(1, Math.max(0.08, 1 - blink), 1));

        // ----- Travel arcs -----
        let spin = 0;
        let tiltZ = 0;
        let tiltX = 0;
        let armsUp = 0;
        let armsOut = 0;
        let tuck = 0;
        let jetOn = 0;
        let lookX = 0;
        let lookY = 0;
        let travelT = 0;
        if (travel) {
          travel.t = Math.min(1, travel.t + delta / travel.duration);
          travelT = travel.t;
          const to = anchor(travel.to);
          const t = travel.t;
          if (travel.mode === "jump") {
            const e = smooth(t);
            const height = 130 + Math.hypot(to.x - travel.from.x, to.y - travel.from.y) * 0.18;
            pos.x = travel.from.x + (to.x - travel.from.x) * e;
            pos.y = travel.from.y + (to.y - travel.from.y) * e - Math.sin(Math.PI * t) * height;
            spin = easeInOut(clamp((t - 0.1) / 0.8, 0, 1)) * Math.PI * 2;
            armsUp = Math.sin(Math.PI * clamp(t * 1.2, 0, 1));
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
            armsOut = flight * 0.85;
            tuck = -flight * 0.5;
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
        const vx = (pos.x - previousX) / Math.max(delta, 1e-3);
        previousX = pos.x;

        // ----- Sitting when the reader pauses -----
        const shouldSit = visible && active >= 0 && !travel && elapsed - lastActivity > 12;
        if (shouldSit && !sitting) {
          sitting = true;
          say("Take your time, I'll wait here 📱");
        } else if (!shouldSit && sitting) {
          sitting = false;
          hush();
        }
        sit += ((sitting ? 1 : 0) - sit) * (1 - Math.exp(-delta * 5));

        // ----- Gestures and wind -----
        let g = 0;
        if (gesture) {
          gesture.t += delta;
          g = envelope(gesture.t / gesture.duration);
          if (gesture.t >= gesture.duration) gesture = null;
        }
        if (windy > 0) windy = Math.max(0, windy - delta);
        const wind = smooth(clamp(windy / 0.3, 0, 1));

        // ----- Pointing at the section target -----
        let pointArm = 0;
        let pointAngle = 0;
        const shoulderX = pos.x + charScreenX;
        const shoulderY = pos.y + size.h * 0.37;
        const target = active >= 0 && !travel ? document.querySelector(STOPS[active].target) : null;
        if (target && sit < 0.5) {
          const { dx, dy } = rectLook(target, shoulderX, shoulderY);
          pointAt.set(dx, dy);
          pointArm = dx >= 0 ? 1 : -1;
          pointAngle = Math.atan2(dx, dy);
          pointAngle = pointArm === 1 ? clamp(pointAngle, 0.4, 2.9) : clamp(pointAngle, -2.9, -0.4);
          lookX = clamp(dx / (window.innerWidth * 0.4), -1, 1);
          lookY = clamp(-dy / (window.innerHeight * 0.5), -1, 1);
        }
        // Hovered cards win his attention for a moment.
        if (hoverElement && elapsed - hoverAt < 2.5 && !travel) {
          const { dx, dy } = rectLook(hoverElement, shoulderX, shoulderY - 30);
          lookX = clamp(dx / (window.innerWidth * 0.4), -1, 1);
          lookY = clamp(-dy / (window.innerHeight * 0.5), -1, 1);
        }
        if (sit > 0.5) {
          lookX = 0;
          lookY = -0.7;
        }

        // ----- Props -----
        const holdSide = pointArm !== 0 ? -pointArm : 1;
        const propName: PropName | null = sitting ? "phone" : active >= 0 && !travel ? STOPS[active].prop : null;
        const wantProp = propName && (!gesture || gesture.kind === "thumbs") && wind < 0.5 ? 1 : 0;
        propShow += (wantProp - propShow) * (1 - Math.exp(-delta * 9));
        handProps.forEach((set, side) => {
          (Object.keys(set.props) as PropName[]).forEach((name) => {
            const prop = set.props[name];
            prop.visible = name === propName && side === holdSide && propShow > 0.02;
            prop.scale.setScalar(Math.max(0.001, propShow));
          });
          const torchOn = night && side === pointArm && !travel && sit < 0.5 && !gesture;
          set.flashlight.visible = torchOn;
          set.beamMaterial.opacity = 0.18 + Math.sin(elapsed * 9) * 0.03;
        });
        // Night: spotlight the element he points at.
        const lit = night && pointArm !== 0 && !gesture ? target : null;
        if (lit !== litElement) {
          litElement?.classList.remove("guide-lit");
          lit?.classList.add("guide-lit");
          litElement = lit;
        }
        // Contact: little envelopes fly toward the button.
        if (active >= 0 && STOPS[active].prop === "envelope" && !travel && sit < 0.5 && target) {
          mailClock += delta;
          if (mailClock > 0.9) {
            mailClock = 0;
            const hx = pos.x + charScreenX + (holdSide === 1 ? 30 : -30);
            const hy = pos.y + size.h * 0.45;
            const { dx, dy } = rectLook(target, hx, hy);
            particle("mail", hx, hy, { dx: dx * 0.85, dy: dy * 0.85, duration: 1300 });
          }
        }

        // ----- Arms -----
        arms.forEach(({ shoulder, elbow, hand, side }) => {
          let z = side * 0.1;
          let x = Math.sin(elapsed * 1.7 + side) * 0.03;
          let ez = side * 0.06;
          let ex = -0.08;
          let handY = 0;
          let handZ = 0;
          if (side === pointArm) {
            z = pointAngle + Math.sin(elapsed * 3) * 0.05;
            x = -0.15;
            ez = 0;
            ex = 0;
          }
          if (side === holdSide && propShow > 0.05) {
            const lift = propName === "paper" ? 0.35 : 0;
            z = side * 0.22;
            x = -0.55 - lift;
            ez = 0;
            ex = -1.35 + lift * 0.4;
          }
          if (sit > 0.01 && side !== holdSide) {
            z = side * 0.35;
            x = -0.55;
            ex = -0.5;
          }
          if (gesture?.kind === "wave" && side === -1) {
            z = -0.1 - g * 2.45;
            x = 0;
            ez = -g * (0.45 + Math.sin(elapsed * 13) * 0.4);
            ex = 0;
            handY = g * -0.9;
          }
          if (gesture?.kind === "thumbs" && side === -holdSide) {
            z = side * (0.1 + g * 0.5);
            x = -g * 0.7;
            ex = -g * 1.75;
            handY = -side * g * 1.3;
            handZ = side * g * 0.5;
          }
          if (gesture?.kind === "cheer") {
            z = side * (0.1 + g * 2.6);
            ez = side * g * 0.25;
            ex = 0;
          }
          if (wind > 0) {
            z = z + (side * 2.6 - z) * wind;
            ez = ez + (side * 1.75 - ez) * wind;
            ex = ex * (1 - wind) - 0.3 * wind;
            x = x * (1 - wind);
          }
          z += side * armsUp * 2.4 + side * armsOut * 1.3;
          shoulder.rotation.z += (z - shoulder.rotation.z) * follow;
          shoulder.rotation.x += (x - shoulder.rotation.x) * follow;
          elbow.rotation.z += (ez - elbow.rotation.z) * follow;
          elbow.rotation.x += (ex - elbow.rotation.x) * follow;
          hand.rotation.y += (handY - hand.rotation.y) * follow;
          hand.rotation.z += (handZ - hand.rotation.z) * follow;
        });

        // ----- Legs: tuck on jumps, trail in flight, fold when sitting -----
        legs.forEach((hip, index) => {
          const side = index === 0 ? -1 : 1;
          hip.rotation.x = -tuck * 0.55 - sit * 1.45;
          hip.rotation.z = side * (0.02 + Math.abs(tuck) * 0.12 + sit * 0.12);
        });

        // ----- Head, eyes, expression -----
        // In flight he glances back over his shoulder at the reader.
        const glance = travel?.mode === "fly" ? clamp(-spin * 0.45, -0.9, 0.9) : 0;
        head.rotation.y += (lookX * 0.55 + glance - head.rotation.y) * follow;
        head.rotation.x += (-lookY * 0.3 - head.rotation.x) * follow;
        head.rotation.z = Math.sin(elapsed * 0.8) * 0.03 * (1 - sit);
        eyes.forEach(({ iris }) => {
          iris.position.x = lookX * 0.011;
          iris.position.y = lookY * 0.009;
        });
        const excited = Math.max(gesture ? g : 0, armsUp, armsOut, wind);
        brows.forEach((brow) => {
          brow.position.y = brow.userData.baseY + excited * 0.013;
        });
        mouth.smile.visible = excited < 0.35;
        mouth.open.scale.set(1, Math.max(0.001, excited), 1);
        torso.rotation.y = lookX * 0.15;

        // ----- Jetpack -----
        const jetScale = jetpack.scale.x + (jetOn - jetpack.scale.x) * (1 - Math.exp(-delta * 12));
        jetpack.scale.setScalar(Math.max(0.001, jetScale));
        jetpack.visible = jetScale > 0.02;
        flames.forEach((flame, index) => {
          flame.scale.set(1, 0.7 + Math.abs(Math.sin(elapsed * 30 + index * 2)) * 0.6, 1);
        });

        // ----- Body: spin, tilt, landing squash, hover bob, sitting -----
        if (landing > 0) landing = Math.max(0, landing - delta);
        const squash = Math.sin((landing / 0.35) * Math.PI) * 0.12;
        const cheerHop = gesture?.kind === "cheer" ? Math.abs(Math.sin(gesture.t * 7)) * 0.12 * g : 0;
        pivot.rotation.set(tiltX, spin, tiltZ);
        pivot.scale.set(1 + squash * 0.6, 1 - squash, 1 + squash * 0.6);
        pivot.position.y = 0.95 - sit * 0.42 + cheerHop + (travel ? 0 : Math.sin(elapsed * 2) * 0.015 * (1 - sit));

        // ----- Puppy: runs and hops alongside, sits when they land -----
        if (withPuppy) {
          const lagTarget = clamp(-vx * 0.0006, -0.35, 0.35);
          puppyLag += (lagTarget - puppyLag) * (1 - Math.exp(-delta * 6));
          puppy.position.x = -charX * 1.45 + puppyLag;
          puppy.rotation.y = 0.45 * Math.sign(charX || 1) + (travel ? -Math.sign(vx) * 0.6 : 0);
          let hop = 0;
          if (travel?.mode === "jump") hop = Math.sin(Math.PI * clamp((travelT - 0.12) / 0.88, 0, 1)) * 0.22;
          if (travel?.mode === "fly") hop = Math.sin(Math.PI * travelT) * 0.35 + Math.sin(elapsed * 10) * 0.02;
          const running = travel ? Math.abs(Math.sin(elapsed * 16)) * 0.05 : 0;
          puppy.position.y = hop + running + (gesture?.kind === "cheer" ? cheerHop : 0);
          puppyBody.rotation.x = travel ? -0.25 + Math.sin(elapsed * 16) * 0.12 : 0;
          puppyHead.rotation.y = lookX * 0.6 - 0.45 * Math.sign(charX || 1) * 0.5;
          puppyHead.rotation.x = -lookY * 0.25;
          puppyHead.rotation.z = Math.sin(elapsed * 0.9) * 0.1;
          tail.rotation.z = Math.sin(elapsed * (travel || gesture ? 24 : 11)) * 0.7;
          tongue.scale.y = 0.5 + Math.max(0, Math.sin(elapsed * 6)) * 0.25;
        }

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
              return { active, travel: travel?.mode ?? null, t: travel?.t, x: Math.round(pos.x), y: Math.round(pos.y), sitting, night, jet: jetpack.scale.x };
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
        {/* Only his body is clickable, so the canvas never blocks the page. */}
        <button ref={hitRef} type="button" className="guide-hit" tabIndex={-1} aria-hidden="true" />
      </div>
    </>
  );
}
