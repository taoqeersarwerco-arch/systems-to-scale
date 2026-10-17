import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface CosmicNode {
  id: string;
  name: string;
  x: number;
  y: number;
  z: number;
  ox: number;
  oy: number;
  oz: number;
  vx: number;
  vy: number;
  vz: number;
  isPrimary: boolean;
  baseAlpha: number;
}

// 8 Primary Discipline Superclusters (Matching Topics Hub 3D Coordinates)
const SUPERCLUSTER_ANCHORS = [
  { id: 'ai-automation', name: 'AI & Automation', pos: [-8.2, 4.6, 2.0] },
  { id: 'e-commerce', name: 'E-commerce', pos: [-6.8, -3.8, 2.8] },
  { id: 'marketing-ads', name: 'Marketing & Ads', pos: [6.4, -4.2, -1.8] },
  { id: 'web-design', name: 'Web Design', pos: [8.8, 3.2, 1.2] },
  { id: 'customer-service', name: 'Customer Service', pos: [-3.2, 7.2, -1.6] },
  { id: 'virtual-assistance', name: 'Virtual Assistance', pos: [4.4, 6.8, 1.8] },
  { id: 'personal-assistance', name: 'Personal Assistance', pos: [0.8, -7.0, 1.4] },
  { id: 'pitch-decks', name: 'Pitch Decks', pos: [7.6, -0.8, -2.6] }
];

