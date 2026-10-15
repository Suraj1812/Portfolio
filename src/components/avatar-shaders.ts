// Gentle image deformation preserves the supplied artwork instead of
// approximating its face and outfit with a different character model.
export const avatarVertexShader = /* glsl */ `
  uniform float uTime;
  uniform vec2 uGaze;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    vec3 p = position;
    float anchored = smoothstep(0.12, 0.65, uv.y);
    float breath = sin(uTime * 1.45);
    p.x += sin(uTime * 0.64) * 0.022 * anchored;
    p.y += breath * 0.007 * anchored;

    // Subtle breathing through the jacket; shoes remain planted.
    float chest = smoothstep(0.44, 0.62, uv.y)
      * (1.0 - smoothstep(0.76, 0.81, uv.y));
    p.x += (uv.x - 0.49) * 0.009 * breath * chest;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const avatarFragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uGaze;
  uniform float uBlink;
  varying vec2 vUv;

  vec4 animateEye(vec4 original, vec2 center, vec2 radius,
                  vec2 upperSkinUv, vec2 lowerSkinUv) {
    vec2 eye = (vUv - center) / radius;
    float mask = 1.0 - smoothstep(0.91, 1.12, length(eye));
    if (mask < 0.001) return original;
    vec2 source = vUv - uGaze * vec2(0.0024, 0.0009) * mask;
    vec4 looking = texture2D(uMap, source);
    vec4 result = mix(original, looking, mask);

    // Compress the original eye between its lids as they close. Sampling
    // this portrait's skin keeps both lids aligned with its smaller face.
    vec4 above = texture2D(uMap, upperSkinUv);
    vec4 below = texture2D(uMap, lowerSkinUv);
    vec4 skin = mix(below, above, smoothstep(-1.0, 1.0, eye.y));
    float opening = max(0.025, 1.0 - uBlink);
    vec2 closingCenter = center - vec2(0.0, radius.y * uBlink * 0.12);
    vec2 closingEye = (vUv - closingCenter) / vec2(radius.x, radius.y * opening);
    float visibleEye = 1.0 - smoothstep(0.83, 1.05, length(closingEye));
    vec2 compressedUv = source;
    compressedUv.y = center.y + (source.y - closingCenter.y) / opening;
    vec4 compressed = texture2D(uMap, compressedUv);
    float crease = exp(-pow((eye.y + 0.12) * 15.0, 2.0))
      * smoothstep(0.9, 1.0, uBlink);
    skin.rgb *= 1.0 - crease * 0.23;
    vec4 blinking = mix(skin, compressed, visibleEye);
    return mix(result, blinking, mask * smoothstep(0.0, 0.13, uBlink));
  }

  void main() {
    vec4 color = texture2D(uMap, vUv);
    if (color.a < 0.02) discard;
    color = animateEye(color, vec2(0.45898, 0.87630),
      vec2(0.0215, 0.00846), vec2(0.45898, 0.88542),
      vec2(0.45703, 0.86328));
    color = animateEye(color, vec2(0.51953, 0.88086),
      vec2(0.0215, 0.00781), vec2(0.51953, 0.89063),
      vec2(0.51855, 0.86719));
    if (color.a < 0.02) discard;
    gl_FragColor = color;
    #include <colorspace_fragment>
  }
`;
