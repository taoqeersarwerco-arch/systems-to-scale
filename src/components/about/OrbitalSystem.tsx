import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { TOPICS } from '../../data/topics';
import styles from '../../styles/about.module.css';

interface OrbitBodyData {
  topicSlug: string;
  topicName: string;
  semiMajor: number;
  semiMinor: number;
  speed: number;
  inclination: number;
  phase: number;
  currentAngle: number;
  eccentricity: number;
  colorHex: number;
  mesh?: THREE.Mesh;
  glowMesh?: THREE.Mesh;
  ringMesh?: THREE.Mesh;
  moonMesh?: THREE.Mesh;
  moonAngle?: number;
  hasRing?: boolean;
  hasMoon?: boolean;
  trailPoints: THREE.Vector3[];
  trailLine?: THREE.Line;
  pos2D: { x: number; y: number; visible: boolean };
}

export const OrbitalSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTopic, setHoveredTopic] = useState<{
    name: string;
    orbitNum: number;
    distanceAu: string;
    velocity: string;
    x: number;
    y: number;
  } | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Configure 8 distinct celestial bodies with authentic Keplerian properties
  const initialBodies = useMemo<OrbitBodyData[]>(() => {
    // Semi-major radii spaced from 4.6 to 15.6 AU
    const baseRadii = [4.6, 6.1, 7.7, 9.3, 10.9, 12.5, 14.1, 15.7];
    const baseSpeeds = [0.85, 0.70, 0.58, 0.48, 0.40, 0.33, 0.27, 0.22];
    const inclinations = [0.08, -0.10, 0.13, -0.08, 0.15, -0.12, 0.09, -0.06];
    const eccentricities = [0.14, 0.10, 0.18, 0.09, 0.20, 0.11, 0.15, 0.08];
    const phases = [0.4, 2.1, 3.8, 5.2, 1.2, 2.9, 4.4, 5.9];
    const colors = [
      0xFFFFFF, // AI & Automation (Pure White)
      0xE2E8F0, // Cloud Architecture (Platinum Steel)
      0xF1F5F9, // Database Engines (Glacial White)
      0xCBD5E1, // Distributed Systems (Titanium)
      0xFFFFFF, // Observability & SRE (Luminous Core)
      0x94A3B8, // Platform Engineering (Slate Silver)
      0xE2E8F0, // Security Engineering (Shield White)
      0xF8FAFC  // Systems Performance (Pure Stream)
    ];

    return TOPICS.map((topic, i) => {
      const a = baseRadii[i] || (4.5 + i * 1.5);
      const e = eccentricities[i] || 0.12;
      const b = a * Math.sqrt(1 - e * e);

      return {
        topicSlug: topic.slug,
        topicName: topic.name,
        semiMajor: a,
        semiMinor: b,
        speed: baseSpeeds[i] || 0.4,
        inclination: inclinations[i] || 0.08,
        eccentricity: e,
        phase: phases[i] || i * 0.8,
        currentAngle: phases[i] || i * 0.8,
        hasRing: i === 2, // Database Engines has thin planetary ring
        hasMoon: i === 0 || i === 3 || i === 6, // Micro-satellites
        colorHex: colors[i] || 0xFFFFFF,
        moonAngle: i * 1.5,
        trailPoints: [],
        pos2D: { x: 0, y: 0, visible: false },
      };
    });
  }, []);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);
    return () => motionQuery.removeEventListener('change', motionHandler);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 750;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);

    // Deep-space perspective vantage point matching Topics Hub
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, -3.8, 31);
    camera.lookAt(0, 0, 0);

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

    // -------------------------------------------------------------------------
    // ROOT CELESTIAL GROUPS
    // -------------------------------------------------------------------------
    const orbitalGroup = new THREE.Group();
    orbitalGroup.position.set(0, 0.35, 0);
    orbitalGroup.rotation.x = Math.PI * 0.21; // ~38 deg cinematic inclination
    orbitalGroup.rotation.y = -Math.PI * 0.05;
    orbitalGroup.rotation.z = Math.PI * 0.04;
    scene.add(orbitalGroup);

    // Interaction tracking vectors
    const mouseNDC = new THREE.Vector2(0, 0);
    const mouseVel = new THREE.Vector2(0, 0);
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isMouseActive = false;
    let lastMouseTime = performance.now();
    let lastClientX = 0;
    let lastClientY = 0;
    let scrollY = window.scrollY;

    // -------------------------------------------------------------------------
    // 1. PINPOINT AIRY-DISK COSMIC PARTICLES (Faint & Atmospheric)
    // -------------------------------------------------------------------------
    const starCount = 2800;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starAlphas = new Float32Array(starCount);
    const starTwinkles = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      const rad = 3.8 + Math.pow(Math.random(), 1.5) * 30.0;
      const theta = Math.random() * Math.PI * 2;
      const zSpread = (Math.random() - 0.5) * 14.0;

      starPositions[i3] = Math.cos(theta) * rad;
      starPositions[i3 + 1] = Math.sin(theta) * rad;
      starPositions[i3 + 2] = zSpread;

      // Subtle, faint bone-tinted stars matching Topics Hub
      const tint = Math.random();
      if (tint > 0.85) {
        starColors[i3] = 0.95;
        starColors[i3 + 1] = 0.97;
        starColors[i3 + 2] = 1.0;
        starSizes[i] = 0.65 + Math.random() * 0.35;
        starAlphas[i] = 0.30 + Math.random() * 0.15;
      } else if (tint > 0.4) {
        starColors[i3] = 0.82;
        starColors[i3 + 1] = 0.85;
        starColors[i3 + 2] = 0.90;
        starSizes[i] = 0.40 + Math.random() * 0.25;
        starAlphas[i] = 0.18 + Math.random() * 0.12;
      } else {
        starColors[i3] = 0.55;
        starColors[i3 + 1] = 0.60;
        starColors[i3 + 2] = 0.65;
        starSizes[i] = 0.25 + Math.random() * 0.20;
        starAlphas[i] = 0.10 + Math.random() * 0.08;
      }

      starTwinkles[i] = Math.random();
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('aAlpha', new THREE.BufferAttribute(starAlphas, 1));
    starGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(starTwinkles, 1));

    // Custom Circular Airy-Disk Shader with Real-Time Screen-Space Cursor Gravitational Warp
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

        // Screen-Space Gravitational Wave Distortion
        if (uMouseActive > 0.5) {
          vec2 diff = ndcPos - uMouse;
          diff.x *= uAspect;
          float dist = length(diff);
          float radius = 0.50;

          if (dist < radius && dist > 0.001) {
            float factor = (1.0 - dist / radius);
            float smoothFactor = smoothstep(0.0, 1.0, factor);

            vec2 normDiff = normalize(diff);
            vec2 tangent = vec2(-normDiff.y, normDiff.x);
            vec2 velInfluence = uMouseVel * 0.012;

            vec2 warp = (normDiff * 0.22 + tangent * 0.14 + velInfluence) * smoothFactor * smoothFactor;
            warp.x /= uAspect;

            clipPos.xy += warp * clipPos.w;
            vAlpha = min(0.65, vAlpha + smoothFactor * 0.35);
          }
        }

        gl_Position = clipPos;
        gl_PointSize = max(1.0, aSize * (180.0 / -mvPosition.z) * uPixelRatio);
      }
    `;

    const starFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Explicit Circular Discard to prevent any square artifacts
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Airy-disk diffraction core + delicate halo
        float core = exp(-dist * 18.0);
        float halo = exp(-dist * 4.5) * 0.35;
        float intensity = core + halo;

        gl_FragColor = vec4(vColor, vAlpha * intensity);
      }
    `;

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
    scene.add(starPoints);

    // -------------------------------------------------------------------------
    // 2. CENTRAL STELLAR NUCLEUS (Delicate & Soft)
    // -------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    orbitalGroup.add(coreGroup);

    // Central core bead
    const coreGeo = new THREE.SphereGeometry(0.28, 24, 24);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xF1F5F9 });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Soft wireframe breathing halo
    const coronaGeo = new THREE.SphereGeometry(0.65, 18, 18);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xE2E8F0,
      transparent: true,
      opacity: 0.10,
      wireframe: true,
      depthWrite: false,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coreGroup.add(coronaMesh);

    // Faint prominence lines
    const reticleGeo = new THREE.BufferGeometry();
    const reticlePts: THREE.Vector3[] = [];
    const reticleSegments = 24;
    for (let r = 0; r < reticleSegments; r++) {
      const angle = (r / reticleSegments) * Math.PI * 2;
      reticlePts.push(new THREE.Vector3(0, 0, 0));
      reticlePts.push(new THREE.Vector3(Math.cos(angle) * 1.4, Math.sin(angle) * 1.4, 0));
    }
    reticleGeo.setFromPoints(reticlePts);
    const reticleMat = new THREE.LineBasicMaterial({
      color: 0xE2E8F0,
      transparent: true,
      opacity: 0.035,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const reticleLines = new THREE.LineSegments(reticleGeo, reticleMat);
    coreGroup.add(reticleLines);

    // -------------------------------------------------------------------------
    // 3. EIGHT KEPLERIAN ORBITAL TRACES & CELESTIAL BODIES
    // -------------------------------------------------------------------------
    const SEGMENTS = 140;
    const bodies = [...initialBodies];
    const traceGeometries: THREE.BufferGeometry[] = [];
    const baseTraceVertices: Float32Array[] = [];

    bodies.forEach((body, idx) => {
      // Build Elliptical Path
      const points: THREE.Vector3[] = [];
      const vArray = new Float32Array((SEGMENTS + 1) * 3);

      for (let s = 0; s <= SEGMENTS; s++) {
        const theta = (s / SEGMENTS) * Math.PI * 2;
        const r = (body.semiMajor * (1 - body.eccentricity * body.eccentricity)) /
                  (1 + body.eccentricity * Math.cos(theta));
        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);
        const z = Math.sin(theta) * body.inclination * 2.8;

        points.push(new THREE.Vector3(x, y, z));
        vArray[s * 3] = x;
        vArray[s * 3 + 1] = y;
        vArray[s * 3 + 2] = z;
      }

      baseTraceVertices.push(vArray);

      const traceGeo = new THREE.BufferGeometry().setFromPoints(points);
      traceGeometries.push(traceGeo);

      // Whisper-faint, delicate bone-tinted ellipse trace
      const traceMat = new THREE.LineBasicMaterial({
        color: 0xE2E8F0,
        transparent: true,
        opacity: 0.065, // Harmonious luminous trace
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const traceLine = new THREE.LineLoop(traceGeo, traceMat);
      orbitalGroup.add(traceLine);

      // Main Celestial Body (Spherical bead)
      const bodyRadius = 0.17 + (idx % 3) * 0.03;
      const bodyGeo = new THREE.SphereGeometry(bodyRadius, 20, 20);
      const bodyMat = new THREE.MeshBasicMaterial({ color: body.colorHex });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      orbitalGroup.add(bodyMesh);
      body.mesh = bodyMesh;

      // Soft Atmospheric Glow Halo
      const glowGeo = new THREE.SphereGeometry(bodyRadius * 2.0, 14, 14);
      const glowMat = new THREE.MeshBasicMaterial({
        color: body.colorHex,
        transparent: true,
        opacity: 0.24,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      orbitalGroup.add(glowMesh);
      body.glowMesh = glowMesh;

      // Thin Planetary Ring for Body 2 (Database Engines)
      if (body.hasRing) {
        const ringGeo = new THREE.RingGeometry(bodyRadius * 2.1, bodyRadius * 3.4, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xE2E8F0,
          transparent: true,
          opacity: 0.18,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI * 0.35;
        orbitalGroup.add(ringMesh);
        body.ringMesh = ringMesh;
      }

      // Micro-Satellite Moon for Bodies 0, 3, 6
      if (body.hasMoon) {
        const moonGeo = new THREE.SphereGeometry(0.05, 10, 10);
        const moonMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        orbitalGroup.add(moonMesh);
        body.moonMesh = moonMesh;
      }

      // Fading Cometary Ribbon Trail (35 points)
      const MAX_TRAIL = 35;
      const trailPositions = new Float32Array(MAX_TRAIL * 3);
      const trailColors = new Float32Array(MAX_TRAIL * 3);

      for (let p = 0; p < MAX_TRAIL; p++) {
        const alpha = Math.pow(1 - p / MAX_TRAIL, 2.2) * 0.16;
        trailColors[p * 3] = alpha;
        trailColors[p * 3 + 1] = alpha;
        trailColors[p * 3 + 2] = alpha;
      }

      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));
      trailGeo.setAttribute('color', new THREE.BufferAttribute(trailColors, 3));

      const trailMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const trailLine = new THREE.Line(trailGeo, trailMat);
      orbitalGroup.add(trailLine);
      body.trailLine = trailLine;
    });

    // -------------------------------------------------------------------------
    // 4. MOUSE MOMENTUM & GRAVITATIONAL DISTORTION TRACKING
    // -------------------------------------------------------------------------
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      const now = performance.now();
      const dt = Math.max(1, now - lastMouseTime);
      const vx = (clientX - lastClientX) / dt;
      const vy = (clientY - lastClientY) / dt;
      lastClientX = clientX;
      lastClientY = clientY;
      lastMouseTime = now;

      mouseVel.set(vx * 15, -vy * 15);

      const ndcX = (clientX / width) * 2 - 1;
      const ndcY = -(clientY / height) * 2 + 1;
      mouseNDC.set(ndcX, ndcY);

      targetMouseX = ndcX;
      targetMouseY = ndcY;
      isMouseActive = clientX >= 0 && clientX <= width && clientY >= 0 && clientY <= height;

      // Check proximity for body hover HUD telemetry
      let foundHover: {
        name: string;
        orbitNum: number;
        distanceAu: string;
        velocity: string;
        x: number;
        y: number;
      } | null = null;

      for (let i = 0; i < bodies.length; i++) {
        const body = bodies[i];
        if (!body.pos2D.visible) continue;
        const dx = clientX - body.pos2D.x;
        const dy = clientY - body.pos2D.y;
        if (Math.hypot(dx, dy) < 28) {
          foundHover = {
            name: body.topicName,
            orbitNum: i + 1,
            distanceAu: `${body.semiMajor.toFixed(1)} AU`,
            velocity: `${(36 / Math.sqrt(body.semiMajor)).toFixed(1)} km/s`,
            x: body.pos2D.x,
            y: body.pos2D.y,
          };
          break;
        }
      }
      setHoveredTopic(foundHover);
    };

    const handleMouseLeave = () => {
      isMouseActive = false;
      targetMouseX = 0;
      targetMouseY = 0;
      mouseVel.set(0, 0);
      setHoveredTopic(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    // -------------------------------------------------------------------------
    // 5. SCROLL LISTENER: COMPRESSION TILT & PARALLAX
    // -------------------------------------------------------------------------
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Handle Window Resize
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      const pr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setPixelRatio(pr);
      starMaterial.uniforms.uPixelRatio.value = pr;
      starMaterial.uniforms.uAspect.value = width / height;
    };
    window.addEventListener('resize', handleResize);

    // -------------------------------------------------------------------------
    // 6. CONTINUOUS 60 FPS RENDER LOOP WITH ROBUST TIME DELTA
    // -------------------------------------------------------------------------
    const startTime = performance.now();
    let lastTime = performance.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.04);
      lastTime = now;
      const elapsedTime = (now - startTime) / 1000;

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;
      mouseVel.multiplyScalar(0.92);

      // Update cosmic dust shaders
      starMaterial.uniforms.uTime.value = elapsedTime;
      starMaterial.uniforms.uMouse.value.copy(mouseNDC);
      starMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      starMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;

      // Scroll response: Tilt from face-on (0.21 rad) to edge-on (0.76 rad) & translate camera
      const scrollRatio = Math.min(scrollY / (height || 750), 1.0);
      const tiltAngle = (Math.PI * 0.21) + scrollRatio * 0.55;
      orbitalGroup.rotation.x = tiltAngle + currentMouseY * 0.08;
      orbitalGroup.rotation.y = -Math.PI * 0.05 + currentMouseX * 0.12;
      orbitalGroup.rotation.z = Math.PI * 0.04 + Math.sin(elapsedTime * 0.15) * 0.02;

      camera.position.z = 31 + scrollRatio * 3.5;
      camera.position.y = -3.8 + scrollRatio * 2.0;

      // Fade canvas out smoothly as user scrolls past hero
      const fadeOpacity = Math.max(1.0 - scrollRatio * 1.3, 0.0);
      container.style.opacity = `${fadeOpacity}`;

      // Central core gentle breathing
      const breath = 1.0 + Math.sin(elapsedTime * 1.8) * 0.04;
      coreMesh.scale.set(breath, breath, breath);
      coronaMesh.rotation.y += 0.002;
      reticleLines.rotation.z += 0.001;

      // -----------------------------------------------------------------------
      // Update Keplerian Bodies & Continuous Orbital Motion
      // -----------------------------------------------------------------------
      bodies.forEach((body, idx) => {
        // True Keplerian velocity calculation: v = v0 * sqrt(2*a/r - 1)
        const theta = body.currentAngle;
        const rCurrent = (body.semiMajor * (1 - body.eccentricity * body.eccentricity)) /
                         (1 + body.eccentricity * Math.cos(theta));
        const keplerSpeedFactor = Math.sqrt(Math.max(0.1, (2 * body.semiMajor) / rCurrent - 0.7));

        let dynamicSpeed = body.speed * keplerSpeedFactor;

        // Proximity acceleration if mouse is hovering nearby
        if (isMouseActive && !prefersReducedMotion) {
          const bodyScreenDist = Math.hypot(
            (body.pos2D.x / width) * 2 - 1 - mouseNDC.x,
            -(body.pos2D.y / height) * 2 + 1 - mouseNDC.y
          );
          if (bodyScreenDist < 0.38) {
            dynamicSpeed *= 1.0 + (0.38 - bodyScreenDist) * 1.8;
          }
        }

        // Advance angle continuously with robust delta
        if (!prefersReducedMotion) {
          body.currentAngle += dynamicSpeed * delta * 0.45;
        }

        const r = (body.semiMajor * (1 - body.eccentricity * body.eccentricity)) /
                  (1 + body.eccentricity * Math.cos(body.currentAngle));
        const x = r * Math.cos(body.currentAngle);
        const y = r * Math.sin(body.currentAngle);
        const z = Math.sin(body.currentAngle) * body.inclination * 2.8;

        // Position Main Body
        if (body.mesh) {
          body.mesh.position.set(x, y, z);
        }
        if (body.glowMesh) {
          body.glowMesh.position.set(x, y, z);
          const glowPulse = 1.0 + Math.sin(elapsedTime * 2.5 + idx) * 0.06;
          body.glowMesh.scale.set(glowPulse, glowPulse, glowPulse);
        }
        if (body.ringMesh) {
          body.ringMesh.position.set(x, y, z);
          body.ringMesh.rotation.z += 0.004;
        }

        // Position Micro-Satellite Moon
        if (body.moonMesh && body.moonAngle !== undefined) {
          body.moonAngle += delta * 3.0;
          const moonDist = 0.55;
          const mx = x + Math.cos(body.moonAngle) * moonDist;
          const my = y + Math.sin(body.moonAngle) * moonDist * 0.7;
          const mz = z + Math.sin(body.moonAngle) * 0.25;
          body.moonMesh.position.set(mx, my, mz);
        }

        // Project 3D coordinates to 2D screen space for interactive HUD pill
        const tempVec = new THREE.Vector3(x, y, z);
        tempVec.applyMatrix4(orbitalGroup.matrixWorld);
        tempVec.project(camera);

        const sx = ((tempVec.x + 1) * width) / 2;
        const sy = ((-tempVec.y + 1) * height) / 2;
        body.pos2D = {
          x: sx,
          y: sy,
          visible: tempVec.z < 1 && fadeOpacity > 0.25,
        };

        // Update Graded Cometary Ribbon Trail
        if (body.trailLine && !prefersReducedMotion) {
          body.trailPoints.unshift(new THREE.Vector3(x, y, z));
          if (body.trailPoints.length > 35) {
            body.trailPoints.pop();
          }

          const posAttr = body.trailLine.geometry.attributes.position as THREE.BufferAttribute;
          const posArr = posAttr.array as Float32Array;

          for (let p = 0; p < 35; p++) {
            const pt = body.trailPoints[p] ||
                       body.trailPoints[body.trailPoints.length - 1] ||
                       new THREE.Vector3(x, y, z);
            posArr[p * 3] = pt.x;
            posArr[p * 3 + 1] = pt.y;
            posArr[p * 3 + 2] = pt.z;
          }
          posAttr.needsUpdate = true;
        }

        // Real-Time Orbit Path Gravitational Wobble
        if (isMouseActive && !prefersReducedMotion && traceGeometries[idx]) {
          const geo = traceGeometries[idx];
          const posAttr = geo.attributes.position as THREE.BufferAttribute;
          const baseArr = baseTraceVertices[idx];
          const curArr = posAttr.array as Float32Array;

          for (let s = 0; s <= SEGMENTS; s++) {
            const bx = baseArr[s * 3];
            const by = baseArr[s * 3 + 1];
            const bz = baseArr[s * 3 + 2];

            // Localized magnetic harmonic ripple
            const ripple = Math.sin(elapsedTime * 3.0 + s * 0.2) * 0.04 * (isMouseActive ? 1 : 0);
            curArr[s * 3] = bx + ripple;
            curArr[s * 3 + 1] = by + ripple;
            curArr[s * 3 + 2] = bz;
          }
          posAttr.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [initialBodies, prefersReducedMotion]);

  return (
    <div ref={containerRef} className={styles.orbitalCanvasContainer}>
      {/* Interactive 3D Proximity Telemetry HUD Pill */}
      {hoveredTopic && (
        <div
          className={styles.orbitalHoverBadge}
          style={{
            left: `${hoveredTopic.x}px`,
            top: `${hoveredTopic.y}px`,
          }}
        >
          <div className={styles.orbitalBadgeHeader}>
            <span className={styles.orbitalBadgeBeacon} />
            <span className={styles.orbitalBadgeOrbit}>ORBIT 0{hoveredTopic.orbitNum}</span>
            <span className={styles.orbitalBadgeSep}>//</span>
            <span className={styles.orbitalBadgeAu}>{hoveredTopic.distanceAu}</span>
          </div>
          <div className={styles.orbitalBadgeTitle}>{hoveredTopic.name}</div>
          <div className={styles.orbitalBadgeMeta}>
            <span>VELOCITY: {hoveredTopic.velocity}</span>
            <span className={styles.orbitalBadgeDot}>•</span>
            <span>VERIFIED SPECS</span>
          </div>
        </div>
      )}
    </div>
  );
};
