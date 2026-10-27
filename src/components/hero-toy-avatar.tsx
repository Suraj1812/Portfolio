"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type * as ThreeTypes from "three";

import { createMover, createRobotPoser, loadRobot, type RobotRig } from "@/components/robot-model";
import "./hero-orbit.css";

/**
 * A complete 3D hero scene: a robot standing on a floating sci-fi hover-pad
 * with holographic panels, drones and flying saucers, under a ringed planet
 * by day and a moon and stars by night. Rendered with physically based materials, procedural textures,
 * an environment map and real cast shadows so it reads as a miniature diorama
 * rather than a flat cartoon.
 *
 * Interactions: head, eyes and puppy follow the cursor; click to wave (the
 * puppy hops too); drag to spin the island.
 */
export const C = {
  skin: 0xe4b28c,
  skinShade: 0xcb9772,
  hair: 0x171210,
  blazer: 0x1f2840,
  trousers: 0x2f323b,
  suit: 0x252a45,
  lapel: 0x171b30,
  shirt: 0xf7f3ee,
  shoe: 0x141414,
  iris: 0x3a2214,
  lips: 0xc4857a,
  blush: 0xff8f7a,
  grass: 0x79c653,
  grassDark: 0x4f9a3a,
  grassLight: 0xa6df6c,
  dirt: 0x8d6240,
  dirtDark: 0x5f402a,
  bark: 0x6e4a2f,
  leaf: 0x4f9d3f,
  leafLight: 0x7ec75a,
  rock: 0xa09c94,
  sun: 0xffd84f,
  sunRay: 0xff9a3d,
  cloud: 0xffffff,
  dog: 0xe0a05a,
  dogDark: 0xb0713a,
  dogWhite: 0xfff6ea,
  dogNose: 0x241811,
};

/** Robot moves (see robot-model.ts for the model and its credits). */
const CLICK_MOVES = ["Waving", "Salute", "Standing Clap", "Hip Hop Dancing", "Pointing Forward"];
const IDLE_MOVES = ["Talking", "Arm Stretching", "Talking (2)", "Talking (1)"];

/** Fired by the scroll guide: `{ away: true }` when it leaves the island. */
export const GUIDE_EVENT = "suraj-guide";

export type TextureKind = "grass" | "soil" | "bark" | "leaf" | "rock" | "fur" | "cloth";

/** Physical surface description for `pbr()`. Everything is optional. */
export type Surface = {
  roughness?: number;
  metalness?: number;
  clearcoat?: number;
  clearcoatRoughness?: number;
  sheen?: number;
  sheenRoughness?: number;
  sheenColor?: number;
  emissive?: number;
  emissiveIntensity?: number;
  opacity?: number;
  doubleSide?: boolean;
  flatShading?: boolean;
  vertexColors?: boolean;
  texture?: TextureKind;
  bumpScale?: number;
};

export type Builder = {
  THREE: typeof ThreeTypes;
  part: (
    geometry: ThreeTypes.BufferGeometry,
    material: ThreeTypes.Material,
    options?: PartOptions,
  ) => ThreeTypes.Mesh;
  /** Matte surface in a given color (name kept from the earlier cel-shaded kit). */
  toon: (color: number) => ThreeTypes.Material;
  /** Slightly glossy surface; supports opacity and double-sided rendering. */
  flat: (color: number, opacity?: number, doubleSide?: boolean) => ThreeTypes.Material;
  /** Fully described physical material (fabric, skin, leather, fur, foliage...). */
  pbr: (color: number, surface?: Surface) => ThreeTypes.MeshPhysicalMaterial;
  /** Shared procedural detail texture of a kind (used for color and bump). */
  tex: (kind: TextureKind) => ThreeTypes.Texture;
};
type PartOptions = {
  /** Kept for compatibility with the old cel-shaded kit; outlines are no longer drawn. */
  outline?: boolean;
  /** Whether the mesh casts a shadow (default: yes for opaque parts). */
  shadow?: boolean;
  position?: [number, number, number];
  scale?: [number, number, number];
  rotation?: [number, number, number];
};

/** Seeded random so the island looks the same on every visit. */
function seeded(seed: number) {
  let value = seed;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

// ======================= Noise =======================
const fract = (v: number) => v - Math.floor(v);
const smooth = (t: number) => t * t * (3 - 2 * t);
const mix = (a: number, b: number, t: number) => a + (b - a) * t;
const hash = (x: number, y: number, z: number) =>
  fract(Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453123);

/** Value noise in [0, 1]. With `period` the lattice wraps, so textures tile. */
function noise3(x: number, y: number, z: number, period = 0) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const zi = Math.floor(z);
  const fx = smooth(x - xi);
  const fy = smooth(y - yi);
  const fz = smooth(z - zi);
  const wrap = (i: number) => (period ? ((i % period) + period) % period : i);
  const c = (dx: number, dy: number, dz: number) => hash(wrap(xi + dx), wrap(yi + dy), wrap(zi + dz));
  return mix(
    mix(mix(c(0, 0, 0), c(1, 0, 0), fx), mix(c(0, 1, 0), c(1, 1, 0), fx), fy),
    mix(mix(c(0, 0, 1), c(1, 0, 1), fx), mix(c(0, 1, 1), c(1, 1, 1), fx), fy),
    fz,
  );
}

/** Layered noise in [0, 1]. */
function fbm(x: number, y: number, z: number, octaves = 3, period = 0) {
  let sum = 0;
  let amplitude = 0.5;
  let total = 0;
  let p = period;
  for (let o = 0; o < octaves; o += 1) {
    sum += amplitude * noise3(x, y, z, p);
    total += amplitude;
    x *= 2;
    y *= 2;
    z *= 2;
    p *= 2;
    amplitude *= 0.5;
  }
  return sum / total;
}

/** Pushes vertices in and out along their own direction for organic lumps. */
export function roughen(geometry: ThreeTypes.BufferGeometry, amount: number, frequency = 3, seed = 0) {
  const attribute = geometry.attributes.position as ThreeTypes.BufferAttribute;
  for (let i = 0; i < attribute.count; i += 1) {
    const x = attribute.getX(i);
    const y = attribute.getY(i);
    const z = attribute.getZ(i);
    const length = Math.hypot(x, y, z) || 1;
    const n = fbm(x * frequency + seed, y * frequency + seed * 0.7, z * frequency + seed * 1.3, 3) - 0.5;
    const k = 1 + (n * 2 * amount) / length;
    attribute.setXYZ(i, x * k, y * k, z * k);
  }
  attribute.needsUpdate = true;
  geometry.computeVertexNormals();
  return geometry;
}

// ======================= Procedural textures =======================
type Paint = (n: number, detail: number, u: number, v: number) => number;

