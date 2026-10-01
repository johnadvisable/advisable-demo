
import * as THREE from "three";

export function createBackgroundParticles() {
  const particleCount = 80; // Reduced for better performance
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  
  for (let i = 0; i < particleCount; i++) {
    const i3 = i * 3;
    particlePositions[i3] = (Math.random() - 0.5) * 40;
    particlePositions[i3 + 1] = (Math.random() - 0.5) * 40;
    particlePositions[i3 + 2] = (Math.random() - 0.5) * 40;
    particleSizes[i] = Math.random() * 0.5;
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
  
  const particleMaterial = new THREE.PointsMaterial({
    color: 0xc4b5fd,
    size: 0.3,
    transparent: true,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  
  return new THREE.Points(particleGeometry, particleMaterial);
}
