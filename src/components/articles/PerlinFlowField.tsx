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
    // Scene & Perspective Camera Setup
    // -------------------------------------------------------------------------
    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 1400;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(54, width / height, 0.1, 100);
    camera.position.set(0, 0, 24);

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
    renderer.setClearColor(0x000000, 0); // Transparent so dark ground glows through
    container.appendChild(renderer.domElement);

    // -------------------------------------------------------------------------
    // Interaction Vectors (NDC, velocity momentum, parallax)
    // -------------------------------------------------------------------------
    const mouseNDC = new THREE.Vector2(0, 0);
    const mouseVel = new THREE.Vector2(0, 0);
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;
    let isMouseActive = false;
    let lastMouseTime = performance.now();
    let lastMouseX = 0;
    let lastMouseY = 0;

    // -------------------------------------------------------------------------
    // 16,000 Airy-Disk Particles with Extended Vertical Coverage
    // -------------------------------------------------------------------------
    const PARTICLE_COUNT = 16000;
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const alphas = new Float32Array(PARTICLE_COUNT);
    const speeds = new Float32Array(PARTICLE_COUNT);
    const phases = new Float32Array(PARTICLE_COUNT);

    const BOUNDS_X = 26;
    const BOUNDS_Y = 26;
    const BOUNDS_Z = 16;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * BOUNDS_X * 2;
      positions[i3 + 1] = (Math.random() - 0.45) * BOUNDS_Y * 2;
      positions[i3 + 2] = (Math.random() - 0.5) * BOUNDS_Z * 2;

      phases[i] = Math.random();

      // Multi-layer depth tiering (Prominent, vivid Airy-disk particles clearly visible behind title)
      const tier = Math.random();
      if (tier > 0.84) {
        // High-velocity foreground filament (brilliant crystalline streaming vectors)
        colors[i3] = 1.0;
        colors[i3 + 1] = 1.0;
        colors[i3 + 2] = 1.0;
        sizes[i] = 1.15 + Math.random() * 0.60;
        alphas[i] = 0.92 + Math.random() * 0.08;
        speeds[i] = 0.052 + Math.random() * 0.035;
      } else if (tier > 0.36) {
        // Mid-speed ambient stream (clear, glowing vector streamlines)
        colors[i3] = 0.88;
        colors[i3 + 1] = 0.92;
        colors[i3 + 2] = 0.98;
        sizes[i] = 0.75 + Math.random() * 0.40;
        alphas[i] = 0.65 + Math.random() * 0.22;
        speeds[i] = 0.028 + Math.random() * 0.020;
      } else {
        // Deep cosmic field (rich atmospheric depth)
        colors[i3] = 0.62;
        colors[i3 + 1] = 0.68;
        colors[i3 + 2] = 0.76;
        sizes[i] = 0.45 + Math.random() * 0.30;
        alphas[i] = 0.38 + Math.random() * 0.20;
        speeds[i] = 0.014 + Math.random() * 0.010;
      }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aAlpha', new THREE.BufferAttribute(alphas, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));

    // -------------------------------------------------------------------------
    // GPU Vertex & Fragment Shaders with Highly Prominent Distortion & Scroll
    // -------------------------------------------------------------------------
    const vertexShader = `
      attribute float aSize;
      attribute float aAlpha;
      attribute float aSpeed;
      attribute float aPhase;
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

        // Subtle organic luminous twinkle
        float twinkle = sin(uTime * 1.8 + aPhase * 6.28318) * 0.15 + 0.85;
        vAlpha = aAlpha * twinkle;

        vec3 pos = position;

        // Continuous seamless downward flow drift + scroll longitudinal warp
        pos.y = mod(pos.y - uTime * aSpeed * 2.2 - uScroll * 0.016 + 26.0, 52.0) - 26.0;

        // Fluid vector curl drift using harmonic trigonometry + scroll harmonic response
        float theta = sin(pos.x * 0.08 + uTime * 0.45) * cos(pos.y * 0.07 + uTime * 0.35) * 3.14159;
        float phi = cos(pos.z * 0.09 + uTime * 0.25) * 3.14159;

        pos.x += cos(theta) * sin(phi) * (1.3 + uScroll * 0.002);
        pos.z += cos(phi) * 0.85;

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        vec4 clipPos = projectionMatrix * mvPosition;
        vec2 ndcPos = clipPos.xy / clipPos.w;

        // HIGHLY PROMINENT cursor-following gravitational wave warp & vortex
        float pointScale = 1.0;
        if (uMouseActive > 0.5) {
          vec2 diff = ndcPos - uMouse;
          diff.x *= uAspect;
          float dist = length(diff);
          float radius = 0.68; // Expansive screen-space interaction radius

          if (dist < radius && dist > 0.001) {
            float factor = (1.0 - dist / radius);
            float smoothFactor = smoothstep(0.0, 1.0, factor);

            // Powerful fluid warp: radial repulsion + strong vortex swirl + momentum
            vec2 normDiff = normalize(diff);
            vec2 tangent = vec2(-normDiff.y, normDiff.x);
            vec2 velInfluence = uMouseVel * 0.024;

            vec2 warp = (normDiff * 0.45 + tangent * 0.30 + velInfluence) * smoothFactor * smoothFactor;
            warp.x /= uAspect;

            clipPos.xy += warp * clipPos.w;

            // Luminous ionization bloom & particle swell on hover
            vAlpha = min(1.0, vAlpha + smoothFactor * 0.85);
            pointScale = 1.0 + smoothFactor * 0.75;
          }
        }

        gl_Position = clipPos;
        gl_PointSize = max(1.0, aSize * pointScale * (200.0 / -mvPosition.z) * uPixelRatio);
      }
    `;

    const fragmentShader = `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;

        // Pinpoint Airy-disk stellar core + soft diffraction glow
        float core = exp(-dist * 16.0);
        float halo = exp(-dist * 4.0) * 0.38;
        float intensity = core + halo;

        gl_FragColor = vec4(vColor, vAlpha * intensity);
      }
    `;

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
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

    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    // -------------------------------------------------------------------------
    // Event Handlers
    // -------------------------------------------------------------------------
    const onMouseMove = (e: MouseEvent) => {
      const now = performance.now();
      const dt = Math.max(1, now - lastMouseTime) / 1000;
      lastMouseTime = now;

      const currentX = (e.clientX / window.innerWidth) * 2 - 1;
      const currentY = -(e.clientY / window.innerHeight) * 2 + 1;

      // Calculate velocity for natural momentum displacement
      mouseVel.x = (currentX - lastMouseX) / dt;
      mouseVel.y = (currentY - lastMouseY) / dt;
      mouseVel.clampLength(0, 8.0);

      lastMouseX = currentX;
      lastMouseY = currentY;

      mouseNDC.set(currentX, currentY);
      isMouseActive = true;

      // Subtle 3D parallax tilt targets
      targetMouseX = currentX * 0.12;
      targetMouseY = currentY * 0.08;
    };

    const onMouseLeave = () => {
      isMouseActive = false;
      targetMouseX = 0;
      targetMouseY = 0;
    };

    let targetScroll = 0;
    let currentScroll = 0;

    const onScroll = () => {
      targetScroll = window.scrollY;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('scroll', onScroll, { passive: true });

    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 1400;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);

      const pr = Math.min(window.devicePixelRatio, 2);
      renderer.setPixelRatio(pr);
      material.uniforms.uPixelRatio.value = pr;
      material.uniforms.uAspect.value = width / height;
    };

    window.addEventListener('resize', onResize);

    // -------------------------------------------------------------------------
    // Visibility Observer
    // -------------------------------------------------------------------------
    let isVisible = true;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.01 }
    );
    observer.observe(container);

    // -------------------------------------------------------------------------
    // Animation Loop: 3D Parallax, Vector Distortion & Scroll Pull-Back
    // -------------------------------------------------------------------------
    const clock = new THREE.Clock();
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      if (!isVisible) return;

      const elapsed = clock.getElapsedTime();

      // Pass interaction uniforms
      material.uniforms.uTime.value = elapsed;
      material.uniforms.uMouse.value.copy(mouseNDC);
      material.uniforms.uMouseVel.value.copy(mouseVel);
      material.uniforms.uMouseActive.value = isMouseActive ? 1.0 : 0.0;
      material.uniforms.uScroll.value = currentScroll;

      // Mouse momentum decay
      mouseVel.multiplyScalar(0.92);

      // Smooth 3D mouse parallax rotation
      currentMouseX += (targetMouseX - currentMouseX) * 0.035;
      currentMouseY += (targetMouseY - currentMouseY) * 0.035;
      scene.rotation.y = currentMouseX;
      scene.rotation.x = currentMouseY;

      // Dynamic deep-space scroll pull-back & longitudinal acceleration
      currentScroll += (targetScroll - currentScroll) * 0.075;
      camera.position.z = 24 + currentScroll * 0.012;
      camera.position.y = -currentScroll * 0.007;

      // Celestial organic drift with scroll responsiveness
      particleSystem.rotation.z = elapsed * 0.018 + currentScroll * 0.0003;

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
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);

      geometry.dispose();
      material.dispose();
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
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none'
      }}
    />
  );
};
