
import { useEffect, useRef } from "react";
import * as THREE from "three";

const LightModeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf9f9fb); // Even lighter background color
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      canvasRef.current.clientWidth / canvasRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 25;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // Add subtle ambient light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Create minimal floating shapes
    const shapes: THREE.Mesh[] = [];
    const colors = [
      0xE8F4FD, // Very light blue
      0xF6F6F9, // Very light gray
      0xEDF0FF, // Very light lavender
    ];
    
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0),
      new THREE.OctahedronGeometry(1, 0),
    ];
    
    // Create fewer shapes (10 instead of 20)
    for (let i = 0; i < 10; i++) {
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      const material = new THREE.MeshStandardMaterial({
        color: colors[Math.floor(Math.random() * colors.length)],
        transparent: true,
        opacity: 0.4, // More transparent
        roughness: 0.7,
        metalness: 0.1,
      });
      
      const shape = new THREE.Mesh(geometry, material);
      
      // Random position in a sphere
      const radius = 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      shape.position.x = radius * Math.sin(phi) * Math.cos(theta);
      shape.position.y = radius * Math.sin(phi) * Math.sin(theta);
      shape.position.z = radius * Math.cos(phi);
      
      // Random size - smaller
      const scale = 0.3 + Math.random() * 0.7;
      shape.scale.set(scale, scale, scale);
      
      // Store initial position for animation
      shape.userData.initialPosition = { ...shape.position };
      shape.userData.rotationSpeed = {
        x: (Math.random() - 0.5) * 0.001, // Slower rotation
        y: (Math.random() - 0.5) * 0.001,
        z: (Math.random() - 0.5) * 0.001,
      };
      shape.userData.floatSpeed = 0.005 + Math.random() * 0.01; // Slower float
      shape.userData.floatOffset = Math.random() * Math.PI * 2;
      
      scene.add(shape);
      shapes.push(shape);
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      if (!canvasRef.current) return;
      
      const width = canvasRef.current.clientWidth;
      const height = canvasRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    // Animation loop
    const clock = new THREE.Clock();
    
    const animate = () => {
      requestAnimationFrame(animate);
      
      const elapsedTime = clock.getElapsedTime();
      
      // Animate shapes very subtly
      shapes.forEach((shape) => {
        // Gentle rotation
        shape.rotation.x += shape.userData.rotationSpeed.x;
        shape.rotation.y += shape.userData.rotationSpeed.y;
        shape.rotation.z += shape.userData.rotationSpeed.z;
        
        // Floating movement based on sine wave - reduced amplitude
        const initial = shape.userData.initialPosition;
        const floatOffset = shape.userData.floatOffset;
        const floatSpeed = shape.userData.floatSpeed;
        
        shape.position.y = initial.y + Math.sin(elapsedTime * floatSpeed + floatOffset) * 0.8;
      });
      
      // Very subtle camera movement based on mouse position - reduced sensitivity
      camera.position.x += (mouseX * 2 - camera.position.x) * 0.01;
      camera.position.y += (-mouseY * 2 - camera.position.y) * 0.01;
      camera.lookAt(scene.position);
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Dispose geometries and materials
      shapes.forEach(shape => {
        shape.geometry.dispose();
        (shape.material as THREE.Material).dispose();
      });
      
      renderer.dispose();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full" 
      style={{ zIndex: 0 }} 
    />
  );
};

export default LightModeBackground;
