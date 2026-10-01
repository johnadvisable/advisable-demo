
import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeJsUniverse = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;
    
    // Renderer setup with error handling
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    
    // Add WebGL context lost/restored handlers
    canvasRef.current.addEventListener('webglcontextlost', (event) => {
      event.preventDefault();
      console.warn('WebGL context lost');
    });
    

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Stars setup
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 6000;
    
    const positionArray = new Float32Array(starCount * 3);
    const colorArray = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount * 3; i += 3) {
      // Position
      positionArray[i] = (Math.random() - 0.5) * 100;
      positionArray[i + 1] = (Math.random() - 0.5) * 100;
      positionArray[i + 2] = (Math.random() - 0.5) * 100;
      
      // Color - varying between blue and purple
      const blueToViolet = Math.random();
      colorArray[i] = 0.3 + blueToViolet * 0.3; // R
      colorArray[i + 1] = 0.3 + Math.random() * 0.2; // G
      colorArray[i + 2] = 0.6 + Math.random() * 0.4; // B
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
    });
    
    const stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);
    
    // Create nebula-like clouds
    const cloudCount = 5;
    const cloudGeometries = [
      new THREE.SphereGeometry(1, 32, 32),
      new THREE.IcosahedronGeometry(1, 5),
      new THREE.TorusGeometry(2, 0.5, 16, 100),
    ];
    
    const clouds: THREE.Mesh[] = [];
    
    for (let i = 0; i < cloudCount; i++) {
      const geometry = cloudGeometries[Math.floor(Math.random() * cloudGeometries.length)];
      const material = new THREE.MeshBasicMaterial({
        color: new THREE.Color(
          0.3 + Math.random() * 0.2,
          0.2 + Math.random() * 0.3,
          0.8 + Math.random() * 0.2
        ),
        transparent: true,
        opacity: 0.15,
        wireframe: true,
      });
      
      const cloud = new THREE.Mesh(geometry, material);
      cloud.position.set(
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60,
        (Math.random() - 0.5) * 60
      );
      cloud.scale.set(
        5 + Math.random() * 15,
        5 + Math.random() * 15,
        5 + Math.random() * 15
      );
      cloud.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );
      
      clouds.push(cloud);
      scene.add(cloud);
    }
    
    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    
    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    
    window.addEventListener('resize', handleResize);
    
    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      // Rotate stars slightly based on mouse position
      stars.rotation.x += 0.0003;
      stars.rotation.y += 0.0004;
      
      stars.rotation.x += mouseY * 0.0003;
      stars.rotation.y += mouseX * 0.0003;
      
      // Animate clouds
      clouds.forEach((cloud, i) => {
        cloud.rotation.x += 0.0005 * (i % 3 + 1);
        cloud.rotation.y += 0.0003 * ((i + 1) % 3 + 1);
        cloud.rotation.z += 0.0002 * ((i + 2) % 3 + 1);
      });
      
      renderer.render(scene, camera);
    };
    
    animate();
    
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      
      // Proper Three.js cleanup
      starGeometry.dispose();
      starMaterial.dispose();
      
      // Dispose cloud geometries
      cloudGeometries.forEach(geometry => geometry.dispose());
      
      // Dispose cloud materials
      clouds.forEach(cloud => {
        if (cloud.material) {
          if (Array.isArray(cloud.material)) {
            cloud.material.forEach(material => material.dispose());
          } else if (cloud.material instanceof THREE.Material) {
            cloud.material.dispose();
          }
        }
      });
      
      // Dispose all meshes
      scene.traverse((object: any) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (object.material instanceof THREE.Material) {
            object.material.dispose();
          }
        }
      });
      
      renderer.dispose();
      renderer.forceContextLoss();
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full"
      style={{
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  );
};

export default ThreeJsUniverse;
