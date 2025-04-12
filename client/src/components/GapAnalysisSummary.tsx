import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

type GapAnalysisSummaryProps = {
  assessmentId: number;
};

// Define domain display names and their corresponding compliance thresholds
const domainInfo = [
  { id: "AC", name: "Access Control", threshold: 80 },
  { id: "IA", name: "Identification & Authentication", threshold: 80 },
  { id: "MP", name: "Media Protection", threshold: 80 },
  { id: "PE", name: "Physical Protection", threshold: 80 },
  { id: "SC", name: "System & Communications Protection", threshold: 80 },
  { id: "SI", name: "System & Information Integrity", threshold: 80 },
  { id: "AU", name: "Audit and Accountability", threshold: 80 },
  { id: "AT", name: "Awareness and Training", threshold: 80 },
  { id: "CM", name: "Configuration Management", threshold: 80 },
  { id: "IR", name: "Incident Response", threshold: 80 },
  { id: "MA", name: "Maintenance", threshold: 80 },
  { id: "PS", name: "Personnel Security", threshold: 80 },
  { id: "RA", name: "Risk Assessment", threshold: 80 },
  { id: "CA", name: "Security Assessment", threshold: 80 },
];

// Mock domain compliance data for visualization
// In a real implementation, this would be calculated from the responses
const domainComplianceData = {
  "AC": 85,
  "IA": 92,
  "MP": 58,
  "PE": 76,
  "SC": 32,
  "SI": 65,
  "AU": 70,
  "AT": 88,
  "CM": 62,
  "IR": 45,
  "MA": 79,
  "PS": 83,
  "RA": 60,
  "CA": 72
};

const GapAnalysisSummary = ({ assessmentId }: GapAnalysisSummaryProps) => {
  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/responses`],
  });

  const { data: scopingDecisions, isLoading: isLoadingScopingDecisions } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/scoping`],
  });

  // In a real application, you would calculate domain compliance from responses
  // For now, we'll use our mock data
  
  const isLoading = isLoadingResponses || isLoadingScopingDecisions;

  if (isLoading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-4 w-40 mb-2" />
            <div className="flex items-center">
              <Skeleton className="w-full h-2.5 mr-2" />
              <Skeleton className="h-4 w-8" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Sort domains by compliance score (ascending) to highlight biggest gaps
  const sortedDomains = [...domainInfo].sort((a, b) => {
    const scoreA = domainComplianceData[a.id as keyof typeof domainComplianceData] || 0;
    const scoreB = domainComplianceData[b.id as keyof typeof domainComplianceData] || 0;
    return scoreA - scoreB;
  });

  // Take only the first 6 domains for display
  const displayDomains = sortedDomains.slice(0, 6);

  return (
    <div className="space-y-5">
      {displayDomains.map((domain) => {
        const complianceScore = domainComplianceData[domain.id as keyof typeof domainComplianceData] || 0;
        const isBelowThreshold = complianceScore < domain.threshold;
        
        let barColor;
        if (complianceScore >= 80) {
          barColor = "bg-success";
        } else if (complianceScore >= 50) {
          barColor = "bg-warning";
        } else {
          barColor = "bg-danger";
        }

        return (
          <div key={domain.id}>
            <h4 className="text-sm font-medium text-slate-700">{domain.name} ({domain.id})</h4>
            <div className="mt-2 flex items-center">
              <div className="w-full bg-slate-200 rounded-full h-2.5 mr-2">
                <div 
                  className={`${barColor} h-2.5 rounded-full`} 
                  style={{ width: `${complianceScore}%` }}
                />
              </div>
              <span className="text-sm font-medium text-slate-700">{complianceScore}%</span>
            </div>
          </div>
        );
      })}
      
      <div className="mt-6">
        <Link href="/gap-analysis" className="text-sm font-medium text-primary hover:text-primary/80">
          View detailed gap analysis <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
};

export default GapAnalysisSummary;
