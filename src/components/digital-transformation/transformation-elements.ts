
import * as THREE from "three";

export function createTransformationElements() {
  const group = new THREE.Group();

  // Create center node (representing digital core)
  const coreGeometry = new THREE.IcosahedronGeometry(1.5, 1);
  const coreMaterial = new THREE.MeshPhongMaterial({
    color: 0x9333ea,
    shininess: 90,
    emissive: 0x4c1d95,
    emissiveIntensity: 0.4,
    flatShading: true
  });
  const core = new THREE.Mesh(coreGeometry, coreMaterial);
  group.add(core);

  // Create orbiting elements (representing digital services)
  const orbitalPaths: THREE.Mesh[] = [];
  const orbitalElements: THREE.Mesh[] = [];
  const colors = [0x2563eb, 0x16a34a, 0xe11d48, 0xf59e0b];
  const shapes = [
    new THREE.TorusGeometry(0.4, 0.2, 8, 16), 
    new THREE.BoxGeometry(0.7, 0.7, 0.7), 
    new THREE.TetrahedronGeometry(0.5), 
    new THREE.OctahedronGeometry(0.5)
  ];

  // Create orbital rings and elements
  for (let i = 0; i < 4; i++) {
    // Orbital path
    const pathGeometry = new THREE.TorusGeometry(3 + i * 1.2, 0.02, 16, 50);
    const pathMaterial = new THREE.MeshBasicMaterial({
      color: 0x6366f1,
      transparent: true,
      opacity: 0.3
    });
    const orbitalPath = new THREE.Mesh(pathGeometry, pathMaterial);
    orbitalPath.rotation.x = Math.PI / 2 + i * 0.3;
    orbitalPath.rotation.y = i * 0.2;
    group.add(orbitalPath);
    orbitalPaths.push(orbitalPath);

    // Orbital element
    const elementMaterial = new THREE.MeshPhongMaterial({
      color: colors[i],
      shininess: 80,
      flatShading: true
    });
    const orbitalElement = new THREE.Mesh(shapes[i], elementMaterial);
    orbitalElement.userData = {
      orbitRadius: 3 + i * 1.2,
      speed: 0.5 - i * 0.07,
      startAngle: i * Math.PI / 2
    };
    group.add(orbitalElement);
    orbitalElements.push(orbitalElement);
  }

  // Add connecting lines
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0xa78bfa,
    transparent: true,
    opacity: 0.5
  });
  
  for (let i = 0; i < orbitalElements.length; i++) {
    const lineGeometry = new THREE.BufferGeometry();
    // The positions will be updated in animation
    const positions = new Float32Array(6); // 2 points (x, y, z) each
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const line = new THREE.Line(lineGeometry, lineMaterial);
    line.userData = {
      elementIndex: i
    };
    group.add(line);
  }
  
  return {
    group,
    core,
    orbitalPaths,
    orbitalElements
  };
}
