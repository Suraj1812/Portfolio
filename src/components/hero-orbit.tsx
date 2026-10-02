"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type * as Three from "three";
import { Pause, Play } from "lucide-react";

import "./hero-orbit.css";

export function HeroOrbit() {
  const stageRef = useRef<HTMLElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">(
    "loading",
  );
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const syncMotionRef = useRef<() => void>(() => {});

  useEffect(() => {
    pausedRef.current = paused;
    syncMotionRef.current();
  }, [paused]);

  useEffect(() => {
    const stage = stageRef.current;
    const canvasHost = canvasHostRef.current;
    if (!stage || !canvasHost) return;

    let disposed = false;
    let destroyScene = () => {};

    async function createScene() {
      try {
        const THREE = await import("three");
        if (disposed) return;

        const renderer = new THREE.WebGLRenderer({
          alpha: true,
          antialias: true,
          powerPreference: "low-power",
        });
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.domElement.setAttribute("aria-hidden", "true");
        renderer.domElement.className = "hero-orbit__canvas";
        canvasHost!.appendChild(renderer.domElement);

        const geometries = new Set<Three.BufferGeometry>();
        const materials = new Set<Three.Material>();
        const cleanupTasks: Array<() => void> = [];
        let frame = 0;
        let previousTime: number | undefined;
        let elapsed = 0;
        let contextLost = false;
        let inView = true;
        const motionQuery = window.matchMedia(
          "(prefers-reduced-motion: reduce)",
        );
        let reducedMotion = motionQuery.matches;

        destroyScene = () => {
          syncMotionRef.current = () => {};
          cancelAnimationFrame(frame);
          cleanupTasks.forEach((cleanup) => cleanup());
          geometries.forEach((geometry) => geometry.dispose());
          materials.forEach((material) => material.dispose());
          renderer.dispose();
          renderer.forceContextLoss();
          renderer.domElement.remove();
        };

        const geometry = <T extends Three.BufferGeometry>(value: T): T => {
          geometries.add(value);
          return value;
        };
        const material = <T extends Three.Material>(value: T): T => {
          materials.add(value);
          return value;
        };
        const neonMaterial = (color: number) =>
          material(
            new THREE.MeshStandardMaterial({
              color,
              emissive: color,
              emissiveIntensity: 0.08,
              roughness: 0.28,
              metalness: 0.12,
              flatShading: true,
            }),
          );
        const blackLines = material(
          new THREE.LineBasicMaterial({ color: 0x101017 }),
        );
        const blackShell = material(
          new THREE.MeshBasicMaterial({
            color: 0x101017,
            side: THREE.BackSide,
          }),
        );

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 40);
        camera.position.set(0, 0.35, 9.6);
        const system = new THREE.Group();
        system.rotation.set(0.16, -0.24, -0.1);
        scene.add(system);

        scene.add(new THREE.HemisphereLight(0xffffff, 0x4761dd, 2.8));
        const keyLight = new THREE.DirectionalLight(0xffffff, 4);
        keyLight.position.set(-3, 5, 5);
        scene.add(keyLight);
        const rimLight = new THREE.PointLight(0x37e5ff, 24, 20);
        rimLight.position.set(4, 1, 2);
        scene.add(rimLight);
        const pinkLight = new THREE.PointLight(0xff70ce, 8, 16);
        pinkLight.position.set(-4, -1, 0);
        scene.add(pinkLight);

        const coreGeometry = geometry(new THREE.IcosahedronGeometry(1.12, 1));
        const core = new THREE.Mesh(coreGeometry, neonMaterial(0xff62be));
        const coreOutline = new THREE.Mesh(coreGeometry, blackShell);
        coreOutline.scale.setScalar(1.025);
        const coreWire = new THREE.LineSegments(
          geometry(new THREE.WireframeGeometry(coreGeometry)),
          blackLines,
        );
        coreWire.scale.setScalar(1.006);
        const nucleus = new THREE.Group();
        nucleus.add(core, coreOutline, coreWire);
        nucleus.rotation.set(0.12, 0.28, 0.08);
        system.add(nucleus);

        const satellites: Array<{
          pivot: Three.Group;
          speed: number;
          offset: number;
        }> = [];
        const rings = [
          {
            color: 0x37e5ff,
            radius: 1.65,
            thickness: 0.072,
            rotation: [1.14, 0.2, -0.3],
            speed: 0.16,
          },
          {
            color: 0xffdd42,
            radius: 2.1,
            thickness: 0.061,
            rotation: [0.48, 0.82, 0.54],
            speed: -0.12,
          },
          {
            color: 0xc9ff62,
            radius: 2.56,
            thickness: 0.036,
            rotation: [0.92, -0.54, -0.85],
            speed: 0.09,
          },
        ];

        rings.forEach((ring, index) => {
          const orbit = new THREE.Group();
          orbit.rotation.set(
            ring.rotation[0],
            ring.rotation[1],
            ring.rotation[2],
          );
          const ringGeometry = geometry(
            new THREE.TorusGeometry(ring.radius, ring.thickness, 10, 100),
          );
          const band = new THREE.Mesh(ringGeometry, neonMaterial(ring.color));
          const bandOutline = new THREE.Mesh(ringGeometry, blackShell);
          bandOutline.scale.setScalar(1.013);
          orbit.add(bandOutline, band);
          system.add(orbit);

          const pivot = new THREE.Group();
          orbit.add(pivot);
          const satelliteGeometry = geometry(
            index === 1
              ? new THREE.OctahedronGeometry(0.29, 0)
              : new THREE.BoxGeometry(0.36, 0.36, 0.36),
          );
          const satellite = new THREE.Mesh(
            satelliteGeometry,
            neonMaterial(ring.color),
          );
          satellite.position.x = ring.radius;
          satellite.rotation.set(0.4, 0.45, 0.3);
          const edges = new THREE.LineSegments(
            geometry(new THREE.EdgesGeometry(satelliteGeometry)),
            blackLines,
          );
          satellite.add(edges);
          pivot.add(satellite);

          const nodeGeometry = geometry(new THREE.IcosahedronGeometry(0.12, 0));
          const node = new THREE.Mesh(nodeGeometry, neonMaterial(ring.color));
          node.position.set(-ring.radius * 0.8, ring.radius * 0.6, 0);
          pivot.add(node);
          satellites.push({
            pivot,
            speed: ring.speed,
            offset: index * 1.8 + 0.3,
          });
        });

        const floatingShapes: Array<{
          mesh: Three.Group;
          origin: Three.Vector3;
          offset: number;
        }> = [];
        [
          { color: 0x6480ff, position: [-2.38, 1.65, -0.7], size: 0.22 },
          { color: 0xffdd42, position: [2.24, -1.44, 0.6], size: 0.17 },
          { color: 0xff62be, position: [1.78, 1.8, -0.45], size: 0.13 },
        ].forEach((shape, index) => {
          const shapeGeometry = geometry(
            new THREE.BoxGeometry(shape.size, shape.size, shape.size),
          );
          const mesh = new THREE.Group();
          mesh.add(
            new THREE.Mesh(shapeGeometry, neonMaterial(shape.color)),
            new THREE.LineSegments(
              geometry(new THREE.EdgesGeometry(shapeGeometry)),
              blackLines,
            ),
          );
          mesh.position.set(
            shape.position[0],
            shape.position[1],
            shape.position[2],
          );
          system.add(mesh);
          floatingShapes.push({
            mesh,
            origin: mesh.position.clone(),
            offset: index * 2.2,
          });
        });

        const pointer = { x: 0, y: 0 };
        function render() {
          if (!disposed && !contextLost) renderer.render(scene, camera);
        }
        function tick(time: number) {
          frame = 0;
          if (
            disposed ||
            contextLost ||
            reducedMotion ||
            pausedRef.current ||
            !inView ||
            document.hidden
          )
            return;
          const delta =
            previousTime === undefined
              ? 0
              : Math.min((time - previousTime) / 1000, 0.05);
          previousTime = time;
          elapsed += delta;

          system.rotation.x = THREE.MathUtils.lerp(
            system.rotation.x,
            0.16 + pointer.y * 0.2,
            0.055,
          );
          system.rotation.y = THREE.MathUtils.lerp(
            system.rotation.y,
            -0.24 + pointer.x * 0.26 + Math.sin(elapsed * 0.12) * 0.22,
            0.055,
          );
          system.position.y = Math.sin(elapsed * 0.7) * 0.07;
          nucleus.rotation.y = 0.28 + elapsed * 0.13;
          nucleus.rotation.z = 0.08 + Math.sin(elapsed * 0.35) * 0.1;
          satellites.forEach(({ pivot, speed, offset }) => {
            pivot.rotation.z = offset + elapsed * speed;
          });
          floatingShapes.forEach(({ mesh, origin, offset }) => {
            mesh.position.y = origin.y + Math.sin(elapsed * 0.7 + offset) * 0.1;
            mesh.rotation.set(elapsed * 0.14 + offset, elapsed * 0.22, offset);
          });
          camera.position.x = THREE.MathUtils.lerp(
            camera.position.x,
            pointer.x * 0.3,
            0.045,
          );
          camera.position.y = THREE.MathUtils.lerp(
            camera.position.y,
            0.35 - pointer.y * 0.2,
            0.045,
          );
          camera.lookAt(0, 0, 0);
          render();
          frame = requestAnimationFrame(tick);
        }
        function syncAnimation() {
          if (disposed || contextLost) return;
          stage!.dataset.motion =
            reducedMotion || pausedRef.current || !inView || document.hidden
              ? "paused"
              : "running";
          if (
            reducedMotion ||
            pausedRef.current ||
            !inView ||
            document.hidden
          ) {
            cancelAnimationFrame(frame);
            frame = 0;
            previousTime = undefined;
            if (inView && !document.hidden) render();
          } else if (!frame) {
            previousTime = undefined;
            frame = requestAnimationFrame(tick);
          }
        }
        syncMotionRef.current = syncAnimation;
        function resize() {
          if (disposed) return;
          const width = Math.max(1, stage!.clientWidth);
          const height = Math.max(1, stage!.clientHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.position.z = width < 440 ? 11 : 9.6;
          camera.updateProjectionMatrix();
          camera.lookAt(0, 0, 0);
          render();
        }
        function movePointer(event: PointerEvent) {
          if (
            reducedMotion ||
            pausedRef.current ||
            event.pointerType === "touch"
          )
            return;
          const bounds = stage!.getBoundingClientRect();
          pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
          pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
        }
        function resetPointer() {
          pointer.x = 0;
          pointer.y = 0;
        }
        function updateMotion() {
          reducedMotion = motionQuery.matches;
          resetPointer();
          syncAnimation();
        }
        function loseContext(event: Event) {
          event.preventDefault();
          contextLost = true;
          stage!.dataset.motion = "paused";
          cancelAnimationFrame(frame);
          frame = 0;
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
        cleanupTasks.push(() => resizeObserver.disconnect());
        const intersectionObserver = new IntersectionObserver(
          ([entry]) => {
            inView = entry.isIntersecting;
            syncAnimation();
          },
          { threshold: 0.01 },
        );
        intersectionObserver.observe(stage!);
        cleanupTasks.push(() => intersectionObserver.disconnect());
        stage!.addEventListener("pointermove", movePointer, { passive: true });
        stage!.addEventListener("pointerleave", resetPointer);
        motionQuery.addEventListener("change", updateMotion);
        document.addEventListener("visibilitychange", syncAnimation);
        renderer.domElement.addEventListener("webglcontextlost", loseContext);
        renderer.domElement.addEventListener(
          "webglcontextrestored",
          restoreContext,
        );
        cleanupTasks.push(() => {
          stage!.removeEventListener("pointermove", movePointer);
          stage!.removeEventListener("pointerleave", resetPointer);
          motionQuery.removeEventListener("change", updateMotion);
          document.removeEventListener("visibilitychange", syncAnimation);
          renderer.domElement.removeEventListener(
            "webglcontextlost",
            loseContext,
          );
          renderer.domElement.removeEventListener(
            "webglcontextrestored",
            restoreContext,
          );
        });

        satellites.forEach(({ pivot, offset }) => {
          pivot.rotation.z = offset;
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
    return () => {
      disposed = true;
      destroyScene();
    };
  }, []);

  return (
    <figure ref={stageRef} className={`hero-orbit hero-orbit--${status}`}>
      <div className="hero-orbit__shadow" aria-hidden="true" />
      <div className="hero-orbit__fallback" aria-hidden="true">
        <span className="hero-orbit__fallback-ring hero-orbit__fallback-ring--one" />
        <span className="hero-orbit__fallback-ring hero-orbit__fallback-ring--two" />
        <span className="hero-orbit__fallback-core" />
      </div>
      <div ref={canvasHostRef} className="hero-orbit__canvas-host" />
      {status === "ready" && (
        <button
          type="button"
          className="hero-orbit__control"
          onClick={() => setPaused((value) => !value)}
          aria-label={paused ? "Play 3D animation" : "Pause 3D animation"}
          title={paused ? "Play 3D animation" : "Pause 3D animation"}
        >
          {paused ? (
            <Play size={16} aria-hidden="true" />
          ) : (
            <Pause size={16} aria-hidden="true" />
          )}
        </button>
      )}
      <span
        className="hero-orbit__cross hero-orbit__cross--top"
        aria-hidden="true"
      >
        +
      </span>
      <span
        className="hero-orbit__cross hero-orbit__cross--bottom"
        aria-hidden="true"
      >
        +
      </span>
      <ul
        className="hero-orbit__labels"
        aria-label="Connected engineering skills"
      >
        <li className="hero-orbit__label hero-orbit__label--llm">
          <Image src="/artwork/ai-robot.png" alt="" width={30} height={30} />{" "}
          LLM
        </li>
        <li className="hero-orbit__label hero-orbit__label--api">
          <Image src="/artwork/api-network.png" alt="" width={30} height={30} />{" "}
          APIs
        </li>
        <li className="hero-orbit__label hero-orbit__label--react">
          <Image
            src="/technology-icons/react.svg"
            alt=""
            width={28}
            height={28}
          />{" "}
          React
        </li>
        <li className="hero-orbit__label hero-orbit__label--data">
          <Image
            src="/artwork/backend-database.png"
            alt=""
            width={30}
            height={30}
          />{" "}
          Data
        </li>
      </ul>
      <div className="hero-orbit__caption" aria-hidden="true">
        <span className="hero-orbit__signal" />
        <span>
          {status === "fallback"
            ? "Ideas, connected"
            : paused
              ? "Motion paused"
              : "Ideas in motion"}
        </span>
      </div>
      <figcaption className="hero-orbit__description">
        A faceted pink sphere with colorful orbital rings connects LLMs, APIs,
        React, and data.
        {status === "ready"
          ? " Pointer motion adds gentle parallax when animations are enabled."
          : " A static illustration is available while the 3D scene loads or when WebGL is unavailable."}
      </figcaption>
    </figure>
  );
}
