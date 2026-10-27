"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type * as ThreeTypes from "three";

import "./hero-orbit.css";

/**
 * A complete 3D hero scene built in code: Suraj standing on a floating grass
 * island with trees, flowers, a puppy, butterflies, drifting clouds and a
 * glowing sun. Rendered with physically based materials, procedural textures,
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
  tee: 0x151517,
  jeans: 0x2b3449,
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
const smoothstep = (edge0: number, edge1: number, x: number) =>
  smooth(Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0))));
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
 * short textured hair swept up and over to his right. Dressed as in the
 * photo: black crew-neck tee, dark jeans and white sneakers.
 */
export function buildCharacter({ THREE, part, pbr }: Builder) {
  const skinSurface: Surface = { roughness: 0.62, sheen: 0.35, sheenRoughness: 0.6, sheenColor: 0xffc9ad };
  const hairSurface: Surface = { roughness: 0.42, sheen: 0.6, sheenRoughness: 0.35, sheenColor: 0x4a3a33 };
  const mat = {
    skin: pbr(C.skin, skinSurface),
    skinShade: pbr(C.skinShade, skinSurface),
    hair: pbr(C.hair, hairSurface),
    hairLight: pbr(0x2b211c, hairSurface),
    tee: pbr(C.tee, { roughness: 0.96, sheen: 0.35, sheenRoughness: 0.75, sheenColor: 0x45454c, texture: "cloth", bumpScale: 0.005 }),
    rib: pbr(0x202024, { roughness: 0.95, texture: "cloth", bumpScale: 0.006 }),
    jeans: pbr(C.jeans, { roughness: 0.95, sheen: 0.2, sheenColor: 0x6f7fa0, texture: "cloth", bumpScale: 0.008 }),
    sneaker: pbr(0xf3f1ea, { roughness: 0.55, clearcoat: 0.2, clearcoatRoughness: 0.4 }),
    sole: pbr(0xd8d4cb, { roughness: 0.75 }),
    lace: pbr(0xffffff, { roughness: 0.85 }),
    white: pbr(0xfaf8f5, { roughness: 0.18 }),
    iris: pbr(0x3a2214, { roughness: 0.2 }),
    irisRing: pbr(0x1f120a, { roughness: 0.2 }),
    pupil: pbr(0x070403, { roughness: 0.1 }),
    lash: pbr(0x1a120e, { roughness: 0.7 }),
    lipLine: pbr(0x8a4a42, { roughness: 0.5 }),
    lips: pbr(C.lips, { roughness: 0.45, sheen: 0.3, sheenColor: 0xffb0a0 }),
    mouthInside: pbr(0x7a2a26, { roughness: 0.6 }),
    teeth: pbr(0xfffdf8, { roughness: 0.25 }),
    tongue: pbr(0xe0645e, { roughness: 0.4 }),
    brow: pbr(0x15100d, { roughness: 0.8 }),
    nostril: pbr(0x8a5a44, { roughness: 0.8 }),
    blush: pbr(C.blush, { roughness: 0.9, opacity: 0.12 }),
    shine: pbr(0xffffff, { roughness: 0.2, opacity: 0.35 }),
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

  // ---------- Legs: dark jeans and white sneakers ----------
  const legs: ThreeTypes.Group[] = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.1, 0.9, 0);
    hip.add(part(sphere(0.09), mat.jeans, { position: [0, -0.02, 0] }));
    hip.add(part(taper(0.09, 0.072, 0.8), mat.jeans, { position: [0, -0.43, 0] }));
    hip.add(part(taper(0.075, 0.075, 0.03, 24), mat.jeans, { position: [0, -0.83, 0] })); // hem
    const sneaker = new THREE.Group();
    sneaker.position.set(side * 0.008, -0.87, 0.05);
    sneaker.add(part(new THREE.CapsuleGeometry(0.072, 0.15, 8, 18), mat.sneaker, { rotation: [Math.PI / 2, 0, 0], scale: [1.05, 0.95, 0.7] }));
    sneaker.add(part(sphere(0.068), mat.sneaker, { position: [0, -0.01, 0.09], scale: [1, 0.72, 0.95] })); // toe box
    sneaker.add(part(taper(0.068, 0.072, 0.06, 18), mat.sneaker, { position: [0, 0.04, -0.05] })); // heel collar
    sneaker.add(part(new THREE.CapsuleGeometry(0.078, 0.17, 6, 18), mat.sole, { position: [0, -0.046, 0], rotation: [Math.PI / 2, 0, 0], scale: [1.1, 1.02, 0.24] }));
    for (let i = 0; i < 3; i += 1) {
      sneaker.add(part(new THREE.BoxGeometry(0.05, 0.005, 0.008), mat.lace, { shadow: false, position: [0, 0.056 - i * 0.014, 0.02 + i * 0.03], rotation: [-0.55, 0, 0] }));
    }
    hip.add(sneaker);
    figure.add(hip);
    legs.push(hip);
  }

  // ---------- Torso: relaxed black crew-neck tee ----------
  const torso = new THREE.Group();
  torso.position.y = 0.86;
  figure.add(torso);
  const teeProfile = [
    [0, -0.06], [0.2, -0.06], [0.21, 0.08], [0.215, 0.28], [0.24, 0.44],
    [0.25, 0.52], [0.21, 0.575], [0.1, 0.6], [0, 0.6],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  torso.add(part(new THREE.LatheGeometry(teeProfile, 48), mat.tee, { scale: [1, 1, 0.72] }));
  torso.add(part(new THREE.TorusGeometry(0.074, 0.011, 10, 40), mat.rib, { position: [0, 0.6, 0.004], rotation: [Math.PI / 2, 0, 0], scale: [1, 0.78, 1] })); // ribbed collar
  for (const side of [-1, 1]) {
    torso.add(part(sphere(0.08), mat.tee, { position: [side * 0.235, 0.505, 0], scale: [1.1, 0.8, 0.95] }));
  }
  // Neck.
  torso.add(part(taper(0.06, 0.068, 0.16, 24), mat.skin, { position: [0, 0.64, 0] }));

  // ---------- Arms: short sleeves, bare forearms, hands with fingers ----------
  type Arm = { shoulder: ThreeTypes.Group; elbow: ThreeTypes.Group; hand: ThreeTypes.Group; side: number };
  const arms: Arm[] = [];
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.255, 0.5, 0);
    shoulder.add(part(taper(0.074, 0.066, 0.22), mat.tee, { position: [0, -0.11, 0] }));
    shoulder.add(part(new THREE.TorusGeometry(0.064, 0.007, 8, 28), mat.rib, { position: [0, -0.22, 0], rotation: [Math.PI / 2, 0, 0] })); // sleeve hem
    shoulder.add(part(taper(0.06, 0.056, 0.12), mat.skin, { position: [0, -0.26, 0] }));
    const elbow = new THREE.Group();
    elbow.position.y = -0.32;
    elbow.add(part(sphere(0.056), mat.skin));
    elbow.add(part(taper(0.054, 0.046, 0.25), mat.skin, { position: [0, -0.125, 0] }));
    const hand = new THREE.Group();
    hand.position.y = -0.27;
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

  // ---------- Hair: short tight sides, textured top swept up and to his right ----------
  const hair = new THREE.Group();
  hair.position.set(0, HEAD_Y, 0);
  head.add(hair);
  // Close-cropped shell over the crown, back and sides.
  hair.add(part(new THREE.SphereGeometry(0.216, 48, 32, 0, Math.PI * 2, 0, 1.5), mat.hair, { position: [0, 0.025, -0.015], rotation: [-0.34, 0, 0], scale: [1.02, 1.08, 1.03] }));
  hair.add(part(new THREE.SphereGeometry(0.218, 48, 32, Math.PI, Math.PI, 0.3, 1.5), mat.hair, { position: [0, 0, -0.003], scale: [1.015, 1.08, 1.02] }));
  for (const side of [-1, 1]) {
    hair.add(part(new THREE.CapsuleGeometry(0.015, 0.045, 6, 10), mat.hair, { shadow: false, position: [side * 0.199, -0.005, 0.035], rotation: [0, 0, side * 0.1] }));
  }
  // Volume on top, leaning to his right (the viewer's left).
  hair.add(part(roughen(sphere(0.135, 48, 32), 0.01, 14, 3), mat.hair, { position: [-0.02, 0.185, 0.025], scale: [1.5, 0.8, 1.3], rotation: [0.1, 0, 0.14] }));
  // Front: a lifted fringe of soft locks combed from the parting on his left across to his right.
  const lock = new THREE.CapsuleGeometry(0.03, 0.1, 8, 14);
  for (let i = 0; i < 7; i += 1) {
    const u = i / 6;
    hair.add(part(lock, i === 2 || i === 5 ? mat.hairLight : mat.hair, {
      position: [0.13 - 0.28 * u, 0.2 + 0.05 * Math.sin(u * Math.PI), 0.13 - 0.04 * Math.abs(u - 0.5)],
      rotation: [-0.65 + 0.1 * u, 0, 0.55 + 0.35 * u],
      scale: [1, 0.9 + 0.3 * Math.sin(u * Math.PI), 0.85],
    }));
  }
  // Texture: shallow strands lying across the crown in the direction of the sweep.
  const strand = new THREE.CapsuleGeometry(0.017, 0.1, 8, 12);
  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    hair.add(part(strand, i % 3 === 1 ? mat.hairLight : mat.hair, {
      shadow: false,
      position: [0.12 - 0.26 * t, 0.178 - 0.01 * Math.abs(t - 0.5), -0.05 + 0.15 * Math.sin(t * Math.PI)],
      rotation: [0.25 - 0.45 * t, 0.25, Math.PI / 2 - 0.35 - 0.12 * t],
      scale: [1, 1, 0.5],
    }));
  }

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

