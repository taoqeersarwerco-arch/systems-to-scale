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
  isSupercluster: boolean;
  isArticle: boolean;
  baseAlpha: number;
  size: number;
  superclusterIndex?: number;
}

// 8 Primary Discipline Superclusters (Gravitational Anchors of the 8 Fields)
const SUPERCLUSTER_ANCHORS = [
  { id: 'ai-automation', name: 'AI & Automation', pos: [-8.8, 4.6, 2.2], color: 0xffffff },
  { id: 'e-commerce', name: 'E-commerce', pos: [-7.4, -3.8, 2.6], color: 0xf5f5f5 },
  { id: 'marketing-ads', name: 'Marketing & Ads', pos: [7.0, -4.2, -1.8], color: 0xd4d4d4 },
  { id: 'web-design', name: 'Web Design', pos: [9.2, 3.4, 1.4], color: 0xffffff },
  { id: 'customer-service', name: 'Customer Service', pos: [-3.4, 7.8, -1.6], color: 0xe2e8f0 },
  { id: 'virtual-assistance', name: 'Virtual Assistance', pos: [4.6, 7.2, 1.8], color: 0xffffff },
  { id: 'personal-assistance', name: 'Personal Assistance', pos: [0.6, -7.2, 1.2], color: 0xd4d4d4 },
  { id: 'pitch-decks', name: 'Pitch Decks', pos: [7.8, -0.6, -2.4], color: 0xe2e8f0 }
];

// Macro Cosmic Web Inter-Supercluster Filaments (Major dark matter trunks)
const MACRO_FILAMENTS: [number, number][] = [
  [0, 1], // AI <-> E-commerce
  [0, 4], // AI <-> Customer Service
  [0, 5], // AI <-> Virtual Assistance
  [1, 2], // E-commerce <-> Marketing & Ads
  [1, 6], // E-commerce <-> Personal Assistance
  [2, 3], // Marketing & Ads <-> Web Design
  [2, 7], // Marketing & Ads <-> Pitch Decks
  [3, 7], // Web Design <-> Pitch Decks
  [4, 5], // Customer Service <-> Virtual Assistance
  [5, 6], // Virtual Assistance <-> Personal Assistance
  [0, 2], // AI <-> Marketing & Ads (cross-domain pipeline)
  [3, 0]  // Web Design <-> AI (rendering & agent UI)
];

