// @ts-nocheck
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
const RocketVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({
    x: 0,
    y: 0
  });
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, {
      passive: true
    });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({
        x: event.clientX / window.innerWidth * 2 - 1,
        y: -(event.clientY / window.innerHeight) * 2 + 1
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  useEffect(() => {
    if (!canvasRef.current) return;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000020, 0.015);
    const createStarField = () => {
      const starsGeometry = new THREE.BufferGeometry();
      const starCount = 8000;
      const positionArray = new Float32Array(starCount * 3);
      const colorArray = new Float32Array(starCount * 3);
      const sizeArray = new Float32Array(starCount);
      for (let i = 0; i < starCount * 3; i += 3) {
        const radius = 60 + Math.random() * 70;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        positionArray[i] = radius * Math.sin(phi) * Math.cos(theta);
        positionArray[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positionArray[i + 2] = radius * Math.cos(phi);
        const colorVariant = Math.random();
        if (colorVariant < 0.1) {
          colorArray[i] = 0.9 + Math.random() * 0.1;
          colorArray[i + 1] = 0.5 + Math.random() * 0.3;
          colorArray[i + 2] = 0.3 + Math.random() * 0.2;
        } else if (colorVariant < 0.2) {
          colorArray[i] = 0.3 + Math.random() * 0.2;
          colorArray[i + 1] = 0.5 + Math.random() * 0.3;
          colorArray[i + 2] = 0.9 + Math.random() * 0.1;
        } else {
          colorArray[i] = 0.8 + Math.random() * 0.2;
          colorArray[i + 1] = 0.8 + Math.random() * 0.2;
          colorArray[i + 2] = 0.9 + Math.random() * 0.1;
        }
        sizeArray[i / 3] = 0.1 + Math.random() * (Math.random() > 0.97 ? 0.5 : 0.2);
      }
      starsGeometry.setAttribute('position', new THREE.BufferAttribute(positionArray, 3));
      starsGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
      starsGeometry.setAttribute('size', new THREE.BufferAttribute(sizeArray, 1));
      const starsMaterial = new THREE.ShaderMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          time: { value: 0 },
        },
        vertexShader: `
          attribute float size;
          varying vec3 vColor;
          void main() {
            vColor = color;
            vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5, 0.5));
            if (dist > 0.5) discard;
            gl_FragColor = vec4(vColor, 1.0 - dist * 2.0);
          }
        `
      });
      return new THREE.Points(starsGeometry, starsMaterial);
    };
    const starField = createStarField();
    scene.add(starField);
    const createNebulaClouds = () => {
      const cloudGroup = new THREE.Group();
      const cloudColors = [[0x8B5CF6, 0xD946EF], [0x0EA5E9, 0x8B5CF6], [0xF97316, 0xD946EF]];
      for (let i = 0; i < 8; i++) {
        const size = 15 + Math.random() * 35;
        const cloudGeometry = new THREE.SphereGeometry(size, 24, 24);
        const colorPair = cloudColors[Math.floor(Math.random() * cloudColors.length)];
        const nebulaMaterial = new THREE.ShaderMaterial({
          uniforms: {
            color1: {
              value: new THREE.Color(colorPair[0])
            },
            color2: {
              value: new THREE.Color(colorPair[1])
            },
            cloudTexture: {
              value: null
            },
            time: {
              value: Math.random() * 1000
            }
          },
          vertexShader: `
            varying vec2 vUv;
            varying vec3 vPosition;
            void main() {
              vUv = uv;
              vPosition = position;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `,
          fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float time;
            varying vec2 vUv;
            varying vec3 vPosition;
            
            float snoise(vec3 v){ 
              const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
              const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
              
              vec3 i  = floor(v + dot(v, C.yyy) );
              vec3 x0 =   v - i + dot(i, C.xxx) ;
              
              vec3 g = step(x0.yzx, x0.xyz);
              vec3 l = 1.0 - g;
              vec3 i1 = min( g.xyz, l.zxy );
              vec3 i2 = max( g.xyz, l.zxy );
              
              vec3 x1 = x0 - i1 + 1.0 * C.xxx;
              vec3 x2 = x0 - i2 + 2.0 * C.xxx;
              vec3 x3 = x0 - 1. + 3.0 * C.xxx;
              
              i = mod(i, 289.0 ); 
              vec4 p = permute( permute( permute( 
                         i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                       + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                       + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
                       
              vec4 j = p - 49.0 * floor(p * ns.z *ns.z);  //  mod(p,N*N)
              
              vec4 x_ = floor(j * ns.z);
              vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)
              
              vec4 x = x_ *ns.x + ns.yyyy;
              vec4 y = y_ *ns.x + ns.yyyy;
              vec4 h = 1.0 - abs(x) - abs(y);
              
              vec4 b0 = vec4( x.xy, y.xy );
              vec4 b1 = vec4( x.zw, y.zw );
              
              vec4 s0 = floor(b0)*2.0 + 1.0;
              vec4 s1 = floor(b1)*2.0 + 1.0;
              vec4 sh = -step(h, vec4(0.0));
              
              vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
              vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
              
              vec3 p0 = vec3(a0.xy,h.x);
              vec3 p1 = vec3(a0.zw,h.y);
              vec3 p2 = vec3(a1.xy,h.z);
              vec3 p3 = vec3(a1.zw,h.w);
              
              vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
              p0 *= norm.x;
              p1 *= norm.y;
              p2 *= norm.z;
              p3 *= norm.w;
              
              float m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
              m = m * m;
              return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                            dot(p2,x2), dot(p3,x3) ) );
            }
            
            void main() {
              float noise = snoise(vPosition * 0.05 + vec3(0.0, 0.0, time * 0.01));
              noise = pow(0.5 + 0.5 * noise, 2.0);
              
              vec3 color = mix(color1, color2, noise + length(vPosition) * 0.05);
              
              float intensity = 1.0 - length(vUv - 0.5) * 1.5;
              intensity = smoothstep(0.0, 1.0, intensity);
              
              gl_FragColor = vec4(color, intensity * 0.05);
            }
          `,
          transparent: true,
          side: THREE.DoubleSide
        });
        const cloud = new THREE.Mesh(cloudGeometry, nebulaMaterial);
        cloud.position.set((Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150, (Math.random() - 0.5) * 150 - 50);
        cloud.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
        cloudGroup.add(cloud);
      }
      const coreGeometry = new THREE.IcosahedronGeometry(25, 2);
      const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
          color1: {
            value: new THREE.Color(0xD946EF)
          },
          color2: {
            value: new THREE.Color(0x8B5CF6)
          },
          time: {
            value: 0
          }
        },
        vertexShader: `
          varying vec3 vPosition;
          varying vec3 vNormal;
          void main() {
            vPosition = position;
            vNormal = normal;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float time;
          varying vec3 vPosition;
          varying vec3 vNormal;
          
          void main() {
            float pulse = sin(time * 0.5) * 0.5 + 0.5;
            float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 3.0);
            vec3 finalColor = mix(color1, color2, fresnel + pulse * 0.3);
            gl_FragColor = vec4(finalColor, fresnel * 0.1);
          }
        `,
        transparent: true,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending
      });
      const core = new THREE.Mesh(coreGeometry, coreMaterial);
      core.position.set(0, 0, -80);
      cloudGroup.add(core);
      return cloudGroup;
    };
    const nebulaClouds = createNebulaClouds();
    scene.add(nebulaClouds);
    const camera = new THREE.PerspectiveCamera(85, canvasRef.current.clientWidth / canvasRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000015, 1);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    const rocketGroup = new THREE.Group();
    scene.add(rocketGroup);
    const rocketBodyGeometry = new THREE.CylinderGeometry(0.4, 0.6, 2, 32);
    const rocketBodyMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.8,
      roughness: 0.2,
      envMap: null,
      envMapIntensity: 1.0
    });
    const rocketBody = new THREE.Mesh(rocketBodyGeometry, rocketBodyMaterial);
    rocketBody.castShadow = true;
    rocketGroup.add(rocketBody);
    const createRivet = (x: number, y: number, z: number) => {
      const rivetGeometry = new THREE.SphereGeometry(0.02, 8, 8);
      const rivetMaterial = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        metalness: 0.9,
        roughness: 0.3
      });
      const rivet = new THREE.Mesh(rivetGeometry, rivetMaterial);
      rivet.position.set(x, y, z);
      return rivet;
    };
    const createTechPanel = (x: number, y: number, z: number, width: number, height: number) => {
      const panelGeometry = new THREE.PlaneGeometry(width, height);
      const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x333344,
        metalness: 0.7,
        roughness: 0.3,
        emissive: 0x223366,
        emissiveIntensity: 0.2
      });
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.position.set(x, y, z);
      if (Math.abs(z) > Math.abs(x)) {
        panel.rotation.y = z > 0 ? 0 : Math.PI;
      } else {
        panel.rotation.y = x > 0 ? Math.PI / 2 : -Math.PI / 2;
      }
      return panel;
    };
    const rivetPositions = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
    for (let y = -0.8; y <= 0.8; y += 0.2) {
      rivetPositions.forEach(angle => {
        const radius = 0.61;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        rocketGroup.add(createRivet(x, y, z));
      });
    }
    rocketGroup.add(createTechPanel(0, 0, 0.61, 0.3, 0.5));
    rocketGroup.add(createTechPanel(0.61, 0, 0, 0.3, 0.5));
    rocketGroup.add(createTechPanel(0, 0, -0.61, 0.3, 0.5));
    rocketGroup.add(createTechPanel(-0.61, 0, 0, 0.3, 0.5));
    const createPanelLine = (y: number) => {
      const panelGeometry = new THREE.TorusGeometry(0.6, 0.01, 8, 32);
      const panelMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.5,
        roughness: 0.5,
        emissive: 0x223366,
        emissiveIntensity: 0.2
      });
      const panel = new THREE.Mesh(panelGeometry, panelMaterial);
      panel.rotation.x = Math.PI / 2;
      panel.position.y = y;
      return panel;
    };
    [-0.6, -0.2, 0.2, 0.6].forEach(y => {
      rocketGroup.add(createPanelLine(y));
    });
    const noseConeGeometry = new THREE.ConeGeometry(0.4, 1.2, 32);
    const noseConeMaterial = new THREE.MeshStandardMaterial({
      color: 0xf5f5f5,
      metalness: 0.8,
      roughness: 0.2
    });
    const noseCone = new THREE.Mesh(noseConeGeometry, noseConeMaterial);
    noseCone.position.y = 1.6;
    noseCone.castShadow = true;
    rocketGroup.add(noseCone);
    const tipGeometry = new THREE.ConeGeometry(0.1, 0.3, 16);
    const tipMaterial = new THREE.MeshStandardMaterial({
      color: 0x33ccff,
      emissive: 0x33ccff,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const tip = new THREE.Mesh(tipGeometry, tipMaterial);
    tip.position.y = 2.3;
    tip.castShadow = true;
    rocketGroup.add(tip);
    const dishGeometry = new THREE.SphereGeometry(0.15, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    const dishMaterial = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0.5,
      roughness: 0.5
    });
    const dish = new THREE.Mesh(dishGeometry, dishMaterial);
    dish.rotation.x = Math.PI;
    dish.position.set(0.3, 1.9, 0);
    dish.scale.set(0.5, 0.5, 0.5);
    rocketGroup.add(dish);
    const finShape = new THREE.Shape();
    finShape.moveTo(0, 0);
    finShape.lineTo(0.7, 0);
    finShape.lineTo(0.4, 0.8);
    finShape.lineTo(0, 0.7);
    finShape.lineTo(0, 0);
    const finExtrudeSettings = {
      steps: 1,
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 3
    };
    const finGeometry = new THREE.ExtrudeGeometry(finShape, finExtrudeSettings);
    const finMaterial = new THREE.MeshStandardMaterial({
      color: 0x2c3e50,
      metalness: 0.5,
      roughness: 0.5,
      emissive: 0x223366,
      emissiveIntensity: 0.1
    });
    const positions = [{
      rotY: 0,
      offsetZ: 0.6
    }, {
      rotY: Math.PI / 2,
      offsetX: 0.6
    }, {
      rotY: Math.PI,
      offsetZ: -0.6
    }, {
      rotY: -Math.PI / 2,
      offsetX: -0.6
    }];
    positions.forEach(pos => {
      const fin = new THREE.Mesh(finGeometry, finMaterial);
      fin.position.y = -1;
      fin.rotation.y = pos.rotY;
      if (pos.offsetZ) {
        fin.position.z = pos.offsetZ;
      }
      if (pos.offsetX) {
        fin.position.x = pos.offsetX;
      }
      fin.castShadow = true;
      rocketGroup.add(fin);
    });
    const windowGeometry = new THREE.CircleGeometry(0.1, 32);
    const windowMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8ddef7,
      metalness: 0.1,
      roughness: 0.1,
      transmission: 0.9,
      transparent: true,
      opacity: 0.9,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.5,
      emissive: 0x8ddef7,
      emissiveIntensity: 0.5
    });
    const windowPositions = [{
      x: 0,
      y: 0.3,
      z: 0.61,
      rotX: Math.PI / 2
    }, {
      x: 0.61,
      y: 0,
      z: 0,
      rotY: Math.PI / 2,
      rotX: Math.PI / 2
    }, {
      x: 0,
      y: -0.3,
      z: -0.61,
      rotY: Math.PI,
      rotX: Math.PI / 2
    }, {
      x: -0.61,
      y: -0.6,
      z: 0,
      rotY: -Math.PI / 2,
      rotX: Math.PI / 2
    }];
    windowPositions.forEach(pos => {
      const rocketWindow = new THREE.Mesh(windowGeometry, windowMaterial);
      rocketWindow.position.set(pos.x, pos.y, pos.z);
      if (pos.rotX) rocketWindow.rotation.x = pos.rotX;
      if (pos.rotY) rocketWindow.rotation.y = pos.rotY;
      rocketGroup.add(rocketWindow);
    });
    const createEngineNozzle = (x: number, z: number) => {
      const nozzleGroup = new THREE.Group();
      const nozzleGeometry = new THREE.CylinderGeometry(0.12, 0.18, 0.3, 16);
      const nozzleMaterial = new THREE.MeshStandardMaterial({
        color: 0x333333,
        metalness: 0.8,
        roughness: 0.3
      });
      const nozzle = new THREE.Mesh(nozzleGeometry, nozzleMaterial);
      nozzle.castShadow = true;
      nozzleGroup.add(nozzle);
      const innerGeometry = new THREE.CylinderGeometry(0.08, 0.12, 0.3, 16);
      const innerMaterial = new THREE.MeshStandardMaterial({
        color: 0xff3300,
        emissive: 0xff3300,
        emissiveIntensity: 0.8,
        metalness: 0,
        roughness: 0.5
      });
      const inner = new THREE.Mesh(innerGeometry, innerMaterial);
      inner.position.y = -0.01;
      nozzleGroup.add(inner);
      nozzleGroup.position.set(x, -1.2, z);
      nozzleGroup.rotation.x = Math.PI;
      return nozzleGroup;
    };
    const nozzle1 = createEngineNozzle(0.25, 0.25);
    const nozzle2 = createEngineNozzle(-0.25, 0.25);
    const nozzle3 = createEngineNozzle(0, -0.25);
    rocketGroup.add(nozzle1, nozzle2, nozzle3);
    const createExhaust = (x: number, z: number) => {
      const exhaustGroup = new THREE.Group();
      const exhaustGeometry = new THREE.ConeGeometry(0.15, 0.5, 16);
      const exhaustMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: {
            value: 0
          }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          
          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }
          
          void main() {
            float t = time * 5.0;
            float flicker = 0.8 + 0.2 * sin(t * 10.0) * sin(t * 7.0) * sin(t * 3.0);
            
            float radial = 1.0 - 2.0 * length(vUv - vec2(0.5, 0.5));
            radial = max(0.0, radial);
            
            float heightGradient = pow(1.0 - vUv.y, 1.5);
            
            float noise = hash(vUv * 20.0 + vec2(0.0, time * 3.0));
            
            float mask = radial * heightGradient * (0.8 + 0.2 * noise) * flicker;
            
            vec3 color = mix(vec3(1.0, 0.6, 0.1), vec3(1.0, 0.2, 0.0), heightGradient);
            
            gl_FragColor = vec4(color, mask);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const exhaust = new THREE.Mesh(exhaustGeometry, exhaustMaterial);
      exhaust.rotation.x = Math.PI;
      exhaustGroup.add(exhaust);
      const innerExhaustGeometry = new THREE.ConeGeometry(0.08, 0.7, 16);
      const innerExhaustMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: {
            value: 0
          }
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float time;
          varying vec2 vUv;
          
          float hash(vec2 p) {
            p = fract(p * vec2(123.34, 456.21));
            p += dot(p, p + 45.32);
            return fract(p.x * p.y);
          }
          
          void main() {
            float t = time * 5.0;
            float flicker = 0.8 + 0.2 * sin(t * 10.0) * sin(t * 7.0) * sin(t * 3.0);
            
            float radial = 1.0 - 2.0 * length(vUv - vec2(0.5, 0.5));
            radial = max(0.0, radial);
            
            float heightGradient = pow(1.0 - vUv.y, 1.5);
            
            float noise = hash(vUv * 20.0 + vec2(0.0, time * 3.0));
            
            float mask = radial * heightGradient * (0.8 + 0.2 * noise) * flicker;
            
            vec3 color = mix(vec3(1.0, 0.9, 0.6), vec3(1.0, 0.5, 0.2), heightGradient);
            
            gl_FragColor = vec4(color, mask);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      });
      const innerExhaust = new THREE.Mesh(innerExhaustGeometry, innerExhaustMaterial);
      innerExhaust.position.y = -0.1;
      innerExhaust.rotation.x = Math.PI;
      exhaustGroup.add(innerExhaust);
      exhaustGroup.position.set(x, -1.4, z);
      return {
        group: exhaustGroup,
        outer: exhaust,
        inner: innerExhaust
      };
    };
    const exhaust1 = createExhaust(0.25, 0.25);
    const exhaust2 = createExhaust(-0.25, 0.25);
    const exhaust3 = createExhaust(0, -0.25);
    rocketGroup.add(exhaust1.group, exhaust2.group, exhaust3.group);
    const logoGeometry = new THREE.PlaneGeometry(0.3, 0.2);
    const logoMaterial = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 1
    });
    const logoMesh = new THREE.Mesh(logoGeometry, logoMaterial);
    logoMesh.position.set(0, 0.7, 0.41);
    logoMesh.rotation.y = 0;
    rocketGroup.add(logoMesh);
    const ambientLight = new THREE.AmbientLight(0x202040, 1);
    scene.add(ambientLight);
    const rimLight = new THREE.DirectionalLight(0x9b87f5, 1);
    rimLight.position.set(-5, 2, -5);
    scene.add(rimLight);
    const mainLight = new THREE.DirectionalLight(0xffffcc, 1.2);
    mainLight.position.set(5, 5, 5);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);
    const engineLight = new THREE.PointLight(0x66ccff, 5, 3);
    engineLight.position.set(0, -2, 0);
    scene.add(engineLight);
    const frontLight = new THREE.PointLight(0xffffcc, 1, 10);
    frontLight.position.set(0, 0, 5);
    scene.add(frontLight);
    const createFogParticles = () => {
      const particleCount = 500;
      const positions = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 30;
        positions[i3 + 1] = (Math.random() - 0.5) * 30;
        positions[i3 + 2] = (Math.random() - 0.5) * 30;
        sizes[i] = 0.1 + Math.random() * 0.5;
      }
      const particleGeometry = new THREE.BufferGeometry();
      particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      const particleMaterial = new THREE.ShaderMaterial({
        uniforms: {
          time: {
            value: 0
          },
          color: {
            value: new THREE.Color(0x8B5CF6)
          }
        },
        vertexShader: `
          attribute float size;
          uniform float time;
          varying float vAlpha;
          
          void main() {
            vec3 pos = position;
            
            pos.x += sin(time * 0.2 + pos.z * 0.5) * 0.2;
            pos.y += cos(time * 0.1 + pos.x * 0.5) * 0.2;
            pos.z += sin(time * 0.3 + pos.y * 0.5) * 0.2;
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            gl_PointSize = size * (30.0 / -mvPosition.z);
            
            float dist = length(pos);
            vAlpha = smoothstep(30.0, 10.0, dist) * 0.3;
          }
        `,
        fragmentShader: `
          uniform vec3 color;
          varying float vAlpha;
          
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            
            float alpha = vAlpha * smoothstep(0.5, 0.2, dist);
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      return new THREE.Points(particleGeometry, particleMaterial);
    };
    const fogParticles = createFogParticles();
    scene.add(fogParticles);
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
    let rotation = {
      x: 0,
      y: 0
    };
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
      rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.x));
      rocketGroup.rotation.x = rotation.x;
      rocketGroup.rotation.y = rotation.y;
      previousMousePosition = {
        x: event.clientX,
        y: event.clientY
      };
    };
    const handleMouseUp = () => {
      isDragging = false;
    };
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
      rotation.x = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, rotation.x));
      rocketGroup.rotation.x = rotation.x;
      rocketGroup.rotation.y = rotation.y;
      previousMousePosition = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    };
    const handleTouchEnd = () => {
      isDragging = false;
    };
    canvasRef.current.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    canvasRef.current.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);
    const handleResize = () => {
      if (!canvasRef.current) return;
      camera.aspect = canvasRef.current.clientWidth / canvasRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvasRef.current.clientWidth, canvasRef.current.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };
    window.addEventListener('resize', handleResize);
    let time = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      time += 0.01;
      nebulaClouds.children.forEach(cloud => {
        if (cloud instanceof THREE.Mesh && cloud.material && 'uniforms' in cloud.material) {
          cloud.material.uniforms.time.value = time;
        }
      });
      [exhaust1, exhaust2, exhaust3].forEach(exhaust => {
        if (exhaust.outer.material && 'uniforms' in exhaust.outer.material) {
          exhaust.outer.material.uniforms.time.value = time;
        }
        if (exhaust.inner.material && 'uniforms' in exhaust.inner.material) {
          exhaust.inner.material.uniforms.time.value = time;
        }
      });
      if (fogParticles.material && 'uniforms' in fogParticles.material) {
        fogParticles.material.uniforms.time.value = time;
      }
      const scrollProgress = Math.min(1, scrollY / (window.innerHeight * 0.5));
      if (!isDragging) {
        const targetX = mousePosition.x * 2;
        const targetY = mousePosition.y * 1.5 + scrollProgress * 0.5;
        rocketGroup.position.x += (targetX - rocketGroup.position.x) * 0.05;
        rocketGroup.position.y += (targetY - rocketGroup.position.y) * 0.05;
        rocketGroup.rotation.z = -mousePosition.x * 0.3 + scrollProgress * -0.2;
        rocketGroup.rotation.x = mousePosition.y * 0.2;
        rocketGroup.rotation.y += 0.003;
      }
      const exhaustScale = 0.9 + Math.sin(time * 8) * 0.1 + scrollProgress * 0.3;
      [exhaust1, exhaust2, exhaust3].forEach(exhaust => {
        exhaust.group.scale.set(exhaustScale, 0.9 + Math.sin(time * 12) * 0.15 + scrollProgress * 0.5, exhaustScale);
      });
      starField.rotation.y += 0.0002;
      starField.rotation.x += 0.0001 - scrollProgress * 0.0005;
      nebulaClouds.children.forEach((cloud, i) => {
        if (cloud instanceof THREE.Mesh) {
          cloud.position.y = scrollProgress * -0.5 * (i % 3 + 1);
          cloud.rotation.x += 0.0002 * (i % 3 + 1);
          cloud.rotation.y += 0.0001 * ((i + 1) % 3 + 1);
        }
      });
      const engineLight = scene.children.find(child => child instanceof THREE.PointLight && child.position.y < 0) as THREE.PointLight;
      if (engineLight) {
        engineLight.intensity = 4 + Math.sin(time * 12) * 1.5 + scrollProgress * 3;
        engineLight.color.setHSL(0.6 + Math.sin(time * 5) * 0.05, 1, 0.5 + scrollProgress * 0.2);
      }
      renderer.render(scene, camera);
    };
    animate();
    return () => {
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('mousedown', handleMouseDown);
        canvasRef.current.removeEventListener('touchstart', handleTouchStart);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      scene.traverse(object => {
        if (object instanceof THREE.Mesh) {
          if (object.geometry) object.geometry.dispose();
          if (object.material) {
            if (Array.isArray(object.material)) {
              object.material.forEach(material => material.dispose());
            } else {
              object.material.dispose();
            }
          }
        }
      });
      renderer.dispose();
    };
  }, [scrollY, mousePosition]);
  return <div className="h-full flex flex-col">
      
      <div className="mt-4 text-center">
        
      </div>
    </div>;
};
export default RocketVisualization;