// ======================= Island geometry =======================
/**
 * Builds a closed surface from polar coordinates: `rings` steps of `s` in
 * [0, 1] by `segments` steps of angle. The seam column is duplicated for UVs
 * and its normals averaged so no line shows; degenerate rings (a point) share
 * one averaged normal too.
 */
function polarSurface(
  THREE: typeof ThreeTypes,
  rings: number,
  segments: number,
  at: (s: number, angle: number) => [number, number, number],
  uvAt: (s: number, angle: number, p: [number, number, number]) => [number, number],
  outward: (p: [number, number, number]) => [number, number, number],
) {
  const cols = segments + 1;
  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];
  for (let i = 0; i <= rings; i += 1) {
    const s = i / rings;
    for (let j = 0; j < cols; j += 1) {
      const angle = (j / segments) * Math.PI * 2;
      const p = at(s, angle);
      positions.push(...p);
      uvs.push(...uvAt(s, angle, p));
    }
  }
  for (let i = 0; i < rings; i += 1) {
    for (let j = 0; j < segments; j += 1) {
      const a = i * cols + j;
      const b = a + 1;
      const c = a + cols;
      const d = c + 1;
      indices.push(a, c, b, b, c, d);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2));
  geometry.computeVertexNormals();

  // Flip the winding if the normals ended up pointing the wrong way.
  const probe = Math.floor(rings / 2) * cols + Math.floor(segments / 4);
  const normal = geometry.attributes.normal as ThreeTypes.BufferAttribute;
  const p: [number, number, number] = [positions[probe * 3], positions[probe * 3 + 1], positions[probe * 3 + 2]];
  const o = outward(p);
  if (normal.getX(probe) * o[0] + normal.getY(probe) * o[1] + normal.getZ(probe) * o[2] < 0) {
    for (let t = 0; t < indices.length; t += 3) {
      const swap = indices[t + 1];
      indices[t + 1] = indices[t + 2];
      indices[t + 2] = swap;
    }
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
  }

  // Smooth the seam and any collapsed rings.
  const n = new THREE.Vector3();
  const sum = new THREE.Vector3();
  for (let i = 0; i <= rings; i += 1) {
    const first = i * cols;
    const last = first + segments;
    const degenerate =
      Math.abs(positions[first * 3] - positions[(first + Math.floor(segments / 2)) * 3]) < 1e-6 &&
      Math.abs(positions[first * 3 + 2] - positions[(first + Math.floor(segments / 2)) * 3 + 2]) < 1e-6;
    if (degenerate) {
      sum.set(0, 0, 0);
      for (let j = first; j <= last; j += 1) sum.add(n.fromBufferAttribute(normal, j));
      sum.normalize();
      for (let j = first; j <= last; j += 1) normal.setXYZ(j, sum.x, sum.y, sum.z);
    } else {
      sum.fromBufferAttribute(normal, first).add(n.fromBufferAttribute(normal, last)).normalize();
      normal.setXYZ(first, sum.x, sum.y, sum.z);
      normal.setXYZ(last, sum.x, sum.y, sum.z);
    }
  }
  normal.needsUpdate = true;
  return geometry;
}

