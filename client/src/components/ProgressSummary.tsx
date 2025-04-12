import { Skeleton } from "@/components/ui/skeleton";

type ProgressSummaryProps = {
  isLoading: boolean;
  stats?: any;
};

const ProgressSummary = ({ isLoading, stats }: ProgressSummaryProps) => {
  if (isLoading) {
    return (
      <div>
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2.5 w-full" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-slate-700">Overall Completion</span>
          <span className="text-sm font-medium text-slate-700">
            {stats?.completionPercentage || 0}% ({stats?.answeredControls || 0}/{stats?.applicableControls || 0})
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2.5">
          <div 
            className="bg-primary h-2.5 rounded-full" 
            style={{ width: `${stats?.completionPercentage || 0}%` }}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-success bg-opacity-20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Compliant</p>
              <p className="text-xl font-semibold text-slate-900">{stats?.compliantControls || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-warning bg-opacity-20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Partial</p>
              <p className="text-xl font-semibold text-slate-900">{stats?.partialControls || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 p-4 rounded-lg">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-danger bg-opacity-20 flex items-center justify-center mr-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-danger" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Non-Compliant</p>
              <p className="text-xl font-semibold text-slate-900">{stats?.nonCompliantControls || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