/** Grayscale tileable detail texture; the material color tints it. */
function detailTexture(THREE: typeof ThreeTypes, size: number, period: number, paint: Paint, stretch = 1) {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d")!;
  const image = context.createImageData(size, size);
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = x / size;
      const v = y / size;
      const n = fbm(u * period * stretch, v * period, 0.37, 4, period);
      const detail = fbm(u * period * 3 * stretch + 5, v * period * 3, 1.3, 3, period * 3);
      const value = Math.round(Math.min(1, Math.max(0, paint(n, detail, u, v))) * 255);
      const i = (y * size + x) * 4;
      image.data[i] = image.data[i + 1] = image.data[i + 2] = value;
      image.data[i + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);
  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

function makeTexture(THREE: typeof ThreeTypes, kind: TextureKind) {
  switch (kind) {
    case "grass":
      return detailTexture(THREE, 256, 8, (n, d) => mix(0.62, 0.98, n) + (d > 0.74 ? 0.1 : 0) - (d < 0.26 ? 0.08 : 0));
    case "soil":
      return detailTexture(THREE, 256, 6, (n, d) => mix(0.55, 0.95, n) + (d > 0.8 ? 0.18 : 0) - (d < 0.2 ? 0.12 : 0));
    case "bark":
      return detailTexture(THREE, 256, 4, (n, d) => mix(0.5, 0.95, n) - (d > 0.72 ? 0.22 : 0), 6);
    case "leaf":
      return detailTexture(THREE, 256, 7, (n, d) => mix(0.6, 1, n) + (d > 0.76 ? 0.12 : 0) - (d < 0.24 ? 0.12 : 0));
    case "rock":
      return detailTexture(THREE, 256, 5, (n, d) => mix(0.66, 1, n) - (Math.abs(d - 0.5) < 0.025 ? 0.25 : 0));
    case "fur":
      return detailTexture(THREE, 128, 6, (n, d) => mix(0.78, 1, n) + (d > 0.7 ? 0.06 : 0), 0.35);
    case "cloth":
      return detailTexture(THREE, 128, 16, (n, d) => mix(0.9, 1, n) + (d - 0.5) * 0.08);
  }
}

const textureRepeat: Record<TextureKind, [number, number]> = {
  grass: [1, 1],
  soil: [1, 1],
  bark: [1, 1],
  leaf: [2, 2],
  rock: [2, 2],
  fur: [3, 3],
  cloth: [4, 4],
};

/**
 * Shared material kit: physically based surfaces, procedural detail textures
 * and a `part` helper that wires up shadows. Used by the hero island and the
 * scroll guide. (Its name survives from the earlier cel-shaded version.)
 */
export function createToonKit(THREE: typeof ThreeTypes) {
  const disposables = new Set<{ dispose: () => void }>();
  const track = <T extends { dispose: () => void }>(item: T) => {
    disposables.add(item);
    return item;
  };
  const textures = new Map<TextureKind, ThreeTypes.Texture>();
  const tex = (kind: TextureKind) => {
    if (!textures.has(kind)) {
      const texture = track(makeTexture(THREE, kind));
      texture.repeat.set(...textureRepeat[kind]);
      textures.set(kind, texture);
    }
    return textures.get(kind)!;
  };
  const cache = new Map<string, ThreeTypes.MeshPhysicalMaterial>();
  const pbr = (color: number, surface: Surface = {}) => {
    const key = `${color}:${JSON.stringify(surface)}`;
    let material = cache.get(key);
    if (!material) {
      const opacity = surface.opacity ?? 1;
      material = track(
        new THREE.MeshPhysicalMaterial({
          color,
          roughness: surface.roughness ?? 0.8,
          metalness: surface.metalness ?? 0,
          clearcoat: surface.clearcoat ?? 0,
          clearcoatRoughness: surface.clearcoatRoughness ?? 0.2,
          sheen: surface.sheen ?? 0,
          sheenRoughness: surface.sheenRoughness ?? 0.8,
          sheenColor: new THREE.Color(surface.sheenColor ?? color),
          emissive: new THREE.Color(surface.emissive ?? 0x000000),
          emissiveIntensity: surface.emissiveIntensity ?? 1,
          transparent: opacity < 1,
          opacity,
          depthWrite: opacity >= 1,
          side: surface.doubleSide ? THREE.DoubleSide : THREE.FrontSide,
          flatShading: surface.flatShading ?? false,
          vertexColors: surface.vertexColors ?? false,
        }),
      );
      if (surface.texture) {
        const texture = tex(surface.texture);
        material.map = texture;
        material.bumpMap = texture;
        material.bumpScale = surface.bumpScale ?? 0.01;
      }
      cache.set(key, material);
    }
    return material;
  };
  const toon = (color: number) => pbr(color, { roughness: 0.82 });
  const flat = (color: number, opacity = 1, doubleSide = false) =>
    pbr(color, { roughness: 0.45, opacity, doubleSide });
  function part(geometry: ThreeTypes.BufferGeometry, material: ThreeTypes.Material, options: PartOptions = {}) {
    track(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    if (options.position) mesh.position.set(...options.position);
    if (options.scale) mesh.scale.set(...options.scale);
    if (options.rotation) mesh.rotation.set(...options.rotation);
    mesh.castShadow = options.shadow ?? !material.transparent;
    mesh.receiveShadow = true;
    return mesh;
  }
  const builder: Builder = { THREE, part, toon, flat, pbr, tex };
  return { builder, track, disposables };
}

/**
 * Renderer + scene lighting shared by every 3D canvas on the site: filmic tone
 * mapping, an environment map for soft reflections, a warm key light (which
 * casts shadows when asked), a rim light from the sun's side and sky/ground
 * bounce light.
 */
export async function lightScene(
  THREE: typeof ThreeTypes,
  renderer: ThreeTypes.WebGLRenderer,
  scene: ThreeTypes.Scene,
  options: { shadows?: boolean; environmentIntensity?: number } = {},
) {
  const { RoomEnvironment } = await import("three/examples/jsm/environments/RoomEnvironment.js");
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.12;
  if (options.shadows) {
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;
  }
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  scene.environment = environment;
  scene.environmentIntensity = options.environmentIntensity ?? 0.55;

  const key = new THREE.DirectionalLight(0xfff1dc, 2.6);
  key.position.set(-2.4, 3.8, 3.4);
  if (options.shadows) {
    key.castShadow = true;
    key.shadow.mapSize.set(2048, 2048);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 14;
    key.shadow.camera.left = key.shadow.camera.bottom = -2.4;
    key.shadow.camera.right = key.shadow.camera.top = 2.4;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.025;
    key.shadow.radius = 4;
  }
  const rim = new THREE.DirectionalLight(0xffc98a, 1.5);
  rim.position.set(1.8, 2.8, -2.4);
  const sky = new THREE.HemisphereLight(0xdcefff, 0x5b8f3e, 0.75);
  scene.add(key, rim, sky);

  return {
    key,
    rim,
    sky,
    dispose() {
      environment.dispose();
      key.dispose();
      rim.dispose();
      sky.dispose();
    },
  };
}

// ======================= Character =======================
/**
 * Suraj, modelled after his photo: a round, soft-jawed face with full cheeks,
 * warm skin, thick straight brows, dark almond eyes, a closed-lip smile and
 * short hair under a navy baseball cap. Dressed for work: navy
 * blazer over a white shirt and tie, charcoal trousers and brown oxfords.
 */
export function buildCharacter({ THREE, part, pbr }: Builder) {
  const skinSurface: Surface = { roughness: 0.62, sheen: 0.35, sheenRoughness: 0.6, sheenColor: 0xffc9ad };
  const hairSurface: Surface = { roughness: 0.42, sheen: 0.6, sheenRoughness: 0.35, sheenColor: 0x4a3a33 };
  const mat = {
    skin: pbr(C.skin, skinSurface),
    skinShade: pbr(C.skinShade, skinSurface),
    hair: pbr(C.hair, hairSurface),
    hairLight: pbr(0x2b211c, hairSurface),
    blazer: pbr(C.blazer, { roughness: 0.9, sheen: 0.45, sheenRoughness: 0.65, sheenColor: 0x56658f, texture: "cloth", bumpScale: 0.004 }),
    lapel: pbr(0x18203a, { roughness: 0.55, sheen: 0.35, sheenColor: 0x56658f }),
    button: pbr(0x111111, { roughness: 0.3, clearcoat: 0.6 }),
    shirt: pbr(0xf6f7f9, { roughness: 0.82, sheen: 0.2, sheenColor: 0xffffff, texture: "cloth", bumpScale: 0.003 }),
    tie: pbr(0x23365e, { roughness: 0.42, sheen: 0.6, sheenRoughness: 0.4, sheenColor: 0x7d95c8 }),
    trousers: pbr(C.trousers, { roughness: 0.88, sheen: 0.3, sheenColor: 0x6a6f7c, texture: "cloth", bumpScale: 0.004 }),
    belt: pbr(0x1b1512, { roughness: 0.4, clearcoat: 0.5 }),
    buckle: pbr(0xc9ced6, { roughness: 0.25, metalness: 1 }),
    shoe: pbr(0x4a2c18, { roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.15 }),
    sole: pbr(0x24170f, { roughness: 0.7 }),
    pocketSquare: pbr(0xffffff, { roughness: 0.6, sheen: 0.4 }),
    white: pbr(0xfaf8f5, { roughness: 0.18 }),
    iris: pbr(0x3a2214, { roughness: 0.2 }),
    irisRing: pbr(0x1f120a, { roughness: 0.2 }),
    pupil: pbr(0x070403, { roughness: 0.1 }),
    lash: pbr(0x1a120e, { roughness: 0.7 }),
    lipLine: pbr(0x8a4a42, { roughness: 0.5 }),
    lips: pbr(C.lips, { roughness: 0.62 }),
    mouthInside: pbr(0x7a2a26, { roughness: 0.6 }),
    teeth: pbr(0xfffdf8, { roughness: 0.25 }),
    tongue: pbr(0xe0645e, { roughness: 0.4 }),
    brow: pbr(0x15100d, { roughness: 0.8 }),
    nostril: pbr(0x8a5a44, { roughness: 0.8 }),
    blush: pbr(C.blush, { roughness: 0.9, opacity: 0.12 }),
    shine: pbr(0xffffff, { roughness: 0.2, opacity: 0.35 }),
    cap: pbr(0x1d2a4a, { roughness: 0.9, sheen: 0.4, sheenColor: 0x5a6c9a, texture: "cloth", bumpScale: 0.004 }),
    capSeam: pbr(0x141d35, { roughness: 0.9 }),
    capBadge: pbr(0x63e6ff, { roughness: 0.5, emissive: 0x63e6ff, emissiveIntensity: 0.1 }),
  };
  const sphere = (radius: number, w = 32, h = 24) => new THREE.SphereGeometry(radius, w, h);
  const taper = (top: number, bottom: number, height: number, segments = 24) =>
    new THREE.CylinderGeometry(top, bottom, height, segments, 1);
  const curve = (points: Array<[number, number, number]>, radius: number) =>
    new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))),
      20,
      radius,
      8,
      false,
    );

  /** Places a feature on the head surface, facing outward along `dir`. */
  function onFace<T extends ThreeTypes.Object3D>(object: T, dir: [number, number, number], radius: number) {
    const d = new THREE.Vector3(...dir).normalize();
    object.position.copy(d).multiplyScalar(radius);
    object.rotation.order = "YXZ";
    object.rotation.y = Math.atan2(d.x, d.z);
    object.rotation.x = -Math.asin(d.y);
    return object;
  }

  const figure = new THREE.Group();

  // ---------- Legs: charcoal trousers and brown oxfords ----------
  const legs: ThreeTypes.Group[] = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.1, 0.9, 0);
    hip.add(part(sphere(0.088), mat.trousers, { position: [0, -0.02, 0] }));
    hip.add(part(taper(0.088, 0.07, 0.82), mat.trousers, { position: [0, -0.44, 0] }));
    // Front crease down the trouser leg.
    hip.add(part(new THREE.BoxGeometry(0.004, 0.74, 0.004), mat.lapel, { shadow: false, position: [0, -0.44, 0.077], rotation: [0.022, 0, 0] }));
    const shoe = new THREE.Group();
    shoe.position.set(side * 0.008, -0.87, 0.045);
    shoe.add(part(new THREE.CapsuleGeometry(0.068, 0.16, 8, 18), mat.shoe, { rotation: [Math.PI / 2, 0, 0], scale: [1, 0.92, 0.66] }));
    shoe.add(part(taper(0.064, 0.067, 0.05, 18), mat.shoe, { position: [0, 0.032, -0.06] }));
    shoe.add(part(new THREE.CapsuleGeometry(0.07, 0.17, 6, 18), mat.sole, { position: [0, -0.04, 0], rotation: [Math.PI / 2, 0, 0], scale: [1.06, 1.02, 0.18] }));
    // Toe cap seam.
    shoe.add(part(new THREE.TorusGeometry(0.05, 0.003, 6, 24, Math.PI), mat.sole, { shadow: false, position: [0, 0.012, 0.1], rotation: [-1.1, 0, 0], scale: [1.15, 1, 1] }));
    hip.add(shoe);
    figure.add(hip);
    legs.push(hip);
  }

  // ---------- Torso: navy blazer, white shirt, tie ----------
  const torso = new THREE.Group();
  torso.position.y = 0.86;
  figure.add(torso);
  const jacketProfile = [
    [0, -0.07], [0.2, -0.07], [0.212, 0.03], [0.21, 0.2], [0.235, 0.38],
    [0.252, 0.47], [0.238, 0.545], [0.17, 0.592], [0.075, 0.612], [0, 0.612],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  torso.add(part(new THREE.LatheGeometry(jacketProfile, 48), mat.blazer, { scale: [1, 1, 0.7] }));
  for (const side of [-1, 1]) {
    torso.add(part(sphere(0.078), mat.blazer, { position: [side * 0.235, 0.515, 0], scale: [1.12, 0.76, 0.95] }));
  }
  // Belt peeking under the jacket hem.
  torso.add(part(taper(0.198, 0.198, 0.03, 40), mat.belt, { position: [0, -0.055, 0], scale: [1, 1, 0.7] }));
  torso.add(part(new THREE.BoxGeometry(0.032, 0.024, 0.008), mat.buckle, { position: [0, -0.055, 0.14] }));

  const shape = (points: Array<[number, number]>) =>
    new THREE.ShapeGeometry(new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y))));
  const front = new THREE.Group();
  front.position.set(0, 0.32, 0.163);
  front.rotation.x = -0.17;
  torso.add(front);
  // Shirt V between the lapels.
  front.add(part(shape([[-0.076, 0.28], [0.076, 0.28], [0, -0.02]]), mat.shirt, { shadow: false, position: [0, 0, 0.004] }));
  // Tie: knot and blade.
  front.add(part(shape([[-0.017, 0.262], [0.017, 0.262], [0.012, 0.232], [-0.012, 0.232]]), mat.tie, { shadow: false, position: [0, 0, 0.012] }));
  front.add(part(shape([[-0.011, 0.234], [0.011, 0.234], [0.022, 0.04], [0, 0.012], [-0.022, 0.04]]), mat.tie, { shadow: false, position: [0, 0, 0.01] }));
  for (const side of [-1, 1]) {
    // Shirt collar points over the tie knot.
    front.add(part(shape([[side * 0.006, 0.282], [side * 0.072, 0.29], [side * 0.042, 0.215]]), mat.shirt, { shadow: false, position: [0, 0, 0.015] }));
    // Notch lapel.
    front.add(part(shape([
      [side * 0.07, 0.272], [side * 0.15, 0.215], [side * 0.126, 0.186],
      [side * 0.156, 0.162], [side * 0.012, -0.03],
    ]), mat.lapel, { shadow: false, position: [0, 0, 0.007] }));
  }
  // Single button closing the jacket.
  torso.add(part(sphere(0.012, 14, 10), mat.button, { position: [0, 0.14, 0.15] }));
  torso.add(part(new THREE.BoxGeometry(0.004, 0.16, 0.003), mat.lapel, { shadow: false, position: [0, 0.06, 0.15], rotation: [-0.06, 0, 0] }));
  // White pocket square in the chest pocket.
  const pocket = new THREE.Group();
  pocket.position.set(0.118, 0.41, 0.15);
  pocket.rotation.y = 0.37;
  torso.add(pocket);
  pocket.add(part(new THREE.BoxGeometry(0.052, 0.012, 0.004), mat.pocketSquare, { shadow: false, position: [0, 0.006, 0.004] }));
  pocket.add(part(new THREE.BoxGeometry(0.066, 0.005, 0.004), mat.lapel, { shadow: false, position: [0, -0.002, 0.006] }));
  // Side pocket flaps.
  for (const side of [-1, 1]) {
    const flap = new THREE.Group();
    flap.position.set(side * 0.12, 0.07, 0.115);
    flap.rotation.y = side * 0.62;
    flap.add(part(new THREE.BoxGeometry(0.09, 0.022, 0.006), mat.blazer, { shadow: false }));
    torso.add(flap);
  }
  // Shirt collar band and neck.
  torso.add(part(taper(0.064, 0.072, 0.05, 24), mat.shirt, { position: [0, 0.612, 0.004] }));
  torso.add(part(taper(0.054, 0.06, 0.14, 24), mat.skin, { position: [0, 0.65, 0] }));

  // ---------- Arms: blazer sleeves, shirt cuffs, hands with fingers ----------
  type Arm = { shoulder: ThreeTypes.Group; elbow: ThreeTypes.Group; hand: ThreeTypes.Group; side: number };
  const arms: Arm[] = [];
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.255, 0.5, 0);
    shoulder.add(part(taper(0.07, 0.062, 0.32), mat.blazer, { position: [0, -0.16, 0] }));
    const elbow = new THREE.Group();
    elbow.position.y = -0.32;
    elbow.add(part(sphere(0.062), mat.blazer));
    elbow.add(part(taper(0.062, 0.057, 0.24), mat.blazer, { position: [0, -0.12, 0] }));
    elbow.add(part(taper(0.05, 0.05, 0.03, 20), mat.shirt, { position: [0, -0.252, 0] })); // cuff
    const hand = new THREE.Group();
    hand.position.y = -0.275;
    hand.add(part(sphere(0.046, 20, 16), mat.skin, { position: [0, -0.035, 0], scale: [1, 1.15, 0.62] }));
    for (let f = 0; f < 4; f += 1) {
      const x = (f - 1.5) * 0.021;
      const length = f === 0 || f === 3 ? 0.038 : 0.048;
      hand.add(part(new THREE.CapsuleGeometry(0.0105, length, 6, 10), mat.skin, { shadow: false, position: [x, -0.085 - (length - 0.038) * 0.5, 0.004], rotation: [0.1, 0, x * -1.5] }));
    }
    hand.add(part(new THREE.CapsuleGeometry(0.013, 0.036, 6, 10), mat.skin, { shadow: false, position: [-side * 0.04, -0.045, 0.02], rotation: [0.3, 0, -side * 0.6] }));
    elbow.add(hand);
    shoulder.add(elbow);
    torso.add(shoulder);
    arms.push({ shoulder, elbow, hand, side });
  }

  // ---------- Head ----------
  const head = new THREE.Group();
  head.position.y = 0.68;
  head.rotation.order = "YXZ";
  torso.add(head);
  const HEAD_Y = 0.2;
  const FACE_R = 0.205;

  // Sculpt a sphere into his face: full cheeks, soft rounded jaw, gentle chin.
  const headGeometry = sphere(0.21, 64, 48);
  const vertices = headGeometry.attributes.position as ThreeTypes.BufferAttribute;
  for (let i = 0; i < vertices.count; i += 1) {
    let x = vertices.getX(i);
    let y = vertices.getY(i);
    let z = vertices.getZ(i);
    const ny = y / 0.21;
    const jaw = Math.pow(THREE.MathUtils.clamp((0.1 - ny) / 1.1, 0, 1), 1.6);
    const cheek = Math.exp(-Math.pow((ny + 0.2) / 0.32, 2)) * (z > 0 ? 1 : 0.5);
    x *= 1 - 0.17 * jaw + 0.07 * cheek;
    z *= 1 - 0.07 * jaw + 0.03 * cheek;
    if (z > 0) z += 0.016 * Math.exp(-Math.pow((ny + 0.8) / 0.22, 2)); // chin
    if (ny < -0.6) y += 0.012 * (1 - Math.pow((ny + 1) / 0.4, 2)); // softer under-chin
    vertices.setXYZ(i, x, y, z);
  }
  headGeometry.computeVertexNormals();
  head.add(part(headGeometry, mat.skin, { position: [0, HEAD_Y, 0], scale: [1.02, 1.07, 0.98] }));

  for (const side of [-1, 1]) {
    head.add(part(sphere(0.052), mat.skin, { position: [side * 0.218, HEAD_Y - 0.035, -0.02], scale: [0.45, 1, 0.78] }));
    head.add(part(sphere(0.028, 16, 12), mat.skinShade, { shadow: false, position: [side * 0.232, HEAD_Y - 0.037, -0.01], scale: [0.3, 1, 0.68] }));
  }

  // ---------- Short hair at the sides and back, under a baseball cap ----------
  const hair = new THREE.Group();
  hair.position.set(0, HEAD_Y, 0);
  head.add(hair);
  // Close-cropped shell over the crown, back and sides.
  hair.add(part(new THREE.SphereGeometry(0.216, 48, 32, 0, Math.PI * 2, 0, 1.5), mat.hair, { position: [0, 0.025, -0.015], rotation: [-0.34, 0, 0], scale: [1.02, 1.08, 1.03] }));
  hair.add(part(new THREE.SphereGeometry(0.218, 48, 32, Math.PI, Math.PI, 0.3, 1.5), mat.hair, { position: [0, 0, -0.003], scale: [1.015, 1.08, 1.02] }));
  for (const side of [-1, 1]) {
    hair.add(part(new THREE.CapsuleGeometry(0.015, 0.045, 6, 10), mat.hair, { shadow: false, position: [side * 0.199, -0.005, 0.035], rotation: [0, 0, side * 0.1] }));
  }
  // Baseball cap: six-panel crown, sweatband edge, curved brim, top button and a small badge.
  const cap = new THREE.Group();
  hair.add(cap);
  cap.add(part(new THREE.SphereGeometry(0.228, 48, 32, 0, Math.PI * 2, 0, 1.28), mat.cap, { position: [0, 0.035, -0.006], rotation: [-0.12, 0, 0], scale: [1.04, 1.02, 1.0] }));
  for (let i = 0; i < 6; i += 1) {
    // Panel seams running from the button down the crown.
    const seam = new THREE.Group();
    seam.position.set(0, 0.035, -0.006);
    seam.rotation.set(-0.12, (i / 6) * Math.PI * 2, 0);
    seam.add(part(new THREE.TorusGeometry(0.2295, 0.0018, 4, 40, 1.22), mat.capSeam, { shadow: false, rotation: [0, Math.PI / 2, Math.PI / 2 - 1.22], scale: [1.04, 1.02, 1] }));
    cap.add(seam);
  }
  cap.add(part(sphere(0.014, 16, 10), mat.cap, { position: [0, 0.266, -0.034], scale: [1, 0.55, 1] }));
  // Curved brim: a half disc that dips at its sides.
  const brimGeometry = new THREE.CylinderGeometry(0.175, 0.175, 0.012, 40, 1, false, -Math.PI / 2, Math.PI);
  {
    const position = brimGeometry.attributes.position as ThreeTypes.BufferAttribute;
    for (let i = 0; i < position.count; i += 1) {
      const x = position.getX(i);
      position.setY(i, position.getY(i) - (x * x) * 1.6);
    }
    brimGeometry.computeVertexNormals();
  }
  cap.add(part(brimGeometry, mat.cap, { position: [0, 0.112, 0.1], rotation: [0.16, 0, 0], scale: [1.02, 1, 1.12] }));
  // Badge on the front panel in the site's cyan.
  const badge = new THREE.Group();
  badge.position.set(0, 0.17, 0.192);
  badge.rotation.x = -0.62;
  badge.add(part(new THREE.CircleGeometry(0.03, 28), mat.capBadge, { shadow: false }));
  badge.add(part(new THREE.TorusGeometry(0.03, 0.003, 6, 28), mat.capSeam, { shadow: false, position: [0, 0, 0.001] }));
  cap.add(badge);

  // ---------- Face ----------
  const face = new THREE.Group();
  face.position.y = HEAD_Y;
  face.scale.set(1.02, 1.07, 0.98);
  head.add(face);

  type Eye = { group: ThreeTypes.Group; iris: ThreeTypes.Group };
  const eyes: Eye[] = [];
  const brows: ThreeTypes.Group[] = [];
  for (const side of [-1, 1]) {
    // Almond eye: white, dark brown iris, lashes, a hooded lid and a lower lid line.
    const group = onFace(new THREE.Group(), [side * 0.36, 0.05, 0.93], FACE_R - 0.008);
    group.add(part(sphere(0.038, 24, 16), mat.white, { shadow: false, scale: [1.25, 0.8, 0.4] }));
    const iris = new THREE.Group();
    iris.position.z = 0.011;
    iris.add(part(sphere(0.026, 20, 14), mat.irisRing, { shadow: false, scale: [1, 1, 0.3] }));
    iris.add(part(sphere(0.021, 20, 14), mat.iris, { shadow: false, position: [0, 0, 0.002], scale: [1, 1, 0.3] }));
    iris.add(part(sphere(0.011, 14, 10), mat.pupil, { shadow: false, position: [0, 0, 0.006], scale: [1, 1, 0.3] }));
    iris.add(part(sphere(0.006, 10, 8), mat.white, { shadow: false, position: [0.008, 0.009, 0.01] }));
    iris.add(part(sphere(0.003, 8, 6), mat.white, { shadow: false, position: [-0.007, -0.008, 0.01] }));
    group.add(iris);
    group.add(part(new THREE.TorusGeometry(0.041, 0.0062, 6, 24, Math.PI), mat.lash, { shadow: false, position: [0, 0.001, 0.007], scale: [1.22, 0.86, 1] }));
    group.add(part(sphere(0.04, 20, 12), mat.skin, { shadow: false, position: [0, 0.026, -0.002], scale: [1.35, 0.5, 0.5] })); // hooded upper lid
    group.add(part(new THREE.TorusGeometry(0.04, 0.0028, 6, 20, Math.PI * 0.8), mat.skinShade, { shadow: false, position: [0, -0.002, 0.006], rotation: [0, 0, Math.PI * 1.1], scale: [1.2, 0.8, 1] }));
    face.add(group);
    eyes.push({ group, iris });

    // Thick, nearly straight brow, a touch higher at the outer end.
    const brow = onFace(new THREE.Group(), [side * 0.35, 0.215, 0.9], FACE_R + 0.002);
    brow.add(part(curve([[-0.054, -0.001, 0], [-0.018, 0.005, 0.003], [0.026, 0.007, 0.002], [0.054, 0.003, 0]], 0.0115), mat.brow, { shadow: false, scale: [side, 0.72, 1] }));
    brow.userData.baseY = brow.position.y;
    face.add(brow);
    brows.push(brow);

    const blush = onFace(new THREE.Group(), [side * 0.55, -0.22, 0.8], FACE_R + 0.003);
    blush.add(part(new THREE.CircleGeometry(0.032, 20), mat.blush, { scale: [1.35, 0.75, 1] }));
    face.add(blush);
  }

  // Nose: straight bridge, rounded tip, soft nostrils.
  face.add(onFace(part(new THREE.CapsuleGeometry(0.012, 0.055, 6, 10), mat.skin, { shadow: false }), [0, -0.03, 1], FACE_R - 0.003));
  face.add(onFace(part(sphere(0.027, 18, 14), mat.skinShade, { shadow: false, scale: [1.2, 0.85, 1] }), [0, -0.15, 1], FACE_R + 0.004));
  for (const side of [-1, 1]) {
    face.add(onFace(part(sphere(0.016, 14, 10), mat.skinShade, { shadow: false, scale: [1, 0.8, 0.9] }), [side * 0.11, -0.165, 0.98], FACE_R - 0.002));
    face.add(onFace(part(sphere(0.006, 10, 8), mat.nostril, { shadow: false }), [side * 0.06, -0.2, 0.99], FACE_R - 0.004));
  }

  // Mouth: closed, slightly smiling lips; plus an open grin shown while waving.
  const mouth = onFace(new THREE.Group(), [0, -0.37, 0.93], FACE_R - 0.002);
  mouth.add(part(sphere(0.04, 24, 12), mat.lips, { shadow: false, position: [0, -0.01, -0.004], scale: [1.05, 0.32, 0.26] })); // lower lip
  mouth.add(part(sphere(0.04, 24, 12), mat.lips, { shadow: false, position: [0, 0.008, -0.005], scale: [1.18, 0.2, 0.22] })); // upper lip
  const smile = part(new THREE.TorusGeometry(0.044, 0.0038, 8, 24, Math.PI * 0.8), mat.lipLine, { shadow: false, position: [0, 0.004, 0.003], rotation: [0, 0, Math.PI * 1.1], scale: [1.08, 0.5, 1] });
  mouth.add(smile);
  const open = new THREE.Group();
  open.add(part(new THREE.CircleGeometry(0.04, 24, Math.PI, Math.PI), mat.mouthInside, { shadow: false, position: [0, 0.006, 0.004] }));
  open.add(part(new THREE.BoxGeometry(0.06, 0.012, 0.002), mat.teeth, { shadow: false, position: [0, 0, 0.006] }));
  open.add(part(new THREE.CircleGeometry(0.016, 16, Math.PI, Math.PI), mat.tongue, { shadow: false, position: [0, -0.022, 0.005] }));
  open.scale.set(1, 0.001, 1);
  mouth.add(open);
  face.add(mouth);

  // Normalize to 1.8 tall with feet at y = 0.
  const bounds = new THREE.Box3().setFromObject(figure);
  const fit = 1.8 / (bounds.max.y - bounds.min.y);
  figure.scale.setScalar(fit);
  figure.position.y = -bounds.min.y * fit;
  const character = new THREE.Group();
  character.add(figure);

  return { character, torso, head, eyes, brows, arms, legs, mouth: { smile, open } };
}

