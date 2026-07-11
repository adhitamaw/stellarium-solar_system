import * as THREE from "three";
import { bodyPositions } from "@/lib/simClock";

const _sun = new THREE.Vector3();
const _body = new THREE.Vector3();
const _dir = new THREE.Vector3();

/**
 * Direction FROM body TOWARD sun (light incoming direction for shading = -this or from sun to body).
 * Shader expects light direction pointing FROM surface TO light, i.e. sun - body.
 */
export function lightDirFromSunTo(
  bodyId: string,
  out: THREE.Vector3 = _dir,
): THREE.Vector3 {
  const sun = bodyPositions.get("sun");
  const body = bodyPositions.get(bodyId);
  if (!sun || !body) {
    return out.set(1, 0.15, 0.05).normalize();
  }
  _sun.set(sun.x, sun.y, sun.z);
  _body.set(body.x, body.y, body.z);
  // For planets orbiting origin-sun, sun is ~0 so lightDir ≈ -body position
  out.copy(_sun).sub(_body);
  if (out.lengthSq() < 1e-8) {
    out.set(1, 0.15, 0.05);
  }
  return out.normalize();
}
