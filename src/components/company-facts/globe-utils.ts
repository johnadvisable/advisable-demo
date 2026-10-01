
import * as THREE from "three";

export function createGlobeMesh() {
  // Create a globe (sphere)
  const sphereGeometry = new THREE.SphereGeometry(1.8, 32, 32);
  const sphereMaterial = new THREE.MeshBasicMaterial({
    color: 0x4285F4,
    wireframe: true,
    transparent: true,
    opacity: 0.6
  });
  const globe = new THREE.Mesh(sphereGeometry, sphereMaterial);

  // Create dots on the globe representing global presence
  const dotsGroup = new THREE.Group();

  // Add random dots for "global presence" 
  for (let i = 0; i < 12; i++) {
    const dotGeometry = new THREE.SphereGeometry(0.05, 12, 12); // Reduced geometry complexity
    const dotMaterial = new THREE.MeshBasicMaterial({
      color: 0xFF4597
    });

    // Calculate a random position on the sphere
    const phi = Math.acos(-1 + 2 * Math.random());
    const theta = 2 * Math.PI * Math.random();
    const dot = new THREE.Mesh(dotGeometry, dotMaterial);
    dot.position.x = 1.8 * Math.sin(phi) * Math.cos(theta);
    dot.position.y = 1.8 * Math.sin(phi) * Math.sin(theta);
    dot.position.z = 1.8 * Math.cos(phi);
    dotsGroup.add(dot);
  }

  // Add central core for "headquarters"
  const coreGeometry = new THREE.SphereGeometry(0.3, 32, 32);
  const coreMaterial = new THREE.MeshBasicMaterial({
    color: 0x6E56CF,
    transparent: true,
    opacity: 0.8
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);

  return { globe, dotsGroup, core };
}
