import React, { useEffect, useRef, useState } from 'react';

interface NodePoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
  disciplineIdx: number;
}

interface PhotonPacket {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
}

interface StarPoint {
  x: number;
  y: number;
  size: number;
  alpha: number;
  twinkleSpeed: number;
  phase: number;
}

export const ConstellationMesh: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: -1000, y: -1000, active: false });
  const isVisibleRef = useRef(true);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(motionQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    motionQuery.addEventListener('change', handler);
    return () => motionQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || 600);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || 600;
      initNetwork();
    };

    window.addEventListener('resize', handleResize);

    // Visibility Observer to pause off-screen canvas loops
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    }, { threshold: 0.05 });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    // Node & Star Arrays
    let nodes: NodePoint[] = [];
    let stars: StarPoint[] = [];
    let photons: PhotonPacket[] = [];

    const initNetwork = () => {
      nodes = [];
      stars = [];
      photons = [];

      // 1. Background Ambient Starfield (300 faint stars)
      const starCount = Math.floor((width * height) / 3800);
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * 1.2 + 0.4,
          alpha: Math.random() * 0.4 + 0.1,
          twinkleSpeed: Math.random() * 0.03 + 0.008,
          phase: Math.random() * Math.PI * 2
        });
      }

      // 2. Dynamic Engineering Nodes (50–90 nodes based on screen size)
      const nodeCount = Math.max(35, Math.min(85, Math.floor((width * height) / 14000)));
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 1.8 + 1.6,
          baseAlpha: Math.random() * 0.4 + 0.4,
          disciplineIdx: i % 8
        });
      }

      // 3. Photon transmission stream
      const photonCount = Math.min(12, Math.floor(nodeCount / 5));
      for (let i = 0; i < photonCount; i++) {
        const from = Math.floor(Math.random() * nodes.length);
        let to = Math.floor(Math.random() * nodes.length);
        while (to === from) to = Math.floor(Math.random() * nodes.length);
        photons.push({
          fromNode: from,
          toNode: to,
          progress: Math.random(),
          speed: Math.random() * 0.008 + 0.004
        });
      }
    };

    initNetwork();

    // Mouse Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Animation Loop
    let time = 0;
    const maxConnectionDist = Math.min(150, Math.max(100, width * 0.11));

    const render = () => {
      if (!isVisibleRef.current) {
        animId = requestAnimationFrame(render);
        return;
      }

      ctx.clearRect(0, 0, width, height);
      time += 0.016;

      // Draw faint stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = Math.sin(time * s.twinkleSpeed * 60 + s.phase) * 0.2 + 0.8;
        ctx.fillStyle = `rgba(255, 255, 255, ${s.alpha * twinkle * 0.6})`;
        ctx.fillRect(s.x, s.y, s.size, s.size);
      }

      // Update & Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];

        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;

          // Bounce off boundary edges gently
          if (n.x < 0) { n.x = 0; n.vx *= -1; }
          else if (n.x > width) { n.x = width; n.vx *= -1; }
          if (n.y < 0) { n.y = 0; n.vy *= -1; }
          else if (n.y > height) { n.y = height; n.vy *= -1; }

          // Mouse Gravitational Interaction
          if (mouseRef.current.active) {
            const dx = mouseRef.current.x - n.x;
            const dy = mouseRef.current.y - n.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 180 && dist > 1) {
              const force = (1 - dist / 180) * 0.6;
              n.x += (dx / dist) * force;
              n.y += (dy / dist) * force;
            }
          }
        }
      }

      // Draw Connections (Filaments)
      ctx.lineWidth = 0.8;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i];
          const n2 = nodes[j];
          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist) {
            const alpha = (1 - dist / maxConnectionDist) * 0.22;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.stroke();
          }
        }

        // Mouse filaments
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - nodes[i].x;
          const dy = mouseRef.current.y - nodes[i].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.35;
            ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
            ctx.stroke();
          }
        }
      }

      // Draw Photons (Data Pulse Packets traveling between nodes)
      if (!prefersReducedMotion) {
        for (let i = 0; i < photons.length; i++) {
          const p = photons[i];
          const n1 = nodes[p.fromNode];
          const n2 = nodes[p.toNode];

          if (!n1 || !n2) continue;

          const dx = n2.x - n1.x;
          const dy = n2.y - n1.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxConnectionDist * 1.5) {
            p.progress += p.speed;
            if (p.progress >= 1) {
              p.progress = 0;
              p.fromNode = p.toNode;
              p.toNode = Math.floor(Math.random() * nodes.length);
            }

            const px = n1.x + dx * p.progress;
            const py = n1.y + dy * p.progress;

            ctx.fillStyle = '#FFFFFF';
            ctx.shadowColor = '#FFFFFF';
            ctx.shadowBlur = 6;
            ctx.beginPath();
            ctx.arc(px, py, 1.8, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
          } else {
            p.toNode = Math.floor(Math.random() * nodes.length);
          }
        }
      }

      // Draw Nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.fillStyle = `rgba(255, 255, 255, ${n.baseAlpha})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fill();

        // Subtle core glow for primary nodes
        if (i % 5 === 0) {
          ctx.strokeStyle = `rgba(255, 255, 255, 0.25)`;
          ctx.lineWidth = 0.7;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius * 2.2, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      observer.disconnect();
    };
  }, [prefersReducedMotion]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0
      }}
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'auto',
          maskImage: 'radial-gradient(ellipse 90% 75% at 50% 45%, black 40%, transparent 95%)',
          WebkitMaskImage: 'radial-gradient(ellipse 90% 75% at 50% 45%, black 40%, transparent 95%)'
        }}
      />
    </div>
  );
};
