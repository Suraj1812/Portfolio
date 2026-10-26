"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type * as ThreeTypes from "three";

import "./hero-orbit.css";

/**
 * A complete cel-shaded 3D hero scene built in code: Suraj standing on a
 * floating grass island with trees, flowers, a puppy, butterflies, drifting
 * clouds and a spinning sun. Colors for Suraj are sampled from his avatar art.
 *
 * Interactions: head, eyes and puppy follow the cursor; click to wave (the
 * puppy hops too); drag to spin the island.
 */
export const C = {
  skin: 0xfbc097,
  skinShade: 0xe9a57d,
  hair: 0x1f1616,
  suit: 0x26283f,
  lapel: 0x1a1c2e,
  shirt: 0xfbf8f6,
  shoe: 0x141414,
  iris: 0x3a2318,
  lips: 0xb7554a,
  blush: 0xff8f7a,
  grass: 0x7ccf5b,
  grassDark: 0x5fb34a,
  grassLight: 0x9be06f,
  dirt: 0x9a6640,
  dirtDark: 0x7a4e30,
  bark: 0x7a4b2e,
  leaf: 0x58b64b,
  leafLight: 0x83d165,
  rock: 0xb8b4ad,
  sun: 0xffd84f,
  sunRay: 0xff9a3d,
  cloud: 0xffffff,
  dog: 0xe3a35b,
  dogDark: 0xb9763c,
  dogWhite: 0xfff8ee,
  dogNose: 0x2b1d14,
};

/** Fired by the scroll guide: `{ away: true }` when it leaves the island. */
export const GUIDE_EVENT = "suraj-guide";

