
import * as THREE from "three";

export const disposeResources = (
  particlesRef: React.MutableRefObject<THREE.Points | null>,
  rendererRef: React.MutableRefObject<THREE.WebGLRenderer | null>
): void => {
  // Dispose of resources
  if (particlesRef.current) {
    if (particlesRef.current.geometry) particlesRef.current.geometry.dispose();
    if (particlesRef.current.material) {
      if (Array.isArray(particlesRef.current.material)) {
        particlesRef.current.material.forEach(material => material.dispose());
      } else {
        particlesRef.current.material.dispose();
      }
    }
  }
  
  if (rendererRef.current) {
    rendererRef.current.dispose();
  }
};
