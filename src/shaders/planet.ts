import * as THREE from "three";

export type PlanetShaderUniforms = {
  uDayMap: { value: THREE.Texture | null };
  uNightMap: { value: THREE.Texture | null };
  uCloudMap: { value: THREE.Texture | null };
  uSpecularMap: { value: THREE.Texture | null };
  uNormalMap: { value: THREE.Texture | null };
  uHasDay: { value: number };
  uHasNight: { value: number };
  uHasClouds: { value: number };
  uHasSpecular: { value: number };
  uHasNormal: { value: number };
  uTint: { value: THREE.Color };
  uLightDir: { value: THREE.Vector3 };
  uSunIntensity: { value: number };
  uAmbient: { value: number };
  uSpecularStrength: { value: number };
  uShininess: { value: number };
  uCloudOpacity: { value: number };
  uNightBoost: { value: number };
  uRoughness: { value: number };
  uTime: { value: number };
  uNormalStrength: { value: number };
  uCloseFactor: { value: number };
  uDetailStrength: { value: number };
  /** 1 = cast ring plane shadow (Saturn) */
  uRingShadow: { value: number };
  uRingInner: { value: number };
  uRingOuter: { value: number };
  uLightLocal: { value: THREE.Vector3 };
};

/**
 * Physically-inspired planet surface:
 * - Soft terminator (day/night)
 * - City lights on night side
 * - Specular oceans
 * - Optional normal mapping
 * - Cloud layer compositing
 * Closer to Google Earth / NASA Eyes than MeshStandardMaterial.
 */