export type Builder = {
  THREE: typeof ThreeTypes;
  part: (
    geometry: ThreeTypes.BufferGeometry,
    material: ThreeTypes.Material,
    options?: PartOptions,
  ) => ThreeTypes.Mesh;
  toon: (color: number) => ThreeTypes.Material;
  flat: (color: number, opacity?: number, doubleSide?: boolean) => ThreeTypes.Material;
};
type PartOptions = {
  outline?: boolean;
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

/**
 * Shared cel-shading kit: three-tone toon materials, ink outlines and a
 * `part` helper. Used by the hero island and the scroll guide.
 */
export function createToonKit(THREE: typeof ThreeTypes) {
  const disposables = new Set<{ dispose: () => void }>();
  const track = <T extends { dispose: () => void }>(item: T) => {
    disposables.add(item);
    return item;
  };
  const toneData = new Uint8Array([95, 95, 95, 255, 180, 180, 180, 255, 255, 255, 255, 255]);
  const gradientMap = track(new THREE.DataTexture(toneData, 3, 1, THREE.RGBAFormat));
  gradientMap.minFilter = THREE.NearestFilter;
  gradientMap.magFilter = THREE.NearestFilter;
  gradientMap.needsUpdate = true;
  const toonCache = new Map<number, ThreeTypes.Material>();
  const toon = (color: number) => {
    if (!toonCache.has(color)) toonCache.set(color, track(new THREE.MeshToonMaterial({ color, gradientMap })));
    return toonCache.get(color)!;
  };
  const flat = (color: number, opacity = 1, doubleSide = false) =>
    track(new THREE.MeshBasicMaterial({ color, transparent: opacity < 1, opacity, side: doubleSide ? THREE.DoubleSide : THREE.FrontSide }));
  const outlineMaterial = track(
    new THREE.ShaderMaterial({
      uniforms: { thickness: { value: 0.011 } },
      vertexShader: /* glsl */ `
        uniform float thickness;
        void main() {
          vec3 p = position + normal * thickness;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }`,
      fragmentShader: /* glsl */ `
        void main() { gl_FragColor = vec4(0.067, 0.067, 0.067, 1.0); }`,
      side: THREE.BackSide,
    }),
  );
  function part(geometry: ThreeTypes.BufferGeometry, material: ThreeTypes.Material, options: PartOptions = {}) {
    track(geometry);
    const mesh = new THREE.Mesh(geometry, material);
    if (options.position) mesh.position.set(...options.position);
    if (options.scale) mesh.scale.set(...options.scale);
    if (options.rotation) mesh.rotation.set(...options.rotation);
    if (options.outline !== false) mesh.add(new THREE.Mesh(geometry, outlineMaterial));
    return mesh;
  }
  const builder: Builder = { THREE, part, toon, flat };
  return { builder, track, disposables };
}

// ======================= Character =======================
export function buildCharacter({ THREE, part, toon, flat }: Builder) {
  const mat = {
    skin: toon(C.skin),
    skinShade: toon(C.skinShade),
    hair: toon(C.hair),
    hairLight: toon(0x3a2b27),
    suit: toon(C.suit),
    lapel: toon(C.lapel),
    shirt: toon(C.shirt),
    shoe: toon(0x1b1b1f),
    sole: toon(0x3a2a20),
    white: flat(0xffffff),
    iris: flat(0x2a1810),
    irisRing: flat(0x6b4630),
    pupil: flat(0x0b0605),
    lash: flat(0x140d0b),
    lips: flat(0x9c463d),
    mouthInside: flat(0x7a2a26),
    teeth: flat(0xfffdf8),
    tongue: flat(0xe0645e),
    brow: flat(0x1a1210),
    blush: flat(C.blush, 0.28),
    shine: flat(0xffffff, 0.35),
    pocket: toon(0x63e6ff),
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
  const shape = (points: Array<[number, number]>) =>
    new THREE.ShapeGeometry(new THREE.Shape(points.map(([x, y]) => new THREE.Vector2(x, y))));

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

  // ---------- Legs and shoes ----------
  const legs: ThreeTypes.Group[] = [];
  for (const side of [-1, 1]) {
    const hip = new THREE.Group();
    hip.position.set(side * 0.1, 0.9, 0);
    hip.add(part(sphere(0.088), mat.suit, { position: [0, -0.02, 0] }));
    hip.add(part(taper(0.088, 0.068, 0.8), mat.suit, { position: [0, -0.43, 0] }));
    // Oxford shoe: rounded upper, darker sole, a little shine on the toe.
    const shoe = new THREE.Group();
    shoe.position.set(side * 0.008, -0.86, 0.045);
    shoe.add(part(new THREE.CapsuleGeometry(0.07, 0.15, 8, 18), mat.shoe, { rotation: [Math.PI / 2, 0, 0], scale: [1.02, 1, 0.68] }));
    shoe.add(part(taper(0.066, 0.068, 0.05, 18), mat.shoe, { position: [0, 0.035, -0.06] }));
    shoe.add(part(new THREE.CapsuleGeometry(0.072, 0.16, 6, 18), mat.sole, { position: [0, -0.04, 0], rotation: [Math.PI / 2, 0, 0], scale: [1.08, 1.02, 0.2] }));
    shoe.add(part(new THREE.CircleGeometry(0.022, 16), mat.shine, { outline: false, position: [side * -0.015, 0.03, 0.13], rotation: [-0.9, 0, 0], scale: [1.4, 0.7, 1] }));
    hip.add(shoe);
    figure.add(hip);
    legs.push(hip);
  }

  // ---------- Torso: jacket, shirt, lapels, pocket square ----------
  const torso = new THREE.Group();
  torso.position.y = 0.86;
  figure.add(torso);
  const jacketProfile = [
    [0, -0.05], [0.19, -0.05], [0.205, 0.03], [0.21, 0.2], [0.235, 0.38],
    [0.25, 0.47], [0.236, 0.545], [0.17, 0.592], [0.075, 0.615], [0, 0.615],
  ].map(([r, y]) => new THREE.Vector2(r, y));
  torso.add(part(new THREE.LatheGeometry(jacketProfile, 48), mat.suit, { scale: [1, 1, 0.7] }));

  // Padded shoulders.
  for (const side of [-1, 1]) {
    torso.add(part(sphere(0.078), mat.suit, { position: [side * 0.235, 0.515, 0], scale: [1.1, 0.78, 0.95] }));
  }

  const front = new THREE.Group();
  front.position.set(0, 0.34, 0.163);
  front.rotation.x = -0.17;
  torso.add(front);
  front.add(part(shape([[-0.072, 0.26], [0.072, 0.26], [0, 0]]), mat.shirt, { outline: false, position: [0, 0, 0.004] }));
  for (const side of [-1, 1]) {
    // Notch lapel.
    front.add(part(shape([
      [side * 0.068, 0.255], [side * 0.145, 0.2], [side * 0.122, 0.17],
      [side * 0.152, 0.148], [side * 0.012, -0.012],
    ]), mat.lapel, { outline: false, position: [0, 0, 0.007] }));
    // Shirt collar points spreading over the lapels.
    front.add(part(shape([[side * 0.012, 0.262], [side * 0.09, 0.275], [side * 0.058, 0.19]]), mat.shirt, { outline: false, position: [0, 0, 0.011] }));
  }
  // Button line and buttons.
  torso.add(part(new THREE.BoxGeometry(0.005, 0.36, 0.004), mat.lapel, { outline: false, position: [0, 0.15, 0.148], rotation: [-0.08, 0, 0] }));
  for (const y of [0.19, 0.1]) {
    torso.add(part(sphere(0.013, 14, 10), mat.lapel, { position: [0.012, y, 0.149] }));
  }
  // Chest pocket with a cyan pocket square (the site's accent color).
  const pocket = new THREE.Group();
  pocket.position.set(0.118, 0.41, 0.15);
  pocket.rotation.y = 0.37;
  torso.add(pocket);
  pocket.add(part(shape([[-0.032, 0], [0.032, 0], [0.018, 0.035], [0, 0.022], [-0.016, 0.04]]), mat.pocket, { outline: false, position: [0, 0, 0.004] }));
  pocket.add(part(new THREE.BoxGeometry(0.075, 0.006, 0.004), mat.lapel, { outline: false, position: [0, -0.002, 0.006] }));
  // Side pocket flaps.
  for (const side of [-1, 1]) {
    const flap = new THREE.Group();
    flap.position.set(side * 0.12, 0.07, 0.115);
    flap.rotation.y = side * 0.62;
    flap.add(part(new THREE.BoxGeometry(0.09, 0.022, 0.006), mat.lapel, { outline: false }));
    torso.add(flap);
  }

  // Collar band and neck.
  torso.add(part(taper(0.064, 0.072, 0.05, 24), mat.shirt, { position: [0, 0.615, 0.004] }));
  torso.add(part(taper(0.052, 0.058, 0.12, 20), mat.skin, { position: [0, 0.66, 0] }));

  // ---------- Arms with tapered sleeves and real hands ----------
  type Arm = { shoulder: ThreeTypes.Group; elbow: ThreeTypes.Group; hand: ThreeTypes.Group; side: number };
  const arms: Arm[] = [];
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Group();
    shoulder.position.set(side * 0.255, 0.5, 0);
    shoulder.add(part(taper(0.068, 0.06, 0.32), mat.suit, { position: [0, -0.16, 0] }));
    const elbow = new THREE.Group();
    elbow.position.y = -0.32;
    elbow.add(part(sphere(0.06), mat.suit));
    elbow.add(part(taper(0.06, 0.056, 0.25), mat.suit, { position: [0, -0.125, 0] }));
    elbow.add(part(taper(0.052, 0.052, 0.03, 20), mat.shirt, { position: [0, -0.262, 0] }));
    const hand = new THREE.Group();
    hand.position.y = -0.285;
    hand.add(part(sphere(0.05, 20, 16), mat.skin, { position: [0, -0.04, 0], scale: [0.95, 1.1, 0.62] }));
    hand.add(part(new THREE.CapsuleGeometry(0.03, 0.045, 6, 12), mat.skin, { position: [0, -0.095, 0.004], scale: [1.35, 1, 0.72] }));
    hand.add(part(new THREE.CapsuleGeometry(0.014, 0.035, 6, 10), mat.skin, { position: [-side * 0.042, -0.05, 0.02], rotation: [0.3, 0, -side * 0.55] }));
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
  const FACE_R = 0.203;

  // Sculpt a sphere into a face: tapered jaw, soft chin, fuller cheeks.
  const headGeometry = sphere(0.21, 64, 48);
  const vertices = headGeometry.attributes.position as ThreeTypes.BufferAttribute;
  for (let i = 0; i < vertices.count; i += 1) {
    let x = vertices.getX(i);
    const y = vertices.getY(i);
    let z = vertices.getZ(i);
    const ny = y / 0.21;
    const jaw = Math.pow(THREE.MathUtils.clamp((0.15 - ny) / 1.15, 0, 1), 1.5);
    x *= 1 - 0.24 * jaw + 0.05 * Math.exp(-Math.pow((ny + 0.12) / 0.3, 2));
    z *= 1 - 0.08 * jaw;
    if (z > 0) z += 0.014 * Math.exp(-Math.pow((ny + 0.78) / 0.22, 2));
    vertices.setXYZ(i, x, y, z);
  }
  headGeometry.computeVertexNormals();
  head.add(part(headGeometry, mat.skin, { position: [0, HEAD_Y, 0], scale: [1, 1.12, 0.98] }));

  for (const side of [-1, 1]) {
    head.add(part(sphere(0.046), mat.skin, { position: [side * 0.2, HEAD_Y - 0.01, -0.012], scale: [0.42, 1, 0.78] }));
    head.add(part(sphere(0.024, 16, 12), mat.skinShade, { outline: false, position: [side * 0.212, HEAD_Y - 0.012, -0.004], scale: [0.3, 1, 0.7] }));
  }

  // ---------- Hair: short, tight sides and a tall quiff swept up and to the side ----------
  const hair = new THREE.Group();
  hair.position.set(0, HEAD_Y, 0);
  head.add(hair);
  // Close-cropped shell: covers the crown, back and sides, hairline set back.
  hair.add(part(new THREE.SphereGeometry(0.216, 48, 32, 0, Math.PI * 2, 0, 1.45), mat.hair, { position: [0, 0.02, -0.018], rotation: [-0.52, 0, 0], scale: [1.02, 1.1, 1.03] }));
  hair.add(part(new THREE.SphereGeometry(0.218, 48, 32, Math.PI, Math.PI, 0.35, 1.45), mat.hair, { position: [0, 0, -0.003], scale: [1.015, 1.1, 1.02] }));
  for (const side of [-1, 1]) {
    // Neat sideburns.
    hair.add(part(new THREE.CapsuleGeometry(0.016, 0.05, 6, 10), mat.hair, { outline: false, position: [side * 0.198, -0.01, 0.03], rotation: [0, 0, side * 0.1] }));
  }
  // Volume on top, leaning forward and to his left.
  hair.add(part(sphere(0.12), mat.hair, { position: [0.02, 0.215, 0.04], scale: [1.45, 0.78, 1.35], rotation: [0.15, 0, -0.12] }));
  // Swept quiff: tapered locks rising from the hairline, curling back and sideways.
  const lock = new THREE.ConeGeometry(0.05, 0.2, 12, 1);
  for (let i = 0; i < 6; i += 1) {
    const u = i / 5;
    hair.add(part(lock, i === 2 || i === 4 ? mat.hairLight : mat.hair, {
      position: [-0.13 + 0.25 * u, 0.25 + 0.05 * Math.sin(u * Math.PI), 0.1 - 0.05 * Math.abs(u - 0.4)],
      rotation: [-0.85 - 0.15 * Math.sin(u * Math.PI), 0, -0.55 + 0.25 * u],
      scale: [1.15, 1, 0.7],
    }));
  }
  // Front wave right at the hairline.
  hair.add(part(new THREE.CapsuleGeometry(0.04, 0.17, 8, 14), mat.hair, { position: [0.0, 0.205, 0.145], rotation: [0.25, 0, Math.PI / 2 - 0.18], scale: [1, 1, 0.75] }));

  // ---------- Face ----------
  const face = new THREE.Group();
  face.position.y = HEAD_Y;
  face.scale.set(1, 1.12, 0.98);
  head.add(face);

  type Eye = { group: ThreeTypes.Group; iris: ThreeTypes.Group };
  const eyes: Eye[] = [];
  const brows: ThreeTypes.Group[] = [];
  for (const side of [-1, 1]) {
    const group = onFace(new THREE.Group(), [side * 0.34, 0.07, 0.94], FACE_R - 0.006);
    group.add(part(sphere(0.041, 24, 16), mat.white, { outline: false, scale: [1.08, 1.1, 0.42] }));
    const iris = new THREE.Group();
    iris.position.z = 0.012;
    iris.add(part(sphere(0.027, 20, 14), mat.irisRing, { outline: false, scale: [1, 1.08, 0.32] }));
    iris.add(part(sphere(0.022, 20, 14), mat.iris, { outline: false, position: [0, 0, 0.002], scale: [1, 1.08, 0.32] }));
    iris.add(part(sphere(0.012, 14, 10), mat.pupil, { outline: false, position: [0, 0, 0.006], scale: [1, 1.08, 0.32] }));
    iris.add(part(sphere(0.0075, 10, 8), mat.white, { outline: false, position: [0.009, 0.011, 0.01] }));
    iris.add(part(sphere(0.0038, 8, 6), mat.white, { outline: false, position: [-0.008, -0.009, 0.01] }));
    group.add(iris);
    // Upper lash line and a soft crease above it.
    group.add(part(new THREE.TorusGeometry(0.043, 0.0058, 6, 24, Math.PI), mat.lash, { outline: false, position: [0, 0.002, 0.008], scale: [1.06, 1.12, 1] }));
    group.add(part(new THREE.TorusGeometry(0.047, 0.0028, 6, 24, Math.PI * 0.7), mat.skinShade, { outline: false, position: [0, 0.012, 0.006], rotation: [0, 0, Math.PI * 0.15] }));
    face.add(group);
    eyes.push({ group, iris });

    // Curved brow, a little higher toward the middle.
    const brow = onFace(new THREE.Group(), [side * 0.34, 0.32, 0.9], FACE_R + 0.002);
    brow.add(part(curve([[-0.05, -0.006, 0], [-0.012, 0.01, 0.004], [0.042, 0.006, 0]], 0.0082), mat.brow, { outline: false, scale: [side, 1, 1], rotation: [0, 0, -side * 0.08] }));
    brow.userData.baseY = brow.position.y;
    face.add(brow);
    brows.push(brow);

    const blush = onFace(new THREE.Group(), [side * 0.52, -0.2, 0.83], FACE_R + 0.003);
    blush.add(part(new THREE.CircleGeometry(0.03, 20), mat.blush, { outline: false, scale: [1.35, 0.75, 1] }));
    face.add(blush);
  }

  // Nose: soft bridge and rounded tip.
  face.add(onFace(part(new THREE.CapsuleGeometry(0.011, 0.045, 6, 10), mat.skinShade, { outline: false }), [0, -0.02, 1], FACE_R - 0.002));
  face.add(onFace(part(sphere(0.024, 18, 14), mat.skinShade, { outline: false, scale: [1.15, 0.85, 1] }), [0, -0.14, 1], FACE_R + 0.002));

  // Mouth: closed smile line, plus an open toothy smile shown while waving.
  const mouth = onFace(new THREE.Group(), [0, -0.36, 0.93], FACE_R - 0.002);
  const smile = part(new THREE.TorusGeometry(0.043, 0.0068, 8, 24, Math.PI * 0.9), mat.lips, { outline: false, rotation: [0, 0, Math.PI * 1.05] });
  mouth.add(smile);
  const open = new THREE.Group();
  open.add(part(new THREE.CircleGeometry(0.04, 24, Math.PI, Math.PI), mat.mouthInside, { outline: false, position: [0, 0.006, 0.002] }));
  open.add(part(new THREE.BoxGeometry(0.06, 0.012, 0.002), mat.teeth, { outline: false, position: [0, 0, 0.004] }));
  open.add(part(new THREE.CircleGeometry(0.016, 16, Math.PI, Math.PI), mat.tongue, { outline: false, position: [0, -0.022, 0.003] }));
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
export function buildPuppy({ THREE, part, toon, flat }: Builder) {
  const tan = toon(C.dog);
  const dark = toon(C.dogDark);
  const white = toon(C.dogWhite);
  const nose = flat(C.dogNose);
  const sphere = (r: number) => new THREE.SphereGeometry(r, 24, 18);

  const puppy = new THREE.Group();
  const body = new THREE.Group();
  puppy.add(body);
  body.add(part(sphere(0.16), tan, { position: [0, 0.19, -0.02], scale: [1, 1.05, 1.2], rotation: [-0.45, 0, 0] }));
  body.add(part(sphere(0.1), white, { position: [0, 0.22, 0.1], scale: [1, 1.2, 0.8] }));
  for (const side of [-1, 1]) {
    body.add(part(sphere(0.085), tan, { position: [side * 0.11, 0.09, -0.08], scale: [0.9, 0.8, 1.3] }));
    body.add(part(new THREE.CapsuleGeometry(0.035, 0.12, 6, 12), tan, { position: [side * 0.06, 0.08, 0.1] }));
    body.add(part(sphere(0.042), white, { position: [side * 0.06, 0.015, 0.12], scale: [1, 0.6, 1.3] }));
  }

  const head = new THREE.Group();
  head.position.set(0, 0.4, 0.08);
  head.rotation.order = "YXZ";
  body.add(head);
  head.add(part(sphere(0.125), tan, { scale: [1.05, 0.95, 1] }));
  head.add(part(sphere(0.065), white, { position: [0, -0.035, 0.1], scale: [1.1, 0.8, 1] }));
  head.add(part(sphere(0.022), nose, { outline: false, position: [0, -0.005, 0.163] }));
  for (const side of [-1, 1]) {
    head.add(part(sphere(0.018), nose, { outline: false, position: [side * 0.048, 0.03, 0.11] }));
    head.add(part(sphere(0.006), flat(0xffffff), { outline: false, position: [side * 0.048 + 0.006, 0.037, 0.126] }));
    head.add(part(new THREE.ConeGeometry(0.05, 0.12, 4), dark, { position: [side * 0.08, 0.11, -0.01], rotation: [-0.1, 0, side * -0.35] }));
  }
  const tongue = part(sphere(0.022), flat(0xff7b8a), { outline: false, position: [0, -0.07, 0.13], scale: [1, 0.5, 0.7] });
  head.add(tongue);

  const tail = new THREE.Group();
  tail.position.set(0, 0.12, -0.2);
  tail.rotation.x = -0.9;
  body.add(tail);
  tail.add(part(new THREE.CapsuleGeometry(0.025, 0.1, 6, 10), tan, { position: [0, 0.07, 0] }));

  return { puppy, body, head, tail, tongue };
}

// ======================= World =======================
function buildWorld(builder: Builder) {
  const { THREE, part, toon, flat } = builder;
  const random = seeded(42);
  const world = new THREE.Group();
  const swayers: Array<{ object: ThreeTypes.Object3D; phase: number }> = [];

  // Floating island: grass top, earthy underside.
  world.add(part(new THREE.CylinderGeometry(1.32, 1.24, 0.22, 56), toon(C.grass), { position: [0, -0.11, 0] }));
  world.add(part(new THREE.CylinderGeometry(1.22, 0.3, 0.85, 56), toon(C.dirt), { position: [0, -0.64, 0] }));
  world.add(part(new THREE.CylinderGeometry(0.3, 0.05, 0.3, 24), toon(C.dirtDark), { position: [0, -1.2, 0] }));
  for (let i = 0; i < 7; i += 1) {
    const angle = (i / 7) * Math.PI * 2 + 0.4;
    world.add(part(new THREE.DodecahedronGeometry(0.07 + random() * 0.06), toon(C.dirtDark), { position: [Math.cos(angle) * 0.85, -0.45 - random() * 0.35, Math.sin(angle) * 0.85] }));
  }

  // Trees behind Suraj.
  const trees: Array<[number, number, number]> = [[-0.85, -0.55, 1.1], [0.95, -0.5, 0.9], [-0.45, -0.95, 0.75]];
  trees.forEach(([x, z, size], index) => {
    const tree = new THREE.Group();
    tree.position.set(x, 0, z);
    tree.scale.setScalar(size);
    tree.add(part(new THREE.CylinderGeometry(0.05, 0.075, 0.55, 10), toon(C.bark), { position: [0, 0.27, 0] }));
    const crown = new THREE.Group();
    crown.position.y = 0.6;
    crown.add(part(new THREE.IcosahedronGeometry(0.3, 1), toon(C.leaf), { scale: [1, 0.95, 1] }));
    crown.add(part(new THREE.IcosahedronGeometry(0.22, 1), toon(C.leafLight), { position: [0.12, 0.2, 0.06] }));
    crown.add(part(new THREE.IcosahedronGeometry(0.19, 1), toon(C.leaf), { position: [-0.15, 0.14, 0.04] }));
    tree.add(crown);
    world.add(tree);
    swayers.push({ object: crown, phase: index * 1.7 });
  });

  // Rocks, grass tufts and flowers scattered around (kept clear of the feet).
  world.add(part(new THREE.DodecahedronGeometry(0.11), toon(C.rock), { position: [-0.95, 0.04, 0.55], scale: [1.3, 0.7, 1] }));
  world.add(part(new THREE.DodecahedronGeometry(0.07), toon(C.rock), { position: [-0.78, 0.03, 0.72], scale: [1.2, 0.7, 1] }));
  world.add(part(new THREE.DodecahedronGeometry(0.09), toon(C.rock), { position: [1.05, 0.03, 0.2], scale: [1.2, 0.65, 1] }));

  const grassMaterials = [toon(C.grassDark), toon(C.grassLight)];
  const bladeGeometry = new THREE.ConeGeometry(0.022, 0.13, 4);
  const spot = () => {
    for (;;) {
      const angle = random() * Math.PI * 2;
      const radius = 0.3 + random() * 0.92;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      if (Math.hypot(x - 0, z - 0) > 0.32 && Math.hypot(x - 0.62, z - 0.3) > 0.3) return [x, z] as const;
    }
  };
  for (let i = 0; i < 26; i += 1) {
    const [x, z] = spot();
    const tuft = new THREE.Group();
    tuft.position.set(x, 0, z);
    for (let b = 0; b < 3; b += 1) {
      tuft.add(part(bladeGeometry, grassMaterials[b % 2], { outline: false, position: [(b - 1) * 0.02, 0.055, 0], rotation: [0, 0, (b - 1) * 0.35] }));
    }
    world.add(tuft);
    swayers.push({ object: tuft, phase: random() * 6 });
  }
  const petalColors = [0xffffff, 0xff8fb1, 0xffd84f, 0xb48cff];
  const stemGeometry = new THREE.CylinderGeometry(0.006, 0.006, 0.12, 6);
  for (let i = 0; i < 14; i += 1) {
    const [x, z] = spot();
    const flower = new THREE.Group();
    flower.position.set(x, 0, z);
    flower.add(part(stemGeometry, toon(C.grassDark), { outline: false, position: [0, 0.06, 0] }));
    flower.add(part(new THREE.SphereGeometry(0.03, 12, 8), toon(petalColors[i % petalColors.length]), { position: [0, 0.13, 0], scale: [1, 0.55, 1] }));
    flower.add(part(new THREE.SphereGeometry(0.012, 8, 6), flat(0xffb020), { outline: false, position: [0, 0.145, 0] }));
    world.add(flower);
    swayers.push({ object: flower, phase: random() * 6 });
  }

  // Sun with spinning rays, behind and above.
  const sun = new THREE.Group();
  sun.position.set(1.15, 2.25, -1.6);
  sun.add(part(new THREE.SphereGeometry(0.34, 32, 24), flat(C.sun)));
  const rays = new THREE.Group();
  for (let i = 0; i < 12; i += 1) {
    const angle = (i / 12) * Math.PI * 2;
    rays.add(part(new THREE.ConeGeometry(0.06, 0.18, 4), flat(i % 2 ? C.sun : C.sunRay), { position: [Math.cos(angle) * 0.48, Math.sin(angle) * 0.48, 0], rotation: [0, 0, angle - Math.PI / 2] }));
  }
  sun.add(rays);
  world.add(sun);

  // Clouds drifting across.
  const clouds: Array<{ group: ThreeTypes.Group; speed: number }> = [];
  const cloudMaterial = toon(C.cloud);
  [
    [-1.4, 2.05, -1.2, 0.9, 0.06],
    [0.5, 2.6, -1.9, 0.7, 0.04],
  ].forEach(([x, y, z, size, speed]) => {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    group.scale.setScalar(size);
    [[0, 0, 0.2], [0.22, 0.04, 0.16], [-0.22, -0.02, 0.15], [0.1, 0.13, 0.15]].forEach(([cx, cy, r]) => {
      group.add(part(new THREE.SphereGeometry(r, 20, 14), cloudMaterial, { position: [cx, cy, 0], scale: [1, 0.85, 0.8] }));
    });
    world.add(group);
    clouds.push({ group, speed });
  });

  // Butterflies looping around the island.
  const butterflies: Array<{ group: ThreeTypes.Group; wings: ThreeTypes.Object3D[]; phase: number; radius: number; height: number }> = [];
  [[0xff8fb1, 0, 0.95, 1.2], [0xffd84f, 2.4, 1.15, 0.8]].forEach(([color, phase, radius, height]) => {
    const group = new THREE.Group();
    const wingMaterial = flat(color, 1, true);
    const wings: ThreeTypes.Object3D[] = [];
    for (const side of [-1, 1]) {
      const pivot = new THREE.Group();
      pivot.add(part(new THREE.CircleGeometry(0.05, 16), wingMaterial, { outline: false, position: [side * 0.045, 0, 0], scale: [1, 1.3, 1] }));
      group.add(pivot);
      wings.push(pivot);
    }
    group.add(part(new THREE.CapsuleGeometry(0.008, 0.05, 4, 6), flat(0x222222), { outline: false, rotation: [Math.PI / 2, 0, 0] }));
    world.add(group);
    butterflies.push({ group, wings, phase, radius, height });
  });

  return { world, swayers, rays, clouds, butterflies, sun };
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

      const { world, swayers, rays, clouds, butterflies, sun } = buildWorld(builder);
      rig.add(world);

      const { character, torso, head, eyes, brows, arms, legs, mouth } = buildCharacter(builder);
      character.position.set(-0.05, 0, 0.05);
      rig.add(character);

      const { puppy, body: puppyBody, head: puppyHead, tail, tongue } = buildPuppy(builder);
      puppy.position.set(0.62, 0, 0.3);
      puppy.rotation.y = -0.35;
      rig.add(puppy);

      // Contact shadows on the grass.
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 128;
      const shadowContext = shadowCanvas.getContext("2d")!;
      const gradient = shadowContext.createRadialGradient(64, 64, 4, 64, 64, 64);
      gradient.addColorStop(0, "rgba(20,60,20,0.45)");
      gradient.addColorStop(1, "rgba(20,60,20,0)");
      shadowContext.fillStyle = gradient;
      shadowContext.fillRect(0, 0, 128, 128);
      const shadowTexture = track(new THREE.CanvasTexture(shadowCanvas));
      const shadowMaterial = track(new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, depthWrite: false }));
      const addShadow = (x: number, z: number, w: number, d: number) => {
        const mesh = new THREE.Mesh(track(new THREE.PlaneGeometry(w, d)), shadowMaterial);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(x, 0.004, z);
        rig.add(mesh);
        return mesh;
      };
      const characterShadow = addShadow(-0.05, 0.08, 0.8, 0.36);
      addShadow(0.62, 0.3, 0.5, 0.36);

      const key = new THREE.DirectionalLight(0xffffff, 2.5);
      key.position.set(-2, 3, 4);
      scene.add(key, new THREE.AmbientLight(0xffffff, 1.15));

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
        // Fit the island, character and sun: about 3.9 tall and 3.0 wide.
        const distance = Math.max(1.95 / Math.tan(halfFov), 1.5 / (Math.tan(halfFov) * camera.aspect));
        camera.position.set(0, 1.55, distance);
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

        // --- Suraj ---
        torso.scale.set(1 + breathe * 0.006, 1 + breathe * 0.01, 1);
        torso.rotation.z = Math.sin(elapsed * 0.7) * 0.015;
        torso.rotation.y = gaze.x * 0.14;
        legs.forEach((hip, index) => {
          hip.rotation.z = (index === 0 ? -1 : 1) * 0.02 + Math.sin(elapsed * 0.7) * 0.01;
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
          if (side === -1) {
            // Waves with the arm away from the puppy, palm turned to the viewer.
            shoulder.rotation.z = -0.1 - raise * 2.45;
            shoulder.rotation.x = swing - raise * 0.25;
            elbow.rotation.z = -raise * (0.45 + Math.sin(elapsed * 13) * 0.4);
            hand.rotation.y = raise * -0.9;
          } else {
            shoulder.rotation.z = 0.1;
            shoulder.rotation.x = -swing;
            elbow.rotation.z = 0.06;
            elbow.rotation.x = -0.12;
          }
        });
        head.rotation.z = -raise * 0.09;
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
        puppyHead.rotation.z = Math.sin(elapsed * 0.9) * 0.08;
        tail.rotation.z = Math.sin(elapsed * (hop > 0 ? 22 : 11)) * 0.7;
        tongue.scale.y = 0.5 + Math.max(0, Math.sin(elapsed * 6)) * 0.25;
        puppyBody.scale.y = 1 + Math.sin(elapsed * 3.2) * 0.015;

        // --- World ---
        swayers.forEach(({ object, phase }) => {
          object.rotation.z = Math.sin(elapsed * 1.3 + phase) * 0.05;
        });
        rays.rotation.z = elapsed * 0.25;
        sun.scale.setScalar(1 + Math.sin(elapsed * 1.5) * 0.03);
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
        character.position.y = (1 - presence) * 0.6;
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
