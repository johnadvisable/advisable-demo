
import * as THREE from "three";

export function setupScene(canvas: HTMLCanvasElement) {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x080821);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
  camera.position.z = 10;

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Create grid
  const gridHelper = new THREE.GridHelper(20, 20, 0x6366f1, 0x4f46e5);
  gridHelper.position.y = -5;
  scene.add(gridHelper);

  // Lights
  const ambientLight = new THREE.AmbientLight(0x333366, 0.5);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const pointLight = new THREE.PointLight(0x9333ea, 1, 10);
  pointLight.position.set(0, 0, 3);
  scene.add(pointLight);

  return { scene, camera, renderer };
}