export function createPlanetMaterial(): THREE.ShaderMaterial {
  const uniforms: PlanetShaderUniforms = {
    uDayMap: { value: null },
    uNightMap: { value: null },
    uCloudMap: { value: null },
    uSpecularMap: { value: null },
    uNormalMap: { value: null },
    uHasDay: { value: 0 },
    uHasNight: { value: 0 },
    uHasClouds: { value: 0 },
    uHasSpecular: { value: 0 },
    uHasNormal: { value: 0 },
    uTint: { value: new THREE.Color(1, 1, 1) },
    uLightDir: { value: new THREE.Vector3(1, 0, 0) },
    uSunIntensity: { value: 1.55 },
    uAmbient: { value: 0.035 },
    uSpecularStrength: { value: 0.85 },
    uShininess: { value: 48 },
    uCloudOpacity: { value: 0.55 },
    uNightBoost: { value: 1.8 },
    uRoughness: { value: 0.7 },
    uTime: { value: 0 },
    uNormalStrength: { value: 1.15 },
    uCloseFactor: { value: 0 },
    uDetailStrength: { value: 0.4 },
    uRingShadow: { value: 0 },
    uRingInner: { value: 1.35 },
    uRingOuter: { value: 2.4 },
    uLightLocal: { value: new THREE.Vector3(1, 0.2, 0) },
  };

  return new THREE.ShaderMaterial({
    uniforms: uniforms as unknown as Record<string, THREE.IUniform>,
    lights: false,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vPosW;
      varying vec3 vPosL;
      varying vec3 vTangentW;
      varying vec3 vBitangentW;

      attribute vec4 tangent;

      void main() {
        vUv = uv;
        vPosL = position;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vPosW = world.xyz;
        mat3 nmat = mat3(modelMatrix);
        vNormalW = normalize(nmat * normal);

        #ifdef USE_TANGENT
          vTangentW = normalize(nmat * tangent.xyz);
          vBitangentW = normalize(cross(vNormalW, vTangentW) * tangent.w);
        #else
          vec3 c1 = cross(normal, vec3(0.0, 0.0, 1.0));
          vec3 c2 = cross(normal, vec3(0.0, 1.0, 0.0));
          vec3 t = length(c1) > length(c2) ? c1 : c2;
          vTangentW = normalize(nmat * t);
          vBitangentW = normalize(cross(vNormalW, vTangentW));
        #endif

        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uDayMap;
      uniform sampler2D uNightMap;
      uniform sampler2D uCloudMap;
      uniform sampler2D uSpecularMap;
      uniform sampler2D uNormalMap;
      uniform float uHasDay;
      uniform float uHasNight;
      uniform float uHasClouds;
      uniform float uHasSpecular;
      uniform float uHasNormal;
      uniform vec3 uTint;
      uniform vec3 uLightDir;
      uniform float uSunIntensity;
      uniform float uAmbient;
      uniform float uSpecularStrength;
      uniform float uShininess;
      uniform float uCloudOpacity;
      uniform float uNightBoost;
      uniform float uRoughness;
      uniform float uTime;
      uniform float uNormalStrength;
      uniform float uCloseFactor;
      uniform float uDetailStrength;
      uniform float uRingShadow;
      uniform float uRingInner;
      uniform float uRingOuter;
      uniform vec3 uLightLocal;

      varying vec2 vUv;
      varying vec3 vNormalW;
      varying vec3 vPosW;
      varying vec3 vPosL;
      varying vec3 vTangentW;
      varying vec3 vBitangentW;

      // Hash noise for procedural micro-craters when normal map missing
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }
      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }
      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        for (int i = 0; i < 4; i++) {
          v += a * noise(p);
          p *= 2.05;
          a *= 0.5;
        }
        return v;
      }

      vec3 sampleNormal() {
        vec3 n = normalize(vNormalW);
        mat3 TBN = mat3(normalize(vTangentW), normalize(vBitangentW), n);
        vec3 mapN = vec3(0.0, 0.0, 1.0);

        if (uHasNormal > 0.5) {
          mapN = texture2D(uNormalMap, vUv).xyz * 2.0 - 1.0;
          float str = uNormalStrength * (1.0 + uCloseFactor * 1.55);
          mapN.xy *= str;
        } else if (uDetailStrength > 0.01) {
          // Fake relief from multi-scale noise (craters / dunes)
          float d = uDetailStrength * (0.55 + uCloseFactor * 1.1);
          float h = fbm(vUv * 48.0);
          float hx = fbm(vUv * 48.0 + vec2(0.004, 0.0));
          float hy = fbm(vUv * 48.0 + vec2(0.0, 0.004));
          mapN = normalize(vec3((h - hx) * 12.0 * d, (h - hy) * 12.0 * d, 1.0));
        }

        return normalize(TBN * mapN);
      }

      void main() {
        vec3 L = normalize(uLightDir);
        vec3 V = normalize(cameraPosition - vPosW);
        vec3 N = sampleNormal();

        float NdotL = dot(N, L);
        float day = smoothstep(-0.12, 0.22, NdotL);
        float twilight = smoothstep(-0.18, 0.04, NdotL) * (1.0 - smoothstep(0.04, 0.32, NdotL));

        vec3 dayCol = uTint;
        if (uHasDay > 0.5) {
          dayCol = texture2D(uDayMap, vUv).rgb * uTint;
          // Local contrast from micro-detail for rocky surfaces
          if (uDetailStrength > 0.2 && uHasNormal < 0.5) {
            float grain = fbm(vUv * 90.0) * 0.08 * uDetailStrength * (0.5 + uCloseFactor);
            dayCol *= 0.96 + grain;
          }
          dayCol = pow(dayCol, vec3(0.9 - uCloseFactor * 0.05));
        }

        vec3 nightCol = dayCol * 0.035;
        if (uHasNight > 0.5) {
          vec3 lights = texture2D(uNightMap, vUv).rgb;
          nightCol = dayCol * 0.025 + lights * uNightBoost * (1.0 + uCloseFactor * 0.4);
        }

        float cloud = 0.0;
        vec3 cloudCol = vec3(1.0);
        if (uHasClouds > 0.5) {
          vec4 ctex = texture2D(uCloudMap, vUv);
          cloud = max(ctex.r, max(ctex.g, ctex.a)) * uCloudOpacity;
          cloudCol = mix(vec3(0.82, 0.88, 0.94), vec3(1.0), ctex.r);
        }

        vec3 surfaceDay = mix(dayCol, cloudCol, cloud);
        vec3 surfaceNight = mix(nightCol, cloudCol * 0.07, cloud * 0.5);
        vec3 albedo = mix(surfaceNight, surfaceDay, day);

        float diff = max(NdotL, 0.0);
        float wrap = (NdotL + uRoughness) / (1.0 + uRoughness);
        wrap = clamp(wrap, 0.0, 1.0);
        float diffuse = mix(diff, wrap, uRoughness * 0.45);
        // Soft ambient occlusion in crevices from detail noise
        float ao = 1.0 - uDetailStrength * 0.12 * (1.0 - day) * (1.0 - cloud);
        vec3 lit = albedo * (uAmbient + diffuse * uSunIntensity) * ao;

        float specMask = 0.0;
        if (uHasSpecular > 0.5) {
          specMask = texture2D(uSpecularMap, vUv).r;
          float waves = 0.9 + 0.1 * sin(vUv.x * 90.0 + uTime * 1.5)
            * cos(vUv.y * 70.0 - uTime * 1.0);
          specMask *= waves;
        } else if (uSpecularStrength > 0.05) {
          // icy bodies without specular map
          specMask = 0.15 * (1.0 - uRoughness);
        }
        vec3 H = normalize(L + V);
        float shiny = mix(24.0, 72.0, 1.0 - uRoughness) * (1.0 + uCloseFactor * 1.4);
        float spec = pow(max(dot(N, H), 0.0), shiny) * specMask * max(uSpecularStrength, 0.2);
        spec *= day * (1.0 - cloud * 0.85);
        float waterFres = pow(1.0 - max(dot(N, V), 0.0), 4.0) * specMask;
        lit += vec3(0.7, 0.85, 1.0) * (spec + waterFres * 0.4 * uCloseFactor) * uSunIntensity;

        lit += vec3(1.0, 0.42, 0.12) * twilight * (0.2 + uCloseFactor * 0.14) * (1.0 - cloud * 0.5);

        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0);
        lit += albedo * fresnel * (0.09 + uCloseFactor * 0.12) * day;

        // Saturn ring shadow — rings in local XZ (Y=0); light in body/tilt frame
        if (uRingShadow > 0.5) {
          vec3 Lp = normalize(uLightLocal);
          float ly = Lp.y;
          if (abs(ly) > 0.015) {
            float tHit = -vPosL.y / ly;
            if (tHit > 0.01) {
              vec2 hit = vPosL.xz + Lp.xz * tHit;
              float rr = length(hit);
              float bodyR = max(length(vPosL), 0.001);
              float inner = uRingInner * bodyR;
              float outer = uRingOuter * bodyR;
              if (rr > inner && rr < outer) {
                float edge = smoothstep(inner, inner * 1.06, rr)
                  * (1.0 - smoothstep(outer * 0.94, outer, rr));
                float dens = 0.4 + 0.4 * sin((rr - inner) / max(outer - inner, 0.001) * 6.28318 * 2.0);
                float sh = clamp(edge * dens * 0.78, 0.0, 0.85) * day;
                lit *= (1.0 - sh);
              }
            }
          }
        }

        // Subtle color grade toward cinematic space photography
        lit *= vec3(1.02, 1.0, 0.98);
        lit = lit / (lit + vec3(1.0)) * 1.18;
        lit = pow(lit, vec3(1.0 / 1.03));

        gl_FragColor = vec4(lit, 1.0);
      }
    `,
  });
}

export function createSunMaterial(map: THREE.Texture | null): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uHasMap: { value: map ? 1 : 0 },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#ffcc44") },
    },
    transparent: false,
    depthWrite: true,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uHasMap;
      uniform float uTime;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vNormal;
      void main() {
        vec3 base = uColor;
        if (uHasMap > 0.5) base = texture2D(uMap, vUv).rgb;
        // Subtle animated brightness for living sun
        float pulse = 0.92 + 0.08 * sin(uTime * 0.7 + vUv.x * 12.0);
        // Limb darkening
        float limb = pow(abs(vNormal.z), 0.45);
        vec3 col = base * pulse * mix(0.55, 1.15, limb);
        col *= 1.35; // emissive boost (toneMapped false via renderer on basic — we output hot)
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    // Keep bright after ACES
    toneMapped: false,
  });
}

export function createRingMaterial(
  map: THREE.Texture | null,
): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uHasMap: { value: map ? 1 : 0 },
      uLightDir: { value: new THREE.Vector3(1, 0, 0) },
      uColor: { value: new THREE.Color("#d4c4a8") },
    },
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vPosW;
      varying vec3 vNormalW;
      void main() {
        vUv = uv;
        vec4 world = modelMatrix * vec4(position, 1.0);
        vPosW = world.xyz;
        vNormalW = normalize(mat3(modelMatrix) * normal);
        gl_Position = projectionMatrix * viewMatrix * world;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform float uHasMap;
      uniform vec3 uLightDir;
      uniform vec3 uColor;
      varying vec2 vUv;
      varying vec3 vPosW;
      varying vec3 vNormalW;
      void main() {
        vec4 tex = uHasMap > 0.5 ? texture2D(uMap, vUv) : vec4(uColor, 0.75);
        // Ring alpha textures often put density in alpha or red
        float alpha = max(tex.a, tex.r) * 0.95;
        if (alpha < 0.02) discard;
        vec3 n = normalize(vNormalW);
        float lit = 0.35 + 0.65 * abs(dot(n, normalize(uLightDir)));
        vec3 col = (uHasMap > 0.5 ? tex.rgb : uColor) * lit * 1.1;
        gl_FragColor = vec4(col, alpha);
      }
    `,
  });
}
