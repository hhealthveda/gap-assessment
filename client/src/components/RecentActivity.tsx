import { useQuery } from "@tanstack/react-query";
import { Activity, Check, PaperclipIcon, Eye, AlertTriangle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, formatDistanceToNow } from "date-fns";

type RecentActivityProps = {
  assessmentId: number;
  limit?: number;
};

const RecentActivity = ({ assessmentId, limit = 5 }: RecentActivityProps) => {
  const { data: activityLogs, isLoading } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/activities?limit=${limit}`],
  });

  if (isLoading) {
    return (
      <div className="space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-start">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="ml-3 flex-1">
              <Skeleton className="h-4 w-full max-w-[250px] mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!activityLogs || activityLogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center text-slate-500">
        <Activity className="h-12 w-12 mb-4 text-slate-300" />
        <p>No recent activity found</p>
        <p className="text-sm mt-1">Activities will appear here as you work on your assessment</p>
      </div>
    );
  }

  const getActivityIcon = (action: string) => {
    switch (action) {
      case "completed_domain":
        return (
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Check className="h-5 w-5 text-green-600" />
          </div>
        );
      case "uploaded_evidence":
        return (
          <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
            <PaperclipIcon className="h-5 w-5 text-blue-600" />
          </div>
        );
      case "updated_control":
        return (
          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center">
            <Eye className="h-5 w-5 text-indigo-600" />
          </div>
        );
      case "updated_scoping":
        return (
          <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
            <Activity className="h-5 w-5 text-purple-600" />
          </div>
        );
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
          </div>
        );
    }
  };

  const getActivityDescription = (log: any) => {
    const { action, details } = log;
    
    switch (action) {
      case "completed_domain":
        return (
          <p className="text-sm text-slate-900">
            Completed assessment for <span className="font-medium">{details.domainName}</span> domain
          </p>
        );
      case "uploaded_evidence":
        return (
          <p className="text-sm text-slate-900">
            Evidence uploaded for <span className="font-medium">{details.controlId}</span>
          </p>
        );
      case "updated_control":
        return (
          <p className="text-sm text-slate-900">
            Updated status for <span className="font-medium">{details.controlId}</span> to {" "}
            <span className="font-medium">
              {details.status === "yes" ? "Compliant" : 
               details.status === "partial" ? "Partially Compliant" : 
               details.status === "no" ? "Non-Compliant" : 
               details.status}
            </span>
          </p>
        );
      case "updated_scoping":
        return (
          <p className="text-sm text-slate-900">
            Marked <span className="font-medium">{details.controlId}</span> as {" "}
            <span className="font-medium">
              {details.applicable ? "applicable" : "not applicable"}
            </span>
          </p>
        );
      default:
        return (
          <p className="text-sm text-slate-900">
            {action.replace(/_/g, " ")}
          </p>
        );
    }
  };

  return (
    <div className="space-y-5">
      {activityLogs.map((log: any) => {
        // Parse the ISO date string to a Date object
        const logDate = new Date(log.timestamp);
        const timeAgo = formatDistanceToNow(logDate, { addSuffix: true });
        
        return (
          <div key={log.id} className="flex items-start">
            {getActivityIcon(log.action)}
            <div className="ml-3 flex-1">
              {getActivityDescription(log)}
              <p className="mt-1 text-xs text-slate-500">{timeAgo}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RecentActivity;
