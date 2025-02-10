import { Card } from "@/components/ui/card";

interface SimStatsProps {
  stats: {
    carCount: number;
    avgSpeed: number;
  };
}

export default function SimStats({ stats }: SimStatsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-[#34495E]">Statistics</h2>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-[#3498DB]/10 rounded-lg">
          <div className="text-sm text-[#34495E]">Cars</div>
          <div className="text-2xl font-semibold text-[#3498DB]">
            {stats.carCount}
          </div>
        </div>
        
        <div className="p-3 bg-[#2ECC71]/10 rounded-lg">
          <div className="text-sm text-[#34495E]">Avg Speed</div>
          <div className="text-2xl font-semibold text-[#2ECC71]">
            {stats.avgSpeed}
          </div>
        </div>
      </div>
    </div>
  );
}
