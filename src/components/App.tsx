"use client";

import { useState } from "react";
import OrbitScene from "@/components/OrbitScene";
import ConfigPanel from "@/components/ConfigPanel";

export interface OrbitConfig {
  id: number;
  radiusMin: number;
  radiusMax: number;
  speed: number;
  count: number;
  size: number;
}

const DEFAULT_ORBITS: OrbitConfig[] = [
  { id: 1, radiusMin: 72,  radiusMax: 108, speed: 0.025, count: 1, size: 8  },
  { id: 2, radiusMin: 128, radiusMax: 172, speed: 0.015, count: 1, size: 12 },
  { id: 3, radiusMin: 185, radiusMax: 235, speed: 0.010, count: 1, size: 6  },
  { id: 4, radiusMin: 245, radiusMax: 295, speed: 0.020, count: 1, size: 10 },
  { id: 5, radiusMin: 305, radiusMax: 375, speed: 0.008, count: 1, size: 14 },
];

export default function App() {
  const [orbits, setOrbits] = useState<OrbitConfig[]>(DEFAULT_ORBITS);

  return (
    <>
      <OrbitScene orbits={orbits} />
      <ConfigPanel orbits={orbits} onChange={setOrbits} />
    </>
  );
}