// ======================= Puppy =======================
export function buildPuppy({ THREE, part, pbr }: Builder) {
  const fur = (color: number, sheenColor: number): Surface => ({
    roughness: 1,
    sheen: 0.7,
    sheenRoughness: 0.85,
    sheenColor,
    texture: "fur",
    bumpScale: 0.006,
  });
  const tan = pbr(C.dog, fur(C.dog, 0xffd9a0));
  const dark = pbr(C.dogDark, fur(C.dogDark, 0xe0a060));
  const white = pbr(C.dogWhite, fur(C.dogWhite, 0xffffff));
  const nose = pbr(C.dogNose, { roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.3 });
  const eye = pbr(0x14100c, { roughness: 0.1 });
  const pink = pbr(0xf2a8b0, { roughness: 0.7 });
  const collar = pbr(0xd9403a, { roughness: 0.45, clearcoat: 0.4 });
  const tag = pbr(0xe8c35a, { roughness: 0.3, metalness: 0.9 });
  const sphere = (r: number) => new THREE.SphereGeometry(r, 32, 24);

  const puppy = new THREE.Group();
  const body = new THREE.Group();
  puppy.add(body);
  body.add(part(roughen(sphere(0.16), 0.004, 14, 7), tan, { position: [0, 0.19, -0.02], scale: [1, 1.05, 1.2], rotation: [-0.45, 0, 0] }));
  body.add(part(sphere(0.1), white, { position: [0, 0.22, 0.1], scale: [1, 1.2, 0.8] }));
  for (const side of [-1, 1]) {
    body.add(part(sphere(0.085), tan, { position: [side * 0.11, 0.09, -0.08], scale: [0.9, 0.8, 1.3] }));
    body.add(part(new THREE.CapsuleGeometry(0.035, 0.12, 6, 16), tan, { position: [side * 0.06, 0.08, 0.1] }));
    body.add(part(sphere(0.042), white, { position: [side * 0.06, 0.015, 0.12], scale: [1, 0.6, 1.3] }));
  }

  const head = new THREE.Group();
  head.position.set(0, 0.4, 0.08);
  head.rotation.order = "YXZ";
  body.add(head);
  head.add(part(roughen(sphere(0.125), 0.003, 16, 11), tan, { scale: [1.05, 0.95, 1] }));
  head.add(part(sphere(0.065), white, { position: [0, -0.035, 0.1], scale: [1.1, 0.8, 1] }));
  head.add(part(sphere(0.022), nose, { shadow: false, position: [0, -0.005, 0.163] }));
  const ears: ThreeTypes.Group[] = [];
  for (const side of [-1, 1]) {
    head.add(part(sphere(0.018), eye, { shadow: false, position: [side * 0.048, 0.03, 0.11] }));
    head.add(part(sphere(0.006), pbr(0xffffff, { roughness: 0.2 }), { shadow: false, position: [side * 0.048 + 0.006, 0.037, 0.126] }));
    // Pricked ears with a pink inner.
    const ear = new THREE.Group();
    ear.position.set(side * 0.08, 0.11, -0.01);
    ear.rotation.set(-0.1, 0, side * -0.35);
    ear.add(part(new THREE.ConeGeometry(0.05, 0.12, 12), dark));
    ear.add(part(new THREE.ConeGeometry(0.03, 0.085, 10), pink, { shadow: false, position: [0, -0.012, 0.014], scale: [1, 1, 0.5] }));
    ear.userData.baseZ = ear.rotation.z;
    head.add(ear);
    ears.push(ear);
  }
  const tongue = part(sphere(0.022), pbr(0xff7b8a, { roughness: 0.35 }), { shadow: false, position: [0, -0.07, 0.13], scale: [1, 0.5, 0.7] });
  head.add(tongue);

  // Red collar with a brass tag.
  const neck = new THREE.Group();
  neck.position.set(0, 0.31, 0.06);
  neck.rotation.x = 0.35;
  neck.add(part(new THREE.TorusGeometry(0.105, 0.014, 12, 40), collar, { rotation: [Math.PI / 2, 0, 0] }));
  neck.add(part(new THREE.CylinderGeometry(0.018, 0.018, 0.006, 20), tag, { position: [0, -0.03, 0.105], rotation: [Math.PI / 2, 0, 0] }));
  body.add(neck);

  const tail = new THREE.Group();
  tail.position.set(0, 0.12, -0.2);
  tail.rotation.x = -0.9;
  body.add(tail);
  tail.add(part(new THREE.CapsuleGeometry(0.025, 0.1, 6, 12), tan, { position: [0, 0.07, 0] }));
  tail.add(part(sphere(0.022), white, { position: [0, 0.13, 0] }));

  return { puppy, body, head, tail, tongue, ears };
}

