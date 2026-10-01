
import * as THREE from "three";

interface SceneSetupResult {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
}

export const setupScene = (
  canvas: HTMLCanvasElement
): SceneSetupResult => {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x111827);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75, 
    canvas.clientWidth / canvas.clientHeight, 
    0.1, 
    1000
  );
  camera.position.z = 5;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  return { scene, camera, renderer };
};

export const handleResize = (
  canvas: HTMLCanvasElement,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
): void => {
  // Update camera
  camera.aspect = canvas.clientWidth / canvas.clientHeight;
  camera.updateProjectionMatrix();
  
  // Update renderer
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
