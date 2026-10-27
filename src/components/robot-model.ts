import type * as ThreeTypes from "three";

/**
 * Shared loader and animation helpers for the robot used in the hero and the
 * scroll guide. Model: fan-made "Chappie", rig by Beneth Borromeo (CC BY 4.0),
 * animations from Adobe Mixamo; Chappie © Sony Pictures / MRC. The file is
 * Draco-compressed, so the decoder is served from /draco/.
 */
export const ROBOT_URL = "/models/robot/robot.glb";

type Disposable = { dispose: () => void };

export type RobotRig = {
  /** Group to place in the scene; hips are pinned to its origin column. */
  root: ThreeTypes.Group;
  mixer: ThreeTypes.AnimationMixer;
  actions: Map<string, ThreeTypes.AnimationAction>;
  bones: { hips?: ThreeTypes.Object3D; head?: ThreeTypes.Object3D; neck?: ThreeTypes.Object3D; chest?: ThreeTypes.Object3D };
};

export async function loadRobot(THREE: typeof ThreeTypes, track: (item: Disposable) => void, height = 1.85): Promise<RobotRig> {
  const [{ GLTFLoader }, { DRACOLoader }] = await Promise.all([
    import("three/examples/jsm/loaders/GLTFLoader.js"),
    import("three/examples/jsm/loaders/DRACOLoader.js"),
  ]);
  const draco = new DRACOLoader().setDecoderPath("/draco/");
  const gltf = await new GLTFLoader().setDRACOLoader(draco).loadAsync(ROBOT_URL);
  draco.dispose();

  const model = gltf.scene;
  model.traverse((node) => {
    const mesh = node as ThreeTypes.Mesh;
    if (!mesh.isMesh) return;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.frustumCulled = false;
    track(mesh.geometry);
    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    materials.forEach((material) => {
      track(material);
      Object.values(material).forEach((value) => {
        if (value && (value as ThreeTypes.Texture).isTexture) track(value as ThreeTypes.Texture);
      });
    });
  });

  // Normalize: requested height, feet at y = 0, centred on the origin.
  model.updateMatrixWorld(true);
  const box = new THREE.Box3().setFromObject(model, true);
  model.scale.multiplyScalar(height / Math.max(box.max.y - box.min.y, 0.001));
  model.updateMatrixWorld(true);
  box.setFromObject(model, true);
  const center = box.getCenter(new THREE.Vector3());
  model.position.x -= center.x;
  model.position.z -= center.z;
  model.position.y -= box.min.y;

  const root = new THREE.Group();
  root.add(model);
  const find = (name: string) => model.getObjectByName(name) ?? model.getObjectByName(name.replace(":", ""));
  const mixer = new THREE.AnimationMixer(model);
  const actions = new Map(gltf.animations.map((clip) => [clip.name, mixer.clipAction(clip)]));
  return {
    root,
    mixer,
    actions,
    bones: {
      hips: find("mixamorig:Hips"),
      head: find("mixamorig:Head"),
      neck: find("mixamorig:Neck"),
      chest: find("mixamorig:Spine2"),
    },
  };
}

/**
 * Plays a looping "base" clip (idle, talking, kneeling...) and one-shot moves
 * on top of it, cross-fading between them and returning to the base when a
 * move finishes.
 */
export function createMover(THREE: typeof ThreeTypes, rig: RobotRig, base = "Idle") {
  let baseAction = rig.actions.get(base) ?? [...rig.actions.values()][0];
  let current: ThreeTypes.AnimationAction | null = null;
  const held = new WeakSet<ThreeTypes.AnimationAction>();
  baseAction.play();

  rig.mixer.addEventListener("finished", (event) => {
    if (!current || event.action !== current) return;
    if (held.has(current)) return; // stays in its last pose (e.g. kneeling) until release()
    const finished = current;
    current = null;
    baseAction.reset().play();
    baseAction.crossFadeFrom(finished, 0.45, false);
  });

  return {
    /** Plays a move once. `hold` keeps its final pose until something else plays. */
    play(name: string, options: { hold?: boolean; fade?: number } = {}) {
      const next = rig.actions.get(name);
      if (!next || next === current) return false;
      const from = current ?? baseAction;
      next.reset();
      next.setLoop(THREE.LoopOnce, 1);
      next.clampWhenFinished = true;
      if (options.hold) held.add(next);
      else held.delete(next);
      next.play();
      next.crossFadeFrom(from, options.fade ?? 0.35, false);
      current = next;
      return true;
    },
    /** Switches the looping base clip, fading over unless a move is playing. */
    setBase(name: string, fade = 0.45) {
      const next = rig.actions.get(name);
      if (!next || next === baseAction) return;
      const previous = baseAction;
      baseAction = next;
      next.setLoop(THREE.LoopRepeat, Infinity);
      next.clampWhenFinished = false;
      next.reset().play();
      next.crossFadeFrom(current ?? previous, fade, false);
      current = null;
    },
    /** Returns from a held pose (or any move) to the base clip. */
    release(fade = 0.45) {
      if (!current) return;
      const from = current;
      current = null;
      baseAction.reset().play();
      baseAction.crossFadeFrom(from, fade, false);
    },
    get busy() {
      return current !== null;
    },
    get currentName() {
      return current?.getClip().name ?? null;
    },
  };
}

/**
 * Per-frame helpers: keeps the hips over the same spot (Mixamo clips drift)
 * and turns head, neck and chest toward a look direction in world space.
 */
export function createRobotPoser(THREE: typeof ThreeTypes, rig: RobotRig, container: ThreeTypes.Object3D) {
  const parentWorld = new THREE.Quaternion();
  const parentInverse = new THREE.Quaternion();
  const turn = new THREE.Quaternion();
  const euler = new THREE.Euler(0, 0, 0, "YXZ");
  const at = new THREE.Vector3();
  let anchor: ThreeTypes.Vector3 | null = null;
  const look = [
    { bone: rig.bones.head, weight: 0.6 },
    { bone: rig.bones.neck, weight: 0.25 },
    { bone: rig.bones.chest, weight: 0.15 },
  ].filter((entry): entry is { bone: ThreeTypes.Object3D; weight: number } => Boolean(entry.bone));

  function addWorldRotation(bone: ThreeTypes.Object3D, yaw: number, pitch: number) {
    bone.parent?.getWorldQuaternion(parentWorld);
    parentInverse.copy(parentWorld).invert();
    euler.set(pitch, yaw, 0);
    turn.setFromEuler(euler);
    bone.quaternion.premultiply(parentWorld).premultiply(turn).premultiply(parentInverse);
  }

  return {
    /** Call right after `mixer.update`. */
    apply(yaw: number, pitch: number) {
      if (rig.bones.hips) {
        container.updateMatrixWorld(true);
        rig.bones.hips.getWorldPosition(at);
        container.worldToLocal(at);
        if (!anchor) anchor = at.clone();
        else {
          rig.root.position.x -= at.x - anchor.x;
          rig.root.position.z -= at.z - anchor.z;
        }
      }
      look.forEach(({ bone, weight }) => addWorldRotation(bone, yaw * weight, pitch * weight));
    },
  };
}
