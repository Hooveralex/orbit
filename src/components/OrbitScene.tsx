"use client";

import { useEffect, useRef } from "react";
import type { OrbitConfig } from "@/components/App";

interface FlatParticle {
  key: string;
  orbitId: number;
  size: number;
  startAngle: number;
}

function deriveParticles(orbits: OrbitConfig[]): FlatParticle[] {
  return orbits.flatMap((orbit) =>
    Array.from({ length: orbit.count }, (_, i) => ({
      key: `${orbit.id}-${i}`,
      orbitId: orbit.id,
      size: orbit.size,
      startAngle: (2 * Math.PI * i) / orbit.count,
    }))
  );
}

interface OrbitSceneProps {
  orbits: OrbitConfig[];
}

export default function OrbitScene({ orbits }: OrbitSceneProps) {
  const particles = deriveParticles(orbits);

  // Stable ref so animation loop always reads latest config without restarting
  const orbitsRef = useRef(orbits);
  useEffect(() => {
    orbitsRef.current = orbits;
  }, [orbits]);

  // Per-particle angle map keyed by "orbitId-particleIndex"
  const anglesRef = useRef<Map<string, number>>(new Map());
  // Per-particle radius — each particle picks a random value within its orbit band
  const radiiRef = useRef<Map<string, number>>(new Map());

  // Initialize angles + radii for new particles; existing ones keep their current values
  particles.forEach((p) => {
    if (!anglesRef.current.has(p.key)) {
      const orbit = orbits.find((o) => o.id === p.orbitId)!;
      const spacing = (2 * Math.PI) / orbit.count;
      const jitter = (Math.random() - 0.5) * 1.0 * spacing;
      anglesRef.current.set(p.key, p.startAngle + jitter);
      radiiRef.current.set(p.key, orbit.radiusMin + Math.random() * (orbit.radiusMax - orbit.radiusMin));
    }
  });

  // Track previous orbits to detect count changes
  const prevOrbitsRef = useRef<OrbitConfig[]>(orbits);

  // When an orbit's count changes, redistribute ALL its particles with
  // even base spacing + jitter + fresh random radii within the band
  useEffect(() => {
    const prev = prevOrbitsRef.current;
    orbits.forEach((orbit) => {
      const prevOrbit = prev.find((o) => o.id === orbit.id);
      if (prevOrbit && prevOrbit.count !== orbit.count) {
        const baseAngle = anglesRef.current.get(`${orbit.id}-0`) ?? 0;
        const spacing = (2 * Math.PI) / orbit.count;
        for (let i = 0; i < orbit.count; i++) {
          const jitter = (Math.random() - 0.5) * 0.5 * spacing;
          anglesRef.current.set(
            `${orbit.id}-${i}`,
            baseAngle + (2 * Math.PI * i) / orbit.count + jitter
          );
          radiiRef.current.set(
            `${orbit.id}-${i}`,
            orbit.radiusMin + Math.random() * (orbit.radiusMax - orbit.radiusMin)
          );
        }
        // Clean up stale keys when count decreased
        for (let i = orbit.count; i < prevOrbit.count; i++) {
          anglesRef.current.delete(`${orbit.id}-${i}`);
          radiiRef.current.delete(`${orbit.id}-${i}`);
        }
      }
    });
    prevOrbitsRef.current = orbits;
  }, [orbits]);

  const particleRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    function animate() {
      const currentOrbits = orbitsRef.current;
      const speedMap = new Map(currentOrbits.map((o) => [o.id, o.speed]));

      anglesRef.current.forEach((angle, key) => {
        const orbitId = parseInt(key.split("-")[0], 10);
        const speed = speedMap.get(orbitId) ?? 0;
        const newAngle = angle + speed;
        anglesRef.current.set(key, newAngle);

        const el = particleRefs.current.get(key);
        if (el) {
          const radius = radiiRef.current.get(key) ?? 0;
          const x = Math.cos(newAngle) * radius;
          const y = Math.sin(newAngle) * radius;
          el.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        }
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden bg-black">
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
        {particles.map((p) => (
          <div
            key={p.key}
            ref={(el) => { particleRefs.current.set(p.key, el); }}
            className="absolute rounded-full bg-white"
            style={{
              width: p.size,
              height: p.size,
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
