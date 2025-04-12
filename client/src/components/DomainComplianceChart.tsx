import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

const domainAbbreviations: Record<string, string> = {
  "Access Control": "AC",
  "Identification & Authentication": "IA",
  "Media Protection": "MP",
  "Physical Protection": "PE",
  "System & Communications Protection": "SC",
  "System & Information Integrity": "SI"
};

type DomainComplianceChartProps = {
  assessmentId?: number;
};

const DomainComplianceChart = ({ assessmentId = 1 }: DomainComplianceChartProps) => {
  // Mock domain compliance data - in a real app, this would come from the API
  const [chartData, setChartData] = useState([
    { name: "Access Control", compliance: 85, color: "#22c55e" },
    { name: "Identification & Authentication", compliance: 92, color: "#22c55e" },
    { name: "Media Protection", compliance: 58, color: "#f59e0b" },
    { name: "Physical Protection", compliance: 76, color: "#22c55e" },
    { name: "System & Comm Protection", compliance: 32, color: "#ef4444" },
    { name: "System & Info Integrity", compliance: 65, color: "#f59e0b" },
  ]);

  // In a real app, we would fetch the domain compliance data from the API
  const { data: responses, isLoading } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/responses`],
  });

  // This would be implemented to calculate domain compliance from responses
  useEffect(() => {
    if (responses) {
      // This would be the real implementation that calculates domain compliance
      // from the responses data. For now, we'll just use the mock data.
    }
  }, [responses]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const abbreviation = domainAbbreviations[label] || label;
      return (
        <div className="bg-white p-2 border border-slate-200 shadow-sm rounded-md">
          <p className="font-medium">{`${label} (${abbreviation})`}</p>
          <p className="text-primary">{`Compliance: ${payload[0].value}%`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return <Skeleton className="w-full h-[300px]" />;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
        <XAxis 
          dataKey="name" 
          tick={{ fontSize: 12 }}
          angle={-45}
          textAnchor="end"
          height={70}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          domain={[0, 100]}
          tickFormatter={(value) => `${value}%`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="compliance" radius={[4, 4, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

export default DomainComplianceChart;
