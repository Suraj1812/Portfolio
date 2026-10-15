"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { avatarFragmentShader, avatarVertexShader } from "@/components/avatar-shaders";
import "./hero-orbit.css";

export function HeroOrbit() {
  const stageRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");
  useEffect(() => {
    const stage = stageRef.current;
    const host = canvasHostRef.current;
    if (!stage || !host) return;
    let disposed = false;
    let destroyScene = () => {};

    async function createScene() {
      try {
        const THREE = await import("three");
        if (disposed) return;
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "low-power" });
        renderer.setClearColor(0, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.className = "hero-orbit__canvas";
        renderer.domElement.setAttribute("aria-hidden", "true");
        host!.appendChild(renderer.domElement);
        let frame = 0;
        let previousTime: number | undefined;
        let elapsed = 0;
        let visible = true;
        let contextLost = false;
        const cleanups: Array<() => void> = [];
        const query = window.matchMedia("(prefers-reduced-motion: reduce)");
        const textureLoader = new THREE.TextureLoader();
        const resources: Array<{ dispose: () => void }> = [];

        destroyScene = () => {
          cancelAnimationFrame(frame);
          cleanups.forEach((cleanup) => cleanup());
          resources.forEach((resource) => resource.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        };

        const loadedTexture = await textureLoader.loadAsync("/artwork/suraj-avatar-neutral.png");
        if (disposed) {
          loadedTexture.dispose();
          return;
        }
        const texture = loadedTexture;
        resources.push(texture);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(4, renderer.capabilities.getMaxAnisotropy());
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-2, 2, 3, -3, 0.1, 20);
        camera.position.z = 8;
        const imageSize = new THREE.Vector2(4, 6);
        const uniforms = {
          uMap: { value: texture },
          uTime: { value: 0 },
          uGaze: { value: new THREE.Vector2() },
          uBlink: { value: 0 },
        };
        const geometry = new THREE.PlaneGeometry(imageSize.x, imageSize.y, 80, 120);
        const material = new THREE.ShaderMaterial({
          uniforms,
          vertexShader: avatarVertexShader,
          fragmentShader: avatarFragmentShader,
          transparent: true,
          depthWrite: false,
          toneMapped: false,
        });
        resources.push(geometry, material);
        const character = new THREE.Mesh(geometry, material);
        scene.add(character);
        const pointer = new THREE.Vector2();
        let pointerPosition: { x: number; y: number } | undefined;
        let pointerDirty = false;

        function updateGaze() {
          if (!pointerDirty || !pointerPosition) return;
          pointerDirty = false;
          const bounds = stage!.getBoundingClientRect();
          const faceX = bounds.left + bounds.width * 0.49;
          const faceY = bounds.top + bounds.height * 0.125;
          pointer.set((pointerPosition.x - faceX) / (window.innerWidth * 0.6),
            (faceY - pointerPosition.y) / (window.innerHeight * 0.65));
          pointer.clampScalar(-1, 1);
        }

        function render() {
          if (!disposed && !contextLost) renderer.render(scene, camera);
        }
        function tick(time: number) {
          frame = 0;
          if (disposed || contextLost || query.matches || !visible || document.hidden) return;
          const delta = previousTime === undefined ? 0 : Math.min((time - previousTime) / 1000, 0.05);
          elapsed += delta;
          previousTime = time;
          updateGaze();
          uniforms.uTime.value = elapsed;
          uniforms.uGaze.value.lerp(pointer, 1 - Math.exp(-delta * 9));
          const blinkPhase = (elapsed + 1.4) % 5.2;
          // A quick close and a slightly slower reopen, with both eyes in sync.
          const blinkPulse = (center: number) => {
            const distance = blinkPhase - center;
            return Math.exp(-Math.pow(distance / (distance < 0 ? 0.065 : 0.11), 2));
          };
          const blink = blinkPulse(3.7);
          const secondBlink = Math.floor((elapsed + 1.4) / 5.2) % 3 === 1
            ? blinkPulse(4.02) : 0;
          uniforms.uBlink.value = Math.max(blink, secondBlink);
          render();
          frame = requestAnimationFrame(tick);
        }
        function syncAnimation() {
          if (disposed || contextLost) return;
          const stop = query.matches || !visible || document.hidden;
          stage!.dataset.motion = stop ? "paused" : "running";
          if (stop) {
            cancelAnimationFrame(frame);
            frame = 0;
            previousTime = undefined;
            // Hold an open-eyed expression when automatic motion is suspended.
            uniforms.uBlink.value = 0;
            if (query.matches) {
              uniforms.uTime.value = 0;
              uniforms.uGaze.value.set(0, 0);
            }
            if (visible && !document.hidden) render();
          } else if (!frame) {
            previousTime = undefined;
            frame = requestAnimationFrame(tick);
          }
        }
        function resize() {
          if (disposed) return;
          pointerDirty = true;
          const width = Math.max(1, stage!.clientWidth);
          const height = Math.max(1, stage!.clientHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
          renderer.setSize(width, height, false);
          // Keep the whole figure in view on narrow screens.
          const halfHeight = Math.max(3, 1.25 / (width / height));
          camera.top = halfHeight;
          camera.bottom = -halfHeight;
          camera.left = -halfHeight * width / height;
          camera.right = halfHeight * width / height;
          camera.updateProjectionMatrix();
          render();
        }
        function movePointer(event: PointerEvent) {
          if (query.matches || event.pointerType === "touch") return;
          pointerPosition = { x: event.clientX, y: event.clientY };
          pointerDirty = true;
        }
        function scrollPointer() { pointerDirty = true; }
        function resetPointer() {
          pointerPosition = undefined;
          pointerDirty = false;
          pointer.set(0, 0);
        }
        function updateMotion() { resetPointer(); syncAnimation(); }
        function loseContext(event: Event) {
          event.preventDefault();
          contextLost = true;
          cancelAnimationFrame(frame);
          frame = 0;
          stage!.dataset.motion = "paused";
          if (!disposed) setStatus("fallback");
        }
        function restoreContext() {
          contextLost = false;
          resize();
          if (!disposed) setStatus("ready");
          syncAnimation();
        }
        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(stage!);
        const observer = new IntersectionObserver(([entry]) => {
          visible = entry.isIntersecting;
          syncAnimation();
        }, { threshold: 0.01 });
        observer.observe(stage!);
        window.addEventListener("pointermove", movePointer, { passive: true });
        window.addEventListener("scroll", scrollPointer, { passive: true });
        document.documentElement.addEventListener("pointerleave", resetPointer);
        window.addEventListener("blur", resetPointer);
        query.addEventListener("change", updateMotion);
        document.addEventListener("visibilitychange", syncAnimation);
        renderer.domElement.addEventListener("webglcontextlost", loseContext);
        renderer.domElement.addEventListener("webglcontextrestored", restoreContext);
        cleanups.push(() => {
          resizeObserver.disconnect();
          observer.disconnect();
          window.removeEventListener("pointermove", movePointer);
          window.removeEventListener("scroll", scrollPointer);
          document.documentElement.removeEventListener("pointerleave", resetPointer);
          window.removeEventListener("blur", resetPointer);
          query.removeEventListener("change", updateMotion);
          document.removeEventListener("visibilitychange", syncAnimation);
          renderer.domElement.removeEventListener("webglcontextlost", loseContext);
          renderer.domElement.removeEventListener("webglcontextrestored", restoreContext);
        });
        resize();
        setStatus("ready");
        syncAnimation();
      } catch {
        destroyScene();
        destroyScene = () => {};
        if (!disposed) setStatus("fallback");
      }
    }
    void createScene();
    return () => { disposed = true; destroyScene(); };
  }, []);

  return (
    <figure ref={stageRef} className={`hero-orbit hero-orbit--${status}`}>
      <div className="hero-orbit__shadow" aria-hidden="true" />
      <div className="hero-orbit__fallback" aria-hidden="true">
        <Image src="/artwork/suraj-avatar-neutral.png" alt="" width={400} height={600}
          priority unoptimized className="hero-orbit__fallback-avatar" />
      </div>
      <div ref={canvasHostRef} className="hero-orbit__canvas-host" />
      <figcaption className="hero-orbit__description">
        Suraj Singh&apos;s full-body cartoon portrait in a navy suit, standing naturally with
        breathing motion, blinking eyes, and a gaze that follows the cursor.
      </figcaption>
    </figure>
  );
}
