"use client";

import { useEffect, useRef } from "react";

interface Particle {
  id: number;
  orbitRadius: number;
  speed: number;
  size: number;
  startAngle: number;
}

const PARTICLES: Particle[] = [
  { id: 1, orbitRadius: 90,  speed: 0.025, size: 8,  startAngle: 0 },
  { id: 2, orbitRadius: 150, speed: 0.015, size: 12, startAngle: 1.2 },
  { id: 3, orbitRadius: 210, speed: 0.010, size: 6,  startAngle: 2.5 },
  { id: 4, orbitRadius: 270, speed: 0.020, size: 10, startAngle: 0.8 },
  { id: 5, orbitRadius: 340, speed: 0.008, size: 14, startAngle: 4.0 },
];

export default function OrbitScene() {
  const particleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const anglesRef = useRef<number[]>(PARTICLES.map((p) => p.startAngle));
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function animate() {
      PARTICLES.forEach((particle, i) => {
        anglesRef.current[i] += particle.speed;
        const angle = anglesRef.current[i];
        const x = Math.cos(angle) * particle.orbitRadius;
        const y = Math.sin(angle) * particle.orbitRadius;

        const el = particleRefs.current[i];
        if (el) {
          el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
      {/* Coordinate origin anchored at exact center */}
      <div className="absolute top-1/2 left-1/2">
        {/* Central sun */}
        <div
          className="absolute rounded-full bg-white"
          style={{
            width: 64,
            height: 64,
            top: 0,
            left: 0,
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Orbiting particles */}
        {PARTICLES.map((particle, i) => (
          <div
            key={particle.id}
            ref={(el) => { particleRefs.current[i] = el; }}
            className="absolute rounded-full bg-white"
            style={{
              width: particle.size,
              height: particle.size,
              top: 0,
              left: 0,
              transform: "translate(-50%, -50%)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