// 32 Deep-Dive System Article Offsets (4 clustered mechanisms per supercluster)
const DEEP_DIVE_OFFSETS = [
  // AI & Automation mechanisms (Retry, Idempotency, Webhooks, DLQ)
  { dx: -1.8, dy: 1.4, dz: 0.8 },
  { dx: 1.6, dy: 1.8, dz: -0.6 },
  { dx: -2.0, dy: -1.4, dz: -0.5 },
  { dx: 1.9, dy: -1.2, dz: 0.9 },

  // E-commerce mechanisms (Auth/Capture, Cart recovery, 3DS, Inventory)
  { dx: -1.7, dy: -1.5, dz: 0.7 },
  { dx: 1.8, dy: -1.2, dz: -0.8 },
  { dx: -1.4, dy: 1.6, dz: -0.4 },
  { dx: 1.9, dy: 1.3, dz: 0.6 },

  // Marketing & Ads mechanisms (RTB auction, Attribution, Consent v2, Server-side tracking)
  { dx: 1.9, dy: -1.5, dz: 0.8 },
  { dx: -1.6, dy: -1.4, dz: -0.6 },
  { dx: 1.7, dy: 1.5, dz: -0.5 },
  { dx: -1.8, dy: 1.3, dz: 0.7 },

  // Web Design mechanisms (Critical render path, CWV metrics, CSSOM, Layout thrashing)
  { dx: 1.8, dy: 1.6, dz: 0.7 },
  { dx: -1.7, dy: 1.5, dz: -0.6 },
  { dx: 1.9, dy: -1.3, dz: -0.8 },
  { dx: -1.5, dy: -1.6, dz: 0.5 },

  // Customer Service mechanisms (Routing engines, SLAs, Sentiment analysis, Omnichannel)
  { dx: -1.8, dy: 1.4, dz: 0.6 },
  { dx: 1.6, dy: 1.5, dz: -0.7 },
  { dx: -1.5, dy: -1.5, dz: -0.4 },
  { dx: 1.7, dy: -1.3, dz: 0.8 },

  // Virtual Assistance mechanisms (Context handoffs, Tool calling, Guardrails, Memory)
  { dx: 1.7, dy: 1.5, dz: 0.7 },
  { dx: -1.6, dy: 1.6, dz: -0.5 },
  { dx: 1.8, dy: -1.4, dz: -0.6 },
  { dx: -1.7, dy: -1.3, dz: 0.8 },

  // Personal Assistance mechanisms (Calendar sync, Inbox triage, Briefing gen, Travel booking)
  { dx: -1.8, dy: -1.4, dz: 0.6 },
  { dx: 1.7, dy: -1.5, dz: -0.5 },
  { dx: -1.5, dy: 1.5, dz: 0.8 },
  { dx: 1.8, dy: 1.3, dz: -0.7 },

  // Pitch Decks mechanisms (Traction waterfalls, TAM/SAM modeling, Unit economics, Cap tables)
  { dx: 1.8, dy: 1.4, dz: -0.6 },
  { dx: -1.6, dy: 1.6, dz: 0.7 },
  { dx: 1.7, dy: -1.5, dz: 0.8 },
  { dx: -1.8, dy: -1.2, dz: -0.5 }
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

    // -------------------------------------------------------------------------
    // 1. SCENE & CAMERA (Deep Space Astrophysical Observatory)
    // -------------------------------------------------------------------------
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 900;

    const scene = new THREE.Scene();
    // Transparent background so ground glow and rich palette blend seamlessly
    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 1000);
    camera.position.set(0, 0, 28);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      });
    } catch {
      return;
    }

    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setSize(width, height);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Cosmic Macro-Structure Group
    const webGroup = new THREE.Group();
    webGroup.position.set(0, 1.8, 0);
    webGroup.rotation.x = Math.PI * 0.24; // Celestial inclination
    webGroup.rotation.y = -Math.PI * 0.05;
    scene.add(webGroup);

    // Mouse tracking & momentum vectors
    const mouseNDC = new THREE.Vector2(0, 0);
    const mouseVel = new THREE.Vector2(0, 0);
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isMouseActive = false;
    let scrollY = window.scrollY;

    // -------------------------------------------------------------------------
    // 2. PINPOINT AIRY-DISK SHADER WITH REAL-TIME CURSOR DISTORTION
    // -------------------------------------------------------------------------
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
      uniform float uScroll;

      void main() {
        vColor = color;
        float twinkle = sin(uTime * 1.8 + aTwinkle * 6.28318) * 0.22 + 0.78;
        vAlpha = aAlpha * twinkle;

        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vec4 clipPos = projectionMatrix * mvPosition;
        vec2 ndcPos = clipPos.xy / clipPos.w;

        // Dynamic cursor-following distortion & gravitational wave
        if (uMouseActive > 0.5) {
          vec2 diff = ndcPos - uMouse;
          diff.x *= uAspect;
          float dist = length(diff);
          float radius = 0.52; // Wide gravitational sweep

          if (dist < radius && dist > 0.001) {
            float factor = (1.0 - dist / radius);
            float smoothFactor = smoothstep(0.0, 1.0, factor);

            // Fluid warp: radial repulsion + tangential vortex swirl
            vec2 normDiff = normalize(diff);
            vec2 tangent = vec2(-normDiff.y, normDiff.x);

            vec2 warp = (normDiff * 0.20 + tangent * 0.12) * smoothFactor * smoothFactor;
            warp.x /= uAspect;

            clipPos.xy += warp * clipPos.w;

            // Ionize/energize stars near cursor (brighten on hover)
            vAlpha = min(1.0, vAlpha + smoothFactor * 0.65);
          }
        }

        gl_Position = clipPos;
        gl_PointSize = max(1.2, aSize * (230.0 / -mvPosition.z) * uPixelRatio);
      }
    `;

    const starFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Airy disk stellar core + faint diffraction halo
        float core = exp(-dist * 18.0);
        float halo = exp(-dist * 4.5) * 0.38;
        float intensity = core + halo;

        gl_FragColor = vec4(vColor, vAlpha * intensity);
      }
    `;

    // -------------------------------------------------------------------------
    // 3. GENERATE ALL 40 ARCHITECTURAL NODES + 80 FILAMENT MICRO-BEADS
    // -------------------------------------------------------------------------
    const scaleFactor = isMobile ? 0.72 : 1.0;
    const allNodes: CosmicNode[] = [];

    // 1. Add 8 Primary Discipline Superclusters
    SUPERCLUSTER_ANCHORS.forEach((sc, idx) => {
      allNodes.push({
        id: sc.id,
        name: sc.name,
        x: sc.pos[0] * scaleFactor,
        y: sc.pos[1] * scaleFactor,
        z: sc.pos[2] * scaleFactor,
        ox: sc.pos[0] * scaleFactor,
        oy: sc.pos[1] * scaleFactor,
        oz: sc.pos[2] * scaleFactor,
        vx: 0,
        vy: 0,
        vz: 0,
        isSupercluster: true,
        isArticle: false,
        baseAlpha: 1.0,
        size: 3.2,
        superclusterIndex: idx
      });
    });

    // 2. Add 32 Deep-Dive System Article Nodes (4 clustered per supercluster)
    for (let i = 0; i < 32; i++) {
      const parentIdx = Math.floor(i / 4);
      const parent = allNodes[parentIdx];
      const offset = DEEP_DIVE_OFFSETS[i];

      const x = parent.ox + offset.dx * scaleFactor;
      const y = parent.oy + offset.dy * scaleFactor;
      const z = parent.oz + offset.dz * scaleFactor;

      allNodes.push({
        id: `article-${i}`,
        name: `System #${i + 1}`,
        x,
        y,
        z,
        ox: x,
        oy: y,
        oz: z,
        vx: 0,
        vy: 0,
        vz: 0,
        isSupercluster: false,
        isArticle: true,
        baseAlpha: 0.82,
        size: 1.8,
        superclusterIndex: parentIdx
      });
    }

    // 3. Add 80 Filament Micro-Bead Nodes (Intergalactic Dark Matter Stream)
    const microCount = 80;
    for (let i = 0; i < microCount; i++) {
      const fil = MACRO_FILAMENTS[i % MACRO_FILAMENTS.length];
      const nodeA = allNodes[fil[0]];
      const nodeB = allNodes[fil[1]];
      const t = 0.15 + (Math.random() * 0.7);

      const x = THREE.MathUtils.lerp(nodeA.ox, nodeB.ox, t) + (Math.random() - 0.5) * 1.4;
      const y = THREE.MathUtils.lerp(nodeA.oy, nodeB.oy, t) + (Math.random() - 0.5) * 1.4;
      const z = THREE.MathUtils.lerp(nodeA.oz, nodeB.oz, t) + (Math.random() - 0.5) * 1.4;

      allNodes.push({
        id: `micro-${i}`,
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
        isSupercluster: false,
        isArticle: false,
        baseAlpha: 0.35 + Math.random() * 0.35,
        size: 0.9 + Math.random() * 0.5
      });
    }

    const totalNodeCount = allNodes.length;

    // Node Point Cloud Geometry
    const nodePositions = new Float32Array(totalNodeCount * 3);
    const nodeColors = new Float32Array(totalNodeCount * 3);
    const nodeSizes = new Float32Array(totalNodeCount);
    const nodeAlphas = new Float32Array(totalNodeCount);
    const nodeTwinkles = new Float32Array(totalNodeCount);

    const colWhite = new THREE.Color(0xffffff);
    const colSilver = new THREE.Color(0xd4d4d4);
    const colMuted = new THREE.Color(0x94a3b8);

    for (let i = 0; i < totalNodeCount; i++) {
      const node = allNodes[i];
      nodePositions[i * 3] = node.x;
      nodePositions[i * 3 + 1] = node.y;
      nodePositions[i * 3 + 2] = node.z;

      const c = node.isSupercluster ? colWhite : node.isArticle ? colSilver : colMuted;
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;

      nodeSizes[i] = node.size;
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
        uMouseActive: { value: 0.0 },
        uScroll: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMaterial);
    webGroup.add(nodePoints);

    // -------------------------------------------------------------------------
    // 4. DIFFRACTION HALOS & ORBITAL RINGS (8 Primary Superclusters)
    // -------------------------------------------------------------------------
    const createHaloTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 128;
      cvs.height = 128;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(0.18, 'rgba(255, 255, 255, 0.75)');
        grad.addColorStop(0.45, 'rgba(230, 230, 230, 0.28)');
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
      opacity: 0.90
    });

    const superclusterSprites: THREE.Sprite[] = [];
    const superclusterRings: THREE.Mesh[] = [];
    const ringGeo = new THREE.RingGeometry(0.56, 0.60, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.28,
      side: THREE.DoubleSide
    });

    for (let i = 0; i < 8; i++) {
      const sprite = new THREE.Sprite(haloMat);
      sprite.position.set(allNodes[i].x, allNodes[i].y, allNodes[i].z);
      sprite.scale.set(3.0, 3.0, 3.0);
      webGroup.add(sprite);
      superclusterSprites.push(sprite);

      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(allNodes[i].x, allNodes[i].y, allNodes[i].z);
      webGroup.add(ring);
      superclusterRings.push(ring);
    }

    // -------------------------------------------------------------------------
    // 5. DISTANT DEEP-SPACE FIELD STARS (Cosmic Depth Layer)
    // -------------------------------------------------------------------------
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
      const rad = 42 + Math.random() * 46;

      bgPositions[i3] = rad * Math.sin(phi) * Math.cos(lam);
      bgPositions[i3 + 1] = rad * Math.sin(phi) * Math.sin(lam);
      bgPositions[i3 + 2] = rad * Math.cos(phi) - 16.0;

      const c = Math.random() > 0.6 ? colSilver : colMuted;
      bgColors[i3] = c.r;
      bgColors[i3 + 1] = c.g;
      bgColors[i3 + 2] = c.b;

      bgSizes[i] = 0.28 + Math.random() * 0.45;
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
        uMouseActive: { value: 0.0 },
        uScroll: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const bgPoints = new THREE.Points(bgGeo, bgMaterial);
    scene.add(bgPoints);

    // -------------------------------------------------------------------------
    // 6. VOLUMETRIC WARM-HOT INTERGALACTIC DUST (Void Medium Clouds)
    // -------------------------------------------------------------------------
    const dustCount = 1400;
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustAlphas = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const rad = Math.pow(Math.random(), 0.68) * 28.0;
      const theta = Math.random() * Math.PI * 2;
      const zDisp = (Math.random() - 0.5) * 10.0;

      dustPositions[i3] = Math.cos(theta) * rad;
      dustPositions[i3 + 1] = Math.sin(theta) * rad * 0.76;
      dustPositions[i3 + 2] = zDisp;

      const c = Math.random() > 0.5 ? colSilver : colMuted;
      dustColors[i3] = c.r;
      dustColors[i3 + 1] = c.g;
      dustColors[i3 + 2] = c.b;

      dustSizes[i] = 2.8 + Math.random() * 4.6;
      dustAlphas[i] = 0.08 + Math.random() * 0.18;
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
        gl_PointSize = max(2.0, aSize * (160.0 / -mvPosition.z) * uPixelRatio);
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

    // -------------------------------------------------------------------------
    // 7. COSMIC WEB FILAMENTS (Trunks, Branches, and Cursor Lasers)
    // -------------------------------------------------------------------------
    const maxLines = 280;
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

    // -------------------------------------------------------------------------
    // 8. INTERACTION & SCROLL LISTENERS (Physics & Deep-Space Pull-Back)
    // -------------------------------------------------------------------------
    const raycaster = new THREE.Raycaster();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const handleMouseMove = (e: MouseEvent) => {
      isMouseActive = true;
      const ndcX = (e.clientX / window.innerWidth) * 2 - 1;
      const ndcY = -(e.clientY / window.innerHeight) * 2 + 1;

      mouseVel.x = ndcX - mouseNDC.x;
      mouseVel.y = ndcY - mouseNDC.y;
      mouseNDC.set(ndcX, ndcY);

      targetMouseX = ((e.clientX / window.innerWidth) - 0.5) * 0.18;
      targetMouseY = ((e.clientY / window.innerHeight) - 0.5) * 0.18;

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

      nodeMaterial.uniforms.uPixelRatio.value = pr;
      nodeMaterial.uniforms.uAspect.value = aspect;
      bgMaterial.uniforms.uPixelRatio.value = pr;
      bgMaterial.uniforms.uAspect.value = aspect;
      dustMaterial.uniforms.uPixelRatio.value = pr;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------------------
    // 9. ANIMATION LOOP: KEPLERIAN DRIFT, FILAMENT METRICS, SCROLL ACCELERATION
    // -------------------------------------------------------------------------
    let frameId: number;
    let lastTime = performance.now();

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const now = performance.now();
      const elapsed = (now - lastTime) * 0.001;

      nodeMaterial.uniforms.uTime.value = now * 0.001;
      nodeMaterial.uniforms.uMouse.value.copy(mouseNDC);
      nodeMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      nodeMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;
      nodeMaterial.uniforms.uScroll.value = scrollY;

      bgMaterial.uniforms.uTime.value = now * 0.001;
      bgMaterial.uniforms.uMouse.value.copy(mouseNDC);
      bgMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      bgMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;

      // Decay mouse momentum
      mouseVel.multiplyScalar(0.92);

      // Majestic cosmic web rotation
      webGroup.rotation.z += 0.00032;

      // Parallax easing
      currentMouseX += (targetMouseX - currentMouseX) * 0.025;
      currentMouseY += (targetMouseY - currentMouseY) * 0.025;
      scene.rotation.y = currentMouseX;
      scene.rotation.x = currentMouseY;

      // Smooth camera pull-back on scroll
      camera.position.z = 28 + scrollY * 0.0065;
      camera.position.y = -scrollY * 0.0032;

      // Update node physics
      const nodePosArr = (nodeGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const lPosArr = (lineGeo.attributes.position as THREE.BufferAttribute).array as Float32Array;
      const lColArr = (lineGeo.attributes.color as THREE.BufferAttribute).array as Float32Array;
      let lineIndex = 0;

      const tSec = now * 0.001;

      for (let i = 0; i < totalNodeCount; i++) {
        const node = allNodes[i];

        // Harmonic organic drift
        const driftX = Math.sin(tSec * 0.36 + i * 1.4) * 0.16;
        const driftY = Math.cos(tSec * 0.30 + i * 1.1) * 0.16;
        const driftZ = Math.sin(tSec * 0.25 + i * 1.8) * 0.10;
        const targetX = node.ox + driftX;
        const targetY = node.oy + driftY;
        const targetZ = node.oz + driftZ;

        // Gravitational pull / push from cursor
        if (isMouseActive) {
          const dx = mouseWorld.x - node.x;
          const dy = mouseWorld.y - node.y;
          const dCursor = Math.sqrt(dx * dx + dy * dy);

          if (dCursor < 8.0 && dCursor > 0.1) {
            const force = (1.0 - dCursor / 8.0) * (node.isSupercluster ? 0.006 : 0.012);
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

        // Update 8 Supercluster Halos & Rings
        if (i < 8) {
          superclusterSprites[i].position.set(node.x, node.y, node.z);
          superclusterRings[i].position.set(node.x, node.y, node.z);
          superclusterRings[i].rotation.z = tSec * 0.25 + i;

          const dToCursor = Math.hypot(mouseWorld.x - node.x, mouseWorld.y - node.y);
          if (isMouseActive && dToCursor < 6.0) {
            const boost = 1.0 - dToCursor / 6.0;
            superclusterSprites[i].scale.set(3.0 + boost * 1.0, 3.0 + boost * 1.0, 1);
            superclusterSprites[i].material.opacity = 0.90 + boost * 0.10;
            (superclusterRings[i].material as THREE.MeshBasicMaterial).opacity = 0.28 + boost * 0.40;
          } else {
            superclusterSprites[i].scale.set(3.0, 3.0, 1);
            superclusterSprites[i].material.opacity = 0.90;
            (superclusterRings[i].material as THREE.MeshBasicMaterial).opacity = 0.28;
          }
        }

        // Dynamic Cursor Laser Filament
        if (isMouseActive && lineIndex < maxLines) {
          const dToCursor = Math.hypot(mouseWorld.x - node.x, mouseWorld.y - node.y);
          if (dToCursor < 6.8) {
            const alpha = (1.0 - dToCursor / 6.8) * 0.78;
            const ptr = lineIndex * 6;

            lPosArr[ptr] = mouseWorld.x;
            lPosArr[ptr + 1] = mouseWorld.y;
            lPosArr[ptr + 2] = mouseWorld.z;

            lPosArr[ptr + 3] = node.x;
            lPosArr[ptr + 4] = node.y;
            lPosArr[ptr + 5] = node.z;

            lColArr[ptr] = 1.0 * alpha;
            lColArr[ptr + 1] = 1.0 * alpha;
            lColArr[ptr + 2] = 1.0 * alpha;

            lColArr[ptr + 3] = 0.82 * alpha;
            lColArr[ptr + 4] = 0.82 * alpha;
            lColArr[ptr + 5] = 0.82 * alpha;

            lineIndex++;
          }
        }
      }

      // 1. Primary Macro Filaments between Superclusters
      MACRO_FILAMENTS.forEach(([aIdx, bIdx]) => {
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

        let alpha = 0.24;
        if (isMouseActive) {
          const midX = (nodeA.x + nodeB.x) * 0.5;
          const midY = (nodeA.y + nodeB.y) * 0.5;
          const dMid = Math.hypot(mouseWorld.x - midX, mouseWorld.y - midY);
          if (dMid < 5.0) {
            alpha += (1.0 - dMid / 5.0) * 0.55;
          }
        }

        lColArr[ptr] = 1.0 * alpha;
        lColArr[ptr + 1] = 1.0 * alpha;
        lColArr[ptr + 2] = 1.0 * alpha;

        lColArr[ptr + 3] = 0.85 * alpha;
        lColArr[ptr + 4] = 0.85 * alpha;
        lColArr[ptr + 5] = 0.85 * alpha;

        lineIndex++;
      });

      // 2. Branch Filaments connecting Deep-Dive Articles to their Parent Supercluster
      for (let art = 8; art < 40; art++) {
        if (lineIndex >= maxLines) break;
        const articleNode = allNodes[art];
        if (articleNode.superclusterIndex !== undefined) {
          const parentSc = allNodes[articleNode.superclusterIndex];

          const ptr = lineIndex * 6;
          lPosArr[ptr] = parentSc.x;
          lPosArr[ptr + 1] = parentSc.y;
          lPosArr[ptr + 2] = parentSc.z;

          lPosArr[ptr + 3] = articleNode.x;
          lPosArr[ptr + 4] = articleNode.y;
          lPosArr[ptr + 5] = articleNode.z;

          let alpha = 0.18;
          if (isMouseActive) {
            const dArt = Math.hypot(mouseWorld.x - articleNode.x, mouseWorld.y - articleNode.y);
            if (dArt < 4.5) {
              alpha += (1.0 - dArt / 4.5) * 0.50;
            }
          }

          lColArr[ptr] = 0.9 * alpha;
          lColArr[ptr + 1] = 0.9 * alpha;
          lColArr[ptr + 2] = 0.9 * alpha;

          lColArr[ptr + 3] = 0.7 * alpha;
          lColArr[ptr + 4] = 0.7 * alpha;
          lColArr[ptr + 5] = 0.7 * alpha;

          lineIndex++;
        }
      }

      // Zero out unused filament lines
      for (let j = lineIndex; j < maxLines; j++) {
        const ptr = j * 6;
        lPosArr[ptr] = 0;
        lPosArr[ptr + 1] = 0;
        lPosArr[ptr + 2] = 0;
        lPosArr[ptr + 3] = 0;
        lPosArr[ptr + 4] = 0;
        lPosArr[ptr + 5] = 0;
        lColArr[ptr] = 0;
        lColArr[ptr + 1] = 0;
        lColArr[ptr + 2] = 0;
        lColArr[ptr + 3] = 0;
        lColArr[ptr + 4] = 0;
        lColArr[ptr + 5] = 0;
      }

      (nodeGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (lineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------------------
    // 10. CLEANUP (Zero Memory Leaks)
    // -------------------------------------------------------------------------
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

      nodeGeo.dispose();
      nodeMaterial.dispose();
      bgGeo.dispose();
      bgMaterial.dispose();
      dustGeo.dispose();
      dustMaterial.dispose();
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
