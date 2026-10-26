# 3D avatar setup

The hero shows a real 3D model of you as soon as `public/models/suraj.glb` exists.
Until then it keeps the current animated picture, so the site never breaks.

## 1. Make the model (about 10 minutes)

1. Go to [avaturn.me](https://avaturn.me) and create a free account.
2. Take the three selfies it asks for (front, left, right) in good, even light.
3. Pick the outfit closest to your current look (navy suit, white shirt).
4. Export as **GLB** (T-pose is fine).
5. Save it as `public/models/suraj.glb`.

## 2. Optional: idle and wave animations (about 10 minutes)

Without these, the model still turns its head toward the cursor, sways gently,
and hops when clicked. With them it breathes naturally and waves on click.

1. Go to [mixamo.com](https://www.mixamo.com) (free Adobe account).
2. Search **Breathing Idle**, click **Download**, choose **FBX**, **Without Skin**.
   Save it as `public/models/idle.fbx`.
3. Search **Waving**, download it the same way, and save it as `public/models/wave.fbx`.

Animations already inside `suraj.glb` also work if their names contain
"idle" or "wave".

## 3. Keep it fast

Aim for a model under about 5 MB. To shrink it:

```bash
npx @gltf-transform/cli optimize public/models/suraj.glb public/models/suraj.glb --compress meshopt --texture-compress webp
```

## What the hero does with the model

- Head, neck and chest turn to follow the cursor
- The body turns slightly toward the cursor too
- Drag the model to spin it; it springs back to face you
- Click it to wave (or hop and spin without a wave animation)
- Studio lighting, a cyan rim light to match the sun disc, and a soft ground shadow
- Pauses when off screen, and stays still for people who prefer reduced motion
