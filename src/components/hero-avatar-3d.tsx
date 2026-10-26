"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type * as ThreeTypes from "three";

import { ToyAvatar } from "@/components/hero-toy-avatar";
import "./hero-orbit.css";

/**
 * Real 3D avatar for the hero.
 *
 * Drop files into /public/models:
 *   suraj.glb   (required) a rigged character, e.g. exported from Avaturn
 *   idle.fbx    (optional) Mixamo "Breathing Idle", downloaded "Without Skin"
 *   wave.fbx    (optional) Mixamo "Waving", downloaded "Without Skin"
 * Animations embedded in suraj.glb are used too (names containing idle / wave).
 * Until suraj.glb exists, the hero shows the coded 3D island scene.
 */
const MODEL_URL = "/models/suraj.glb";
const IDLE_URL = "/models/idle.fbx";
const WAVE_URL = "/models/wave.fbx";

export function HeroAvatar() {
  const [mode, setMode] = useState<"checking" | "3d" | "2d">("checking");

  useEffect(() => {
    let cancelled = false;
    fetch(MODEL_URL, { method: "HEAD" })
      .then((response) => {
        if (!cancelled) setMode(response.ok ? "3d" : "2d");
      })
      .catch(() => {
        if (!cancelled) setMode("2d");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // A real model file wins; otherwise the coded 3D island scene.
  if (mode === "3d") return <Avatar3D onFail={() => setMode("2d")} />;
  return <ToyAvatar />;
}

/** Normalizes rig bone names so Mixamo, Avaturn and similar rigs line up. */
function boneKey(name: string) {
  return name.toLowerCase().replace(/^mixamorig[:_]?/, "").replace(/[^a-z0-9]/g, "");
}

function findBone(root: ThreeTypes.Object3D, patterns: RegExp[], avoid = /end|top|nub/) {
  let found: ThreeTypes.Object3D | undefined;
  root.traverse((node) => {
    if (found || !(node as ThreeTypes.Bone).isBone) return;
    const key = boneKey(node.name);
    if (!avoid.test(key) && patterns.some((pattern) => pattern.test(key))) found = node;
  });
  return found;
}

function Avatar3D({ onFail }: { onFail: () => void }) {
  const stageRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const failRef = useRef(onFail);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    failRef.current = onFail;
  }, [onFail]);

  useEffect(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host) return;
    let disposed = false;
    let destroy = () => {};

    async function build() {
      const THREE = await import("three");
      const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader.js");
      const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
      const { MeshoptDecoder } = await import("three/examples/jsm/libs/meshopt_decoder.module.js");
      if (disposed) return;

      const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.05;
      renderer.domElement.className = "hero-orbit__canvas hero-avatar3d__canvas";
      renderer.domElement.setAttribute("aria-hidden", "true");
      host!.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const pmrem = new THREE.PMREMGenerator(renderer);
      const envTexture = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      scene.environment = envTexture;

      // Studio-style lighting: warm key, cyan rim to match the sun disc, soft fill.
      const key = new THREE.DirectionalLight(0xfff1dc, 2.2);
      key.position.set(-2.5, 4, 4);
      const rim = new THREE.DirectionalLight(0x63e6ff, 2.4);
      rim.position.set(3, 3, -3);
      const fill = new THREE.HemisphereLight(0xffffff, 0x334155, 0.6);
      scene.add(key, rim, fill);

      const camera = new THREE.PerspectiveCamera(26, 1, 0.05, 100);
      const disposables: Array<{ dispose: () => void }> = [renderer, pmrem, envTexture];

      // ---------- Load model ----------
      // Meshopt lets an optimized (much smaller) model file load too.
      const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
      let gltf: Awaited<ReturnType<typeof loader.loadAsync>>;
      try {
        gltf = await loader.loadAsync(MODEL_URL);
      } catch {
        renderer.dispose();
        renderer.domElement.remove();
        if (!disposed) failRef.current();
        return;
      }
      if (disposed) {
        renderer.dispose();
        return;
      }

      const model = gltf.scene;
      model.traverse((node) => {
        const mesh = node as ThreeTypes.Mesh;
        if (mesh.isMesh) {
          mesh.frustumCulled = false;
          disposables.push(mesh.geometry);
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => disposables.push(material));
        }
      });

      // Normalize: feet on the ground, centered, 1.8 units tall.
      const box = new THREE.Box3().setFromObject(model);
      const size = box.getSize(new THREE.Vector3());
      const scale = 1.8 / Math.max(size.y, 0.001);
      model.scale.setScalar(scale);
      box.setFromObject(model);
      const center = box.getCenter(new THREE.Vector3());
      model.position.x -= center.x;
      model.position.z -= center.z;
      model.position.y -= box.min.y;

      const rig = new THREE.Group();
      rig.add(model);
      scene.add(rig);

      // Soft contact shadow under the feet.
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 128;
      const shadowContext = shadowCanvas.getContext("2d")!;
      const gradient = shadowContext.createRadialGradient(64, 64, 4, 64, 64, 64);
      gradient.addColorStop(0, "rgba(17,17,17,0.45)");
      gradient.addColorStop(1, "rgba(17,17,17,0)");
      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 128, 128);
      const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.3, 0.55),
        new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.002;
      scene.add(shadow);
      disposables.push(shadowTexture, shadow.geometry, shadow.material as ThreeTypes.Material);

      // ---------- Animations ----------
      const mixer = new THREE.AnimationMixer(model);
      const modelBones = new Map<string, string>();
      model.traverse((node) => {
        if ((node as ThreeTypes.Bone).isBone) modelBones.set(boneKey(node.name), node.name);
      });

      /** Keeps rotation tracks only and renames them to this model's bones. */
      function retarget(clip: ThreeTypes.AnimationClip) {
        const tracks = clip.tracks.flatMap((track) => {
          const dot = track.name.lastIndexOf(".");
          const node = track.name.slice(0, dot);
          const property = track.name.slice(dot + 1);
          if (property !== "quaternion") return [];
          const target = modelBones.get(boneKey(node.split("/").pop() ?? node));
          if (!target) return [];
          const copy = track.clone();
          copy.name = `${target}.${property}`;
          return [copy];
        });
        return new THREE.AnimationClip(clip.name, clip.duration, tracks);
      }

      async function loadFbxClip(url: string) {
        try {
          const head = await fetch(url, { method: "HEAD" });
          if (!head.ok) return undefined;
          const { FBXLoader } = await import("three/examples/jsm/loaders/FBXLoader.js");
          const fbx = await new FBXLoader().loadAsync(url);
          return fbx.animations[0] ? retarget(fbx.animations[0]) : undefined;
        } catch {
          return undefined;
        }
      }

      const embedded = gltf.animations.map(retarget);
      const idleClip =
        embedded.find((clip) => /idle|breath|stand/i.test(clip.name)) ??
        (await loadFbxClip(IDLE_URL)) ??
        embedded.find((clip) => !/wave|greet|hello/i.test(clip.name));
      const waveClip =
        embedded.find((clip) => /wave|greet|hello/i.test(clip.name)) ?? (await loadFbxClip(WAVE_URL));
      if (disposed) return;

      const idleAction = idleClip ? mixer.clipAction(idleClip).play() : undefined;
      const waveAction = waveClip ? mixer.clipAction(waveClip) : undefined;
      if (waveAction) {
        waveAction.setLoop(THREE.LoopOnce, 1);
        waveAction.clampWhenFinished = false;
      }
      mixer.addEventListener("finished", (event) => {
        if (event.action === waveAction && idleAction) {
          idleAction.reset().fadeIn(0.35).play();
          waveAction?.fadeOut(0.35);
        }
      });

      // ---------- Bones for look-at ----------
      const head = findBone(model, [/^head$/, /head$/]);
      const neck = findBone(model, [/^neck$/, /neck/]);
      const chest = findBone(model, [/^spine2$/, /^chest$/, /^upperchest$/, /^spine1$/]);
      const lookBones = [
        { bone: head, weight: 0.55 },
        { bone: neck, weight: 0.3 },
        { bone: chest, weight: 0.15 },
      ].filter((entry): entry is { bone: ThreeTypes.Object3D; weight: number } => Boolean(entry.bone));
      const restPose = new Map(lookBones.map(({ bone }) => [bone, bone.quaternion.clone()]));

      const parentWorld = new THREE.Quaternion();
      const parentInverse = new THREE.Quaternion();
      const turn = new THREE.Quaternion();
      const euler = new THREE.Euler(0, 0, 0, "YXZ");
      /** Rotates a bone in world space, independent of the rig's local axes. */
      function addWorldRotation(bone: ThreeTypes.Object3D, yaw: number, pitch: number) {
        bone.parent?.getWorldQuaternion(parentWorld);
        parentInverse.copy(parentWorld).invert();
        euler.set(pitch, yaw, 0);
        turn.setFromEuler(euler);
        bone.quaternion.premultiply(parentWorld).premultiply(turn).premultiply(parentInverse);
      }

      // ---------- Camera framing ----------
      const target = new THREE.Vector3(0, 0.98, 0);
      function frame() {
        const width = Math.max(1, stage!.clientWidth);
        const height = Math.max(1, stage!.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const fit = 2.05 / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)));
        camera.position.set(0, 1.0, fit * Math.max(1, 0.62 / camera.aspect) + 0.4);
        camera.lookAt(target);
        camera.updateProjectionMatrix();
      }

      // ---------- Interaction ----------
      const gaze = new THREE.Vector2();
      const gazeTarget = new THREE.Vector2();
      let dragYaw = 0;
      let dragVelocity = 0;
      let dragging = false;
      let dragMoved = 0;
      let lastX = 0;
      let hopTime = -1;

      function onPointerMove(event: PointerEvent) {
        if (reducedQuery.matches) return;
        const bounds = stage!.getBoundingClientRect();
        const faceX = bounds.left + bounds.width / 2;
        const faceY = bounds.top + bounds.height * 0.18;
        gazeTarget.set(
          THREE.MathUtils.clamp((event.clientX - faceX) / (window.innerWidth * 0.5), -1, 1),
          THREE.MathUtils.clamp((faceY - event.clientY) / (window.innerHeight * 0.6), -1, 1),
        );
        if (dragging) {
          const dx = event.clientX - lastX;
          lastX = event.clientX;
          dragMoved += Math.abs(dx);
          dragVelocity = dx * 0.012;
          dragYaw += dragVelocity;
        }
      }
      function onPointerDown(event: PointerEvent) {
        dragging = true;
        dragMoved = 0;
        lastX = event.clientX;
        renderer.domElement.setPointerCapture(event.pointerId);
      }
      function onPointerUp(event: PointerEvent) {
        if (!dragging) return;
        dragging = false;
        renderer.domElement.releasePointerCapture(event.pointerId);
        if (dragMoved < 6) react();
      }
      function react() {
        if (reducedQuery.matches) return;
        if (waveAction) {
          idleAction?.fadeOut(0.3);
          waveAction.reset().fadeIn(0.3).play();
        } else {
          hopTime = 0;
        }
      }
      function resetGaze() {
        gazeTarget.set(0, 0);
      }

      // ---------- Loop ----------
      const clock = new THREE.Clock();
      let rafId = 0;
      let visible = true;
      let elapsed = 0;
      let intro = 0;

      function render() {
        renderer.render(scene, camera);
      }
      function tick() {
        rafId = 0;
        if (disposed || !visible || document.hidden) return;
        const delta = Math.min(clock.getDelta(), 0.05);
        elapsed += delta;
        intro = Math.min(1, intro + delta / 0.9);

        mixer.update(delta);
        if (!idleAction && !waveAction?.isRunning()) {
          lookBones.forEach(({ bone }) => bone.quaternion.copy(restPose.get(bone)!));
        }

        // Smoothly follow the cursor, then spread the turn over head, neck and chest.
        gaze.lerp(gazeTarget, 1 - Math.exp(-delta * 6));
        lookBones.forEach(({ bone, weight }) => {
          addWorldRotation(bone, gaze.x * 0.9 * weight, -gaze.y * 0.5 * weight);
        });

        // Drag spin with inertia that springs back to facing forward.
        if (!dragging) {
          dragYaw += dragVelocity;
          dragVelocity *= 0.92;
          dragYaw *= 0.94;
        }
        const idleSway = idleAction ? 0 : Math.sin(elapsed * 0.9) * 0.04;
        rig.rotation.y = dragYaw + gaze.x * 0.25 + idleSway;

        // Entrance pop and click hop (when the model has no wave animation).
        const ease = 1 - Math.pow(1 - intro, 3);
        let lift = 0;
        let spin = 0;
        if (hopTime >= 0) {
          hopTime += delta;
          const t = Math.min(1, hopTime / 0.9);
          lift = Math.sin(t * Math.PI) * 0.18;
          spin = t * Math.PI * 2;
          if (t >= 1) hopTime = -1;
        }
        const breathe = idleAction ? 0 : Math.sin(elapsed * 1.6) * 0.004;
        rig.position.y = (1 - ease) * -0.25 + lift + breathe;
        rig.rotation.y += spin;
        rig.scale.setScalar(0.92 + ease * 0.08);
        shadow.scale.setScalar(1 - lift * 1.6);

        render();
        rafId = requestAnimationFrame(tick);
      }
      function sync() {
        if (disposed) return;
        const shouldRun = visible && !document.hidden && !reducedQuery.matches;
        if (shouldRun && !rafId) {
          clock.getDelta();
          rafId = requestAnimationFrame(tick);
        } else if (!shouldRun) {
          cancelAnimationFrame(rafId);
          rafId = 0;
          if (reducedQuery.matches) {
            intro = 1;
            rig.position.y = 0;
            rig.scale.setScalar(1);
            mixer.update(0);
            render();
          }
        }
      }

      const resizeObserver = new ResizeObserver(() => {
        frame();
        render();
      });
      resizeObserver.observe(stage!);
      const visibility = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        sync();
      });
      visibility.observe(stage!);

      window.addEventListener("pointermove", onPointerMove, { passive: true });
      window.addEventListener("blur", resetGaze);
      document.documentElement.addEventListener("pointerleave", resetGaze);
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("pointercancel", onPointerUp);
      document.addEventListener("visibilitychange", sync);
      reducedQuery.addEventListener("change", sync);

      destroy = () => {
        cancelAnimationFrame(rafId);
        resizeObserver.disconnect();
        visibility.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("blur", resetGaze);
        document.documentElement.removeEventListener("pointerleave", resetGaze);
        document.removeEventListener("visibilitychange", sync);
        reducedQuery.removeEventListener("change", sync);
        mixer.stopAllAction();
        disposables.forEach((item) => item.dispose());
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };

      frame();
      sync();
      render();
      setReady(true);
    }

    void build();
    return () => {
      disposed = true;
      destroy();
    };
  }, []);

  return (
    <figure ref={stageRef} className={`hero-orbit hero-avatar3d ${ready ? "hero-orbit--ready" : ""}`}>
      <div className="hero-orbit__shadow" aria-hidden="true" />
      <div className="hero-orbit__fallback" aria-hidden="true">
        <Image
          src="/artwork/suraj-avatar-neutral.png"
          alt=""
          width={400}
          height={600}
          priority
          unoptimized
          className="hero-orbit__fallback-avatar"
        />
      </div>
      <div ref={hostRef} className="hero-orbit__canvas-host" />
      <figcaption className="hero-orbit__description">
        A 3D model of Suraj Singh that follows the cursor with its head, can be dragged to spin,
        and waves when clicked.
      </figcaption>
    </figure>
  );
}
