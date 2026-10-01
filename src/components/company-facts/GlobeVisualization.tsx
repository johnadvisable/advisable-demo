import { useEffect, useRef } from "react";
import * as THREE from "three";
import { createGlobeMesh } from "./globe-utils";
import { setupLighting } from "./lighting-utils";
import { setupInteractions } from "./interaction-utils";

const GlobeVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75, 
      canvasRef.current.clientWidth / canvasRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setClearColor(0x000000, 0);

    // Create globe and dots
    const { globe, dotsGroup, core } = createGlobeMesh();
    scene.add(globe);
    scene.add(dotsGroup);
    scene.add(core);
    
    // Add lighting
    setupLighting(scene);

    // Setup interactions (mouse and touch)
    const { handleResize, animate } = setupInteractions({
      canvasRef: canvasRef.current,
      camera,
      renderer,
      globe,
      dotsGroup,
      core,
      scene // Pass the scene to setupInteractions
    });

    // Handle window resize
    window.addEventListener('resize', handleResize);

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      
      // Dispose of resources with proper type checking
      scene.traverse((object: THREE.Object3D) => {
        const mesh = object as THREE.Mesh;
        if (mesh.isMesh) {
          if (mesh.geometry) mesh.geometry.dispose();
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((material: THREE.Material) => material.dispose());
            } else {
              mesh.material.dispose();
            }
          }
        }
      });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-64" />;
};

export default GlobeVisualization;