// Primary Architectural Filaments (Exact Match to Topics Hub Backbone)
const PRIMARY_FILAMENTS: [number, number][] = [
  [0, 1], // AI & Automation <-> E-commerce
  [0, 4], // AI & Automation <-> Customer Service
  [0, 6], // AI & Automation <-> Personal Assistance
  [1, 2], // E-commerce <-> Marketing & Ads
  [2, 3], // Marketing & Ads <-> Web Design
  [3, 7], // Web Design <-> Pitch Decks
  [4, 5], // Customer Service <-> Virtual Assistance
  [5, 6], // Virtual Assistance <-> Personal Assistance
  [1, 6], // E-commerce <-> Personal Assistance
  [2, 7], // Marketing & Ads <-> Pitch Decks
  [0, 2]  // AI & Automation <-> Marketing & Ads
];

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
    // 1. SCENE & CAMERA (Exact Match to Topics Hub Deep-Space Setup)
    // -------------------------------------------------------------
    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808); // Exact deep obsidian background

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
    // 2. CELESTIAL GROUP (Shifted upward so the arc frames the H1 title)
    // -------------------------------------------------------------
    const webGroup = new THREE.Group();
    webGroup.position.set(0, 3.2, 0); // Exact Topics Hub framing offset
    webGroup.rotation.x = Math.PI * 0.28; // ~50° celestial inclination
    webGroup.rotation.y = -Math.PI * 0.07;
    webGroup.rotation.z = Math.PI * 0.08;
    scene.add(webGroup);

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
        float twinkle = sin(uTime * 1.6 + aTwinkle * 6.28318) * 0.2 + 0.8;
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
    // 4. CELESTIAL STELLAR STREAM (20,000 Pinpoint Crystalline Stars)
    // -------------------------------------------------------------
    const starCount = 20000;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starAlphas = new Float32Array(starCount);
    const starTwinkles = new Float32Array(starCount);

    const colorWhite = new THREE.Color(0xffffff);
    const colorSilver = new THREE.Color(0xd4d4d4);
    const colorMuted = new THREE.Color(0x94a3b8);
    const colorDarkSlate = new THREE.Color(0x475569);

    const maxRadius = 24.0;
    const streamBranches = 3;

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const isCoreNexus = Math.random() < 0.28;
      const isHalo = !isCoreNexus && Math.random() < 0.18;

      let r: number;
      let theta: number;
      let zDisp: number;
      let xyDisp: number;

      if (isCoreNexus) {
        r = Math.pow(Math.random(), 1.8) * 6.5;
        theta = Math.random() * Math.PI * 2;
        xyDisp = (Math.random() - 0.5) * 0.6;
        zDisp = (Math.random() - 0.5) * Math.max(0.2, (6.5 - r) * 0.45);
      } else if (isHalo) {
        r = 5.0 + Math.pow(Math.random(), 1.3) * (maxRadius * 1.25);
        theta = Math.random() * Math.PI * 2;
        xyDisp = (Math.random() - 0.5) * 2.2;
        zDisp = (Math.random() - 0.5) * 3.5 * (1 - r / (maxRadius * 1.35));
      } else {
        r = 3.5 + Math.pow(Math.random(), 1.2) * (maxRadius - 3.5);
        const branchIdx = i % streamBranches;
        const branchAngle = (branchIdx / streamBranches) * Math.PI * 2;
        const spinAngle = Math.pow(r / maxRadius, 0.72) * 1.4 * Math.PI * 2;
        theta = branchAngle + spinAngle;

        const spread = 0.3 + (r / maxRadius) * 1.1;
        xyDisp = (Math.random() + Math.random() - 1.0) * spread;
        zDisp = (Math.random() + Math.random() - 1.0) * spread * 0.35;
      }

      starPositions[i3] = Math.cos(theta) * r + xyDisp;
      starPositions[i3 + 1] = Math.sin(theta) * r * 0.88 + xyDisp;
      starPositions[i3 + 2] = zDisp;

      const normR = Math.min(1.0, r / maxRadius);
      const mixedColor = new THREE.Color();
      if (normR < 0.2) {
        mixedColor.lerpColors(colorWhite, colorSilver, normR / 0.2);
      } else if (normR < 0.6) {
        mixedColor.lerpColors(colorSilver, colorMuted, (normR - 0.2) / 0.4);
      } else {
        mixedColor.lerpColors(colorMuted, colorDarkSlate, (normR - 0.6) / 0.4);
      }

      starColors[i3] = mixedColor.r;
      starColors[i3 + 1] = mixedColor.g;
      starColors[i3 + 2] = mixedColor.b;

      const pRand = Math.random();
      let pSize: number;
      let pAlpha: number;

      if (pRand > 0.96) {
        pSize = 1.3 + Math.random() * 0.7;
        pAlpha = 0.95;
      } else if (pRand > 0.82) {
        pSize = 0.8 + Math.random() * 0.4;
        pAlpha = 0.75;
      } else {
        pSize = 0.3 + Math.random() * 0.38;
        pAlpha = 0.30 + Math.random() * 0.45;
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
    webGroup.add(starPoints);

    // -------------------------------------------------------------
    // 5. DISTANT DEEP-SPACE FIELD STARS (Infinite Depth Layer)
    // -------------------------------------------------------------
    const bgStarCount = 2200;
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
      const rad = 45 + Math.random() * 40;

      bgPositions[i3] = rad * Math.sin(phi) * Math.cos(lam);
      bgPositions[i3 + 1] = rad * Math.sin(phi) * Math.sin(lam);
      bgPositions[i3 + 2] = rad * Math.cos(phi) - 14.0;

      const c = Math.random() > 0.6 ? colorSilver : colorMuted;
      bgColors[i3] = c.r;
      bgColors[i3 + 1] = c.g;
      bgColors[i3 + 2] = c.b;

      bgSizes[i] = 0.25 + Math.random() * 0.45;
      bgAlphas[i] = 0.18 + Math.random() * 0.45;
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
    // 6. DELICATE COSMIC DUST CLOUDS (Subtle Nebular Haze)
    // -------------------------------------------------------------
    const dustCount = 1200;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustAlphas = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const rad = Math.pow(Math.random(), 0.65) * 26.0;
      const theta = Math.random() * Math.PI * 2;
      const zDisp = (Math.random() - 0.5) * 9.0;

      dustPositions[i3] = Math.cos(theta) * rad;
      dustPositions[i3 + 1] = Math.sin(theta) * rad * 0.75;
      dustPositions[i3 + 2] = zDisp;

      const c = Math.random() > 0.5 ? colorSilver : colorDarkSlate;
      dustColors[i3] = c.r;
      dustColors[i3 + 1] = c.g;
      dustColors[i3 + 2] = c.b;

      dustSizes[i] = 2.6 + Math.random() * 4.2;
      dustAlphas[i] = 0.07 + Math.random() * 0.16; // Very faint, subtle haze
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
        gl_PointSize = max(2.0, aSize * (150.0 / -mvPosition.z) * uPixelRatio);
      }
    `;

    const dustFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float intensity = exp(-dist * dist * 14.0);
        gl_FragColor = vec4(vColor, vAlpha * intensity);
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
    webGroup.add(dustPoints);

    // -------------------------------------------------------------
    // 7. 8 PRIMARY SUPERCLUSTERS & 32 DEEP-DIVE COMPANIONS
    // -------------------------------------------------------------
    const scaleFactor = isMobile ? 0.72 : 1.0;
    const allNodes: CosmicNode[] = [];

    // Add 8 Supercluster Centers
    SUPERCLUSTER_ANCHORS.forEach((p) => {
      allNodes.push({
        id: p.id,
        name: p.name,
        x: p.pos[0] * scaleFactor,
        y: p.pos[1] * scaleFactor,
        z: p.pos[2] * scaleFactor,
        ox: p.pos[0] * scaleFactor,
        oy: p.pos[1] * scaleFactor,
        oz: p.pos[2] * scaleFactor,
        vx: 0,
        vy: 0,
        vz: 0,
        isPrimary: true,
        baseAlpha: 1.0
      });
    });

    // Add 32 Deep-Dive Companion Stars (4 per supercluster, naturally dispersed)
    const secondaryCount = 32;
    for (let i = 0; i < secondaryCount; i++) {
      const parentPrimary = allNodes[i % 8];
      const angle = (i * 0.785) + Math.sin(i) * 0.6;
      const dist = 1.8 + (i % 4) * 0.9;
      const x = parentPrimary.ox + Math.cos(angle) * dist;
      const y = parentPrimary.oy + Math.sin(angle) * dist * 0.85;
      const z = parentPrimary.oz + (Math.sin(i * 1.5)) * 1.6;

      allNodes.push({
        id: `article-${i}`,
        name: '',
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        isPrimary: false,
        baseAlpha: 0.45 + (i % 3) * 0.15
      });
    }

    const totalNodeCount = allNodes.length;

    // Node Point Cloud Geometry
    const nodePositions = new Float32Array(totalNodeCount * 3);
    const nodeColors = new Float32Array(totalNodeCount * 3);
    const nodeSizes = new Float32Array(totalNodeCount);
    const nodeAlphas = new Float32Array(totalNodeCount);
    const nodeTwinkles = new Float32Array(totalNodeCount);

    for (let i = 0; i < totalNodeCount; i++) {
      const node = allNodes[i];
      nodePositions[i * 3] = node.x;
      nodePositions[i * 3 + 1] = node.y;
      nodePositions[i * 3 + 2] = node.z;

      const c = node.isPrimary ? colorWhite : colorSilver;
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;

      nodeSizes[i] = node.isPrimary ? 2.8 : 1.3;
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
    webGroup.add(nodePoints);

    // -------------------------------------------------------------
    // 8. DIFFRACTION HALOS & ORBITAL BEACONS (8 Major Superclusters)
    // -------------------------------------------------------------
    const createHaloTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.45, 'rgba(230, 230, 230, 0.25)');
        grad.addColorStop(0.80, 'rgba(180, 180, 180, 0.06)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 128, 128);
      }
      return new THREE.CanvasTexture(cvs);
    };

    const haloTexture = createHaloTexture();
    const haloMat = new THREE.SpriteMaterial({
      map: haloTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.88
    });

    const primaryGlowSprites: THREE.Sprite[] = [];
    const primaryRings: THREE.Mesh[] = [];
    const ringGeo = new THREE.RingGeometry(0.52, 0.55, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.24,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 8; i++) {
      const sprite = new THREE.Sprite(haloMat);
      sprite.position.set(allNodes[i].x, allNodes[i].y, allNodes[i].z);
      sprite.scale.set(2.6, 2.6, 2.6); // Exact Topics Hub scale
      webGroup.add(sprite);
      primaryGlowSprites.push(sprite);

      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(allNodes[i].x, allNodes[i].y, allNodes[i].z);
      webGroup.add(ring);
      primaryRings.push(ring);
    }

    // -------------------------------------------------------------
    // 9. DELICATE ARCHITECTURAL FILAMENTS (Zero Clutter or Tangled Fans)
    // -------------------------------------------------------------
    const maxLines = 240;
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(maxLines * 6);
    const lineColors = new Float32Array(maxLines * 6);

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
    webGroup.add(lineSegments);

    // -------------------------------------------------------------
    // 10. INTERACTION LISTENERS & CAMERA KINEMATICS
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

      targetMouseX = ((e.clientX / window.innerWidth) - 0.5) * 0.16;
      targetMouseY = ((e.clientY / window.innerHeight) - 0.5) * 0.16;

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
    // 11. ANIMATION LOOP: VORTEX DISTORTION & PULL-BACK
    // -------------------------------------------------------------
    let frameId: number;
    let lastTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const elapsed = (now - lastTime) * 0.001;

      // Uniform updates
      const tSec = now * 0.001;
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
      webGroup.rotation.z += 0.00035;

      // Smooth weightless 3D mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.025;
      currentMouseY += (targetMouseY - currentMouseY) * 0.025;
      scene.rotation.y = currentMouseX;
      scene.rotation.x = currentMouseY;

      // Smooth camera pull-back on scroll (Exact Topics Hub Kinematics)
      camera.position.z = 28 + scrollY * 0.0055;
      camera.position.y = -scrollY * 0.0035;

      // Update Node Physics and Positions
      const nodePosArr = (nodeGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const lPosArr = (lineGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const lColArr = (lineGeo.attributes.color as THREE.BufferAttribute).array as Float32Array;
      let lineIndex = 0;

      for (let i = 0; i < totalNodeCount; i++) {
        const node = allNodes[i];

        // Organic celestial orbital drift
        const driftX = Math.sin(tSec * 0.38 + i * 1.5) * 0.14;
        const driftY = Math.cos(tSec * 0.32 + i * 1.2) * 0.14;
        const driftZ = Math.sin(tSec * 0.28 + i * 2.0) * 0.09;
        const targetX = node.ox + driftX;
        const targetY = node.oy + driftY;
        const targetZ = node.oz + driftZ;

        // Cursor attraction & fluid push in 3D world space
        if (isMouseActive) {
          const dx = mouseWorld.x - node.x;
          const dy = mouseWorld.y - node.y;
          const dCursor = Math.sqrt(dx * dx + dy * dy);

          if (dCursor < 7.5 && dCursor > 0.1) {
            const force = (1.0 - dCursor / 7.5) * 0.008;
            node.vx += dx * force;
            node.vy += dy * force;
          }
        }

        node.x += (targetX - node.x) * 0.08 + node.vx;
        node.y += (targetY - node.y) * 0.08 + node.vy;
        node.z += (targetZ - node.z) * 0.08 + node.vz;

        node.vx *= 0.92;
        node.vy *= 0.92;
        node.vz *= 0.92;

        nodePosArr[i * 3] = node.x;
        nodePosArr[i * 3 + 1] = node.y;
        nodePosArr[i * 3 + 2] = node.z;

        // Update primary halos and rings
        if (i < 8) {
          primaryGlowSprites[i].position.set(node.x, node.y, node.z);
          primaryRings[i].position.set(node.x, node.y, node.z);
          primaryRings[i].rotation.z = tSec * 0.22 + i;

          const dToCursor = Math.hypot(mouseWorld.x - node.x, mouseWorld.y - node.y);
          if (isMouseActive && dToCursor < 5.5) {
            const boost = 1.0 - dToCursor / 5.5;
            primaryGlowSprites[i].scale.set(2.6 + boost * 0.8, 2.6 + boost * 0.8, 1);
            primaryGlowSprites[i].material.opacity = 0.88 + boost * 0.12;
            (primaryRings[i].material as THREE.MeshBasicMaterial).opacity = 0.24 + boost * 0.35;
          } else {
            primaryGlowSprites[i].scale.set(2.6, 2.6, 1);
            primaryGlowSprites[i].material.opacity = 0.88;
            (primaryRings[i].material as THREE.MeshBasicMaterial).opacity = 0.24;
          }
        }

        // Dynamic Cursor Laser Filament
        if (isMouseActive && lineIndex < maxLines) {
          const dToCursor = Math.hypot(mouseWorld.x - node.x, mouseWorld.y - node.y);
          if (dToCursor < 6.5) {
            const alpha = (1.0 - dToCursor / 6.5) * 0.75;
            const ptr = lineIndex * 6;

            lPosArr[ptr] = mouseWorld.x;
            lPosArr[ptr + 1] = mouseWorld.y;
            lPosArr[ptr + 2] = mouseWorld.z;

            lPosArr[ptr + 3] = node.x;
            lPosArr[ptr + 4] = node.y;
            lPosArr[ptr + 5] = node.z;

            for (let j = 0; j < 3; j++) {
              lColArr[ptr + j] = 1.0 * alpha;
              lColArr[ptr + 3 + j] = 0.78 * alpha;
            }

            lineIndex++;
          }
        }
      }

      // 1. Primary Filaments (Major 8 Disciplinary Trunks)
      PRIMARY_FILAMENTS.forEach(([aIdx, bIdx]) => {
        if (lineIndex >= maxLines) return;
        const nodeA = allNodes[aIdx];
        const nodeB = allNodes[bIdx];

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
        const isNear = isMouseActive && dMid < 4.8;
        const alpha = isNear ? 0.92 : 0.35;

        for (let j = 0; j < 6; j++) {
          lColArr[ptr + j] = alpha;
        }

        lineIndex++;
      });

      // 2. Secondary Filaments (Clean, Delicate Bridge to Companions without Fans)
      for (let i = 8; i < totalNodeCount; i += 2) {
        if (lineIndex >= maxLines) break;
        const nodeA = allNodes[i];
        const parentPrimary = allNodes[i % 8];
        const dist = Math.hypot(nodeA.x - parentPrimary.x, nodeA.y - parentPrimary.y);

        if (dist < 4.5) {
          const alpha = (1.0 - dist / 4.5) * 0.20;
          const ptr = lineIndex * 6;

          lPosArr[ptr] = nodeA.x;
          lPosArr[ptr + 1] = nodeA.y;
          lPosArr[ptr + 2] = nodeA.z;

          lPosArr[ptr + 3] = parentPrimary.x;
          lPosArr[ptr + 4] = parentPrimary.y;
          lPosArr[ptr + 5] = parentPrimary.z;

          for (let j = 0; j < 6; j++) {
            lColArr[ptr + j] = alpha;
          }

          lineIndex++;
        }
      }

      // Clear remaining unused lines
      for (let k = lineIndex * 6; k < maxLines * 6; k++) {
        lPosArr[k] = 0;
        lColArr[k] = 0;
      }

      (nodeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------
    // 12. CLEANUP
    // -------------------------------------------------------------
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

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
      haloTexture.dispose();
      haloMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion, isMobile]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden'
      }}
      aria-hidden="true"
    />
  );
};