// ======================= World =======================
function buildWorld(builder: Builder) {
  const { THREE, part, pbr } = builder;
  const random = seeded(42);
  const world = new THREE.Group();
  const swayers: Array<{ object: ThreeTypes.Object3D; phase: number }> = [];
  const R = 1.32;
  const FEET: [number, number] = [-0.05, 0.05];
  const PAWS: [number, number] = [0.62, 0.3];

  // ---------- Ground: gentle dome with bumps, flat where anyone stands ----------
  function groundAt(x: number, z: number) {
    const t = Math.hypot(x, z) / R;
    const clear =
      smoothstep(0.28, 0.6, Math.hypot(x - FEET[0], z - FEET[1])) *
      smoothstep(0.24, 0.5, Math.hypot(x - PAWS[0], z - PAWS[1]));
    return (
      -0.05 * t * t +
      (fbm(x * 1.6 + 3, z * 1.6 + 7, 0.5, 3) - 0.5) * 0.08 * clear +
      (fbm(x * 5 + 1, z * 5 + 2, 2, 2) - 0.5) * 0.012
    );
  }
  const grassMaterial = pbr(C.grass, { roughness: 0.95, texture: "grass", bumpScale: 0.02, sheen: 0.3, sheenColor: 0xc8ff9a });
  const ground = part(
    polarSurface(
      THREE, 26, 112,
      (s, a) => {
        const r = s * R;
        const x = Math.cos(a) * r;
        const z = Math.sin(a) * r;
        return [x, groundAt(x, z), z];
      },
      (_s, _a, p) => [(p[0] / R) * 3.2 + 3.2, (p[2] / R) * 3.2 + 3.2],
      () => [0, 1, 0],
    ),
    grassMaterial,
    { shadow: false },
  );
  world.add(ground);

  // Overhanging turf around the rim.
  const lip = new THREE.TorusGeometry(R - 0.02, 0.055, 14, 112);
  roughen(lip, 0.03, 3, 5);
  const turfEdge = pbr(0x5fa843, { roughness: 0.98, texture: "grass", bumpScale: 0.03 });
  world.add(part(lip, turfEdge, { position: [0, -0.06, 0], rotation: [Math.PI / 2, 0, 0], scale: [1, 1, 0.7] }));

  // ---------- Underside: soil band fading into weathered rock, tapering to a point ----------
  const soil = new THREE.Color(0x5c3a22);
  const earth = new THREE.Color(C.dirt);
  const stone = new THREE.Color(0x6e5440);
  const underGeometry = polarSurface(
    THREE, 40, 112,
    (s, a) => {
      const k = Math.pow(Math.cos((s * Math.PI) / 2), 0.72);
      const bump = fbm(Math.cos(a) * 2.2 + 9, Math.sin(a) * 2.2 + 9, s * 3.6, 3) - 0.5;
      const r = (R + 0.005) * k * (1 + bump * 0.24 * Math.min(1, s * 3 + 0.1));
      const y = -0.05 - 1.28 * Math.pow(Math.sin((s * Math.PI) / 2), 1.15) + bump * 0.06 * s;
      return [Math.cos(a) * r, y, Math.sin(a) * r];
    },
    (s, a) => [(a / (Math.PI * 2)) * 6, s * 3],
    (p) => [p[0], -0.4, p[2]],
  );
  {
    const positions = underGeometry.attributes.position as ThreeTypes.BufferAttribute;
    const colors = new Float32Array(positions.count * 3);
    const color = new THREE.Color();
    for (let i = 0; i < positions.count; i += 1) {
      const depth = -positions.getY(i);
      const grit = fbm(positions.getX(i) * 4, depth * 4, positions.getZ(i) * 4, 2);
      color.copy(soil).lerp(earth, smoothstep(0.08, 0.26, depth)).lerp(stone, smoothstep(0.45, 1.1, depth) * 0.8);
      color.multiplyScalar(0.9 + grit * 0.25);
      colors.set([color.r, color.g, color.b], i * 3);
    }
    underGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  }
  world.add(part(underGeometry, pbr(0xffffff, { roughness: 0.95, texture: "soil", bumpScale: 0.035, vertexColors: true })));

  // Boulders lodged in the soil and a few roots trailing underneath.
  const rockMaterial = pbr(C.rock, { roughness: 0.9, texture: "rock", bumpScale: 0.03, flatShading: true });
  const darkRock = pbr(0x7d7066, { roughness: 0.92, texture: "rock", bumpScale: 0.03, flatShading: true });
  for (let i = 0; i < 8; i += 1) {
    const angle = (i / 8) * Math.PI * 2 + 0.4 + random() * 0.4;
    const depth = 0.3 + random() * 0.45;
    const radius = (R - 0.02) * Math.pow(Math.cos((depth / 1.3) * (Math.PI / 2)), 0.72) * 0.93;
    world.add(part(roughen(new THREE.IcosahedronGeometry(0.07 + random() * 0.07, 2), 0.25, 3, i * 7), darkRock, {
      position: [Math.cos(angle) * radius, -depth, Math.sin(angle) * radius],
      rotation: [random() * 3, random() * 3, random() * 3],
    }));
  }
  const rootMaterial = pbr(0x5a3b24, { roughness: 0.9, texture: "bark", bumpScale: 0.01 });
  for (let i = 0; i < 4; i += 1) {
    const angle = i * 1.7 + 0.9;
    const x = Math.cos(angle) * 0.75;
    const z = Math.sin(angle) * 0.75;
    const root = new THREE.TubeGeometry(
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(x, -0.62, z),
        new THREE.Vector3(x * 0.92 + 0.08, -0.84, z * 0.92),
        new THREE.Vector3(x * 0.78 - 0.05, -1.02 - i * 0.04, z * 0.78 + 0.06),
        new THREE.Vector3(x * 0.6, -1.14 - i * 0.05, z * 0.62),
      ]),
      14, 0.014, 7, false,
    );
    world.add(part(root, rootMaterial, { shadow: false }));
  }

  // ---------- Trees behind Suraj ----------
  const barkMaterial = pbr(C.bark, { roughness: 0.95, texture: "bark", bumpScale: 0.03 });
  const leafShades = [0x478f38, C.leaf, 0x5fae47, C.leafLight].map((color) =>
    pbr(color, { roughness: 0.92, texture: "leaf", bumpScale: 0.02, sheen: 0.25, sheenColor: 0xc8ffb0 }),
  );
  const trees: Array<[number, number, number]> = [[-0.85, -0.55, 1.15], [0.95, -0.5, 0.95], [-0.45, -0.95, 0.8]];
  trees.forEach(([x, z, size], index) => {
    const tree = new THREE.Group();
    tree.position.set(x, groundAt(x, z) - 0.01, z);
    tree.scale.setScalar(size);
    tree.rotation.y = index * 2.1;
    // Trunk with a flared base, slight lean, and surface roots.
    const trunkProfile = [
      [0, 0], [0.13, 0], [0.09, 0.05], [0.066, 0.18], [0.058, 0.4], [0.05, 0.62], [0.04, 0.8], [0, 0.82],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const trunk = new THREE.LatheGeometry(trunkProfile, 28);
    roughen(trunk, 0.006, 9, index);
    tree.add(part(trunk, barkMaterial, { rotation: [0.04, 0, 0.05] }));
    for (let i = 0; i < 4; i += 1) {
      const angle = i * 1.6 + index;
      tree.add(part(new THREE.CapsuleGeometry(0.022, 0.12, 6, 10), barkMaterial, {
        position: [Math.cos(angle) * 0.1, 0.012, Math.sin(angle) * 0.1],
        rotation: [Math.PI / 2 * Math.sin(angle), 0, Math.PI / 2 * Math.cos(angle)],
        scale: [1, 1, 0.7],
      }));
    }
    // Two branches reaching into the canopy.
    for (const side of [-1, 1]) {
      tree.add(part(new THREE.CylinderGeometry(0.018, 0.034, 0.34, 10), barkMaterial, {
        position: [side * 0.1, 0.78, side * 0.03],
        rotation: [side * 0.2, 0, side * -0.55],
      }));
    }
    // Lumpy layered canopy.
    const crown = new THREE.Group();
    crown.position.y = 0.92;
    const lumps: Array<[number, number, number, number]> = [
      [0, 0.04, 0, 0.36], [0.2, 0.2, 0.08, 0.26], [-0.22, 0.14, 0.06, 0.25], [0.04, 0.32, -0.04, 0.24],
      [0.1, -0.02, 0.22, 0.22], [-0.14, 0.02, -0.2, 0.22], [0.22, -0.06, -0.14, 0.2], [-0.06, 0.12, 0.26, 0.2],
    ];
    lumps.forEach(([lx, ly, lz, radius], i) => {
      const lump = roughen(new THREE.IcosahedronGeometry(radius, 3), 0.13 * radius, 5, index * 11 + i * 3);
      crown.add(part(lump, leafShades[(i + index) % leafShades.length], { position: [lx, ly, lz], scale: [1, 0.9, 1] }));
    });
    tree.add(crown);
    world.add(tree);
    swayers.push({ object: crown, phase: index * 1.7 });
  });

  // ---------- Rocks and pebbles ----------
  const rocks: Array<[number, number, number, number]> = [
    [-0.95, 0.55, 0.13, 1.3], [-0.78, 0.74, 0.08, 1.1], [1.05, 0.2, 0.11, 1.25], [0.2, 0.95, 0.05, 1], [-0.3, 1.05, 0.045, 1],
  ];
  rocks.forEach(([x, z, radius, stretch], i) => {
    const rock = roughen(new THREE.IcosahedronGeometry(radius, 3), 0.28, 2.6, i * 5 + 1);
    world.add(part(rock, i % 3 === 2 ? darkRock : rockMaterial, {
      position: [x, groundAt(x, z) + radius * 0.3, z],
      rotation: [random() * 0.6, random() * 6, random() * 0.6],
      scale: [stretch, 0.62, 1],
    }));
  });

  // ---------- Grass: thousands of instanced blades that bend in the wind ----------
  const bladeGeometry = new THREE.PlaneGeometry(0.03, 0.17, 1, 5);
  bladeGeometry.translate(0, 0.085, 0);
  {
    const position = bladeGeometry.attributes.position as ThreeTypes.BufferAttribute;
    const shade = new Float32Array(position.count * 3);
    for (let i = 0; i < position.count; i += 1) {
      const v = position.getY(i) / 0.17;
      position.setX(i, position.getX(i) * (1 - v * 0.88));
      position.setZ(i, v * v * 0.05);
      const tone = mix(0.5, 1.05, v);
      shade.set([tone, tone, tone], i * 3);
    }
    bladeGeometry.setAttribute("color", new THREE.Float32BufferAttribute(shade, 3));
    bladeGeometry.computeVertexNormals();
  }
  const wind = { value: 0 };
  const bladeMaterial = pbr(0xffffff, { roughness: 0.85, doubleSide: true, vertexColors: true, sheen: 0.4, sheenColor: 0xd0ff9a });
  bladeMaterial.onBeforeCompile = (shader) => {
    shader.uniforms.uTime = wind;
    shader.vertexShader = shader.vertexShader
      .replace("#include <common>", "#include <common>\nuniform float uTime;")
      .replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
        {
          vec3 root = (instanceMatrix * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
          float bend = uv.y * uv.y;
          float gust = sin(uTime * 1.7 + root.x * 2.6 + root.z * 1.9) + 0.5 * sin(uTime * 3.1 + root.z * 4.0);
          transformed.x += gust * 0.03 * bend;
          transformed.z += cos(uTime * 1.2 + root.x * 1.7) * 0.018 * bend;
        }`,
      );
  };
  bladeMaterial.customProgramCacheKey = () => "island-grass-wind";
  const BLADES = 1500;
  const grass = new THREE.InstancedMesh(bladeGeometry, bladeMaterial, BLADES);
  grass.receiveShadow = true;
  {
    const matrix = new THREE.Matrix4();
    const position = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const euler = new THREE.Euler();
    const scale = new THREE.Vector3();
    const dark = new THREE.Color(C.grassDark);
    const light = new THREE.Color(C.grassLight);
    const color = new THREE.Color();
    let placed = 0;
    while (placed < BLADES) {
      const angle = random() * Math.PI * 2;
      const onRim = placed % 6 === 0;
      const radius = onRim ? R - 0.06 + random() * 0.07 : Math.sqrt(random()) * (R - 0.04);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      if (Math.hypot(x - FEET[0], z - FEET[1]) < 0.2 || Math.hypot(x - PAWS[0], z - PAWS[1]) < 0.2) continue;
      position.set(x, (onRim ? groundAt(x * 0.97, z * 0.97) - 0.02 : groundAt(x, z)) - 0.004, z);
      // Blades on the rim lean outward over the edge.
      const lean = onRim ? 0.55 : 0.25;
      euler.set(Math.sin(angle) * lean * (onRim ? 1 : random() * 2 - 1), random() * Math.PI * 2, -Math.cos(angle) * lean * (onRim ? 1 : random() * 2 - 1));
      quaternion.setFromEuler(euler);
      const height = 0.6 + random() * 0.9;
      scale.set(0.8 + random() * 0.5, height, 1);
      matrix.compose(position, quaternion, scale);
      grass.setMatrixAt(placed, matrix);
      color.copy(dark).lerp(light, Math.pow(random(), 1.4)).offsetHSL((random() - 0.5) * 0.03, 0, (random() - 0.5) * 0.05);
      grass.setColorAt(placed, color);
      placed += 1;
    }
    grass.instanceMatrix.needsUpdate = true;
    if (grass.instanceColor) grass.instanceColor.needsUpdate = true;
  }
  world.add(grass);

  // ---------- Flowers: stems, leaves and petals ----------
  const spot = () => {
    for (;;) {
      const angle = random() * Math.PI * 2;
      const radius = 0.3 + random() * 0.9;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      if (Math.hypot(x - FEET[0], z - FEET[1]) > 0.34 && Math.hypot(x - PAWS[0], z - PAWS[1]) > 0.32) return [x, z] as const;
    }
  };
  const petalColors = [0xfff6f0, 0xff7fa8, 0xffd23f, 0xb48cff, 0xff9d5c];
  const stemMaterial = pbr(0x4e9a3a, { roughness: 0.8 });
  const leafMaterial = pbr(0x5aa844, { roughness: 0.85, doubleSide: true });
  const stamenMaterial = pbr(0xffb020, { roughness: 0.6, emissive: 0xffb020, emissiveIntensity: 0.15 });
  const petalGeometry = new THREE.SphereGeometry(0.02, 14, 10);
  const leafGeometry = new THREE.ShapeGeometry(
    new THREE.Shape().moveTo(0, 0).quadraticCurveTo(0.03, 0.03, 0, 0.075).quadraticCurveTo(-0.03, 0.03, 0, 0),
  );
  for (let i = 0; i < 16; i += 1) {
    const [x, z] = spot();
    const flower = new THREE.Group();
    flower.position.set(x, groundAt(x, z), z);
    flower.rotation.set((random() - 0.5) * 0.3, random() * Math.PI * 2, (random() - 0.5) * 0.3);
    const height = 0.12 + random() * 0.06;
    flower.add(part(new THREE.CylinderGeometry(0.005, 0.0075, height, 8), stemMaterial, { position: [0, height / 2, 0] }));
    flower.add(part(leafGeometry, leafMaterial, { shadow: false, position: [0.004, height * 0.4, 0], rotation: [-1.1, 0.4, 0.5] }));
    const bloom = new THREE.Group();
    bloom.position.y = height;
    bloom.rotation.x = -0.35;
    const petal = pbr(petalColors[i % petalColors.length], { roughness: 0.55, sheen: 0.5, sheenColor: 0xffffff });
    const petalCount = 5 + (i % 2);
    for (let p = 0; p < petalCount; p += 1) {
      const angle = (p / petalCount) * Math.PI * 2;
      flowerPetal(bloom, petal, angle);
    }
    bloom.add(part(new THREE.SphereGeometry(0.014, 12, 10), stamenMaterial, { shadow: false, position: [0, 0.006, 0], scale: [1, 0.6, 1] }));
    flower.add(bloom);
    world.add(flower);
    swayers.push({ object: flower, phase: random() * 6 });
  }
  function flowerPetal(bloom: ThreeTypes.Group, material: ThreeTypes.Material, angle: number) {
    const holder = new THREE.Group();
    holder.rotation.y = angle;
    holder.add(part(petalGeometry, material, { shadow: false, position: [0, 0.004, 0.024], rotation: [0.45, 0, 0], scale: [0.9, 0.3, 1.5] }));
    bloom.add(holder);
  }

  // ---------- Sun: bright disc with a soft corona, behind and above ----------
  const sun = new THREE.Group();
  sun.position.set(1.15, 2.25, -1.6);
  const sunDisc = new THREE.Mesh(
    new THREE.SphereGeometry(0.3, 48, 32),
    new THREE.MeshBasicMaterial({ color: 0xfff0a0, toneMapped: false }),
  );
  sun.add(sunDisc);
  const glowTexture = (stops: Array<[number, string]>, size = 256) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    stops.forEach(([offset, color]) => gradient.addColorStop(offset, color));
    context.fillStyle = gradient;
    context.fillRect(0, 0, size, size);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };
  const coronaTexture = (size = 512) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d")!;
    context.translate(size / 2, size / 2);
    const streaks = 36;
    for (let i = 0; i < streaks; i += 1) {
      const length = size * (0.26 + random() * 0.2);
      const width = 6 + random() * 14;
      const gradient = context.createLinearGradient(0, 0, 0, -length);
      gradient.addColorStop(0, "rgba(255, 214, 120, 0.55)");
      gradient.addColorStop(0.5, "rgba(255, 170, 70, 0.18)");
      gradient.addColorStop(1, "rgba(255, 150, 60, 0)");
      context.fillStyle = gradient;
      context.beginPath();
      context.moveTo(-width / 2, 0);
      context.lineTo(width / 2, 0);
      context.lineTo(0, -length);
      context.closePath();
      context.fill();
      context.rotate((Math.PI * 2) / streaks + (random() - 0.5) * 0.08);
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  };
  const glowMaterial = (texture: ThreeTypes.Texture, opacity: number) =>
    new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity, depthWrite: false, toneMapped: false });
  const halo = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    glowMaterial(glowTexture([[0, "rgba(255,250,210,1)"], [0.3, "rgba(255,226,120,0.7)"], [0.55, "rgba(255,170,70,0.16)"], [0.78, "rgba(255,150,60,0)"], [1, "rgba(255,150,60,0)"]]), 0.95),
  );
  halo.scale.setScalar(1.9);
  halo.position.z = -0.02;
  const rays = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), glowMaterial(coronaTexture(), 0.8));
  rays.scale.setScalar(2.4);
  rays.position.z = -0.04;
  sun.add(halo, rays);
  world.add(sun);

  // ---------- Clouds: soft lumpy cumulus drifting across ----------
  const clouds: Array<{ group: ThreeTypes.Group; speed: number }> = [];
  const cloudMaterial = pbr(C.cloud, { roughness: 1, sheen: 0.5, sheenColor: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.12 });
  [
    [-1.4, 2.05, -1.2, 0.95, 0.06],
    [0.5, 2.6, -1.9, 0.75, 0.04],
  ].forEach(([x, y, z, size, speed], c) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.scale.setScalar(size);
    const puffs: Array<[number, number, number, number]> = [
      [0, 0, 0, 0.22], [0.24, 0.05, 0.02, 0.18], [-0.24, -0.01, 0.02, 0.17], [0.1, 0.15, -0.02, 0.17],
      [-0.1, 0.12, 0.04, 0.15], [0.4, -0.02, 0, 0.13], [-0.4, -0.03, 0, 0.12], [0.02, -0.04, 0.14, 0.16], [0.18, -0.05, -0.12, 0.14],
    ];
    puffs.forEach(([px, py, pz, radius], i) => {
      const puff = roughen(new THREE.IcosahedronGeometry(radius, 3), 0.08 * radius, 4, c * 13 + i * 2);
      group.add(part(puff, cloudMaterial, { shadow: false, position: [px, py, pz], scale: [1, 0.8, 0.85] }));
    });
    world.add(group);
    clouds.push({ group, speed });
  });

  // ---------- Butterflies looping around the island ----------
  const butterflies: Array<{ group: ThreeTypes.Group; wings: ThreeTypes.Object3D[]; phase: number; radius: number; height: number }> = [];
  const wingShape = new THREE.Shape()
    .moveTo(0, 0)
    .bezierCurveTo(0.03, 0.06, 0.08, 0.06, 0.075, 0.015)
    .bezierCurveTo(0.072, -0.01, 0.045, -0.012, 0.03, -0.005)
    .bezierCurveTo(0.05, -0.03, 0.03, -0.06, 0.008, -0.04)
    .lineTo(0, 0);
  const wingGeometry = new THREE.ShapeGeometry(wingShape, 12);
  [[0xff8fb1, 0, 0.95, 1.2], [0xffd84f, 2.4, 1.15, 0.8]].forEach(([color, phase, radius, height]) => {
    const group = new THREE.Group();
    const wingMaterial = pbr(color, { roughness: 0.5, doubleSide: true, emissive: color, emissiveIntensity: 0.12 });
    const wings: ThreeTypes.Object3D[] = [];
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.add(part(wingGeometry, wingMaterial, { shadow: false, scale: [side, 1, 1] }));
      group.add(pivot);
      wings.push(pivot);
    }
    group.add(part(new THREE.CapsuleGeometry(0.007, 0.05, 4, 8), pbr(0x1e1a18, { roughness: 0.6 }), { shadow: false, rotation: [Math.PI / 2, 0, 0] }));
    world.add(group);
    butterflies.push({ group, wings, phase, radius, height });
  });

  return { world, swayers, rays, clouds, butterflies, sun, wind, groundAt };
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

      const { world, swayers, rays, clouds, butterflies, sun, wind, groundAt } = buildWorld(builder);
      rig.add(world);

      const { character, torso, head, eyes, brows, arms, legs, mouth } = buildCharacter(builder);
      character.position.set(-0.05, groundAt(-0.05, 0.05), 0.05);
      rig.add(character);

      const { puppy, body: puppyBody, head: puppyHead, tail, tongue, ears } = buildPuppy(builder);
      puppy.position.set(0.62, groundAt(0.62, 0.3), 0.3);
      puppy.rotation.y = -0.35;
      rig.add(puppy);

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
      addShadow(0.62, 0.3, 0.5, 0.36);

      const lighting = await lightScene(THREE, renderer, scene, { shadows: true });
      if (disposed) {
        lighting.dispose();
        return;
      }
      disposables.add(lighting);

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
      const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      const gaze = new THREE.Vector2();
      const gazeTarget = new THREE.Vector2();
      let dragging = false;
      let dragMoved = 0;
      let lastX = 0;
      let dragYaw = 0;
      let dragVelocity = 0;
      let waveTime = -1;
      let hopTime = -1;

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
          if (waveTime < 0) waveTime = 0;
          if (hopTime < 0) hopTime = 0;
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
      const WAVE_SECONDS = 2;

      function pose(delta: number) {
        elapsed += delta;
        wind.value = elapsed;
        intro = Math.min(1, intro + delta / 1.1);
        if (!introWaveDone && elapsed > 1.3) {
          introWaveDone = true;
          if (waveTime < 0) waveTime = 0;
        }
        // With no recent cursor movement, glance around on his own.
        if (elapsed - lastPointer > 3) {
          gazeTarget.set(
            Math.sin(elapsed * 0.45) * 0.45 + Math.sin(elapsed * 1.3) * 0.08,
            Math.sin(elapsed * 0.31 + 1) * 0.18,
          );
        }
        gaze.lerp(gazeTarget, 1 - Math.exp(-delta * 7));
        const breathe = Math.sin(elapsed * 1.7);

        // --- Suraj: breathes, slowly shifts his weight from foot to foot ---
        const shift = Math.sin(elapsed * 0.42);
        torso.scale.set(1 + breathe * 0.006, 1 + breathe * 0.01, 1);
        torso.position.x = shift * 0.014;
        torso.rotation.z = -shift * 0.035 + Math.sin(elapsed * 0.7) * 0.01;
        torso.rotation.y = gaze.x * 0.14 + shift * 0.04;
        legs.forEach((hip, index) => {
          const side = index === 0 ? -1 : 1;
          hip.rotation.z = side * 0.025 + shift * 0.03;
          hip.rotation.x = Math.max(0, side * shift) * 0.04;
        });
        head.rotation.y = gaze.x * 0.55;
        head.rotation.x = -gaze.y * 0.28;
        eyes.forEach(({ iris }) => {
          iris.position.x = gaze.x * 0.011;
          iris.position.y = gaze.y * 0.009;
        });
        const cycle = (elapsed + 0.8) % 4.2;
        const blinkAt = (center: number) => Math.exp(-Math.pow((cycle - center) / 0.06, 2));
        const doubleBlink = Math.floor((elapsed + 0.8) / 4.2) % 3 === 1 ? blinkAt(3.95) : 0;
        const blink = Math.max(blinkAt(3.7), doubleBlink);
        eyes.forEach(({ group }) => group.scale.set(1, Math.max(0.08, 1 - blink), 1));

        let raise = 0;
        if (waveTime >= 0) {
          waveTime += delta;
          const t = waveTime / WAVE_SECONDS;
          raise = t < 0.18 ? t / 0.18 : t > 0.82 ? Math.max(0, (1 - t) / 0.18) : 1;
          raise = raise * raise * (3 - 2 * raise);
          if (t >= 1) waveTime = -1;
        }
        arms.forEach(({ shoulder, elbow, hand, side }) => {
          const swing = Math.sin(elapsed * 1.7 + side) * 0.03;
          // Relaxed rest pose: arms a little out from the body, elbows softly bent.
          shoulder.position.y = 0.5 + breathe * 0.004;
          if (side === -1) {
            // Waves with the arm away from the puppy, palm turned to the viewer.
            shoulder.rotation.z = -0.14 - raise * 2.35 + shift * 0.02;
            shoulder.rotation.x = swing - raise * 0.35;
            elbow.rotation.z = -raise * (0.5 + Math.sin(elapsed * 13) * 0.42);
            elbow.rotation.x = -0.22 * (1 - raise);
            hand.rotation.y = raise * -0.9;
            hand.rotation.z = raise * Math.sin(elapsed * 13) * 0.25;
          } else {
            shoulder.rotation.z = 0.14 - shift * 0.02;
            shoulder.rotation.x = -swing;
            elbow.rotation.z = 0.05;
            elbow.rotation.x = -0.24 + Math.sin(elapsed * 1.1) * 0.02;
          }
        });
        head.rotation.z = -raise * 0.1 + shift * 0.02;
        torso.rotation.z += raise * 0.05;
        // Expression: brows lift and the smile opens while waving.
        brows.forEach((brow) => {
          brow.position.y = brow.userData.baseY + raise * 0.012 + gaze.y * 0.004;
        });
        mouth.smile.visible = raise < 0.35;
        mouth.open.scale.set(1, Math.max(0.001, raise), 1);

        // --- Puppy: looks at the cursor, wags, hops on click ---
        let hop = 0;
        if (hopTime >= 0) {
          hopTime += delta;
          const t = Math.min(1, hopTime / 0.6);
          hop = Math.sin(t * Math.PI);
          if (t >= 1) hopTime = -1;
        }
        puppyBody.position.y = hop * 0.16;
        puppyBody.rotation.x = -hop * 0.15;
        puppyHead.rotation.y = gaze.x * 0.6 + 0.3;
        puppyHead.rotation.x = -gaze.y * 0.3;
        puppyHead.rotation.z = Math.sin(elapsed * 0.9) * 0.08 + (elapsed - lastPointer > 3 ? Math.sin(elapsed * 0.3) * 0.12 : 0);
        tail.rotation.z = Math.sin(elapsed * (hop > 0 ? 22 : 11)) * 0.7;
        // Occasional quick ear flick.
        ears.forEach((ear, index) => {
          const flick = Math.max(0, Math.sin(elapsed * 2.1 + index * 2.6) - 0.96) * 25;
          ear.rotation.z = ear.userData.baseZ + flick * (index === 0 ? 0.35 : -0.35);
        });
        tongue.scale.y = 0.5 + Math.max(0, Math.sin(elapsed * 6)) * 0.25;
        puppyBody.scale.y = 1 + Math.sin(elapsed * 3.2) * 0.015;

        // --- World ---
        swayers.forEach(({ object, phase }) => {
          object.rotation.z = Math.sin(elapsed * 1.3 + phase) * 0.05;
        });
        rays.rotation.z = elapsed * 0.08;
        sun.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.02);
        clouds.forEach(({ group, speed }) => {
          group.position.x += speed * delta;
          if (group.position.x > 2.4) group.position.x = -2.4;
        });
        butterflies.forEach(({ group, wings, phase, radius, height }) => {
          const t = elapsed * 0.55 + phase;
          group.position.set(Math.sin(t) * radius, height + Math.sin(t * 2.3) * 0.12, Math.cos(t) * radius * 0.55);
          group.rotation.y = t + Math.PI / 2;
          const flap = Math.sin(elapsed * 22 + phase) * 0.9;
          wings[0].rotation.y = flap;
          wings[1].rotation.y = -flap;
        });

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
        character.visible = presence > 0.02;
        character.scale.setScalar(Math.max(0.001, presence));
        character.position.y = groundAt(-0.05, 0.05) + (1 - presence) * 0.6;
        characterShadow.scale.setScalar(Math.max(0.001, presence) * (1 - raise * 0.04));
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
              waveTime = 0;
              hopTime = 0;
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
        A 3D scene of Suraj Singh in a navy suit standing on a floating grass island with trees,
        flowers, a puppy, butterflies, clouds and a sun. He follows the cursor, waves when clicked,
        and the island can be dragged to spin.
      </figcaption>
    </figure>
  );
}
