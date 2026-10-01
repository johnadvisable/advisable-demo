
import * as THREE from "three";

export interface ParticleSystem {
  particles: THREE.Points;
  update: (elapsedTime: number, scrollY: number) => void;
}

export const createParticleSystem = (): ParticleSystem => {
  const particleCount = 2000;
  const particleGeometry = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);
  const particleColors = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    // Create a spherical distribution of particles
    const radius = 10;
    const phi = Math.random() * Math.PI * 2; // around the y-axis
    const theta = Math.random() * Math.PI; // from top to bottom
    
    const x = radius * Math.sin(theta) * Math.cos(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(theta);
    
    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;
    
    // Random sizes for particles
    particleSizes[i] = Math.random() * 0.1 + 0.05;
    
    // Colors - gradient from blue to purple
    const blueToViolet = Math.random();
    particleColors[i * 3] = 0.4 + blueToViolet * 0.3; // R
    particleColors[i * 3 + 1] = 0.2 + Math.random() * 0.3; // G 
    particleColors[i * 3 + 2] = 0.7 + Math.random() * 0.3; // B
  }
  
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
  particleGeometry.setAttribute('color', new THREE.BufferAttribute(particleColors, 3));
  
  // Particle material with custom shader
  const particleMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      scroll: { value: 0 }
    },
    vertexShader: `
      attribute float size;
      attribute vec3 color;
      varying vec3 vColor;
      uniform float time;
      uniform float scroll;
      
      void main() {
        vColor = color;
        
        // Apply some movement based on position, time and scroll
        vec3 pos = position;
        float scrollEffect = scroll * 0.01;
        
        // Rotate around y axis based on scroll
        float angle = scrollEffect * 2.0;
        float cosA = cos(angle);
        float sinA = sin(angle);
        vec3 rotatedPos = vec3(
          pos.x * cosA - pos.z * sinA,
          pos.y + sin(time + pos.x * 0.5 + pos.z * 0.5) * 0.2,
          pos.x * sinA + pos.z * cosA
        );
        
        // Add a pulsing effect with time
        vec4 mvPosition = modelViewMatrix * vec4(rotatedPos, 1.0);
        gl_PointSize = size * (150.0 / -mvPosition.z) * (1.0 + 0.2 * sin(time * 2.0 + pos.x + pos.y));
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vColor;
      
      void main() {
        // Draw a smooth circle for each particle
        float r = 0.5;
        vec2 uv = gl_PointCoord - vec2(0.5);
        float d = length(uv);
        float c = smoothstep(r, r - 0.05, d);
        
        if (d > r) discard;
        
        gl_FragColor = vec4(vColor, c);
      }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  const particles = new THREE.Points(particleGeometry, particleMaterial);
  
  const update = (elapsedTime: number, scrollY: number) => {
    if (particles.material instanceof THREE.ShaderMaterial) {
      particles.material.uniforms.time.value = elapsedTime;
      particles.material.uniforms.scroll.value = scrollY;
    }
  };
  
  return { particles, update };
};
