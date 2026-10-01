
import * as THREE from "three";

interface InteractionSetupProps {
  canvasRef: HTMLCanvasElement;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  globe: THREE.Mesh;
  dotsGroup: THREE.Group;
  core: THREE.Mesh;
  scene: THREE.Scene;
}

export function setupInteractions({
  canvasRef,
  camera,
  renderer,
  globe,
  dotsGroup,
  core,
  scene
}: InteractionSetupProps) {
  // Mouse interaction variables
  let isDragging = false;
  let previousMousePosition = {
    x: 0,
    y: 0
  };
  let rotation = {
    x: 0,
    y: 0
  };

  // Mouse event handlers
  const handleMouseDown = (event: MouseEvent) => {
    isDragging = true;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDragging) return;
    const deltaMove = {
      x: event.clientX - previousMousePosition.x,
      y: event.clientY - previousMousePosition.y
    };
    rotation.x += deltaMove.y * 0.005;
    rotation.y += deltaMove.x * 0.005;
    globe.rotation.x = rotation.x;
    globe.rotation.y = rotation.y;
    dotsGroup.rotation.x = rotation.x;
    dotsGroup.rotation.y = rotation.y;
    previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  };

  const handleMouseUp = () => {
    isDragging = false;
  };

  // Touch event handlers
  const handleTouchStart = (event: TouchEvent) => {
    if (event.touches.length === 1) {
      isDragging = true;
      previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }
  };

  const handleTouchMove = (event: TouchEvent) => {
    if (!isDragging || event.touches.length !== 1) return;
    const deltaMove = {
      x: event.touches[0].clientX - previousMousePosition.x,
      y: event.touches[0].clientY - previousMousePosition.y
    };
    rotation.x += deltaMove.y * 0.005;
    rotation.y += deltaMove.x * 0.005;
    globe.rotation.x = rotation.x;
    globe.rotation.y = rotation.y;
    dotsGroup.rotation.x = rotation.x;
    dotsGroup.rotation.y = rotation.y;
    previousMousePosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY
    };
  };

  const handleTouchEnd = () => {
    isDragging = false;
  };

  // Add event listeners
  canvasRef.addEventListener('mousedown', handleMouseDown);
  window.addEventListener('mousemove', handleMouseMove);
  window.addEventListener('mouseup', handleMouseUp);
  canvasRef.addEventListener('touchstart', handleTouchStart);
  window.addEventListener('touchmove', handleTouchMove);
  window.addEventListener('touchend', handleTouchEnd);

  // Handle canvas resize
  const handleResize = () => {
    camera.aspect = canvasRef.clientWidth / canvasRef.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasRef.clientWidth, canvasRef.clientHeight);
  };

  // Animation loop
  let autoRotationSpeed = 0.005;

  const animate = () => {
    requestAnimationFrame(animate);

    // Auto-rotation when not interacting
    if (!isDragging) {
      rotation.y += autoRotationSpeed;
      globe.rotation.y = rotation.y;
      dotsGroup.rotation.y = rotation.y;
    }
    core.rotation.y += 0.01;
    renderer.render(scene, camera);
  };

  // Return functions that will be used outside this setup
  return {
    handleResize,
    animate
  };
}
