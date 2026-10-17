import React, { useEffect, useRef, useState, useMemo } from 'react';
import * as THREE from 'three';
import { TOPICS } from '../../data/topics';
import styles from '../../styles/about.module.css';

interface OrbitBody {
  topicSlug: string;
  topicName: string;
  semiMajor: number;
  semiMinor: number;
  speed: number;
  inclination: number;
  phase: number;
  currentAngle: number;
  mesh?: THREE.Mesh;
  glowMesh?: THREE.Mesh;
  trailPoints: THREE.Vector3[];
  trailLine?: THREE.Line;
  pos2D: { x: number; y: number; visible: boolean };
}

export const OrbitalSystem: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredTopic, setHoveredTopic] = useState<{ name: string; x: number; y: number } | null>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Configure the 8 orbital bodies corresponding to the 8 topics
  const initialBodies = useMemo<OrbitBody[]>(() => {
    // Semi-major radii spaced from 4.2 to 14.5
    const baseRadii = [4.2, 5.6, 7.1, 8.6, 10.1, 11.6, 13.1, 14.6];
    const baseSpeeds = [0.85, 0.65, 0.52, 0.42, 0.35, 0.28, 0.22, 0.18];
    const inclinations = [0.06, -0.09, 0.12, -0.07, 0.14, -0.11, 0.08, -0.05];
    const phases = [0.2, 1.8, 3.4, 4.9, 0.9, 2.7, 4.1, 5.6];

    return TOPICS.map((topic, i) => {
      const a = baseRadii[i] || (4 + i * 1.4);
      const e = 0.12 + (i % 3) * 0.04; // subtle elliptical eccentricity
      const b = a * Math.sqrt(1 - e * e);

      return {
        topicSlug: topic.slug,
        topicName: topic.name,
        semiMajor: a,
        semiMinor: b,
        speed: baseSpeeds[i] || (0.7 / (i + 1)),
        inclination: inclinations[i] || 0.05,
        phase: phases[i] || i * 0.8,
        currentAngle: phases[i] || i * 0.8,
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
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, -6, 26);
    camera.lookAt(0, 0, 0);

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

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0c0d, 1);
    container.appendChild(renderer.domElement);

    // Root orbital system group for mouse and scroll tilt
    const orbitalGroup = new THREE.Group();
    scene.add(orbitalGroup);

    // -------------------------------------------------------------------------
    // 1. Central Luminous Core ("The Three Questions / Mechanism")
    // -------------------------------------------------------------------------
    const coreGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    orbitalGroup.add(coreMesh);

    // Core ambient glow sprite/halo
    const coreHaloGeo = new THREE.SphereGeometry(0.9, 16, 16);
    const coreHaloMat = new THREE.MeshBasicMaterial({
      color: 0xEDE9E3,
      transparent: true,
      opacity: 0.15,
      wireframe: true,
    });
    const coreHaloMesh = new THREE.Mesh(coreHaloGeo, coreHaloMat);
    orbitalGroup.add(coreHaloMesh);

    // -------------------------------------------------------------------------
    // 2. Eight Elliptical Orbital Traces & Orbiting Bodies
    // -------------------------------------------------------------------------
    const SEGMENTS = 120;
    const bodies = [...initialBodies];
    const traceGeometries: THREE.BufferGeometry[] = [];
    const baseTraceVertices: Float32Array[] = [];

    bodies.forEach((body) => {
      // Build Ellipse LineLoop
      const points: THREE.Vector3[] = [];
      const vArray = new Float32Array((SEGMENTS + 1) * 3);

      for (let s = 0; s <= SEGMENTS; s++) {
        const theta = (s / SEGMENTS) * Math.PI * 2;
        const x = body.semiMajor * Math.cos(theta);
        const y = body.semiMinor * Math.sin(theta);
        const z = Math.sin(theta) * body.inclination * 2.5;
        points.push(new THREE.Vector3(x, y, z));
        vArray[s * 3] = x;
        vArray[s * 3 + 1] = y;
        vArray[s * 3 + 2] = z;
      }

      baseTraceVertices.push(vArray);

      const traceGeo = new THREE.BufferGeometry().setFromPoints(points);
      traceGeometries.push(traceGeo);

      const traceMat = new THREE.LineBasicMaterial({
        color: 0xEDE9E3,
        transparent: true,
        opacity: 0.05,
        blending: THREE.AdditiveBlending,
      });

      const traceLine = new THREE.LineLoop(traceGeo, traceMat);
      orbitalGroup.add(traceLine);

      // Orbital Body Sphere
      const bodyGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const bodyMat = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });
      const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
      orbitalGroup.add(bodyMesh);
      body.mesh = bodyMesh;

      // Body subtle glow halo
      const glowGeo = new THREE.SphereGeometry(0.38, 12, 12);
      const glowMat = new THREE.MeshBasicMaterial({
        color: 0xEDE9E3,
        transparent: true,
        opacity: 0.22,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      orbitalGroup.add(glowMesh);
      body.glowMesh = glowMesh;

      // Trail Line (stores trailing 35 points)
      const MAX_TRAIL = 35;
      const trailPositions = new Float32Array(MAX_TRAIL * 3);
      const trailGeo = new THREE.BufferGeometry();
      trailGeo.setAttribute('position', new THREE.BufferAttribute(trailPositions, 3));

      const trailMat = new THREE.LineBasicMaterial({
        color: 0xEDE9E3,
        transparent: true,
        opacity: 0.16,
        blending: THREE.AdditiveBlending,
      });

      const trailLine = new THREE.Line(trailGeo, trailMat);
      orbitalGroup.add(trailLine);
      body.trailLine = trailLine;
    });

    // -------------------------------------------------------------------------
    // 3. Mouse & Gravitational Perturbation Physics
    // -------------------------------------------------------------------------
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let isMouseInView = false;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      targetMouseX = (clientX / width) * 2 - 1;
      targetMouseY = -(clientY / height) * 2 + 1;
      isMouseInView = clientX >= 0 && clientX <= width && clientY >= 0 && clientY <= height;

      // Check proximity for body hover labels
      let foundHover: { name: string; x: number; y: number } | null = null;
      for (const body of bodies) {
        if (!body.pos2D.visible) continue;
        const dx = clientX - body.pos2D.x;
        const dy = clientY - body.pos2D.y;
        if (Math.hypot(dx, dy) < 28) {
          foundHover = {
            name: body.topicName,
            x: body.pos2D.x,
            y: body.pos2D.y,
          };
          break;
        }
      }
      setHoveredTopic(foundHover);
    };

    const handleMouseLeave = () => {
      isMouseInView = false;
      targetMouseX = 0;
      targetMouseY = 0;
      setHoveredTopic(null);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave);

    // -------------------------------------------------------------------------
    // 4. Scroll Reaction: Tilt from Face-on to Edge-on & Fade
    // -------------------------------------------------------------------------
    let scrollProgress = 0;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const heroHeight = container.clientHeight || 750;
      scrollProgress = Math.min(Math.max(scrollY / heroHeight, 0), 1);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // -------------------------------------------------------------------------
    // 5. Animation Loop
    // -------------------------------------------------------------------------
    let lastTime = performance.now();
    let animId: number;

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const now = performance.now();
      const delta = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Smooth mouse damping
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Orbit tilt response to scroll: from 0.1 rad (face-on) to 1.3 rad (edge-on)
      const baseTiltX = prefersReducedMotion ? 0.3 : 0.2 + scrollProgress * 1.1;
      const baseRotY = mouseX * 0.18;
      const baseRotX = baseTiltX + mouseY * 0.12;

      orbitalGroup.rotation.x += (baseRotX - orbitalGroup.rotation.x) * 0.06;
      orbitalGroup.rotation.y += (baseRotY - orbitalGroup.rotation.y) * 0.06;
      orbitalGroup.rotation.z = Math.sin(now * 0.0003) * 0.04;

      // Fade system opacity slightly on deep scroll
      const systemOpacity = Math.max(1 - scrollProgress * 1.15, 0);
      container.style.opacity = `${systemOpacity}`;

      // Central core subtle pulse
      const pulse = 1 + Math.sin(now * 0.003) * 0.08;
      coreMesh.scale.set(pulse, pulse, pulse);
      coreHaloMesh.rotation.y += 0.002;
      coreHaloMesh.rotation.x += 0.001;

      // Update each orbital body
      bodies.forEach((body, idx) => {
        // Gravitational perturbation if mouse is nearby
        let currentSpeed = body.speed;
        if (isMouseInView && !prefersReducedMotion) {
          const bodyScreenDist = Math.hypot(
            (body.pos2D.x / width) * 2 - 1 - mouseX,
            -(body.pos2D.y / height) * 2 + 1 - mouseY
          );
          if (bodyScreenDist < 0.45) {
            // Speed up or slow down based on proximity
            currentSpeed *= 1 + (0.45 - bodyScreenDist) * 1.5;
          }
        }

        if (!prefersReducedMotion) {
          body.currentAngle += currentSpeed * delta * 0.5;
        }

        const theta = body.currentAngle;
        const x = body.semiMajor * Math.cos(theta);
        const y = body.semiMinor * Math.sin(theta);
        const z = Math.sin(theta) * body.inclination * 2.5;

        // Position body
        if (body.mesh) {
          body.mesh.position.set(x, y, z);
        }
        if (body.glowMesh) {
          body.glowMesh.position.set(x, y, z);
        }

        // Project 3D to 2D screen coordinate for tooltip
        const tempVec = new THREE.Vector3(x, y, z);
        tempVec.applyMatrix4(orbitalGroup.matrixWorld);
        tempVec.project(camera);

        const sx = ((tempVec.x + 1) * width) / 2;
        const sy = ((-tempVec.y + 1) * height) / 2;
        body.pos2D = {
          x: sx,
          y: sy,
          visible: tempVec.z < 1 && systemOpacity > 0.2,
        };

        // Update trail
        if (body.trailLine && !prefersReducedMotion) {
          body.trailPoints.unshift(new THREE.Vector3(x, y, z));
          if (body.trailPoints.length > 35) {
            body.trailPoints.pop();
          }

          const posAttr = body.trailLine.geometry.attributes.position as THREE.BufferAttribute;
          const array = posAttr.array as Float32Array;

          for (let p = 0; p < 35; p++) {
            const pt = body.trailPoints[p] || body.trailPoints[body.trailPoints.length - 1] || new THREE.Vector3(x, y, z);
            array[p * 3] = pt.x;
            array[p * 3 + 1] = pt.y;
            array[p * 3 + 2] = pt.z;
          }
          posAttr.needsUpdate = true;
        }

        // Gravitational wobble on the orbital trace
        if (isMouseInView && !prefersReducedMotion && traceGeometries[idx]) {
          const geo = traceGeometries[idx];
          const posAttr = geo.attributes.position as THREE.BufferAttribute;
          const baseArr = baseTraceVertices[idx];
          const currArr = posAttr.array as Float32Array;

          for (let s = 0; s <= SEGMENTS; s++) {
            const bx = baseArr[s * 3];
            const by = baseArr[s * 3 + 1];
            const bz = baseArr[s * 3 + 2];

            // Wave disturbance
            const wobble = Math.sin(s * 0.3 + now * 0.003) * 0.06 * (1 - Math.min(Math.hypot(mouseX, mouseY), 1));
            currArr[s * 3] = bx + wobble * 0.4;
            currArr[s * 3 + 1] = by + wobble * 0.4;
            currArr[s * 3 + 2] = bz + wobble * 0.2;
          }
          posAttr.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    // -------------------------------------------------------------------------
    // 6. Resize Observer
    // -------------------------------------------------------------------------
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 750;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement.parentElement) {
        renderer.domElement.parentElement.removeChild(renderer.domElement);
      }
    };
  }, [initialBodies, prefersReducedMotion]);

  return (
    <div className={styles.orbitalCanvasWrapper} ref={containerRef}>
      {/* Floating Hover Label for Orbiting Bodies */}
      {hoveredTopic && (
        <div
          className={styles.orbitalHoverBadge}
          style={{
            left: `${hoveredTopic.x}px`,
            top: `${hoveredTopic.y}px`,
          }}
        >
          <span className={styles.orbitalBadgeDot} />
          <span>{hoveredTopic.name}</span>
        </div>
      )}
    </div>
  );
};
