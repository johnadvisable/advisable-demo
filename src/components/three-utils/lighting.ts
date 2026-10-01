
import * as THREE from "three";

export const setupLighting = (scene: THREE.Scene): void => {
  // Add point lights
  const colors = [0x4285F4, 0x6E56CF, 0xFF4597];
  
  colors.forEach((color, i) => {
    const light = new THREE.PointLight(color, 2, 15);
    const angle = (i / colors.length) * Math.PI * 2;
    light.position.set(Math.cos(angle) * 5, Math.sin(angle) * 3, 2);
    scene.add(light);
  });

  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
};
