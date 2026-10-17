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
  hasRings?: boolean;
  hasMoon?: boolean;
  colorHex: number;
  mesh?: THREE.Mesh;
  glowMesh?: THREE.Mesh;
  ringMesh?: THREE.Mesh;
  moonMesh?: THREE.Mesh;
  moonAngle?: number;
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
    const baseSpeeds = [1.15, 0.92, 0.76, 0.62, 0.51, 0.42, 0.34, 0.28];
    const inclinations = [0.08, -0.11, 0.14, -0.09, 0.16, -0.13, 0.10, -0.06];
    const eccentricities = [0.14, 0.11, 0.18, 0.09, 0.21, 0.12, 0.16, 0.08];
    const phases = [0.4, 2.1, 3.8, 5.2, 1.2, 2.9, 4.4, 5.9];
    const colors = [
      0xFFFFFF, // AI & Automation (Brilliant White)
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
        speed: baseSpeeds[i] || 0.5,
        inclination: inclinations[i] || 0.08,
        eccentricity: e,
        phase: phases[i] || i * 0.8,
        currentAngle: phases[i] || i * 0.8,
        hasRings: i === 2, // Database Engines has planetary ring
        hasMoon: i === 0 || i === 3 || i === 6, // AI, Distributed Systems, Security have micro-satellites
        colorHex: colors[i] || 0xFFFFFF,
        moonAngle: (i * 1.4),
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

    // Deep-space perspective vantage point
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, -5.5, 29);
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
    // Master group tilted at authentic celestial angle (~44 deg)
    const orbitalGroup = new THREE.Group();
    orbitalGroup.position.set(0, 0.8, 0);
    orbitalGroup.rotation.x = Math.PI * 0.24; // ~44 deg inclination
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
    // 1. PINPOINT AIRY-DISK COSMIC PARTICLES WITH REAL-TIME GPU DISTORTION
    // -------------------------------------------------------------------------
    const starCount = 3600;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(starCount * 3);
    const starColors = new Float32Array(starCount * 3);
    const starSizes = new Float32Array(starCount);
    const starAlphas = new Float32Array(starCount);
    const starTwinkles = new Float32Array(starCount);

    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      // Multi-layer deep space dispersion
      const rad = 3.5 + Math.pow(Math.random(), 1.6) * 32.0;
      const theta = Math.random() * Math.PI * 2;
      const zSpread = (Math.random() - 0.5) * 16.0;

      starPositions[i3] = Math.cos(theta) * rad;
      starPositions[i3 + 1] = Math.sin(theta) * rad;
      starPositions[i3 + 2] = zSpread;

      // Color variation: bone, white, platinum
      const tint = Math.random();
      if (tint > 0.8) {
        starColors[i3] = 1.0;
        starColors[i3 + 1] = 1.0;
        starColors[i3 + 2] = 1.0;
        starSizes[i] = 0.95 + Math.random() * 0.55;
        starAlphas[i] = 0.75 + Math.random() * 0.25;
      } else if (tint > 0.35) {
        starColors[i3] = 0.92;
        starColors[i3 + 1] = 0.94;
        starColors[i3 + 2] = 0.98;
        starSizes[i] = 0.55 + Math.random() * 0.4;
        starAlphas[i] = 0.4 + Math.random() * 0.3;
      } else {
        starColors[i3] = 0.65;
        starColors[i3 + 1] = 0.70;
        starColors[i3 + 2] = 0.75;
        starSizes[i] = 0.35 + Math.random() * 0.3;
        starAlphas[i] = 0.2 + Math.random() * 0.2;
      }

      starTwinkles[i] = Math.random();
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('color', new THREE.BufferAttribute(starColors, 3));
    starGeo.setAttribute('aSize', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('aAlpha', new THREE.BufferAttribute(starAlphas, 1));
    starGeo.setAttribute('aTwinkle', new THREE.BufferAttribute(starTwinkles, 1));

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

        // Cursor Gravitational Wave & Vortex Distortion
        if (uMouseActive > 0.5) {
          vec2 diff = ndcPos - uMouse;
          diff.x *= uAspect;
          float dist = length(diff);
          float radius = 0.48;

          if (dist < radius && dist > 0.001) {
            float factor = (1.0 - dist / radius);
            float smoothFactor = smoothstep(0.0, 1.0, factor);

            vec2 normDiff = normalize(diff);
            vec2 tangent = vec2(-normDiff.y, normDiff.x);
            vec2 velInfluence = uMouseVel * 0.015;

            vec2 warp = (normDiff * 0.22 + tangent * 0.14 + velInfluence) * smoothFactor * smoothFactor;
            warp.x /= uAspect;

            clipPos.xy += warp * clipPos.w;
            vAlpha = min(1.0, vAlpha + smoothFactor * 0.65);
          }
        }

        gl_Position = clipPos;
        gl_PointSize = max(1.0, aSize * (200.0 / -mvPosition.z) * uPixelRatio);
      }
    `;

    const starFragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Pinpoint Airy-disk diffraction core + soft halo
        float core = exp(-dist * 16.0);
        float halo = exp(-dist * 4.0) * 0.35;
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
    // 2. MULTI-LAYER CENTRAL STELLAR MECHANISM (The System Singularity)
    // -------------------------------------------------------------------------
    const coreGroup = new THREE.Group();
    orbitalGroup.add(coreGroup);

    // Central white nucleus
    const coreGeo = new THREE.SphereGeometry(0.38, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Breathing inner corona sphere
    const coronaGeo = new THREE.SphereGeometry(0.85, 24, 24);
    const coronaMat = new THREE.MeshBasicMaterial({
      color: 0xF1F5F9,
      transparent: true,
      opacity: 0.18,
      wireframe: true,
    });
    const coronaMesh = new THREE.Mesh(coronaGeo, coronaMat);
    coreGroup.add(coronaMesh);

    // Gravitational accretion ring around central core
    const accretionGeo = new THREE.RingGeometry(1.2, 1.45, 64);
    const accretionMat = new THREE.MeshBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.12,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
    });
    const accretionMesh = new THREE.Mesh(accretionGeo, accretionMat);
    accretionMesh.rotation.x = Math.PI * 0.5;
    coreGroup.add(accretionMesh);

    // Radiating solar prominence reticle line
    const reticleGeo = new THREE.BufferGeometry();
    const reticlePts: THREE.Vector3[] = [];
    const reticleSegments = 32;
    for (let r = 0; r < reticleSegments; r++) {
      const angle = (r / reticleSegments) * Math.PI * 2;
      reticlePts.push(new THREE.Vector3(0, 0, 0));
      reticlePts.push(new THREE.Vector3(Math.cos(angle) * 1.8, Math.sin(angle) * 1.8, 0));
    }
    reticleGeo.setFromPoints(reticlePts);
    const reticleMat = new THREE.LineBasicMaterial({
      color: 0xFFFFFF,
      transparent: true,
      opacity: 0.06,
      blending: THREE.AdditiveBlending
    });
    const reticleLines = new THREE.LineSegments(reticleGeo, reticleMat);
    coreGroup.add(reticleLines);

    // -------------------------------------------------------------------------
    // 3. EIGHT KEPLERIAN ORBITAL TRACES & ALIVE CELESTIAL BODIES
    // -------------------------------------------------------------------------
    const SEGMENTS = 140;
    const bodies = [...initialBodies];
    const traceGeometries: THREE.BufferGeometry[] = [];
    const baseTraceVertices: Float32Array[] = [];

    // Photon packets travelling through orbit paths
    const photonCount = 16;
    const photonPositions = new Float32Array(photonCount * 3);
    const photonAlphas = new Float32Array(photonCount);
    const photonBodyIndex = new Uint8Array(photonCount);
    const photonAngles = new Float32Array(photonCount);

    for (let p = 0; p < photonCount; p++) {
      photonBodyIndex[p] = p % 8;
      photonAngles[p] = (p / photonCount) * Math.PI * 2;
      photonAlphas[p] = 0.8;
    }

    const photonGeo = new THREE.BufferGeometry();
    photonGeo.setAttribute('position', new THREE.BufferAttribute(photonPositions, 3));
    const photonMat = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 3.5,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const photonPoints = new THREE.Points(photonGeo, photonMat);
    orbitalGroup.add(photonPoints);

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
        const z = Math.sin(theta) * body.inclination * 3.2;

        points.push(new THREE.Vector3(x, y, z));
        vArray[s * 3] = x;
        vArray[s * 3 + 1] = y;
        vArray[s * 3 + 2] = z;
      }

      baseTraceVertices.push(vArray);

      const traceGeo = new THREE.BufferGeometry().setFromPoints(points);
      traceGeometries.push(traceGeo);

      // Subtle high-tech luminous trace
      const traceMat = new THREE.LineBasicMaterial({
        color: 0xEDE9E3,
        transparent: true,
        opacity: 0.08 + (idx % 2) * 0.03,
        blending: THREE.AdditiveBlending,
      });

      const traceLine = new THREE.LineLoop(traceGeo, traceMat);
      orbitalGroup.add(traceLine);

      // Main Celestial Body Sphere
      const bodyRadius = 0.22 + (idx % 3) * 0.04;
      const bodyGeo = new THREE.SphereGeometry(bodyRadius, 24, 24);
      const bodyMat = new THREE.MeshBasicMaterial({ color: body.colorHex });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      orbitalGroup.add(bodyMesh);
      body.mesh = bodyMesh;

      // Atmospheric Glow Halo
      const glowGeo = new THREE.SphereGeometry(bodyRadius * 2.2, 16, 16);
      const glowMat = new THREE.MeshBasicMaterial({
        color: body.colorHex,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      orbitalGroup.add(glowMesh);
      body.glowMesh = glowMesh;

      // Special: Planetary Ring for Body 2 (Database Engines)
      if (body.hasRings) {
        const ringGeo = new THREE.RingGeometry(bodyRadius * 2.2, bodyRadius * 3.6, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xFFFFFF,
          transparent: true,
          opacity: 0.28,
          side: THREE.DoubleSide,
          blending: THREE.AdditiveBlending,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.rotation.x = Math.PI * 0.35;
        orbitalGroup.add(ringMesh);
        body.ringMesh = ringMesh;
      }

      // Special: Orbiting Micro-Satellite Moon for Bodies 0, 3, 6
      if (body.hasMoon) {
        const moonGeo = new THREE.SphereGeometry(0.07, 12, 12);
        const moonMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
        const moonMesh = new THREE.Mesh(moonGeo, moonMat);
        orbitalGroup.add(moonMesh);
        body.moonMesh = moonMesh;
      }

      // Luminous Graded Cometary Ribbon Trail (45 points)
      const MAX_TRAIL = 45;
      const trailPositions = new Float32Array(MAX_TRAIL * 3);
      const trailColors = new Float32Array(MAX_TRAIL * 3);

      for (let p = 0; p < MAX_TRAIL; p++) {
        const alpha = Math.pow(1 - p / MAX_TRAIL, 2.0) * 0.32;
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
        if (Math.hypot(dx, dy) < 32) {
          foundHover = {
            name: body.topicName,
            orbitNum: i + 1,
            distanceAu: `${body.semiMajor.toFixed(1)} AU`,
            velocity: `${(38 / Math.sqrt(body.semiMajor)).toFixed(1)} km/s`,
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
    // 5. SCROLL LISTENER: COMPRESSION TILT & TRANSLATION
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
    // 6. 60 FPS RENDER LOOP WITH KEPLERIAN DYNAMICS & SHADER UNIFORMS
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const delta = Math.min(clock.getDelta(), 0.05);

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.04;
      currentMouseY += (targetMouseY - currentMouseY) * 0.04;
      mouseVel.multiplyScalar(0.92);

      // Update cosmic dust shaders
      starMaterial.uniforms.uTime.value = elapsedTime;
      starMaterial.uniforms.uMouse.value.copy(mouseNDC);
      starMaterial.uniforms.uMouseVel.value.copy(mouseVel);
      starMaterial.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;

      // Scroll response: Tilt from face-on (0.24 rad) to edge-on (1.28 rad) & translate camera
      const scrollRatio = Math.min(scrollY / (height || 750), 1.0);
      const tiltAngle = (Math.PI * 0.24) + scrollRatio * 0.65;
      orbitalGroup.rotation.x = tiltAngle + currentMouseY * 0.12;
      orbitalGroup.rotation.y = -Math.PI * 0.05 + currentMouseX * 0.18;
      orbitalGroup.rotation.z = Math.PI * 0.04 + Math.sin(elapsedTime * 0.2) * 0.03;

      camera.position.z = 29 + scrollRatio * 4.0;
      camera.position.y = -5.5 + scrollRatio * 2.5;

      // Fade canvas out smoothly as user scrolls past hero
      const fadeOpacity = Math.max(1.0 - scrollRatio * 1.3, 0.0);
      container.style.opacity = `${fadeOpacity}`;

      // Central core breathing & corona rotation
      const breath = 1.0 + Math.sin(elapsedTime * 2.2) * 0.06;
      coreMesh.scale.set(breath, breath, breath);
      coronaMesh.rotation.y += 0.003;
      coronaMesh.rotation.z += 0.002;
      accretionMesh.rotation.z -= 0.004;
      reticleLines.rotation.z += 0.001;

      // -----------------------------------------------------------------------
      // Update Keplerian Bodies & Interactive Gravitational Pull
      // -----------------------------------------------------------------------
      bodies.forEach((body, idx) => {
        // Keplerian velocity approximation: v = v0 * sqrt(2*a/r - 1)
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
          if (bodyScreenDist < 0.42) {
            dynamicSpeed *= 1.0 + (0.42 - bodyScreenDist) * 2.2;
          }
        }

        if (!prefersReducedMotion) {
          body.currentAngle += dynamicSpeed * delta * 0.45;
        }

        const r = (body.semiMajor * (1 - body.eccentricity * body.eccentricity)) /
                  (1 + body.eccentricity * Math.cos(body.currentAngle));
        const x = r * Math.cos(body.currentAngle);
        const y = r * Math.sin(body.currentAngle);
        const z = Math.sin(body.currentAngle) * body.inclination * 3.2;

        // Position Main Body
        if (body.mesh) {
          body.mesh.position.set(x, y, z);
        }
        if (body.glowMesh) {
          body.glowMesh.position.set(x, y, z);
          const glowPulse = 1.0 + Math.sin(elapsedTime * 3.0 + idx) * 0.08;
          body.glowMesh.scale.set(glowPulse, glowPulse, glowPulse);
        }
        if (body.ringMesh) {
          body.ringMesh.position.set(x, y, z);
          body.ringMesh.rotation.z += 0.005;
        }

        // Position Micro-Satellite Moon
        if (body.moonMesh && body.moonAngle !== undefined) {
          body.moonAngle += delta * 3.5;
          const moonDist = 0.65;
          const mx = x + Math.cos(body.moonAngle) * moonDist;
          const my = y + Math.sin(body.moonAngle) * moonDist * 0.7;
          const mz = z + Math.sin(body.moonAngle) * 0.35;
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
          if (body.trailPoints.length > 45) {
            body.trailPoints.pop();
          }

          const posAttr = body.trailLine.geometry.attributes.position as THREE.BufferAttribute;
          const posArr = posAttr.array as Float32Array;

          for (let p = 0; p < 45; p++) {
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
            const ripple = Math.sin(elapsedTime * 4.0 + s * 0.2) * 0.05 * (isMouseActive ? 1 : 0);
            curArr[s * 3] = bx + ripple;
            curArr[s * 3 + 1] = by + ripple;
            curArr[s * 3 + 2] = bz;
          }
          posAttr.needsUpdate = true;
        }
      });

      // -----------------------------------------------------------------------
      // Update Orbit Photon Pulses
      // -----------------------------------------------------------------------
      const photonAttr = photonGeo.attributes.position as THREE.BufferAttribute;
      const pArr = photonAttr.array as Float32Array;

      for (let p = 0; p < photonCount; p++) {
        const bIdx = photonBodyIndex[p];
        const b = bodies[bIdx];
        if (!b) continue;

        photonAngles[p] += delta * (b.speed * 1.8);
        const thetaP = photonAngles[p];
        const rP = (b.semiMajor * (1 - b.eccentricity * b.eccentricity)) /
                   (1 + b.eccentricity * Math.cos(thetaP));

        const px = rP * Math.cos(thetaP);
        const py = rP * Math.sin(thetaP);
        const pz = Math.sin(thetaP) * b.inclination * 3.2;

        pArr[p * 3] = px;
        pArr[p * 3 + 1] = py;
        pArr[p * 3 + 2] = pz;
      }
      photonAttr.needsUpdate = true;

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
