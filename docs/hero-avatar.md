# Hero avatar

Asset: `public/artwork/suraj-avatar-neutral.png`.

Edited with the built-in ImageGen tool from the cartoon avatar supplied by the user. The edit lowers both arms to a relaxed pose and reduces the head relative to the body. The figure has a transparent background.

`src/components/avatar-shaders.ts` adds subtle breathing, cursor-following gaze and synchronized eyelid animation to the supplied artwork. The head and neck retain their original shape. It uses measured eye positions from the final image. The cursor listener covers the entire window. Reduced-motion preferences and offscreen/document visibility suspend motion. The image remains visible when WebGL is unavailable.

Final image-edit prompt:

> Use case: precise-object-edit, identity-preserve. EDIT THE SUPPLIED TRANSPARENT CARTOON AVATAR. Make exactly two changes: (1) Lower the raised waving arm into a normal relaxed standing position, so BOTH arms hang naturally down at his sides with relaxed hands beside the thighs. No greeting, no raised hand, no wave, no hands in pockets. (2) Reduce the ENTIRE head including hair and face by approximately 12 percent relative to the torso, keeping the head naturally attached to the existing neck and aligned centrally. Keep the SAME person's face, eye shape, smile, hair design, same exact polished stylized 3D cartoon look, skin tone, lighting, tailored navy suit, open-collar white shirt, trousers and black formal shoes. Keep the existing lean tall adult body, leg length and full-body framing. Preserve the exact outfit and all other details. Frontal, confident neutral standing pose, both shoes fully visible. Maintain genuinely transparent background with clean alpha, no background color, no scene, no text, no accessories or new objects. Keep the same 1024 by 1536 portrait canvas and same approximate foot positions and collar height. Do not change into a different character or a photorealistic person.
