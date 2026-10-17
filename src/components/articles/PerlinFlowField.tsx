import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const PerlinFlowField: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const motionHandler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', motionHandler);

    return () => {
      motionQuery.removeEventListener('change', motionHandler);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) return;
    const container = mountRef.current;
    if (!container) return;

    // -------------------------------------------------------------------------
    // Scene & Camera Setup
    // -------------------------------------------------------------------------
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 600;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x080808);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 22);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------------------
    // 14,000+ Luminous Flow Stream Particles
    // -------------------------------------------------------------------------
    const PARTICLE_COUNT = 14500;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const velocities = new Float32Array(PARTICLE_COUNT * 3);
    const baseSpeeds = new Float32Array(PARTICLE_COUNT);

    const BOUNDS_X = 24;
    const BOUNDS_Y = 14;
    const BOUNDS_Z = 10;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * BOUNDS_X * 2;
      positions[i3 + 1] = (Math.random() - 0.5) * BOUNDS_Y * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * BOUNDS_Z * 2;

      velocities[i3] = 0;
      velocities[i3 + 1] = 0;
      velocities[i3 + 2] = 0;

      // Multi-layer speed distribution
      const speedTier = Math.random();
      if (speedTier > 0.85) {
        // High speed foreground stream
        baseSpeeds[i] = 0.045 + Math.random() * 0.035;
        colors[i3] = 1.0;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 1.0;
      } else if (speedTier > 0.4) {
        // Mid-speed ambient stream
        baseSpeeds[i] = 0.025 + Math.random() * 0.02;
        colors[i3] = 0.68;
        colors[i3 + 1] = 0.72;
        colors[i3 + 2] = 0.75;
      } else {
        // Deep-space slow drifting particles
        baseSpeeds[i] = 0.012 + Math.random() * 0.01;
        colors[i3] = 0.35;
        colors[i3 + 1] = 0.38;
        colors[i3 + 2] = 0.42;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Particle texture for soft, glowing rounds without sharp square borders
    const createParticleTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 32;
      canvas.height = 32;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.7)');
      gradient.addColorStop(0.7, 'rgba(255, 255, 255, 0.15)');
      gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);

      const texture = new THREE.CanvasTexture(canvas);
      return texture;
    };

    const particleTexture = createParticleTexture();

    const material = new THREE.PointsMaterial({
      size: 0.18,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      map: particleTexture || undefined,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // -------------------------------------------------------------------------
    // Mouse Interaction & Deflection Well
    // -------------------------------------------------------------------------
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, worldX: 0, worldY: 0 };

    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouse.targetX = x;
      mouse.targetY = y;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });

    // -------------------------------------------------------------------------
    // Scroll Depth Camera Dynamics
    // -------------------------------------------------------------------------
    let currentScroll = 0;
    let targetScroll = 0;

    const onScroll = () => {
      targetScroll = window.scrollY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    // -------------------------------------------------------------------------
    // Resize Handler
    // -------------------------------------------------------------------------
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 600;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', onResize);

    // -------------------------------------------------------------------------
    // Visibility Observer to Pause Off-Screen Loops
    // -------------------------------------------------------------------------
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // -------------------------------------------------------------------------
    // Animation Loop: 3D Vector Flow Field Computation
    // -------------------------------------------------------------------------
    let animationId: number;
    let time = 0;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (!isVisible) return;

      time += 0.007;

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Project mouse to world coordinates at Z=0
      mouse.worldX = mouse.x * (camera.aspect * 12);
      mouse.worldY = mouse.y * 10;

      // Smooth scroll interpolation
      currentScroll += (targetScroll - currentScroll) * 0.06;
      camera.position.z = 22 + Math.min(currentScroll * 0.008, 14);
      camera.position.y = -Math.min(currentScroll * 0.004, 6);

      // Camera gentle pan response
      camera.position.x = mouse.x * 1.5;
      camera.rotation.y = -mouse.x * 0.04;
      camera.rotation.x = mouse.y * 0.03;

      const pos = geometry.attributes.position.array as Float32Array;

      // Vector flow field logic
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        let px = pos[i3];
        let py = pos[i3 + 1];
        let pz = pos[i3 + 2];
        const spd = baseSpeeds[i];

        // 3D vector angle calculation using harmonious harmonic trigonometry
        const theta = Math.sin(px * 0.08 + time * 0.8) * Math.cos(py * 0.09 + time * 0.6) * Math.PI * 2;
        const phi = Math.cos(pz * 0.12 + time * 0.4) * Math.PI;

        let vx = Math.cos(theta) * Math.sin(phi) * spd;
        let vy = Math.sin(theta) * Math.sin(phi) * spd;
        let vz = Math.cos(phi) * spd * 0.5;

        // Mouse deflection well
        const dx = px - mouse.worldX;
        const dy = py - mouse.worldY;
        const distSq = dx * dx + dy * dy;
        const maxDistSq = 36; // 6 units radius

        if (distSq < maxDistSq && distSq > 0.01) {
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 6) * 0.08;
          // Tangential swirl + subtle radial push
          vx += ((-dy / dist) * 0.06 + (dx / dist) * 0.03) * force * 15;
          vy += ((dx / dist) * 0.06 + (dy / dist) * 0.03) * force * 15;
        }

        // Apply velocities
        px += vx;
        py += vy;
        pz += vz;

        // Wrap around boundary limits seamlessly
        if (px > BOUNDS_X) px = -BOUNDS_X;
        if (px < -BOUNDS_X) px = BOUNDS_X;
        if (py > BOUNDS_Y) py = -BOUNDS_Y;
        if (py < -BOUNDS_Y) py = BOUNDS_Y;
        if (pz > BOUNDS_Z) pz = -BOUNDS_Z;
        if (pz < -BOUNDS_Z) pz = BOUNDS_Z;

        pos[i3] = px;
        pos[i3 + 1] = py;
        pos[i3 + 2] = pz;
      }

      geometry.attributes.position.needsUpdate = true;
      particleSystem.rotation.z = time * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // -------------------------------------------------------------------------
    // Cleanup
    // -------------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(animationId);
      observer.disconnect();
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      geometry.dispose();
      material.dispose();
      if (particleTexture) particleTexture.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: '#080808',
          backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 80%)'
        }}
      />
    );
  }

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none'
      }}
    />
  );
};
