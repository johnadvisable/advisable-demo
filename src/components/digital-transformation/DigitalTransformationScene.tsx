
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { setupScene } from "./scene-setup";
import { createTransformationElements } from "./transformation-elements";
import { createBackgroundParticles } from "./background-particles";
import { useAnimationLoop } from "./useAnimationLoop";

const DigitalTransformationScene = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene, camera, renderer setup
    const { scene, camera, renderer } = setupScene(canvasRef.current);

    // Create transformation elements (core, orbitals, etc.)
    const { group, core, orbitalElements } = createTransformationElements();
    scene.add(group);

    // Add background particles
    const backgroundParticles = createBackgroundParticles();
    scene.add(backgroundParticles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX = (event.clientX - rect.left) / rect.width * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    canvasRef.current.addEventListener('mousemove', handleMouseMove);

    // Handle hover state
    canvasRef.current.addEventListener('mouseenter', () => setIsHovered(true));
    canvasRef.current.addEventListener('mouseleave', () => setIsHovered(false));

    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const { animate } = useAnimationLoop({
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
    });
    
    animate();

    // Cleanup
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousemove', handleMouseMove);
        canvasRef.current.removeEventListener('mouseenter', () => setIsHovered(true));
        canvasRef.current.removeEventListener('mouseleave', () => setIsHovered(false));
      }
      window.removeEventListener('resize', handleResize);
      scene.traverse((object: any) => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach((material: any) => material.dispose());
            } else {
              (object.material as any).dispose();
            }
          }
        }
      });
      renderer.dispose();
    };
  }, [isHovered]);

  return (
    <div className="w-full h-full">
      <canvas 
        ref={canvasRef} 
        className="w-full h-64 rounded-lg cursor-pointer" 
        style={{ minHeight: "240px" }}
      />
    </div>
  );
};

export default DigitalTransformationScene;
