"use client";

import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { OrbitConfig } from "@/components/App";

interface ConfigPanelProps {
  orbits: OrbitConfig[];
  onChange: (orbits: OrbitConfig[]) => void;
}

// Map slider value 1–10 to speed range 0.002–0.05
function sliderToSpeed(value: number): number {
  const min = 0.002;
  const max = 0.05;
  return min + ((value - 1) / 9) * (max - min);
}

function speedToSlider(speed: number): number {
  const min = 0.002;
  const max = 0.05;
  return 1 + ((speed - min) / (max - min)) * 9;
}

export default function ConfigPanel({ orbits, onChange }: ConfigPanelProps) {
  function updateOrbit(id: number, patch: Partial<OrbitConfig>) {
    onChange(orbits.map((o) => (o.id === id ? { ...o, ...patch } : o)));
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed bottom-6 right-6 z-50 rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-80 border-white/10 bg-neutral-950 text-white overflow-y-auto p-6"
      >
        <SheetHeader className="p-0 mb-6">
          <SheetTitle className="text-white">Orbit Config</SheetTitle>
        </SheetHeader>

        <div className="space-y-8">
          {orbits.map((orbit, i) => (
            <div key={orbit.id} className="space-y-4">
              <p className="text-sm font-semibold text-white/70 uppercase tracking-wider">
                Orbit {i + 1}
                <span className="ml-2 font-normal normal-case text-white/40">
                  r={orbit.radiusMin}–{orbit.radiusMax}px
                </span>
              </p>

              {/* Count */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Particles</Label>
                  <span className="text-sm tabular-nums text-white/60">
                    {orbit.count}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={1}
                  value={[orbit.count]}
                  onValueChange={([val]) => updateOrbit(orbit.id, { count: val })}
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
                />
              </div>

              {/* Speed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-white/80">Speed</Label>
                  <span className="text-sm tabular-nums text-white/60">
                    {orbit.speed.toFixed(3)}
                  </span>
                </div>
                <Slider
                  min={1}
                  max={10}
                  step={0.1}
                  value={[speedToSlider(orbit.speed)]}
                  onValueChange={([val]) =>
                    updateOrbit(orbit.id, { speed: sliderToSpeed(val) })
                  }
                  className="[&_[role=slider]]:bg-white [&_[role=slider]]:border-white"
                />
              </div>

              {i < orbits.length - 1 && (
                <div className="border-t border-white/10" />
              )}
            </div>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
