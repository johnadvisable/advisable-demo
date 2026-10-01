
import * as THREE from "three";
import { ParticleSystem } from "./particleSystem";

interface AnimationContext {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  particleSystem: ParticleSystem;
  scrollY: React.MutableRefObject<number>;
  clock: THREE.Clock;
}

export const createAnimationLoop = (context: AnimationContext) => {
  const { renderer, scene, camera, particleSystem, scrollY, clock } = context;
  
  const animate = () => {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();
    const normalizedScroll = scrollY.current * 0.0005; // Reduced sensitivity for smoother effect
    
    // Update particle system
    particleSystem.update(elapsedTime, scrollY.current);
    
    // More subtle camera movement based on scroll
    camera.position.x = Math.sin(normalizedScroll * 0.5) * 3;
    camera.position.y = Math.cos(normalizedScroll * 0.5) * 3;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
  };

  return animate;
};
