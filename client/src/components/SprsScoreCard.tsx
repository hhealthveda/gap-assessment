import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

// Define the SPRS data structure that matches the API response
interface SprsScoreData {
  sprsScore: number;
  totalControls: number;
  inScopeControls: number;
  compliantControls: number;
  partialControls: number;
  nonCompliantControls: number;
  implementationPercentage: number;
  implementationLevel: string;
  implementationFactor: string;
}

type SprsScoreCardProps = {
  assessmentId: number;
  isLoading: boolean;
};

const SprsScoreCard = ({ assessmentId, isLoading }: SprsScoreCardProps) => {
  // Fetch SPRS score data from the API
  const { data, isLoading: isLoadingSprs } = useQuery<SprsScoreData>({
    queryKey: [`/api/assessments/${assessmentId}/sprs-score`],
    // Don't refetch too often
    staleTime: 30000, // 30 seconds
  });
  
  const isLoadingAll = isLoading || isLoadingSprs;

  // Determine progress bar color based on implementation percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  if (isLoadingAll || !data) {
    return (
      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">SPRS Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-8 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-16 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">SPRS Score (Supplier Performance Risk System)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-xl font-bold">{data.sprsScore}</span>
              <span className="text-slate-500 text-sm ml-1">/ 110</span>
            </div>
            <div className="text-right">
              <span className="text-sm font-medium">Implementation Factor: </span>
              <span className="text-sm font-bold">{data.implementationFactor}</span>
            </div>
          </div>
          
          <div>
            <Progress 
              value={data.implementationPercentage} 
              className={`h-2 ${getProgressColor(data.implementationPercentage)}`} 
            />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-slate-500">0%</span>
              <span className="text-xs font-medium">{data.implementationPercentage}%</span>
              <span className="text-xs text-slate-500">100%</span>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-md mt-4">
            <p className="text-sm text-blue-800">
              <span className="font-medium">Implementation Level: </span>
              {data.implementationLevel}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-green-50 rounded-md p-3 text-center">
              <div className="text-green-600 font-bold text-xl">
                {data.compliantControls}
              </div>
              <div className="text-green-800 text-sm">
                Compliant
              </div>
            </div>
            <div className="bg-yellow-50 rounded-md p-3 text-center">
              <div className="text-yellow-600 font-bold text-xl">
                {data.partialControls}
              </div>
              <div className="text-yellow-800 text-sm">
                Partially Compliant
              </div>
            </div>
            <div className="bg-red-50 rounded-md p-3 text-center">
              <div className="text-red-600 font-bold text-xl">
                {data.nonCompliantControls}
              </div>
              <div className="text-red-800 text-sm">
                Non-Compliant
              </div>
            </div>
          </div>
          
          <div className="text-xs text-slate-500 italic mt-2">
            Note: SPRS score is calculated based on in-scope practices only. 
            Out-of-scope practices are excluded from the calculation.
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SprsScoreCard;