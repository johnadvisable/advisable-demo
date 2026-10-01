
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { setupScene, handleResize } from "./three-utils/sceneSetup";
import { createParticleSystem } from "./three-utils/particleSystem";
import { setupLighting } from "./three-utils/lighting";
import { createAnimationLoop } from "./three-utils/animation";
import { disposeResources } from "./three-utils/cleanup";
import { createScrollHandler } from "./three-utils/eventHandlers";

interface ScrollableSceneProps {
  className?: string;
}

const ScrollableScene = ({ className = "w-full h-64" }: ScrollableSceneProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const scrollY = useRef<number>(0);

  // Initialize the Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    // Initialize scene, camera, and renderer
    const { scene, camera, renderer } = setupScene(canvasRef.current);
    scene.background = new THREE.Color(0x111111); // Darker background
    
    sceneRef.current = scene;
    cameraRef.current = camera;
    rendererRef.current = renderer;

    // Create particle system
    const particleSystem = createParticleSystem();
    particlesRef.current = particleSystem.particles;
    scene.add(particleSystem.particles);

    // Add lighting
    setupLighting(scene);

    // Scroll handler
    const handleScroll = createScrollHandler(scrollY);
    window.addEventListener('scroll', handleScroll);
    
    // Set initial scroll position
    scrollY.current = window.scrollY;

    // Handle resize
    const handleWindowResize = () => {
      if (!canvasRef.current || !cameraRef.current || !rendererRef.current) return;
      handleResize(canvasRef.current, cameraRef.current, rendererRef.current);
    };
    window.addEventListener('resize', handleWindowResize);
    
    // Call resize handler once to ensure proper initial sizing
    handleWindowResize();

    // Animation loop with clock for time-based animations
    const clock = new THREE.Clock();
    
    const animate = createAnimationLoop({ 
      renderer, 
      scene, 
      camera, 
      particleSystem, 
      scrollY, 
      clock 
    });

    animate();

    // Cleanup function
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleWindowResize);
      disposeResources(particlesRef, rendererRef);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className={className} />
  );
};

export default ScrollableScene;
