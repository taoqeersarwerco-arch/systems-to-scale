import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface ConstellationNode {
  id: string;
  name: string;
  anchor: THREE.Vector3;
  current: THREE.Vector3;
  velocity: THREE.Vector3;
}

// 8 nodes matching the 8 core disciplines
const TOPIC_NODES_CONFIG = [
  { id: 'ai-automation', name: 'AI & Automation', pos: [-4.6, 2.4, 0.2] },
  { id: 'e-commerce', name: 'E-commerce', pos: [-3.2, -2.4, 0.8] },
  { id: 'marketing-ads', name: 'Marketing & Ads', pos: [3.8, -2.6, -0.6] },
  { id: 'web-design', name: 'Web Design', pos: [4.8, 1.6, 0.4] },
  { id: 'customer-service', name: 'Customer Service', pos: [-1.4, 4.2, -0.8] },
  { id: 'virtual-assistance', name: 'Virtual Assistance', pos: [2.2, 3.8, 0.9] },
  { id: 'personal-assistance', name: 'Personal Assistance', pos: [0.2, -4.2, 0.3] },
  { id: 'pitch-decks', name: 'Pitch Decks', pos: [4.4, -0.4, -1.2] }
];

// Meaningful cross-discipline architectural relationships
const CONNECTIONS: [number, number][] = [
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

export const ConstellationMesh: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    motionQuery.addEventListener('change', handler);
    return () => motionQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    // Pure architectural dark background
    scene.background = new THREE.Color('#0E1112');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 16);

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

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Setup 8 Nodes
    const isMobile = width < 760;
    const scaleFactor = isMobile ? 0.75 : 1.0;

    const nodes: ConstellationNode[] = TOPIC_NODES_CONFIG.map((cfg) => {
      const anchor = new THREE.Vector3(
        cfg.pos[0] * scaleFactor,
        cfg.pos[1] * scaleFactor,
        cfg.pos[2] * scaleFactor
      );
      return {
        id: cfg.id,
        name: cfg.name,
        anchor: anchor.clone(),
        current: anchor.clone(),
        velocity: new THREE.Vector3()
      };
    });

    // Create glowing node meshes
    const nodeGroup = new THREE.Group();
    scene.add(nodeGroup);

    const brassColor = new THREE.Color('#C9974A');
    const steelColor = new THREE.Color('#7FA8B8');

    // Soft radial glow texture
    const createGlowTexture = () => {
      const cvs = document.createElement('canvas');
      cvs.width = 64;
      cvs.height = 64;
      const ctx = cvs.getContext('2d');
      if (ctx) {
        const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
        grad.addColorStop(0, 'rgba(201, 151, 74, 1)');
        grad.addColorStop(0.3, 'rgba(201, 151, 74, 0.55)');
        grad.addColorStop(0.7, 'rgba(201, 151, 74, 0.12)');
        grad.addColorStop(1, 'rgba(201, 151, 74, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 64, 64);
      }
      const texture = new THREE.CanvasTexture(cvs);
      return texture;
    };

    const glowTexture = createGlowTexture();
    const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
    const sphereMat = new THREE.MeshBasicMaterial({ color: brassColor });
    const spriteMat = new THREE.SpriteMaterial({
      map: glowTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      opacity: 0.75
    });

    const nodeMeshes: THREE.Mesh[] = [];
    const glowSprites: THREE.Sprite[] = [];

    nodes.forEach((node) => {
      const mesh = new THREE.Mesh(sphereGeo, sphereMat);
      mesh.position.copy(node.current);
      nodeGroup.add(mesh);
      nodeMeshes.push(mesh);

      const sprite = new THREE.Sprite(spriteMat);
      sprite.position.copy(node.current);
      sprite.scale.set(1.4, 1.4, 1.4);
      nodeGroup.add(sprite);
      glowSprites.push(sprite);
    });

    // Connection lines
    // On small screens, draw fewer cross-links to keep topology clean
    const activeConnections = isMobile ? CONNECTIONS.slice(0, 7) : CONNECTIONS;
    const lineCount = activeConnections.length;

    const linePositions = new Float32Array(lineCount * 6);
    const lineColors = new Float32Array(lineCount * 6);

    for (let i = 0; i < lineCount; i++) {
      // Initialize steel color with base opacity
      for (let j = 0; j < 2; j++) {
        const offset = i * 6 + j * 3;
        lineColors[offset] = steelColor.r * 0.35;
        lineColors[offset + 1] = steelColor.g * 0.35;
        lineColors[offset + 2] = steelColor.b * 0.35;
      }
    }

    const lineGeo = new THREE.BufferGeometry();
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeo.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));

    const lineMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      blending: THREE.AdditiveBlending
    });

    const lineSegments = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(lineSegments);

    // Mouse coordinates in NDC & 3D world space
    const mouseScreen = new THREE.Vector2(-9999, -9999);
    const mouseWorld = new THREE.Vector3(0, 0, 0);
    const raycaster = new THREE.Raycaster();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      mouseScreen.set(e.clientX - rect.left, e.clientY - rect.top);

      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
      raycaster.ray.intersectPlane(planeZ, mouseWorld);
    };

    const onPointerLeave = () => {
      mouseScreen.set(-9999, -9999);
      mouseWorld.set(9999, 9999, 0);
    };

    container.addEventListener('mousemove', onPointerMove, { passive: true });
    container.addEventListener('mouseleave', onPointerLeave, { passive: true });

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsed = clock.getElapsedTime();

      const positions = lineGeo.attributes.position.array as Float32Array;
      const colors = lineGeo.attributes.color.array as Float32Array;

      // Update node physics & mouse interaction
      nodes.forEach((node, idx) => {
        if (!reducedMotion) {
          // Floating gentle organic drift
          const driftX = Math.sin(elapsed * 0.4 + idx * 1.5) * 0.12;
          const driftY = Math.cos(elapsed * 0.35 + idx * 1.2) * 0.12;
          const target = node.anchor.clone().add(new THREE.Vector3(driftX, driftY, 0));

          // Calculate cursor proximity in world space
          const distToCursor = target.distanceTo(mouseWorld);
          const maxProximity = 4.2; // approx 120px screen distance equivalent

          if (distToCursor < maxProximity) {
            // Gravitate subtly toward cursor
            const pullFactor = (1 - distToCursor / maxProximity) * 0.45;
            const pullVec = new THREE.Vector3().subVectors(mouseWorld, target).multiplyScalar(pullFactor);
            target.add(pullVec);

            // Brighten node glow
            glowSprites[idx].scale.set(1.8, 1.8, 1.8);
            glowSprites[idx].material.opacity = 0.95;
          } else {
            glowSprites[idx].scale.set(1.4, 1.4, 1.4);
            glowSprites[idx].material.opacity = 0.75;
          }

          // Damped spring interpolation toward target
          node.current.lerp(target, 0.08);
        } else {
          // Static constellation in reduced motion
          node.current.copy(node.anchor);
        }

        // Apply updated position to meshes
        nodeMeshes[idx].position.copy(node.current);
        glowSprites[idx].position.copy(node.current);
      });

      // Update connection lines
      for (let i = 0; i < lineCount; i++) {
        const [aIdx, bIdx] = activeConnections[i];
        const posA = nodes[aIdx].current;
        const posB = nodes[bIdx].current;

        const basePos = i * 6;
        positions[basePos] = posA.x;
        positions[basePos + 1] = posA.y;
        positions[basePos + 2] = posA.z;
        positions[basePos + 3] = posB.x;
        positions[basePos + 4] = posB.y;
        positions[basePos + 5] = posB.z;

        // Check if cursor is near this line segment
        const midPoint = new THREE.Vector3().addVectors(posA, posB).multiplyScalar(0.5);
        const distToMid = midPoint.distanceTo(mouseWorld);
        const isNear = !reducedMotion && distToMid < 3.5;

        const alpha = isNear ? 0.95 : (reducedMotion ? 0.5 : 0.28);

        for (let j = 0; j < 2; j++) {
          const colOffset = i * 6 + j * 3;
          colors[colOffset] = steelColor.r * alpha;
          colors[colOffset + 1] = steelColor.g * alpha;
          colors[colOffset + 2] = steelColor.b * alpha;
        }
      }

      lineGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.color.needsUpdate = true;

      // Subtle slow rotation of constellation camera
      if (!reducedMotion) {
        camera.position.x = Math.sin(elapsed * 0.08) * 0.5;
        camera.position.y = Math.cos(elapsed * 0.06) * 0.3;
        camera.lookAt(0, 0, 0);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('resize', handleResize);

      sphereGeo.dispose();
      sphereMat.dispose();
      glowTexture.dispose();
      spriteMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [reducedMotion]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }} />;
};
