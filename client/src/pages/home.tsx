import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Simulation } from "@/lib/simulation/Simulation";
import Canvas from "@/components/Canvas";
import Controls from "@/components/Controls";
import SimStats from "@/components/SimStats";

export default function Home() {
  const [simulation, setSimulation] = useState<Simulation | null>(null);
  const [stats, setStats] = useState({ carCount: 0, avgSpeed: 0 });

  useEffect(() => {
    const sim = new Simulation();
    setSimulation(sim);
    return () => sim.stop();
  }, []);

  const handleUpdateParams = (params: { carCount: number, speed: number }) => {
    simulation?.updateParams(params);
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
        <h1 className="text-3xl font-bold text-[#34495E]">Traffic Simulation</h1>
        
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
