import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";

interface ControlsProps {
  onUpdate: (params: { carCount: number; speed: number }) => void;
}

export default function Controls({ onUpdate }: ControlsProps) {
  const [carCount, setCarCount] = useState(10);
  const [speed, setSpeed] = useState(2);

  const handleCarCountChange = (value: number[]) => {
    const count = value[0];
    setCarCount(count);
    onUpdate({ carCount: count, speed });
  };

  const handleSpeedChange = (value: number[]) => {
    const newSpeed = value[0];
    setSpeed(newSpeed);
    onUpdate({ carCount, speed: newSpeed });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-[#34495E]">Simulation Controls</h2>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Number of Cars: {carCount}</Label>
          <Slider
            value={[carCount]}
            onValueChange={handleCarCountChange}
            min={1}
            max={50}
            step={1}
          />
        </div>

        <div className="space-y-2">
          <Label>Max Speed: {speed}</Label>
          <Slider
            value={[speed]}
            onValueChange={handleSpeedChange}
            min={0.5}
            max={5}
            step={0.5}
          />
        </div>
      </div>
    </div>
  );
}