// ======================= World =======================
/**
 * Futuristic stage: a floating hover-pad with glowing panel seams, a pulsing
 * rim and thrusters, holographic UI panels, orbiting drones,
 * a flying saucer, and a ringed planet by day / moon and stars by night.
 */
function buildWorld(builder: Builder) {
  const { THREE, part, pbr } = builder;
  const random = seeded(42);
  const world = new THREE.Group();
  const R = 1.25;
  const CYAN_GLOW = 0x5ee7ff;

  const canvasTexture = (width: number, height: number, draw: (context: CanvasRenderingContext2D) => void) => {
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    draw(canvas.getContext("2d")!);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 4;
    return texture;
  };
  const glowTexture = (stops: Array<[number, string]>, size = 256) =>
    canvasTexture(size, size, (context) => {
      const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
      context.fillStyle = gradient;
      context.fillRect(0, 0, size, size);
    });
  const glowMaterial = (texture: ThreeTypes.Texture, opacity: number, additive = false) =>
    new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity,
      depthWrite: false,
      toneMapped: false,
      side: THREE.DoubleSide,
      blending: additive ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
  const neon = (color: number, opacity = 1) =>
    new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, toneMapped: false, depthWrite: opacity >= 1 });

  // ---------- Hover-pad deck ----------
  const deckSize = 1024;
  const drawDeck = (context: CanvasRenderingContext2D, glowOnly: boolean) => {
    const c = deckSize / 2;
    if (!glowOnly) {
      const base = context.createRadialGradient(c, c, 0, c, c, c);
      base.addColorStop(0, "#3a4356");
      base.addColorStop(1, "#232a38");
      context.fillStyle = base;
    } else context.fillStyle = "#000";
    context.fillRect(0, 0, deckSize, deckSize);
    context.translate(c, c);
    const seam = glowOnly ? "rgba(0,0,0,0)" : "#151a24";
    // Concentric panel seams and radial plate joints.
    context.lineWidth = 6;
    context.strokeStyle = seam;
    [0.36, 0.64, 0.9].forEach((r) => {
      context.beginPath();
      context.arc(0, 0, r * c, 0, Math.PI * 2);
      context.stroke();
    });
    for (let i = 0; i < 16; i += 1) {
      const a = (i / 16) * Math.PI * 2;
      context.beginPath();
      context.moveTo(Math.cos(a) * 0.36 * c, Math.sin(a) * 0.36 * c);
      context.lineTo(Math.cos(a) * 0.98 * c, Math.sin(a) * 0.98 * c);
      context.stroke();
    }
    if (!glowOnly) {
      // Rivets and lighter plate highlights.
      context.fillStyle = "#56607a";
      for (let i = 0; i < 48; i += 1) {
        const a = (i / 48) * Math.PI * 2;
        context.beginPath();
        context.arc(Math.cos(a) * 0.94 * c, Math.sin(a) * 0.94 * c, 5, 0, Math.PI * 2);
        context.fill();
      }
    }
    // Glowing lines: the landing circle, dashed guide ring and chevrons.
    context.strokeStyle = glowOnly ? "#5ee7ff" : "#7beaff";
    context.lineWidth = 9;
    context.beginPath();
    context.arc(0, 0, 0.28 * c, 0, Math.PI * 2);
    context.stroke();
    context.lineWidth = 5;
    context.setLineDash([22, 18]);
    context.beginPath();
    context.arc(0, 0, 0.5 * c, 0, Math.PI * 2);
    context.stroke();
    context.setLineDash([]);
    for (let i = 0; i < 4; i += 1) {
      context.save();
      context.rotate((i / 4) * Math.PI * 2 + Math.PI / 4);
      context.lineWidth = 7;
      context.beginPath();
      context.moveTo(-26, -0.78 * c);
      context.lineTo(0, -0.72 * c);
      context.lineTo(26, -0.78 * c);
      context.stroke();
      context.restore();
    }
  };
  const deckMap = canvasTexture(deckSize, deckSize, (context) => drawDeck(context, false));
  const deckGlow = canvasTexture(deckSize, deckSize, (context) => drawDeck(context, true));
  const deckMaterial = new THREE.MeshPhysicalMaterial({
    map: deckMap,
    emissiveMap: deckGlow,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 1.4,
    metalness: 0.75,
    roughness: 0.38,
    clearcoat: 0.4,
    clearcoatRoughness: 0.3,
  });
  const deck = part(new THREE.CircleGeometry(R, 96), deckMaterial, { shadow: false, rotation: [-Math.PI / 2, 0, 0], position: [0, 0.001, 0] });
  world.add(deck);

  const steel = pbr(0x3b4456, { roughness: 0.35, metalness: 0.85, clearcoat: 0.5 });
  const darkSteel = pbr(0x1f2533, { roughness: 0.45, metalness: 0.8 });
  const brightSteel = pbr(0x9aa6bd, { roughness: 0.25, metalness: 0.95, clearcoat: 0.6 });
  world.add(part(new THREE.CylinderGeometry(R, R, 0.08, 96), steel, { position: [0, -0.04, 0] }));
  world.add(part(new THREE.TorusGeometry(R, 0.045, 16, 128), brightSteel, { rotation: [Math.PI / 2, 0, 0], position: [0, -0.01, 0] }));
  const rimGlow = neon(CYAN_GLOW);
  const rim = new THREE.Mesh(new THREE.TorusGeometry(R + 0.035, 0.014, 10, 160), rimGlow);
  rim.rotation.x = Math.PI / 2;
  rim.position.y = -0.055;
  world.add(rim);

  // Underside: stepped hull tapering to the thruster.
  world.add(part(new THREE.CylinderGeometry(R - 0.02, 0.62, 0.3, 96), darkSteel, { position: [0, -0.23, 0] }));
  world.add(part(new THREE.TorusGeometry(0.64, 0.03, 12, 96), brightSteel, { rotation: [Math.PI / 2, 0, 0], position: [0, -0.385, 0] }));
  world.add(part(new THREE.CylinderGeometry(0.6, 0.32, 0.28, 64), steel, { position: [0, -0.53, 0] }));
  world.add(part(new THREE.CylinderGeometry(0.3, 0.24, 0.1, 48), darkSteel, { position: [0, -0.72, 0] }));
  // Hull vents with blinking status lights.
  const blinkers: Array<{ mesh: ThreeTypes.Mesh; phase: number }> = [];
  for (let i = 0; i < 12; i += 1) {
    const a = (i / 12) * Math.PI * 2;
    const vent = new THREE.Group();
    vent.position.set(Math.cos(a) * 0.98, -0.2, Math.sin(a) * 0.98);
    vent.rotation.y = -a + Math.PI / 2;
    vent.rotation.x = 0.0;
    vent.add(part(new THREE.BoxGeometry(0.16, 0.06, 0.03), brightSteel, { shadow: false }));
    const light = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 8), neon(i % 3 === 0 ? 0xff8a3d : CYAN_GLOW));
    light.position.set(0.1, 0, 0.02);
    vent.add(light);
    world.add(vent);
    blinkers.push({ mesh: light, phase: i * 0.9 });
  }
  // Thruster: glowing ring, hot core and a soft beam below.
  const thrusterRing = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.025, 12, 48), neon(CYAN_GLOW));
  thrusterRing.rotation.x = Math.PI / 2;
  thrusterRing.position.y = -0.775;
  world.add(thrusterRing);
  const core = new THREE.Mesh(new THREE.CircleGeometry(0.19, 48), neon(0xd8fbff));
  core.rotation.x = Math.PI / 2;
  core.position.y = -0.772;
  world.add(core);
  const beamTexture = canvasTexture(64, 256, (context) => {
    const gradient = context.createLinearGradient(0, 0, 0, 256);
    gradient.addColorStop(0, "rgba(140,240,255,0.9)");
    gradient.addColorStop(1, "rgba(140,240,255,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 64, 256);
  });
  const beam = new THREE.Mesh(new THREE.CylinderGeometry(0.19, 0.42, 0.9, 40, 1, true), glowMaterial(beamTexture, 0.55, true));
  beam.position.y = -1.22;
  world.add(beam);

  // Antenna pylons around the rim with blinking tips.
  for (let i = 0; i < 6; i += 1) {
    const a = (i / 6) * Math.PI * 2 + Math.PI / 6;
    if (Math.sin(a) > 0.5) continue; // keep the front edge clear
    const x = Math.cos(a) * (R - 0.08);
    const z = Math.sin(a) * (R - 0.08);
    world.add(part(new THREE.CylinderGeometry(0.035, 0.05, 0.08, 16), brightSteel, { position: [x, 0.04, z] }));
    world.add(part(new THREE.CylinderGeometry(0.008, 0.012, 0.38, 8), steel, { position: [x, 0.27, z] }));
    const tip = new THREE.Mesh(new THREE.SphereGeometry(0.022, 12, 8), neon(i % 2 ? 0xff5a5a : CYAN_GLOW));
    tip.position.set(x, 0.47, z);
    world.add(tip);
    blinkers.push({ mesh: tip, phase: i * 1.7 });
  }

  // Cyan bounce light from the deck so the robot picks up the glow.
  const deckLight = new THREE.PointLight(CYAN_GLOW, 1.4, 3.2, 1.6);
  deckLight.position.set(0, 0.25, 0.55);
  world.add(deckLight);

  // ---------- Holo rings around the robot ----------
  const holo = (opacity: number) =>
    new THREE.MeshBasicMaterial({ color: CYAN_GLOW, transparent: true, opacity, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
  const floorRing = new THREE.Mesh(new THREE.RingGeometry(0.42, 0.46, 96), holo(0.7));
  floorRing.rotation.x = -Math.PI / 2;
  floorRing.position.y = 0.01;
  world.add(floorRing);

  // ---------- Holographic UI panels ----------
  const panelTexture = (kind: number) =>
    canvasTexture(512, 320, (context) => {
      context.fillStyle = "rgba(30,160,200,0.14)";
      context.fillRect(0, 0, 512, 320);
      context.strokeStyle = "rgba(120,240,255,0.95)";
      context.lineWidth = 6;
      context.strokeRect(6, 6, 500, 308);
      context.fillStyle = "rgba(120,240,255,0.95)";
      context.fillRect(6, 6, 500, 38);
      context.fillStyle = "#06222c";
      context.font = "bold 22px monospace";
      context.fillText(["SYS // ONLINE", "AI.CORE v2.6", "RADAR // SCAN"][kind], 22, 33);
      context.fillStyle = "rgba(160,245,255,0.95)";
      context.strokeStyle = "rgba(160,245,255,0.95)";
      if (kind === 0) {
        for (let i = 0; i < 9; i += 1) {
          const h = 40 + ((i * 37) % 170);
          context.fillRect(34 + i * 50, 290 - h, 30, h);
        }
      } else if (kind === 1) {
        context.font = "20px monospace";
        ["> load model('llm')", "> embed(docs) ... ok", "> rag.query(user)", "> agent.run()", "> deploy --prod", "  status: 200 OK"].forEach((line, i) => {
          context.fillText(line, 24, 84 + i * 36);
        });
      } else {
        context.lineWidth = 3;
        [40, 80, 120].forEach((r) => {
          context.beginPath();
          context.arc(256, 180, r, 0, Math.PI * 2);
          context.stroke();
        });
        context.beginPath();
        context.moveTo(256, 180);
        context.lineTo(256 + 118, 120);
        context.stroke();
        [[300, 140], [210, 230], [330, 220]].forEach(([x, y]) => {
          context.beginPath();
          context.arc(x, y, 7, 0, Math.PI * 2);
          context.fill();
        });
      }
    });
  const panels: Array<{ mesh: ThreeTypes.Mesh; baseY: number; phase: number }> = [];
  ([
    [-0.95, 1.55, -0.35, 0.45],
    [0.98, 1.3, -0.45, -0.5],
    [-0.75, 0.75, 0.25, 0.7],
  ] as const).forEach(([x, y, z, turnY], kind) => {
    const material = glowMaterial(panelTexture(kind), 0.92, true);
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(0.52, 0.325), material);
    mesh.position.set(x, y, z);
    mesh.rotation.set(0, turnY, 0);
    world.add(mesh);
    panels.push({ mesh, baseY: y, phase: kind * 2.1 });
  });

  // ---------- Drones orbiting the pad ----------
  const drones: Array<{ group: ThreeTypes.Group; rotors: ThreeTypes.Object3D[]; eye: ThreeTypes.Mesh; phase: number; radius: number; height: number }> = [];
  [[0, 1.15, 1.55], [Math.PI, 1.35, 0.95]].forEach(([phase, radius, height]) => {
    const group = new THREE.Group();
    group.add(part(new THREE.SphereGeometry(0.06, 24, 16), brightSteel, { scale: [1, 0.55, 1] }));
    group.add(part(new THREE.SphereGeometry(0.035, 20, 12), darkSteel, { position: [0, -0.02, 0], scale: [1, 0.6, 1] }));
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 8), neon(CYAN_GLOW));
    eye.position.set(0, -0.005, 0.055);
    group.add(eye);
    const rotors: ThreeTypes.Object3D[] = [];
    for (let i = 0; i < 4; i += 1) {
      const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
      group.add(part(new THREE.BoxGeometry(0.11, 0.008, 0.012), steel, { shadow: false, position: [Math.cos(a) * 0.06, 0.008, Math.sin(a) * 0.06], rotation: [0, -a, 0] }));
      const rotor = new THREE.Mesh(new THREE.CircleGeometry(0.04, 20), new THREE.MeshBasicMaterial({ color: 0xcfe9ff, transparent: true, opacity: 0.35, side: THREE.DoubleSide, depthWrite: false }));
      rotor.rotation.x = -Math.PI / 2;
      rotor.position.set(Math.cos(a) * 0.115, 0.016, Math.sin(a) * 0.115);
      group.add(rotor);
      rotors.push(rotor);
    }
    world.add(group);
    drones.push({ group, rotors, eye, phase, radius, height });
  });

  // ---------- Day: a ringed planet; night: moon and stars ----------
  const sun = new THREE.Group();
  sun.position.set(1.15, 2.3, -1.6);
  const planetTexture = canvasTexture(512, 256, (context) => {
    const bands = ["#ffb26b", "#ffd29a", "#f59a5c", "#ffe0b8", "#f7a86e", "#ffc585", "#ec8f55", "#ffd8a8"];
    let y = 0;
    while (y < 256) {
      const h = 10 + random() * 26;
      context.fillStyle = bands[Math.floor(random() * bands.length)];
      context.fillRect(0, y, 512, h);
      y += h;
    }
    context.globalAlpha = 0.25;
    for (let i = 0; i < 40; i += 1) {
      context.fillStyle = random() > 0.5 ? "#fff1dc" : "#c9703f";
      context.fillRect(random() * 512, random() * 256, 40 + random() * 120, 2 + random() * 4);
    }
  });
  const planet = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 64, 48),
    new THREE.MeshStandardMaterial({ map: planetTexture, roughness: 0.9, emissive: 0xff9a50, emissiveIntensity: 0.18 }),
  );
  planet.rotation.z = 0.35;
  sun.add(planet);
  const ringTexture = canvasTexture(512, 16, (context) => {
    for (let x = 0; x < 512; x += 1) {
      const t = x / 512;
      const alpha = 0.15 + 0.6 * Math.abs(Math.sin(t * 19)) * (1 - Math.abs(t - 0.5) * 1.2);
      context.fillStyle = `rgba(255, 222, 180, ${alpha.toFixed(3)})`;
      context.fillRect(x, 0, 1, 16);
    }
  });
  const ringGeometry = new THREE.RingGeometry(0.4, 0.62, 128, 1);
  {
    // Map the strip texture radially across the ring.
    const position = ringGeometry.attributes.position as ThreeTypes.BufferAttribute;
    const uv = ringGeometry.attributes.uv as ThreeTypes.BufferAttribute;
    for (let i = 0; i < position.count; i += 1) {
      const r = Math.hypot(position.getX(i), position.getY(i));
      uv.setXY(i, (r - 0.4) / 0.22, 0.5);
    }
  }
  const rays = new THREE.Mesh(ringGeometry, new THREE.MeshBasicMaterial({ map: ringTexture, transparent: true, side: THREE.DoubleSide, depthWrite: false, toneMapped: false }));
  rays.rotation.set(1.2, 0.2, 0.35);
  sun.add(rays);
  const planetGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    glowMaterial(glowTexture([[0, "rgba(255,200,140,0.5)"], [0.4, "rgba(255,170,110,0.16)"], [0.75, "rgba(255,160,100,0)"], [1, "rgba(255,160,100,0)"]]), 1),
  );
  planetGlow.scale.setScalar(1.7);
  planetGlow.position.z = -0.35;
  sun.add(planetGlow);
  world.add(sun);

  const moon = new THREE.Group();
  moon.position.copy(sun.position);
  const moonSurface = new THREE.MeshStandardMaterial({ color: 0xe9edf6, roughness: 0.95, emissive: 0xc9d4ff, emissiveIntensity: 0.32 });
  moon.add(new THREE.Mesh(roughen(new THREE.SphereGeometry(0.26, 64, 48), 0.004, 6, 17), moonSurface));
  const craterMaterial = new THREE.MeshStandardMaterial({ color: 0xa3abbe, roughness: 1, emissive: 0x7c88ac, emissiveIntensity: 0.25 });
  ([[-0.09, 0.08, 0.05], [0.07, -0.06, 0.04], [0.1, 0.1, 0.028], [-0.04, -0.12, 0.03], [-0.13, -0.02, 0.022]] as const).forEach(([cx, cy, r]) => {
    const cz = Math.sqrt(Math.max(0, 0.26 * 0.26 - cx * cx - cy * cy));
    const crater = new THREE.Mesh(new THREE.SphereGeometry(r, 20, 14), craterMaterial);
    crater.position.set(cx, cy, cz - r * 0.55);
    crater.scale.set(1, 1, 0.35);
    crater.lookAt(cx * 4, cy * 4, cz * 4);
    moon.add(crater);
  });
  const moonGlow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    glowMaterial(glowTexture([[0, "rgba(220,230,255,0.75)"], [0.32, "rgba(170,190,255,0.32)"], [0.6, "rgba(130,150,240,0.08)"], [0.8, "rgba(120,140,230,0)"], [1, "rgba(120,140,230,0)"]]), 1),
  );
  moonGlow.scale.setScalar(1.6);
  moonGlow.position.z = -0.03;
  moon.add(moonGlow);
  moon.scale.setScalar(0.001);
  moon.visible = false;
  world.add(moon);

  const starCount = 120;
  const starPositions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i += 1) {
    starPositions.set([(random() - 0.5) * 3.6, 1.15 + random() * 2.1, -2.2 - random() * 0.6], i * 3);
  }
  const starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", new THREE.Float32BufferAttribute(starPositions, 3));
  const starMaterial = new THREE.PointsMaterial({
    color: 0xfdf6d8,
    size: 0.055,
    map: glowTexture([[0, "rgba(255,255,255,1)"], [0.35, "rgba(255,250,220,0.6)"], [1, "rgba(255,250,220,0)"]], 64),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    toneMapped: false,
  });
  const stars = new THREE.Points(starGeometry, starMaterial);
  stars.visible = false;
  world.add(stars);

  const sparkleTexture = canvasTexture(128, 128, (context) => {
    const glow = context.createRadialGradient(64, 64, 0, 64, 64, 30);
    glow.addColorStop(0, "rgba(255,255,240,1)");
    glow.addColorStop(1, "rgba(255,245,200,0)");
    context.fillStyle = glow;
    context.fillRect(0, 0, 128, 128);
    context.fillStyle = "rgba(255,252,230,0.95)";
    context.beginPath();
    for (let i = 0; i < 8; i += 1) {
      const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const radius = i % 2 === 0 ? 62 : 9;
      context.lineTo(64 + Math.cos(angle) * radius, 64 + Math.sin(angle) * radius);
    }
    context.closePath();
    context.fill();
  });
  const sparkles: Array<{ mesh: ThreeTypes.Mesh; material: ThreeTypes.MeshBasicMaterial; phase: number; size: number }> = [];
  ([[-1.35, 2.85, 0.32], [-0.35, 3.15, 0.24], [0.45, 2.75, 0.2], [1.6, 3.05, 0.26], [-1.6, 1.9, 0.2], [1.75, 1.75, 0.18]] as const).forEach(([x, y, size], i) => {
    const material = new THREE.MeshBasicMaterial({ map: sparkleTexture, transparent: true, opacity: 0, depthWrite: false, toneMapped: false });
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material);
    mesh.position.set(x, y, -2.1);
    mesh.scale.setScalar(size);
    mesh.visible = false;
    world.add(mesh);
    sparkles.push({ mesh, material, phase: i * 1.3, size });
  });

  // ---------- Spaceships crossing the sky ----------
  const saucerLights = [0x5ee7ff, 0xff8a3d, 0xb48cff, 0x7dff9a];
  const buildSaucer = (scale: number) => {
    const ship = new THREE.Group();
    const body = new THREE.Group();
    ship.add(body);
    body.add(part(new THREE.SphereGeometry(0.22, 48, 24), brightSteel, { shadow: false, scale: [1, 0.22, 1] }));
    body.add(part(new THREE.TorusGeometry(0.21, 0.018, 10, 64), steel, { shadow: false, rotation: [Math.PI / 2, 0, 0] }));
    body.add(part(new THREE.SphereGeometry(0.09, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2), pbr(0x8ff1ff, { roughness: 0.05, metalness: 0.1, clearcoat: 1, opacity: 0.75, emissive: 0x2bb8d8, emissiveIntensity: 0.4 }), { shadow: false, position: [0, 0.035, 0] }));
    const lights: ThreeTypes.Mesh[] = [];
    for (let i = 0; i < 10; i += 1) {
      const a = (i / 10) * Math.PI * 2;
      const light = new THREE.Mesh(new THREE.SphereGeometry(0.012, 8, 6), neon(saucerLights[i % saucerLights.length]));
      light.position.set(Math.cos(a) * 0.17, -0.03, Math.sin(a) * 0.17);
      body.add(light);
      lights.push(light);
    }
    const tractor = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), neon(CYAN_GLOW, 0.9));
    tractor.rotation.x = Math.PI / 2;
    tractor.position.y = -0.05;
    body.add(tractor);
    ship.scale.setScalar(scale);
    world.add(ship);
    return { ship, body, lights };
  };
  const ships = [
    { ...buildSaucer(1), speed: 0.3, y: 2.95, z: -1.4, dir: 1, offset: 0 },
    { ...buildSaucer(0.55), speed: 0.16, y: 2.35, z: -2.1, dir: -1, offset: 2.6 },
  ];
  ships.forEach((ship) => {
    ship.ship.position.set(ship.dir > 0 ? -3.2 + ship.offset : 3.2 - ship.offset, ship.y, ship.z);
  });

  function update(elapsed: number, delta: number) {
    // Deck and rim pulse gently; thruster flickers.
    const pulse = 0.5 + 0.5 * Math.sin(elapsed * 2.2);
    deckMaterial.emissiveIntensity = 1.1 + pulse * 0.6;
    rimGlow.color.setHSL(0.53, 1, 0.55 + pulse * 0.12);
    const flicker = 0.85 + Math.sin(elapsed * 31) * 0.06 + Math.sin(elapsed * 17) * 0.05;
    (beam.material as ThreeTypes.MeshBasicMaterial).opacity = 0.5 * flicker;
    beam.scale.set(1, 0.95 + flicker * 0.1, 1);
    core.scale.setScalar(0.92 + flicker * 0.1);
    blinkers.forEach(({ mesh, phase }) => {
      mesh.visible = Math.sin(elapsed * 2.6 + phase) > -0.3;
    });
    deckLight.intensity = 1.1 + pulse * 0.6;

    // The holo ring on the deck breathes.
    floorRing.scale.setScalar(1 + pulse * 0.06);
    (floorRing.material as ThreeTypes.MeshBasicMaterial).opacity = 0.45 + pulse * 0.35;

    panels.forEach(({ mesh, baseY, phase }) => {
      mesh.position.y = baseY + Math.sin(elapsed * 1.1 + phase) * 0.04;
      (mesh.material as ThreeTypes.MeshBasicMaterial).opacity = 0.8 + Math.sin(elapsed * 7 + phase) * 0.04 + (Math.sin(elapsed * 0.7 + phase) > 0.97 ? -0.4 : 0);
    });

    drones.forEach(({ group, rotors, eye, phase, radius, height }) => {
      const t = elapsed * 0.42 + phase;
      group.position.set(Math.sin(t) * radius, height + Math.sin(t * 2.1) * 0.08, Math.cos(t) * radius * 0.6);
      group.rotation.set(Math.sin(t * 2.1) * 0.08, t + Math.PI / 2, Math.cos(t) * 0.18);
      rotors.forEach((rotor, i) => {
        rotor.rotation.z = elapsed * 40 + i;
      });
      eye.visible = Math.sin(elapsed * 3 + phase) > -0.6;
    });

    rays.rotation.z = 0.35 + Math.sin(elapsed * 0.1) * 0.02;
    planet.rotation.y = elapsed * 0.08;

    ships.forEach((ship) => {
      ship.ship.position.x += delta * ship.speed * ship.dir;
      if (ship.dir > 0 && ship.ship.position.x > 3.4) ship.ship.position.x = -3.4;
      if (ship.dir < 0 && ship.ship.position.x < -3.4) ship.ship.position.x = 3.4;
      ship.ship.position.y = ship.y + Math.sin(elapsed * 0.8 + ship.offset) * 0.05;
      ship.body.rotation.set(Math.sin(elapsed * 0.9 + ship.offset) * 0.06, elapsed * 1.5 * ship.dir, -0.12 * ship.dir);
      ship.lights.forEach((light, i) => {
        light.visible = (Math.floor(elapsed * 6) + i) % 3 !== 0;
      });
    });
  }

  // The deck is flat at y = 0.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const groundAt = (_x: number, _z: number) => 0;
  return { world, sun, moon, stars, starMaterial, sparkles, update, groundAt };
}

