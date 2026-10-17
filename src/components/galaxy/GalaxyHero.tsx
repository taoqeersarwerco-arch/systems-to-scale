import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { StsLogo } from '../ui/StsLogo';
import { ChevronDown } from 'lucide-react';

interface GalaxyHeroProps {
  onExploreClick?: () => void;
}

export const GalaxyHero: React.FC<GalaxyHeroProps> = ({ onExploreClick }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    const checkMobile = () => setIsMobile(window.innerWidth < 760);
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion || isMobile) return;
    const container = mountRef.current;
    if (!container) return;

    // Realistic spiral galaxy observed from deep space + interactive particle web
    const starCount = 34000;
    const dustCount = 1400;
    const backgroundStarCount = 1000;
    const webNodeCount = 95; // Interactive constellation web nodes
    const maxWebLines = 320;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      54,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
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

    const pixelRatio = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(pixelRatio);
    renderer.setClearColor(0x0e1112, 1);
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------
    // GALAXY GROUP (Tilted at oblique angle + shifted upward so the
    // luminous core sits behind the STS mark and DOES NOT blind the H1 text)
    // -------------------------------------------------------------
    const galaxyGroup = new THREE.Group();
    galaxyGroup.position.set(0, 4.2, 0); // Shift core upward to frame the headline
    galaxyGroup.rotation.x = Math.PI * 0.33; // ~60 degrees tilt
    galaxyGroup.rotation.y = -Math.PI * 0.07;
    galaxyGroup.rotation.z = Math.PI * 0.12;
    scene.add(galaxyGroup);

    // Mouse tracking vectors (NDC, screen & 3D world space)
    const mouseNDC = new THREE.Vector2(0, 0);
    const mouseVel = new THREE.Vector2(0, 0);
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isMouseActive = false;

    // -------------------------------------------------------------
    // 1. PINPOINT STAR SHADER WITH REAL-TIME CURSOR DISTORTION
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
        float twinkle = sin(uTime * 1.6 + aTwinkle * 6.28318) * 0.18 + 0.82;
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
    // 2. GENERATE 34,000 SPIRAL GALAXY STARS
    // -------------------------------------------------------------
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starAlphas = new Float32Array(starCount);
    const starTwinkles = new Float32Array(starCount);

    const maxRadius = 18.0;
    const branches = 4;
    const spin = 1.30;

    const colorCoreWhite = new THREE.Color(0xffffff);
    const colorCoreGold = new THREE.Color(0xf1f5f9);
    const colorBrass = new THREE.Color(0xffffff);
    const colorSteelLight = new THREE.Color(0xe2e8f0);
    const colorSteel = new THREE.Color(0x94a3b8);
    const colorOuterSlate = new THREE.Color(0x475569);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;

      const isCore = Math.random() < 0.32;
      const isHalo = !isCore && Math.random() < 0.15;

      let r: number;
      let theta: number;
      let xyDisp: number;
      let zDisp: number;

      if (isCore) {
        r = Math.pow(Math.random(), 2.2) * 3.8;
        theta = Math.random() * Math.PI * 2;
        xyDisp = (Math.random() - 0.5) * 0.38 * (1 + r * 0.25);
        zDisp = (Math.random() - 0.5) * Math.max(0.15, (3.8 - r) * 0.42);
      } else if (isHalo) {
        r = 3.8 + Math.pow(Math.random(), 1.4) * (maxRadius * 1.2);
        theta = Math.random() * Math.PI * 2;
        xyDisp = (Math.random() - 0.5) * 1.5;
        zDisp = (Math.random() - 0.5) * 2.2 * (1 - r / (maxRadius * 1.4));
      } else {
        r = 2.5 + Math.pow(Math.random(), 1.3) * (maxRadius - 2.5);
        const branchIdx = i % branches;
        const branchAngle = (branchIdx / branches) * Math.PI * 2;
        const spinAngle = Math.pow(r / maxRadius, 0.78) * spin * Math.PI * 2;
        theta = branchAngle + spinAngle;

        const armSpread = 0.2 + (r / maxRadius) * 0.88;
        const g1 = (Math.random() + Math.random() + Math.random() - 1.5) * armSpread;
        const g2 = (Math.random() + Math.random() + Math.random() - 1.5) * armSpread;
        xyDisp = g1;
        zDisp = g2 * 0.30;
      }

      starPositions[i3] = Math.cos(theta) * r + xyDisp;
      starPositions[i3 + 1] = Math.sin(theta) * r + xyDisp;
      starPositions[i3 + 2] = zDisp;

      const mixedColor = new THREE.Color();
      const normR = Math.min(1.0, r / maxRadius);

      if (normR < 0.16) {
        mixedColor.lerpColors(colorCoreWhite, colorCoreGold, normR / 0.16);
      } else if (normR < 0.42) {
        const t = (normR - 0.16) / (0.42 - 0.16);
        mixedColor.lerpColors(colorCoreGold, colorBrass, t);
        if (Math.random() > 0.45) mixedColor.lerp(colorSteelLight, Math.random() * 0.4);
      } else if (normR < 0.84) {
        const t = (normR - 0.42) / (0.84 - 0.42);
        mixedColor.lerpColors(colorSteelLight, colorSteel, t);
        if (Math.random() < 0.22) mixedColor.lerp(colorCoreWhite, 0.65);
      } else {
        const t = (normR - 0.84) / 0.16;
        mixedColor.lerpColors(colorSteel, colorOuterSlate, t);
      }

      starColors[i3] = mixedColor.r;
      starColors[i3 + 1] = mixedColor.g;
      starColors[i3 + 2] = mixedColor.b;

      const pRand = Math.random();
      let pSize: number;
      let pAlpha: number;

      if (pRand > 0.97) {
        pSize = 1.35 + Math.random() * 0.7;
        pAlpha = 0.95;
      } else if (pRand > 0.85) {
        pSize = 0.8 + Math.random() * 0.45;
        pAlpha = 0.8;
      } else {
        pSize = 0.30 + Math.random() * 0.42;
        pAlpha = 0.35 + Math.random() * 0.55;
      }

      if (normR < 0.14) {
        pAlpha = Math.min(1.0, pAlpha + 0.25);
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
        uAspect: { value: container.clientWidth / container.clientHeight },
        uMouseActive: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const starPoints = new THREE.Points(starGeo, starMaterial);
    galaxyGroup.add(starPoints);

    // -------------------------------------------------------------
    // 3. INTERSTELLAR GASEOUS NEBULA DUST CLOUDS
    // -------------------------------------------------------------
    const dustGeo = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    const dustColors = new Float32Array(dustCount * 3);
    const dustSizes = new Float32Array(dustCount);
    const dustAlphas = new Float32Array(dustCount);

    for (let i = 0; i < dustCount; i++) {
      const i3 = i * 3;
      const r = 1.5 + Math.pow(Math.random(), 1.2) * (maxRadius - 3.0);
      const branchIdx = i % branches;
      const branchAngle = (branchIdx / branches) * Math.PI * 2;
      const spinAngle = Math.pow(r / maxRadius, 0.78) * spin * Math.PI * 2;
      const theta = branchAngle + spinAngle;

      const spread = 0.35 + (r / maxRadius) * 1.1;
      const g1 = (Math.random() + Math.random() - 1.0) * spread;
      const g2 = (Math.random() + Math.random() - 1.0) * spread;

      dustPositions[i3] = Math.cos(theta) * r + g1;
      dustPositions[i3 + 1] = Math.sin(theta) * r + g1;
      dustPositions[i3 + 2] = g2 * 0.25;

      const normR = r / maxRadius;
      const dColor = new THREE.Color();
      if (normR < 0.28) {
        dColor.lerpColors(colorBrass, colorCoreGold, Math.random());
      } else {
        dColor.lerpColors(colorSteel, colorSteelLight, Math.random());
      }

      dustColors[i3] = dColor.r;
      dustColors[i3 + 1] = dColor.g;
      dustColors[i3 + 2] = dColor.b;

      dustSizes[i] = 4.0 + Math.random() * 5.0;
      dustAlphas[i] = 0.018 + Math.random() * 0.032;
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
    galaxyGroup.add(dustPoints);

    // -------------------------------------------------------------
    // 4. GALACTIC CORE BULGE (Soft Volumetric Glow Nucleus)
    // -------------------------------------------------------------
    const coreCanvas = document.createElement('canvas');
    coreCanvas.width = 128;
    coreCanvas.height = 128;
    const coreCtx = coreCanvas.getContext('2d');
    if (coreCtx) {
      const grad = coreCtx.createRadialGradient(64, 64, 0, 64, 64, 64);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
      grad.addColorStop(0.15, 'rgba(241, 245, 249, 0.60)');
      grad.addColorStop(0.40, 'rgba(203, 213, 225, 0.22)');
      grad.addColorStop(0.70, 'rgba(148, 163, 184, 0.05)');
      grad.addColorStop(1, 'rgba(8, 8, 8, 0)');
      coreCtx.fillStyle = grad;
      coreCtx.fillRect(0, 0, 128, 128);
    }
    const coreTexture = new THREE.CanvasTexture(coreCanvas);
    const coreMaterial = new THREE.SpriteMaterial({
      map: coreTexture,
      transparent: true,
      opacity: 0.58,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const coreSprite = new THREE.Sprite(coreMaterial);
    coreSprite.scale.set(8.5, 8.5, 1);
    galaxyGroup.add(coreSprite);

    // -------------------------------------------------------------
    // 5. DISTANT DEEP-SPACE FIELD STARS
    // -------------------------------------------------------------
    const bgGeo = new THREE.BufferGeometry();
    const bgPositions = new Float32Array(backgroundStarCount * 3);
    const bgColors = new Float32Array(backgroundStarCount * 3);
    const bgSizes = new Float32Array(backgroundStarCount);
    const bgAlphas = new Float32Array(backgroundStarCount);
    const bgTwinkles = new Float32Array(backgroundStarCount);

    for (let i = 0; i < backgroundStarCount; i++) {
      const i3 = i * 3;
      const u = Math.random();
      const v = Math.random();
      const phi = Math.acos(2 * v - 1);
      const lam = 2 * Math.PI * u;
      const rad = 45 + Math.random() * 35;

      bgPositions[i3] = rad * Math.sin(phi) * Math.cos(lam);
      bgPositions[i3 + 1] = rad * Math.sin(phi) * Math.sin(lam);
      bgPositions[i3 + 2] = rad * Math.cos(phi);

      const isWarm = Math.random() > 0.65;
      const c = isWarm ? colorBrass : colorSteel;
      bgColors[i3] = c.r;
      bgColors[i3 + 1] = c.g;
      bgColors[i3 + 2] = c.b;

      bgSizes[i] = 0.25 + Math.random() * 0.4;
      bgAlphas[i] = 0.2 + Math.random() * 0.45;
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
        uAspect: { value: container.clientWidth / container.clientHeight },
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
    // 6. INTERACTIVE PARTICLE WEB (Constellation Network Layer)
    // -------------------------------------------------------------
    // Foreground nodes that connect to each other and directly track the cursor
    const webNodes: { x: number; y: number; z: number; vx: number; vy: number; vz: number; baseAlpha: number }[] = [];
    for (let i = 0; i < webNodeCount; i++) {
      webNodes.push({
        x: (Math.random() - 0.5) * 36,
        y: (Math.random() - 0.5) * 22,
        z: (Math.random() - 0.5) * 8 + 2, // Close to camera in foreground
        vx: (Math.random() - 0.5) * 0.008,
        vy: (Math.random() - 0.5) * 0.008,
        vz: (Math.random() - 0.5) * 0.004,
        baseAlpha: 0.35 + Math.random() * 0.45
      });
    }

    // Dynamic LineSegments for constellation connections
    const linePositions = new Float32Array(maxWebLines * 2 * 3);
    const lineColors = new Float32Array(maxWebLines * 2 * 3);
    const webLineGeo = new THREE.BufferGeometry();
    webLineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    webLineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const webLineMaterial = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      linewidth: 1
    });

    const webLines = new THREE.LineSegments(webLineGeo, webLineMaterial);
    scene.add(webLines);

    // Constellation node vertices (small glowing points)
    const nodePositions = new Float32Array(webNodeCount * 3);
    const nodeColors = new Float32Array(webNodeCount * 3);
    const nodeSizes = new Float32Array(webNodeCount);
    const nodeAlphas = new Float32Array(webNodeCount);
    const nodeTwinkles = new Float32Array(webNodeCount);

    for (let i = 0; i < webNodeCount; i++) {
      nodePositions[i * 3] = webNodes[i].x;
      nodePositions[i * 3 + 1] = webNodes[i].y;
      nodePositions[i * 3 + 2] = webNodes[i].z;

      const c = i % 2 === 0 ? colorBrass : colorSteel;
      nodeColors[i * 3] = c.r;
      nodeColors[i * 3 + 1] = c.g;
      nodeColors[i * 3 + 2] = c.b;

      nodeSizes[i] = 1.1 + Math.random() * 0.8;
      nodeAlphas[i] = webNodes[i].baseAlpha;
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
        uAspect: { value: container.clientWidth / container.clientHeight },
        uMouseActive: { value: 0.0 }
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });

    const nodePoints = new THREE.Points(nodeGeo, nodeMaterial);
    scene.add(nodePoints);

    // -------------------------------------------------------------
    // INTERACTION & ANIMATION DYNAMICS
    // -------------------------------------------------------------
    const clock = new THREE.Clock();
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

      // Project mouse into 3D world space at z = 0
      raycaster.setFromCamera(mouseNDC, camera);
      raycaster.ray.intersectPlane(planeZ, mouseWorld);
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    const handleMouseLeave = () => {
      isMouseActive = false;
      targetMouseX = 0;
      targetMouseY = 0;
    };
    window.addEventListener('mouseleave', handleMouseLeave);

    let scrollY = window.scrollY;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    observer.observe(container);

    const handleResize = () => {
      if (!container) return;
      const aspect = container.clientWidth / container.clientHeight;
      camera.aspect = aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);

      const pr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pr);

      starMaterial.uniforms.uPixelRatio.value = pr;
      starMaterial.uniforms.uAspect.value = aspect;
      dustMaterial.uniforms.uPixelRatio.value = pr;
      bgMaterial.uniforms.uPixelRatio.value = pr;
      bgMaterial.uniforms.uAspect.value = aspect;
      nodeMaterial.uniforms.uPixelRatio.value = pr;
      nodeMaterial.uniforms.uAspect.value = aspect;
    };
    window.addEventListener('resize', handleResize);

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Pass interaction uniforms
      starMaterial.uniforms.uTime.value = elapsedTime;
      starMaterial.uniforms.uMouse.value.copy(mouseNDC);
      starMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      starMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;

      nodeMaterial.uniforms.uTime.value = elapsedTime;
      nodeMaterial.uniforms.uMouse.value.copy(mouseNDC);
      nodeMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      nodeMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;

      bgMaterial.uniforms.uTime.value = elapsedTime;

      // Mouse momentum decay
      mouseVel.multiplyScalar(0.92);

      // Celestial spiral galaxy rotation
      galaxyGroup.rotation.z += 0.00045;

      // Smooth weightless 3D mouse parallax
      currentMouseX += (targetMouseX - currentMouseX) * 0.025;
      currentMouseY += (targetMouseY - currentMouseY) * 0.025;
      scene.rotation.y = currentMouseX;
      scene.rotation.x = currentMouseY;

      // Core breathing
      const breath = 1.0 + Math.sin(elapsedTime * 0.8) * 0.04;
      coreSprite.scale.set(8.5 * breath, 8.5 * breath, 1);

      // Camera scroll response
      camera.position.z = 28 + scrollY * 0.004;
      camera.position.y = -scrollY * 0.003;

      // -------------------------------------------------------------
      // UPDATE PARTICLE WEB NODES & LINES
      // -------------------------------------------------------------
      const nodePosAttr = nodeGeo.attributes.position as THREE.BufferAttribute;
      const nPosArr = nodePosAttr.array as Float32Array;
      const lPosArr = webLineGeo.attributes.position.array as Float32Array;
      const lColArr = webLineGeo.attributes.color.array as Float32Array;
      let lineIndex = 0;

      // Update node positions and physics
      for (let i = 0; i < webNodeCount; i++) {
        const node = webNodes[i];

        // Cursor attraction & fluid push
        if (isMouseActive) {
          const dx = mouseWorld.x - node.x;
          const dy = mouseWorld.y - node.y;
          const dCursor = Math.sqrt(dx * dx + dy * dy);

          if (dCursor < 7.0 && dCursor > 0.1) {
            // Gentle magnetic attraction towards cursor
            const force = (1.0 - dCursor / 7.0) * 0.006;
            node.vx += dx * force;
            node.vy += dy * force;
          }
        }

        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Soft boundaries with elastic bounce
        if (node.x > 22 || node.x < -22) node.vx *= -1;
        if (node.y > 14 || node.y < -14) node.vy *= -1;
        if (node.z > 7 || node.z < -2) node.vz *= -1;

        // Drag friction
        node.vx *= 0.985;
        node.vy *= 0.985;
        node.vz *= 0.985;

        nPosArr[i * 3] = node.x;
        nPosArr[i * 3 + 1] = node.y;
        nPosArr[i * 3 + 2] = node.z;

        // Connect node to cursor if within range (glowing brass laser line)
        if (isMouseActive && lineIndex < maxWebLines) {
          const dToCursor = Math.hypot(mouseWorld.x - node.x, mouseWorld.y - node.y);
          if (dToCursor < 6.5) {
            const alpha = (1.0 - dToCursor / 6.5) * 0.65;
            const ptr = lineIndex * 6;

            lPosArr[ptr] = mouseWorld.x;
            lPosArr[ptr + 1] = mouseWorld.y;
            lPosArr[ptr + 2] = mouseWorld.z;

            lPosArr[ptr + 3] = node.x;
            lPosArr[ptr + 4] = node.y;
            lPosArr[ptr + 5] = node.z;

            // Cursor side: warm brass
            lColArr[ptr] = colorBrass.r * alpha;
            lColArr[ptr + 1] = colorBrass.g * alpha;
            lColArr[ptr + 2] = colorBrass.b * alpha;

            // Node side: steel
            lColArr[ptr + 3] = colorSteelLight.r * alpha;
            lColArr[ptr + 4] = colorSteelLight.g * alpha;
            lColArr[ptr + 5] = colorSteelLight.b * alpha;

            lineIndex++;
          }
        }

        // Connect nearby nodes to each other
        for (let j = i + 1; j < webNodeCount; j++) {
          if (lineIndex >= maxWebLines) break;
          const nodeB = webNodes[j];
          const dist = Math.hypot(node.x - nodeB.x, node.y - nodeB.y, node.z - nodeB.z);

          if (dist < 3.8) {
            const alpha = (1.0 - dist / 3.8) * 0.22;
            const ptr = lineIndex * 6;

            lPosArr[ptr] = node.x;
            lPosArr[ptr + 1] = node.y;
            lPosArr[ptr + 2] = node.z;

            lPosArr[ptr + 3] = nodeB.x;
            lPosArr[ptr + 4] = nodeB.y;
            lPosArr[ptr + 5] = nodeB.z;

            lColArr[ptr] = colorSteel.r * alpha;
            lColArr[ptr + 1] = colorSteel.g * alpha;
            lColArr[ptr + 2] = colorSteel.b * alpha;

            lColArr[ptr + 3] = colorSteelLight.r * alpha;
            lColArr[ptr + 4] = colorSteelLight.g * alpha;
            lColArr[ptr + 5] = colorSteelLight.b * alpha;

            lineIndex++;
          }
        }
      }

      // Clear remaining line buffer
      for (let k = lineIndex * 6; k < maxWebLines * 6; k++) {
        lPosArr[k] = 0;
        lColArr[k] = 0;
      }

      nodePosAttr.needsUpdate = true;
      (webLineGeo.attributes.position as THREE.BufferAttribute).needsUpdate = true;
      (webLineGeo.attributes.color as THREE.BufferAttribute).needsUpdate = true;
      webLineGeo.setDrawRange(0, lineIndex * 2);

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
      cancelAnimationFrame(frameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      starGeo.dispose();
      starMaterial.dispose();
      dustGeo.dispose();
      dustMaterial.dispose();
      bgGeo.dispose();
      bgMaterial.dispose();
      nodeGeo.dispose();
      nodeMaterial.dispose();
      webLineGeo.dispose();
      webLineMaterial.dispose();
      coreTexture.dispose();
      coreMaterial.dispose();
      renderer.dispose();
    };
  }, [prefersReducedMotion, isMobile]);

  const handleCtaClick = () => {
    if (onExploreClick) {
      onExploreClick();
    } else {
      const el = document.getElementById('topics');
      if (el) el.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
  };

  return (
    <section className="sts-section-hero" style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Background Layer: Three.js on desktop, Shimmer on mobile / reduced-motion */}
      {!prefersReducedMotion && !isMobile ? (
        <div
          ref={mountRef}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            pointerEvents: 'none'
          }}
        />
      ) : (
        <div
          className="sts-shimmer-bg"
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            background: 'radial-gradient(circle at 50% 50%, #161A1C 0%, #0E1112 80%)'
          }}
        />
      )}

      {/* Atmospheric Reading Sanctuary: Soft dark obsidian pocket in the center to guarantee 100% crisp, effortless text clarity */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background: 'radial-gradient(ellipse 72% 56% at 50% 56%, rgba(14, 17, 18, 0.95) 0%, rgba(14, 17, 18, 0.70) 50%, rgba(14, 17, 18, 0) 100%)'
        }}
      />

      {/* Content Layer (centred, z-index: 2) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          minHeight: '100vh',
          width: '100%',
          padding: '0 24px',
          position: 'relative',
          zIndex: 2
        }}
      >
        {/* Logo mark (width: clamp(80px, 15vw, 140px); margin-bottom: 32px; fill: white) */}
        <div
          className="sts-hero-logo"
          style={{
            marginBottom: '32px'
          }}
        >
          <StsLogo size={110} color="#FFFFFF" />
        </div>

        {/* Tagline (H1): Understand the mechanism, not just the steps. */}
        <h1
          style={{
            fontFamily: 'var(--sts-font-display)',
            fontSize: 'clamp(36px, 5.5vw, 64px)',
            fontWeight: 600,
            letterSpacing: '-0.035em',
            lineHeight: 1.08,
            maxWidth: '740px',
            marginBottom: '18px',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #A3A3A3 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 4px 28px rgba(0, 0, 0, 0.95)'
          }}
        >
          Understand the mechanism, not just the steps.
        </h1>

        {/* Sub-lead */}
        <p
          style={{
            fontFamily: 'var(--sts-font-body)',
            fontSize: 'clamp(15px, 2vw, 18px)',
            fontWeight: 400,
            color: 'var(--sts-muted)',
            lineHeight: 1.6,
            maxWidth: '560px',
            marginBottom: '44px',
            textShadow: '0 2px 16px rgba(0, 0, 0, 0.95)'
          }}
        >
          In-depth explanations of the tools and systems modern businesses run on — because knowing why something works is what lets you build the next thing yourself.
        </p>

        {/* High-Contrast White Pill CTA Button */}
        <button
          onClick={handleCtaClick}
          className="sts-btn-primary"
          style={{
            background: '#FFFFFF',
            color: '#000000',
            fontFamily: 'var(--sts-font-body)',
            fontSize: '14.5px',
            fontWeight: 600,
            padding: '14px 32px',
            borderRadius: '999px',
            cursor: 'pointer',
            minHeight: '48px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.7)',
            transition: 'background var(--sts-dur-in) var(--sts-ease), transform var(--sts-dur-in) var(--sts-ease)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#EDEDED';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#FFFFFF';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <span>Explore Topics ↓</span>
        </button>

        {/* Scroll indicator (bottom of hero) */}
        <div
          onClick={handleCtaClick}
          style={{
            position: 'absolute',
            bottom: '32px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer'
          }}
        >
          <span
            style={{
              fontFamily: 'var(--sts-font-mono)',
              fontSize: '11px',
              color: 'var(--sts-muted)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}
          >
            Scroll
          </span>
          <ChevronDown
            size={16}
            color="var(--sts-muted)"
            className="sts-scroll-bounce"
          />
        </div>
      </div>

      <style>{`
        .sts-hero-logo {
          animation: logoPulse 4s ease-in-out infinite;
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 0.85; }
          50% { opacity: 1; }
        }
        .sts-scroll-bounce {
          animation: scrollDown 2s ease-in-out infinite;
        }
        @keyframes scrollDown {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(8px); }
        }
        @keyframes shimmer {
          0%, 100% { filter: brightness(1); }
          50% { filter: brightness(1.2); }
        }
        .sts-shimmer-bg {
          animation: shimmer 8s infinite ease-in-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .sts-hero-logo, .sts-scroll-bounce, .sts-shimmer-bg {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
};
