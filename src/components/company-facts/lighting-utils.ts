
import * as THREE from "three";

export function setupLighting(scene: THREE.Scene) {
  // Add ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);
  
  return ambientLight;
}