// ======================= Component =======================
export function ToyAvatar() {
  const stageRef = useRef<HTMLElement>(null);
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "fallback">("loading");

  useEffect(() => {
    const stage = stageRef.current;
    const host = hostRef.current;
    if (!stage || !host) return;
    let disposed = false;
    let destroy = () => {};

    async function build() {
      const THREE = await import("three");
      if (disposed) return;

      let renderer: ThreeTypes.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
      } catch {
        setStatus("fallback");
        return;
      }
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.domElement.className = "hero-orbit__canvas hero-avatar3d__canvas";
      renderer.domElement.setAttribute("aria-hidden", "true");
      host!.appendChild(renderer.domElement);

      const { builder, track, disposables } = createToonKit(THREE);
      disposables.add(renderer);

      // ---------- Scene ----------
      const scene = new THREE.Scene();
      const rig = new THREE.Group();
      scene.add(rig);

      const { world, sun, moon, stars, starMaterial, sparkles, update: updateWorld, groundAt } = buildWorld(builder);
      rig.add(world);

      // The robot loads in after the island is up; this group holds it.
      const character = new THREE.Group();
      character.position.set(-0.05, groundAt(-0.05, 0.05), 0.05);
      character.rotation.y = 0.12;
      rig.add(character);


      // Soft contact shadows on the grass (the key light adds the real cast shadows).
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 128;
      const shadowContext = shadowCanvas.getContext("2d")!;
      const gradient = shadowContext.createRadialGradient(64, 64, 4, 64, 64, 64);
      gradient.addColorStop(0, "rgba(14,40,14,0.32)");
      gradient.addColorStop(1, "rgba(14,40,14,0)");
      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 128, 128);
      const shadowTexture = track(new THREE.CanvasTexture(shadowCanvas));
      const shadowMaterial = track(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
      const addShadow = (x: number, z: number, w: number, d: number) => {
        const mesh = new THREE.Mesh(track(new THREE.PlaneGeometry(w, d)), shadowMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x, groundAt(x, z) + 0.006, z);
        rig.add(mesh);
        return mesh;
      };
      const characterShadow = addShadow(-0.05, 0.08, 0.8, 0.36);

      const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const lighting = await lightScene(THREE, renderer, scene, { shadows: true });
      if (disposed) {
        lighting.dispose();
        return;
      }
      disposables.add(lighting);

      // ---------- Day / night: follows the site's theme toggle ----------
      const isNight = () => document.documentElement.dataset.theme === "dark";
      let nightTarget = isNight() ? 1 : 0;
      let night = nightTarget;
      const dayKey = new THREE.Color(0xfff1dc);
      const nightKey = new THREE.Color(0xaebfff);
      const dayRim = new THREE.Color(0xffc98a);
      const nightRim = new THREE.Color(0x8ea6ff);
      const daySky = new THREE.Color(0xdcefff);
      const nightSky = new THREE.Color(0x6f80c8);
      const dayGround = new THREE.Color(0x4a5468);
      const nightGround = new THREE.Color(0x1c2233);
      function applyNight() {
        const t = night * night * (3 - 2 * night);
        lighting.key.color.copy(dayKey).lerp(nightKey, t);
        lighting.key.intensity = 2.6 - t * 1.25;
        lighting.rim.color.copy(dayRim).lerp(nightRim, t);
        lighting.rim.intensity = 1.5 - t * 0.4;
        lighting.sky.color.copy(daySky).lerp(nightSky, t);
        lighting.sky.groundColor.copy(dayGround).lerp(nightGround, t);
        lighting.sky.intensity = 0.75 - t * 0.25;
        scene.environmentIntensity = 0.55 - t * 0.25;
        renderer.toneMappingExposure = 1.12 - t * 0.1;
        sun.visible = t < 0.999;
        sun.scale.setScalar(Math.max(0.001, 1 - t));
        moon.visible = t > 0.001;
        moon.scale.setScalar(Math.max(0.001, t));
        stars.visible = t > 0.001;
        starMaterial.opacity = t * (0.85 + Math.sin(elapsed * 2.3) * 0.15);
        sparkles.forEach(({ mesh, material, phase, size }) => {
          const twinkle = 0.55 + 0.45 * Math.sin(elapsed * 1.8 + phase);
          mesh.visible = t > 0.001;
          material.opacity = t * twinkle;
          mesh.scale.setScalar(size * (0.8 + 0.3 * twinkle));
          mesh.rotation.z = Math.sin(elapsed * 0.4 + phase) * 0.2;
        });
      }
      const themeObserver = new MutationObserver(() => {
        nightTarget = isNight() ? 1 : 0;
        if (reducedQuery.matches) {
          night = nightTarget;
          applyNight();
          render();
        }
        sync();
      });
      themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

      // ---------- Robot ----------
      type Robot = {
        rig: RobotRig;
        mover: ReturnType<typeof createMover>;
        poser: ReturnType<typeof createRobotPoser>;
        age: number;
      };
      let robot: Robot | null = null;
      let clickIndex = 0;
      let idleFor = 0;
      let nextIdleMove = 9;
      let lookWeight = 1;

      loadRobot(THREE, (item) => disposables.add(item))
        .then((rig) => {
          if (disposed) return;
          character.add(rig.root);
          robot = { rig, mover: createMover(THREE, rig), poser: createRobotPoser(THREE, rig, character), age: 0 };
          sync();
        })
        .catch(() => {
          // The stage still works without the robot.
        });

      function playMove(name: string) {
        if (robot?.mover.play(name)) idleFor = 0;
      }

      function updateRobot(delta: number) {
        if (!robot) return;
        robot.age += delta;
        robot.rig.mixer.update(delta);
        // Head follows the cursor, mostly while idling.
        lookWeight += ((robot.mover.busy ? 0.25 : 1) - lookWeight) * (1 - Math.exp(-delta * 4));
        robot.poser.apply(gaze.x * 0.85 * lookWeight, -gaze.y * 0.45 * lookWeight);
        // Every so often while idle, do a small gesture on his own.
        if (!robot.mover.busy) {
          idleFor += delta;
          if (idleFor > nextIdleMove) {
            playMove(IDLE_MOVES[Math.floor(Math.random() * IDLE_MOVES.length)]);
            nextIdleMove = 12 + Math.random() * 8;
          }
        }
      }

      // ---------- Camera ----------
      const camera = new THREE.PerspectiveCamera(30, 1, 0.05, 60);
      const lookTarget = new THREE.Vector3(0, 0.9, 0);
      function frame() {
        const width = Math.max(1, stage!.clientWidth);
        const height = Math.max(1, stage!.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
        // Fit the island, character and sun: about 4.1 tall and 3.0 wide.
        const distance = Math.max(2.05 / Math.tan(halfFov), 1.5 / (Math.tan(halfFov) * camera.aspect));
        camera.position.set(0, 1.5, distance);
        camera.lookAt(lookTarget);
        camera.updateProjectionMatrix();
      }

      // ---------- Interaction ----------
      const gaze = new THREE.Vector2();
      const gazeTarget = new THREE.Vector2();
      let dragging = false;
      let dragMoved = 0;
      let lastX = 0;
      let dragYaw = 0;
      let dragVelocity = 0;

      // The scroll guide borrows Suraj from the island while it follows the reader.
      let presenceTarget = 1;
      let presence = 1;
      function onGuide(event: Event) {
        presenceTarget = (event as CustomEvent<{ away: boolean }>).detail?.away ? 0 : 1;
        sync();
      }

      let lastPointer = -10;
      function onPointerMove(event: PointerEvent) {
        lastPointer = elapsed;
        const rect = stage!.getBoundingClientRect();
        const faceX = rect.left + rect.width / 2;
        const faceY = rect.top + rect.height * 0.3;
        gazeTarget.set(
          THREE.MathUtils.clamp((event.clientX - faceX) / (window.innerWidth * 0.45), -1, 1),
          THREE.MathUtils.clamp((faceY - event.clientY) / (window.innerHeight * 0.55), -1, 1),
        );
        if (dragging) {
          const dx = event.clientX - lastX;
          lastX = event.clientX;
          dragMoved += Math.abs(dx);
          dragVelocity = dx * 0.01;
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
        if (renderer.domElement.hasPointerCapture(event.pointerId)) {
          renderer.domElement.releasePointerCapture(event.pointerId);
        }
        if (dragMoved < 6) {
          playMove(CLICK_MOVES[clickIndex % CLICK_MOVES.length]);
          clickIndex += 1;
        }
      }
      function resetGaze() {
        gazeTarget.set(0, 0);
      }

      // ---------- Animation ----------
      const clock = new THREE.Clock();
      let rafId = 0;
      let visible = true;
      let elapsed = 0;
      let intro = 0;
      let introWaveDone = false;

      function pose(delta: number) {
        elapsed += delta;
        intro = Math.min(1, intro + delta / 1.1);
        if (!introWaveDone && robot && robot.age > 0.8) {
          introWaveDone = true;
          playMove("Waving");
          clickIndex = 1;
        }
        // With no recent cursor movement, glance around on his own.
        if (elapsed - lastPointer > 3) {
          gazeTarget.set(
            Math.sin(elapsed * 0.45) * 0.45 + Math.sin(elapsed * 1.3) * 0.08,
            Math.sin(elapsed * 0.31 + 1) * 0.18,
          );
        }
        gaze.lerp(gazeTarget, 1 - Math.exp(-delta * 7));

        // --- Robot ---
        updateRobot(delta);

        // --- World ---
        updateWorld(elapsed, delta);
        night += (nightTarget - night) * (1 - Math.exp(-delta * 3));
        if (Math.abs(nightTarget - night) < 0.001) night = nightTarget;
        applyNight();
        if (night < 0.999) sun.scale.multiplyScalar(1 + Math.sin(elapsed * 1.5) * 0.015);
        moon.rotation.z = Math.sin(elapsed * 0.2) * 0.05;

        // --- Whole island: float, cursor parallax, drag spin with spring back ---
        if (!dragging) {
          dragYaw += dragVelocity;
          dragVelocity *= 0.93;
          dragYaw *= 0.95;
        }
        const ease = 1 - Math.pow(1 - intro, 3);
        rig.rotation.y = dragYaw + gaze.x * 0.18;
        rig.rotation.x = -gaze.y * 0.04;
        rig.position.y = Math.sin(elapsed * 0.9) * 0.04 + (1 - ease) * -0.5;
        rig.scale.setScalar(0.85 + ease * 0.15);
        // Pop off / back onto the island when the scroll guide takes over.
        presence += (presenceTarget - presence) * (1 - Math.exp(-delta * 9));
        const arrive = robot ? 1 - Math.pow(1 - Math.min(1, robot.age / 0.7), 3) : 0;
        const shown = presence * arrive;
        character.visible = shown > 0.02;
        character.scale.setScalar(Math.max(0.001, shown));
        character.position.y = groundAt(-0.05, 0.05) + (1 - presence) * 0.6;
        characterShadow.scale.setScalar(Math.max(0.001, shown));
      }

      function render() {
        renderer.render(scene, camera);
      }
      function tick() {
        rafId = 0;
        if (disposed || !visible || document.hidden) return;
        pose(Math.min(clock.getDelta(), 0.05));
        render();
        rafId = requestAnimationFrame(tick);
      }
      function sync() {
        if (disposed) return;
        const run = visible && !document.hidden && !reducedQuery.matches;
        if (run && !rafId) {
          clock.getDelta();
          rafId = requestAnimationFrame(tick);
        } else if (!run) {
          cancelAnimationFrame(rafId);
          rafId = 0;
          if (reducedQuery.matches) {
            intro = 1;
            pose(0);
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
      window.addEventListener(GUIDE_EVENT, onGuide);
      window.addEventListener("blur", resetGaze);
      document.documentElement.addEventListener("pointerleave", resetGaze);
      renderer.domElement.addEventListener("pointerdown", onPointerDown);
      renderer.domElement.addEventListener("pointerup", onPointerUp);
      renderer.domElement.addEventListener("pointercancel", onPointerUp);
      document.addEventListener("visibilitychange", sync);
      reducedQuery.addEventListener("change", sync);

      destroy = () => {
        cancelAnimationFrame(rafId);
        themeObserver.disconnect();
        resizeObserver.disconnect();
        visibility.disconnect();
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener(GUIDE_EVENT, onGuide);
        window.removeEventListener("blur", resetGaze);
        document.documentElement.removeEventListener("pointerleave", resetGaze);
        document.removeEventListener("visibilitychange", sync);
        reducedQuery.removeEventListener("change", sync);
        disposables.forEach((item) => item.dispose());
        renderer.forceContextLoss();
        renderer.domElement.remove();
      };

      // Development-only hook for stepping the animation from devtools.
      if (process.env.NODE_ENV !== "production") {
        Object.assign(window, {
          __toyAvatar: {
            step(seconds: number) {
              for (let t = 0; t < seconds; t += 1 / 30) pose(1 / 30);
              render();
            },
            wave() {
              playMove("Waving");
            },
            move(name: string) {
              playMove(name);
            },
            look(x: number, y: number) {
              lastPointer = elapsed + 1000;
              gazeTarget.set(x, y);
              gaze.set(x, y);
            },
            closeUp(target: "face" | "body" | "off") {
              if (target === "off") {
                frame();
              } else {
                const y = target === "face" ? 1.5 : 1.0;
                camera.position.set(0, y, target === "face" ? 1.1 : 3.4);
                camera.lookAt(0, y, 0);
              }
              render();
            },
          },
        });
      }

      frame();
      pose(0);
      render();
      sync();
      setStatus("ready");
    }

    build().catch(() => {
      if (!disposed) setStatus("fallback");
    });
    return () => {
      disposed = true;
      destroy();
    };
  }, []);

  return (
    <figure ref={stageRef} className={`hero-orbit hero-avatar3d hero-world hero-orbit--${status}`}>
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
        A futuristic 3D scene of a robot standing on a floating hover-pad with glowing rings,
        holographic panels, orbiting drones and flying saucers, under a ringed planet by day or a
        moon and stars by night. The robot follows the cursor with its head, waves,
        salutes, claps or dances when clicked, and the island can be dragged to spin. Robot model
        rig by Beneth Borromeo (CC BY 4.0), animations from Adobe Mixamo, fan-made Chappie
        character © Sony Pictures / MRC.
      </figcaption>
    </figure>
  );
}
