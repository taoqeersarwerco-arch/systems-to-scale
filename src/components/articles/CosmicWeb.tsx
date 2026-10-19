import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CosmicNode {
  id: string;
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  vx: number;
  vy: number;
  vz: number;
  baseAlpha: number;
}

export const CosmicWeb: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = mountRef.current;
    if (!container) return;

    // -------------------------------------------------------------
    // 1. SCENE & CAMERA (Deep-Space Optical Setup)
    // -------------------------------------------------------------
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808); // Deep obsidian background

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 1000);
    camera.position.set(0, 0, 28);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // 2. CELESTIAL GROUP: BIPOLAR PLANETARY NEBULA ORIENTATION
    // -------------------------------------------------------------
    // Tilted gracefully across the viewport diagonal (~34° inclination)
    const nebulaGroup = new THREE.Group();
    nebulaGroup.position.set(0, 1.8, 0); // Gentle upward framing so center sits behind title
    nebulaGroup.rotation.x = Math.PI * 0.18; // ~32° pitch
    nebulaGroup.rotation.y = -Math.PI * 0.08;
    nebulaGroup.rotation.z = Math.PI * 0.14; // Diagonal sweep
    scene.add(nebulaGroup);

    // Mouse tracking vectors
    const mouseNDC = new THREE.Vector2(0, 0);
    const mouseVel = new THREE.Vector2(0, 0);
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isMouseActive = false;
    let scrollY = window.scrollY;

    // -------------------------------------------------------------
    // 3. AIRY-DISK SHADERS (Crystalline Pinpoint Stars + Ripple Warp)
    // -------------------------------------------------------------
    const starVertexShader = `
      attribute float aSize;
      attribute float aAlpha;
      attribute float aTwinkle;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uTime;
      uniform float uPixelRatio;
      uniform vec2 uMouse;
      uniform vec2 uMouseVel;
      uniform float uAspect;
      uniform float uMouseActive;

      void main() {
        vColor = color;
        float twinkle = sin(uTime * 1.5 + aTwinkle * 6.28318) * 0.18 + 0.82;
        vAlpha = aAlpha * twinkle;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 clipPos = projectionMatrix * mvPosition;
        vec2 ndcPos = clipPos.xy / clipPos.w;

        // Dynamic cursor-following distortion & gravitational wave
        if (uMouseActive > 0.5) {
          vec2 diff = ndcPos - uMouse;
          diff.x *= uAspect;
          float dist = length(diff);
          float radius = 0.44; // Screen-space distortion radius

          if (dist < radius && dist > 0.001) {
            float factor = (1.0 - dist / radius);
            float smoothFactor = smoothstep(0.0, 1.0, factor);

            // Fluid warp: radial repulsion + tangential vortex swirl
            vec2 normDiff = normalize(diff);
            vec2 tangent = vec2(-normDiff.y, normDiff.x);

            vec2 warp = (normDiff * 0.16 + tangent * 0.09) * smoothFactor * smoothFactor;
            warp.x /= uAspect;

            clipPos.xy += warp * clipPos.w;

            // Energize/ionize stars near cursor (brighten on hover)
            vAlpha = min(1.0, vAlpha + smoothFactor * 0.55);
          }
        }

        gl_Position = clipPos;
        gl_PointSize = max(1.0, aSize * (220.0 / -mvPosition.z) * uPixelRatio);
      }
    `;

    const starFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Airy disk stellar core + faint diffraction halo
        float core = exp(-dist * 16.0);
        float halo = exp(-dist * 4.0) * 0.35;
        float intensity = core + halo;

        gl_FragColor = vec4(vColor, vAlpha * intensity);
      }
    `;

    // -------------------------------------------------------------
    // 4. BIPOLAR PLANETARY NEBULA STELLAR PARTICLES (22,000 Pinpoints)
    // -------------------------------------------------------------
    const starCount = 22000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starAlphas = new Float32Array(starCount);
    const starTwinkles = new Float32Array(starCount);

    const colorWhite = new THREE.Color(0xffffff);
    const colorSilver = new THREE.Color(0xd4d4d4);
    const colorSlate = new THREE.Color(0x94a3b8);
    const colorDarkSlate = new THREE.Color(0x475569);

    // Parametric Bipolar Planetary Nebula generator
    // Two symmetric expanding hourglass lobes + central toroidal waist ring
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const isWaistRing = Math.random() < 0.28; // 28% form the delicate central waist
      const isDiffuseHalo = !isWaistRing && Math.random() < 0.14; // 14% form the outer halo

      let x: number;
      let y: number;
      let z: number;
      let normDist: number;

      if (isWaistRing) {
        // Equatorial Toroidal Ring (The waist of the nebula)
        const theta = Math.random() * Math.PI * 2;
        const r = 3.6 + Math.pow(Math.random(), 1.6) * 5.4;
        const spreadY = (Math.random() + Math.random() - 1.0) * 0.7;
        const spreadZ = (Math.random() + Math.random() - 1.0) * 0.9;

        x = Math.cos(theta) * r;
        y = Math.sin(theta) * r * 0.42 + spreadY; // Elliptical inclination
        z = spreadZ;
        normDist = r / 9.0;
      } else if (isDiffuseHalo) {
        // Faint deep-space stellar envelope around the nebula
        const u = Math.random();
        const v = Math.random();
        const phi = Math.acos(2 * v - 1);
        const lam = 2 * Math.PI * u;
        const rad = 14.0 + Math.pow(Math.random(), 1.4) * 16.0;

        x = rad * Math.sin(phi) * Math.cos(lam);
        y = rad * Math.sin(phi) * Math.sin(lam) * 0.8;
        z = rad * Math.cos(phi) * 0.7;
        normDist = 1.0;
      } else {
        // Dual Expanding Bipolar Lobes (Hourglass shape)
        const sign = Math.random() > 0.5 ? 1 : -1; // Upper or lower lobe
        const u = Math.pow(Math.random(), 0.92); // Normalized distance along polar axis (0 -> 1)
        const h = u * 15.5; // Extension height

        // Hourglass profile: expands outward, peaks at ~0.65h, then curls softly
        const lobeRadius = 2.2 + Math.sin(u * Math.PI * 0.88) * 5.6 + u * 2.8;

        // Shell concentration: stars concentrate along the lobe boundaries with subtle noise
        const shellThickness = 0.8 + Math.random() * 0.9;
        const rad = lobeRadius * (0.78 + Math.random() * 0.38);
        const phi = Math.random() * Math.PI * 2;

        const jitterX = (Math.random() - 0.5) * shellThickness;
        const jitterY = (Math.random() - 0.5) * shellThickness * 0.8;
        const jitterZ = (Math.random() - 0.5) * shellThickness;

        x = Math.cos(phi) * rad + jitterX;
        y = sign * (h + 1.2) + jitterY;
        z = Math.sin(phi) * rad * 0.75 + jitterZ;
        normDist = Math.min(1.0, (Math.abs(y) + rad) / 22.0);
      }

      starPositions[i3] = x;
      starPositions[i3 + 1] = y;
      starPositions[i3 + 2] = z;

      // Color mapping: subtle monochrome gradient
      const mixedColor = new THREE.Color();
      if (normDist < 0.25) {
        mixedColor.lerpColors(colorWhite, colorSilver, normDist / 0.25);
      } else if (normDist < 0.65) {
        mixedColor.lerpColors(colorSilver, colorSlate, (normDist - 0.25) / 0.40);
      } else {
        mixedColor.lerpColors(colorSlate, colorDarkSlate, (normDist - 0.65) / 0.35);
      }

      starColors[i3] = mixedColor.r;
      starColors[i3 + 1] = mixedColor.g;
      starColors[i3 + 2] = mixedColor.b;

      // Contrast settings: exact high-contrast match to Topics Hub hero section
      const pRand = Math.random();
      let pSize: number;
      let pAlpha: number;

      if (pRand > 0.95) {
        // High-luminance stellar beacon
        pSize = 1.4 + Math.random() * 0.8;
        pAlpha = 0.98;
      } else if (pRand > 0.80) {
        // Bright secondary stellar node
        pSize = 0.9 + Math.random() * 0.5;
        pAlpha = 0.82;
      } else {
        // Crisp crystalline pinpoint
        pSize = 0.35 + Math.random() * 0.45;
        pAlpha = 0.42 + Math.random() * 0.45;
      }

      starSizes[i] = pSize;
      starAlphas[i] = pAlpha;
      starTwinkles[i] = Math.random();
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('aAlpha', new THREE.BufferAttribute(starAlphas, 1));
    starGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(starTwinkles, 1));

    const starMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: width / height },
        uMouseActive: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const starPoints = new THREE.Points(starGeo, starMaterial);
    nebulaGroup.add(starPoints);

    // -------------------------------------------------------------
    // 5. DISTANT DEEP-SPACE FIELD STARS (Infinite Depth Layer)
    // -------------------------------------------------------------
    const bgStarCount = 2000;
    const bgGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(bgStarCount * 3);
    const bgColors = new Float32Array(bgStarCount * 3);
    const bgSizes = new Float32Array(bgStarCount);
    const bgAlphas = new Float32Array(bgStarCount);
    const bgTwinkles = new Float32Array(bgStarCount);

    for (let i = 0; i < bgStarCount; i++) {
      const i3 = i * 3;
      const u = Math.random();
      const v = Math.random();
      const phi = Math.acos(2 * v - 1);
      const lam = 2 * Math.PI * u;
      const rad = 40 + Math.random() * 38;

      bgPositions[i3] = rad * Math.sin(phi) * Math.cos(lam);
      bgPositions[i3 + 1] = rad * Math.sin(phi) * Math.sin(lam);
      bgPositions[i3 + 2] = rad * Math.cos(phi);

      const isSubtleSilver = Math.random() > 0.40;
      const c = isSubtleSilver ? colorSilver : colorSlate;
      bgColors[i3] = c.r;
      bgColors[i3 + 1] = c.g;
      bgColors[i3 + 2] = c.b;

      // Exact match to Topics Hub background star contrast
      bgSizes[i] = 0.28 + Math.random() * 0.42;
      bgAlphas[i] = 0.25 + Math.random() * 0.45;
      bgTwinkles[i] = Math.random();
    }

    bgGeo.setAttribute('position', new THREE.BufferAttribute(bgPositions, 3));
    bgGeo.setAttribute('color', new THREE.BufferAttribute(bgColors, 3));
    bgGeo.setAttribute('aSize', new THREE.BufferAttribute(bgSizes, 1));
    bgGeo.setAttribute('aAlpha', new THREE.BufferAttribute(bgAlphas, 1));
    bgGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(bgTwinkles, 1));

    const bgMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: width / height },
        uMouseActive: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const bgPoints = new THREE.Points(bgGeo, bgMaterial);
    scene.add(bgPoints);

    // -------------------------------------------------------------
    // 6. PROMINENT NEBULAR DUST CLOUDS (Visibly Luminous to Naked Eye)
    // -------------------------------------------------------------
    const dustCount = 2000;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustAlphas = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const layer = Math.random();
      let x: number;
      let y: number;
      let z: number;

      if (layer < 0.45) {
        // Equatorial waist ring dust layer - frames around the reading sanctuary
        const theta = Math.random() * Math.PI * 2;
        const rad = 3.2 + Math.pow(Math.random(), 1.1) * 9.5;
        x = Math.cos(theta) * rad;
        y = Math.sin(theta) * rad * 0.52 + (Math.random() - 0.5) * 1.6;
        z = (Math.random() - 0.5) * 3.8;
      } else if (layer < 0.82) {
        // Dual expanding hourglass lobes dust layer
        const sign = Math.random() > 0.5 ? 1 : -1;
        const u = Math.pow(Math.random(), 0.78);
        const h = u * 11.5;
        const lobeRadius = 3.0 + Math.sin(u * Math.PI * 0.88) * 6.2 + u * 2.5;
        const phi = Math.random() * Math.PI * 2;
        const rad = lobeRadius * (0.70 + Math.random() * 0.50);

        x = Math.cos(phi) * rad;
        y = sign * (h + 0.9) + (Math.random() - 0.5) * 1.4;
        z = Math.sin(phi) * rad * 0.75 + (Math.random() - 0.5) * 2.2;
      } else {
        // Surrounding volumetric cosmic envelope
        const rad = Math.pow(Math.random(), 0.6) * 25.0;
        const theta = Math.random() * Math.PI * 2;
        x = Math.cos(theta) * rad;
        y = Math.sin(theta) * rad * 0.75;
        z = (Math.random() - 0.5) * 8.5;
      }

      dustPositions[i3] = x;
      dustPositions[i3 + 1] = y;
      dustPositions[i3 + 2] = z;

      // Color grading: luminous pure white, radiant silver, and slate clouds
      const cRand = Math.random();
      const c = cRand > 0.55 ? colorWhite : (cRand > 0.22 ? colorSilver : colorSlate);
      dustColors[i3] = c.r;
      dustColors[i3 + 1] = c.g;
      dustColors[i3 + 2] = c.b;

      // Contrast: prominently visible to the naked eye with lush volumetric presence
      dustSizes[i] = 4.0 + Math.random() * 6.2;
      dustAlphas[i] = 0.14 + Math.random() * 0.22;
    }

    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    dustGeo.setAttribute('color', new THREE.BufferAttribute(dustColors, 3));
    dustGeo.setAttribute('aSize', new THREE.BufferAttribute(dustSizes, 1));
    dustGeo.setAttribute('aAlpha', new THREE.BufferAttribute(dustAlphas, 1));

    const dustVertexShader = `
      attribute float aSize;
      attribute float aAlpha;
      varying vec3 vColor;
      varying float vAlpha;
      uniform float uPixelRatio;

      void main() {
        vColor = color;
        vAlpha = aAlpha;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = max(3.0, aSize * (180.0 / -mvPosition.z) * uPixelRatio);
      }
    `;

    const dustFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        // Soft volumetric Gaussian envelope with luminous core
        float intensity = exp(-dist * dist * 9.0);
        gl_FragColor = vec4(vColor, vAlpha * intensity * 1.35);
      }
    `;

    const dustMaterial = new THREE.ShaderMaterial({
      vertexShader: dustVertexShader,
      fragmentShader: dustFragmentShader,
      uniforms: {
        uPixelRatio: { value: pixelRatio }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const dustPoints = new THREE.Points(dustGeo, dustMaterial);
    nebulaGroup.add(dustPoints);

    // -------------------------------------------------------------
    // 7. 40 ARCHITECTURAL PRODUCTION NODES & DELICATE FILAMENTS
    // -------------------------------------------------------------
    // 40 precision system anchor nodes placed along the nebula structure
    // (representing the 40 indexed production systems)
    const systemNodes: CosmicNode[] = [];
    const scaleFactor = isMobile ? 0.75 : 1.0;

    for (let i = 0; i < 40; i++) {
      let x: number;
      let y: number;
      let z: number;

      if (i < 12) {
        // Waist ring systems
        const angle = (i / 12) * Math.PI * 2;
        const r = (4.4 + (i % 3) * 0.9) * scaleFactor;
        x = Math.cos(angle) * r;
        y = Math.sin(angle) * r * 0.45;
        z = (Math.sin(i * 1.7)) * 1.1;
      } else {
        // Polar lobe systems distributed across upper and lower lobes
        const lobeIdx = i - 12;
        const sign = lobeIdx % 2 === 0 ? 1 : -1;
        const u = 0.15 + ((lobeIdx / 28) * 0.75);
        const h = u * 13.5 * scaleFactor;
        const lobeRadius = (3.2 + Math.sin(u * Math.PI * 0.85) * 4.6) * scaleFactor;
        const phi = (lobeIdx * 0.95) + Math.sin(lobeIdx) * 0.5;

        x = Math.cos(phi) * lobeRadius;
        y = sign * (h + 1.2);
        z = Math.sin(phi) * lobeRadius * 0.75;
      }

      systemNodes.push({
        id: `system-${i}`,
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        baseAlpha: 0.45 + (i % 4) * 0.12
      });
    }

    const totalNodeCount = systemNodes.length;

    // Node Point Cloud Geometry
    const nodePositions = new Float32Array(totalNodeCount * 3);
    const nodeColors = new Float32Array(totalNodeCount * 3);
    const nodeSizes = new Float32Array(totalNodeCount);
    const nodeAlphas = new Float32Array(totalNodeCount);
    const nodeTwinkles = new Float32Array(totalNodeCount);

    for (let i = 0; i < totalNodeCount; i++) {
      const node = systemNodes[i];
      nodePositions[i * 3] = node.x;
      nodePositions[i * 3 + 1] = node.y;
      nodePositions[i * 3 + 2] = node.z;

      const isKeySystem = i % 5 === 0;
      const c = isKeySystem ? colorWhite : colorSilver;
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;

      nodeSizes[i] = isKeySystem ? 1.4 : 0.9;
      nodeAlphas[i] = node.baseAlpha;
      nodeTwinkles[i] = Math.random();
    }

    const nodeGeo = new THREE.BufferGeometry();
    nodeGeo.setAttribute('position', new THREE.BufferAttribute(nodePositions, 3));
    nodeGeo.setAttribute('color', new THREE.BufferAttribute(nodeColors, 3));
    nodeGeo.setAttribute('aSize', new THREE.BufferAttribute(nodeSizes, 1));
    nodeGeo.setAttribute('aAlpha', new THREE.BufferAttribute(nodeAlphas, 1));
    nodeGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(nodeTwinkles, 1));

    const nodeMaterial = new THREE.ShaderMaterial({
      vertexShader: starVertexShader,
      fragmentShader: starFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: pixelRatio },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseVel: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: width / height },
        uMouseActive: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMaterial);
    nebulaGroup.add(nodePoints);

    // -------------------------------------------------------------
    // 8. DYNAMIC LINE FILAMENTS (Crystalline Connecting Tracks)
    // -------------------------------------------------------------
    const maxLines = 160;
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    nebulaGroup.add(lineSegments);

    // Precompute nearest neighbor pairs along the nebula geometry
    const filamentPairs: [number, number][] = [];
    for (let i = 0; i < totalNodeCount; i++) {
      for (let j = i + 1; j < totalNodeCount; j++) {
        const dx = systemNodes[i].ox - systemNodes[j].ox;
        const dy = systemNodes[i].oy - systemNodes[j].oy;
        const dz = systemNodes[i].oz - systemNodes[j].oz;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (dist < 4.8) {
          filamentPairs.push([i, j]);
        }
      }
    }

    // -------------------------------------------------------------
    // 9. INTERACTION LISTENERS & CAMERA KINEMATICS
    // -------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive = true;
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseVel.x = ndcX - mouseNDC.x;
      mouseVel.y = ndcY - mouseNDC.y;
      mouseNDC.set(ndcX, ndcY);

      targetMouseX = ((e.clientX / window.innerWidth) - 0.5) * 0.14;
      targetMouseY = ((e.clientY / window.innerHeight) - 0.5) * 0.14;

      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(planeZ, mouseWorld);
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
      targetMouseX = 0;
      targetMouseY = 0;
    };

    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      const aspect = newWidth / newHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);

      const pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);

      starMaterial.uniforms.uPixelRatio.value = pr;
      starMaterial.uniforms.uAspect.value = aspect;
      bgMaterial.uniforms.uPixelRatio.value = pr;
      bgMaterial.uniforms.uAspect.value = aspect;
      dustMaterial.uniforms.uPixelRatio.value = pr;
      nodeMaterial.uniforms.uPixelRatio.value = pr;
      nodeMaterial.uniforms.uAspect.value = aspect;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------
    // 10. ANIMATION LOOP: VORTEX DISTORTION & PULL-BACK
    // -------------------------------------------------------------
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const tSec = now * 0.001;

      // Uniform updates
      starMaterial.uniforms.uTime.value = tSec;
      starMaterial.uniforms.uMouse.value.copy(mouseNDC);
      starMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      starMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;

      bgMaterial.uniforms.uTime.value = tSec;
      nodeMaterial.uniforms.uTime.value = tSec;
      nodeMaterial.uniforms.uMouse.value.copy(mouseNDC);
      nodeMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      nodeMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;

      // Mouse momentum decay
      mouseVel.multiplyScalar(0.92);

      // Celestial cosmic rotation
      nebulaGroup.rotation.z += 0.0003;

      // Smooth weightless 3D mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.025;
      currentMouseY += (targetMouseY - currentMouseY) * 0.025;
      scene.rotation.y = currentMouseX;
      scene.rotation.x = currentMouseY;

      // Smooth camera pull-back on scroll
      camera.position.z = 28 + scrollY * 0.005;
      camera.position.y = -scrollY * 0.003;

      // Update Node Physics and Dynamic Filaments
      const nodePosArr = (nodeGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const lPosArr = (lineGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const lColArr = (lineGeo.attributes.color as THREE.BufferAttribute).array as Float32Array;
      let lineIndex = 0;

      for (let i = 0; i < totalNodeCount; i++) {
        const node = systemNodes[i];

        // Organic celestial orbital drift
        const driftX = Math.sin(tSec * 0.35 + i * 1.4) * 0.12;
        const driftY = Math.cos(tSec * 0.30 + i * 1.1) * 0.12;
        const driftZ = Math.sin(tSec * 0.25 + i * 1.8) * 0.08;
        const targetX = node.ox + driftX;
        const targetY = node.oy + driftY;
        const targetZ = node.oz + driftZ;

        // Cursor attraction & fluid push in 3D world space
        if (isMouseActive) {
          const dx = mouseWorld.x - node.x;
          const dy = mouseWorld.y - node.y;
          const dCursor = Math.sqrt(dx * dx + dy * dy);

          if (dCursor < 6.0 && dCursor > 0.1) {
            const pull = (1.0 - dCursor / 6.0) * 0.035;
            node.vx += (dx / dCursor) * pull;
            node.vy += (dy / dCursor) * pull;

            // Fluid tangential vortex push
            node.vx += (-dy / dCursor) * mouseVel.x * 0.15;
            node.vy += (dx / dCursor) * mouseVel.y * 0.15;
          }
        }

        // Spring force towards anchor target
        node.vx += (targetX - node.x) * 0.04;
        node.vy += (targetY - node.y) * 0.04;
        node.vz += (targetZ - node.z) * 0.04;

        // Velocity damping
        node.vx *= 0.88;
        node.vy *= 0.88;
        node.vz *= 0.88;

        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        nodePosArr[i * 3] = node.x;
        nodePosArr[i * 3 + 1] = node.y;
        nodePosArr[i * 3 + 2] = node.z;

        // Dynamic Cursor Laser Filament
        if (isMouseActive && lineIndex < maxLines) {
          const dToCursor = Math.hypot(mouseWorld.x - node.x, mouseWorld.y - node.y);
          if (dToCursor < 5.5) {
            const alpha = (1.0 - dToCursor / 5.5) * 0.45;
            const ptr = lineIndex * 6;

            lPosArr[ptr] = mouseWorld.x;
            lPosArr[ptr + 1] = mouseWorld.y;
            lPosArr[ptr + 2] = mouseWorld.z;

            lPosArr[ptr + 3] = node.x;
            lPosArr[ptr + 4] = node.y;
            lPosArr[ptr + 5] = node.z;

            for (let j = 0; j < 3; j++) {
              lColArr[ptr + j] = 0.85 * alpha;
              lColArr[ptr + 3 + j] = 0.65 * alpha;
            }

            lineIndex++;
          }
        }
      }

      // Draw subtle filaments between neighboring system nodes
      for (let p = 0; p < filamentPairs.length; p++) {
        if (lineIndex >= maxLines) break;
        const [aIdx, bIdx] = filamentPairs[p];
        const nodeA = systemNodes[aIdx];
        const nodeB = systemNodes[bIdx];

        const ptr = lineIndex * 6;
        lPosArr[ptr] = nodeA.x;
        lPosArr[ptr + 1] = nodeA.y;
        lPosArr[ptr + 2] = nodeA.z;

        lPosArr[ptr + 3] = nodeB.x;
        lPosArr[ptr + 4] = nodeB.y;
        lPosArr[ptr + 5] = nodeB.z;

        const midX = (nodeA.x + nodeB.x) * 0.5;
        const midY = (nodeA.y + nodeB.y) * 0.5;
        const dMid = Math.hypot(mouseWorld.x - midX, mouseWorld.y - midY);
        const isNear = isMouseActive && dMid < 4.2;
        const alpha = isNear ? 0.60 : 0.18; // Very subtle, delicate monochrome track

        for (let j = 0; j < 6; j++) {
          lColArr[ptr + j] = alpha;
        }

        lineIndex++;
      }

      // Clear remaining line vertices
      for (let k = lineIndex; k < maxLines; k++) {
        const ptr = k * 6;
        for (let j = 0; j < 6; j++) {
          lPosArr[ptr + j] = 0;
          lColArr[ptr + j] = 0;
        }
      }

      nodeGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // CLEANUP
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();

      starGeo.dispose();
      starMaterial.dispose();
      bgGeo.dispose();
      bgMaterial.dispose();
      dustGeo.dispose();
      dustMaterial.dispose();
      nodeGeo.dispose();
      nodeMaterial.dispose();
      lineGeo.dispose();
      lineMat.dispose();

      renderer.dispose();
      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        overflow: 'hidden',
        pointerEvents: 'auto'
      }}
      aria-hidden="true"
    />
  );
};
