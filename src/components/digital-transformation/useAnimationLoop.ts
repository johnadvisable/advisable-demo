
import * as THREE from "three";

type AnimationProps = {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  core: THREE.Mesh;
  group: THREE.Group;
  orbitalElements: THREE.Mesh[];
  backgroundParticles: THREE.Points;
  isHovered: boolean;
  mouseX: number;
  mouseY: number;
};

export function useAnimationLoop({
  scene,
  camera,
  renderer,
  core,
  group,
  orbitalElements,
  backgroundParticles,
  isHovered,
  mouseX,
  mouseY
}: AnimationProps) {
  let time = 0;

  const animate = () => {
    requestAnimationFrame(animate);
    time += 0.01;

    // Rotate the core
    core.rotation.x += 0.003;
    core.rotation.y += 0.005;

    // Make core pulse
    const pulseScale = 1 + Math.sin(time * 2) * 0.05;
    core.scale.set(pulseScale, pulseScale, pulseScale);

    // Update orbital elements
    orbitalElements.forEach((element, index) => {
      const { orbitRadius, speed, startAngle } = element.userData;
      const angle = startAngle + time * speed;

      // Update position along orbital path
      element.position.x = Math.cos(angle) * orbitRadius;
      element.position.z = Math.sin(angle) * orbitRadius;
      element.position.y = Math.sin(angle * 0.5) * (index * 0.3);

      // Rotate the element
      element.rotation.x += 0.01;
      element.rotation.y += 0.01;

      // Update connecting line
      const line = group.children.find(
        child => child instanceof THREE.Line && child.userData.elementIndex === index
      ) as THREE.Line;
      
      if (line) {
        const positions = line.geometry.attributes.position.array as Float32Array;
        positions[0] = 0;
        positions[1] = 0;
        positions[2] = 0;
        positions[3] = element.position.x;
        positions[4] = element.position.y;
        positions[5] = element.position.z;
        line.geometry.attributes.position.needsUpdate = true;
      }
    });

    // Rotate the group based on mouse position if hovered
    if (isHovered) {
      group.rotation.y += (mouseX * 0.05 - group.rotation.y) * 0.05;
      group.rotation.x += (mouseY * 0.05 - group.rotation.x) * 0.05;
    } else {
      group.rotation.y += 0.005;
      group.rotation.x = Math.sin(time * 0.2) * 0.2;
    }

    // Animate particles
    if (backgroundParticles.geometry.attributes.position) {
      const positions = backgroundParticles.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 1] += 0.01 * (Math.random() * 0.5);

        if (positions[i + 1] > 20) {
          positions[i + 1] = -20;
        }
      }
      backgroundParticles.geometry.attributes.position.needsUpdate = true;
    }
    
    renderer.render(scene, camera);
  };

  return { animate };
}
