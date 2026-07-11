import * as THREE from "three";

/**
 * Ultra-subtle atmospheric limb — like real space photography.
 * Thin horizon glow only; no thick "onion layers".
 */
export function createAtmosphereMaterial(opts: {
  color: THREE.ColorRepresentation;
  /** Higher = thinner rim (realistic Earth ~4.5–6) */
  rimPower?: number;
  /** Keep low (0.15–0.45) for natural look */
  intensity?: number;
  /** Day-side scatter strength (soft) */
  scatter?: number;
}) {
  const color = new THREE.Color(opts.color);
  const uniforms = {
    uColor: { value: color },
    uRimPower: { value: opts.rimPower ?? 5.2 },
    uIntensity: { value: opts.intensity ?? 0.28 },
    uScatter: { value: opts.scatter ?? 0.22 },
    uLightDir: { value: new THREE.Vector3(1, 0, 0) },
    uCloseFactor: { value: 0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    // Soft composite — avoids hard band edges
    vertexShader: /* glsl */ `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        // BackSide: invert normal for outward atmosphere
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uRimPower;
      uniform float uIntensity;
      uniform float uScatter;
      uniform vec3 uLightDir;
      uniform float uCloseFactor;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;

      void main() {
        vec3 n = normalize(vWorldNormal);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        // Facing factor: 0 facing camera, 1 at limb
        float ndv = max(dot(viewDir, n), 0.0);
        // Soft multi-lobe fresnel (thin realistic rim)
        float rim = pow(1.0 - ndv, uRimPower);
        float rimSoft = pow(1.0 - ndv, uRimPower * 0.55) * 0.25;
        float limb = rim * 0.85 + rimSoft * 0.15;

        vec3 L = normalize(uLightDir);
        float day = smoothstep(-0.15, 0.55, dot(n, L));
        // Night side: almost no glow (real planets don't glow in darkness)
        float nightFade = mix(0.08, 1.0, day);

        // Very soft Rayleigh-ish scatter only near terminator / day limb
        float scatter = pow(max(dot(n, L), 0.0), 1.2) * uScatter * limb;

        float intensity = uIntensity * (0.85 + uCloseFactor * 0.35);
        float alpha = (limb * intensity + scatter * 0.4) * nightFade;
        // Cap so it never becomes a solid ring
        alpha = clamp(alpha, 0.0, 0.42);

        // Horizon: slightly desaturated / pale (airlight)
        vec3 col = mix(uColor, vec3(0.85, 0.92, 1.0), limb * 0.45);
        col *= 0.35 + day * 0.55;

        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}

/**
 * Soft solar chromosphere / corona halo.
 * Scientific: photosphere + chromosphere + corona (not planetary air).
 * Visual: thin warm limb + very faint outer corona — no thick onion rings.
 */
export function createSunCoronaMaterial(opts?: {
  /** Inner chromosphere intensity */
  chromoIntensity?: number;
  /** Outer corona intensity */
  coronaIntensity?: number;
  /** 0 = chromosphere shell, 1 = outer corona shell */
  layer?: 0 | 1;
}) {
  const layer = opts?.layer ?? 0;
  const intensity =
    layer === 0
      ? (opts?.chromoIntensity ?? 0.1)
      : (opts?.coronaIntensity ?? 0.035);

  const uniforms = {
    uIntensity: { value: intensity },
    // Higher power = thinner rim (more natural)
    uRimPower: { value: layer === 0 ? 5.5 : 3.6 },
    uColorCore: {
      value: new THREE.Color(layer === 0 ? "#ffd27a" : "#ffb060"),
    },
    uColorEdge: {
      value: new THREE.Color(layer === 0 ? "#fff6e0" : "#ffc080"),
    },
    uTime: { value: 0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    depthTest: true,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    toneMapped: false,
    vertexShader: /* glsl */ `
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;
      void main() {
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        vWorldNormal = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uIntensity;
      uniform float uRimPower;
      uniform vec3 uColorCore;
      uniform vec3 uColorEdge;
      uniform float uTime;
      varying vec3 vWorldNormal;
      varying vec3 vWorldPos;

      void main() {
        vec3 n = normalize(vWorldNormal);
        vec3 viewDir = normalize(cameraPosition - vWorldPos);
        float ndv = max(dot(viewDir, n), 0.0);
        // Whisper-thin limb only
        float rim = pow(1.0 - ndv, uRimPower);
        float soft = pow(1.0 - ndv, uRimPower * 0.5) * 0.12;
        float limb = clamp(rim * 0.88 + soft, 0.0, 1.0);

        // Barely perceptible pulse
        float pulse = 0.97 + 0.03 * sin(uTime * 0.25);

        float alpha = limb * uIntensity * pulse;
        alpha = clamp(alpha, 0.0, 0.18);

        vec3 col = mix(uColorCore, uColorEdge, limb * 0.6);
        col *= 0.4 + limb * 0.35;

        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}

/**
 * Extremely soft front haze — only a whisper of air when very close.
 */
export function createInnerAtmosphereMaterial(opts: {
  color: THREE.ColorRepresentation;
  intensity?: number;
}) {
  const color = new THREE.Color(opts.color);
  const uniforms = {
    uColor: { value: color },
    uIntensity: { value: opts.intensity ?? 0.06 },
    uLightDir: { value: new THREE.Vector3(1, 0, 0) },
    uCloseFactor: { value: 0 },
  };

  return new THREE.ShaderMaterial({
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      varying vec3 vViewNormal;
      varying vec3 vWorldPos;
      void main() {
        vViewNormal = normalize(normalMatrix * normal);
        vec4 world = modelMatrix * vec4(position, 1.0);
        vWorldPos = world.xyz;
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform float uIntensity;
      uniform vec3 uLightDir;
      uniform float uCloseFactor;
      varying vec3 vViewNormal;
      varying vec3 vWorldPos;

      void main() {
        vec3 n = normalize(vViewNormal);
        // View-space rim (camera looks down -Z)
        float rim = pow(1.0 - abs(n.z), 4.5);
        // Only visible when zoomed in
        float close = smoothstep(0.15, 0.85, uCloseFactor);
        float a = rim * uIntensity * close * 0.55;
        a = clamp(a, 0.0, 0.12);
        if (a < 0.004) discard;
        gl_FragColor = vec4(uColor * 0.7, a);
      }
    `,
  });
}
