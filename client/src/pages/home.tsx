import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { MergingSimulation } from "@/lib/simulation/MergingSimulation";
import Canvas from "@/components/Canvas";
import Controls from "@/components/Controls";
import SimStats from "@/components/SimStats";

export default function Home() {
  const [simulation, setSimulation] = useState<MergingSimulation | null>(null);
  const [stats, setStats] = useState({ carCount: 0, avgSpeed: 0 });

  useEffect(() => {
    const sim = new MergingSimulation();
    setSimulation(sim);
    return () => sim.stop();
  }, []);

  const handleUpdateParams = (params: { carCount: number, speed: number }) => {
    if (!simulation) return;

    // Update car speeds
    simulation.cars.forEach(car => {
      car.maxSpeed = params.speed;
    });

    // Adjust car count
    const currentCount = simulation.cars.length;
    const diff = params.carCount - currentCount;

    if (diff > 0) {
      // Add cars to both lanes
      simulation.addCars(Math.ceil(diff * 0.7), true); // 70% to main lane
      simulation.addCars(Math.floor(diff * 0.3), false); // 30% to merge lane
    } else if (diff < 0) {
      simulation.cars = simulation.cars.slice(0, params.carCount);
    }
  };

  useEffect(() => {
    if (!simulation) return;

    const updateStats = () => {
      setStats({
        carCount: simulation.cars.length,
        avgSpeed: simulation.getAverageSpeed()
      });
    };

    const interval = setInterval(updateStats, 1000);
    return () => clearInterval(interval);
  }, [simulation]);

  return (
    <div className="min-h-screen bg-[#ECF0F1] p-4">
      <div className="max-w-7xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-[#34495E]">Traffic Merge Simulation</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <Card className="p-4">
              <Canvas simulation={simulation} />
            </Card>
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <Controls onUpdate={handleUpdateParams} />
            </Card>

            <Card className="p-4">
              <SimStats stats={stats} />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}