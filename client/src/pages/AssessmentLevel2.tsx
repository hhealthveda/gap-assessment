import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import DomainAccordion from "@/components/DomainAccordion";
import ProgressSummary from "@/components/ProgressSummary";
import { cmmcLevel2Controls } from "@/data/cmmc-data";
import type { Assessment } from "@shared/schema";
import { 
  adaptControlResponses, 
  adaptScopingDecisions,
  type Response,
  type ScopingDecision
} from "@/lib/typeAdapters";

const AssessmentLevel2 = () => {
  const [activeTab, setActiveTab] = useState<string>("assessment");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: assessment, isLoading: isLoadingAssessment } = useQuery<Assessment>({
    queryKey: ["/api/assessments/2"],
  });

  const { data: dbResponses, isLoading: isLoadingResponses } = useQuery({
    queryKey: ["/api/assessments/2/responses"],
  });

  const { data: dbScopingDecisions, isLoading: isLoadingScopingDecisions } = useQuery({
    queryKey: ["/api/assessments/2/scoping"],
  });
  
  // Adapt the DB responses to our component types
  const responses = dbResponses ? adaptControlResponses(dbResponses) : undefined;
  const scopingDecisions = dbScopingDecisions ? adaptScopingDecisions(dbScopingDecisions) : undefined;

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ["/api/assessments/2/calculate-completion"],
  });

  const saveResponseMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", `/api/assessments/2/responses`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/2/responses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/2/calculate-completion"] });
    },
  });

  const saveScopingDecisionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", `/api/assessments/2/scoping`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/2/scoping"] });
      queryClient.invalidateQueries({ queryKey: ["/api/assessments/2/calculate-completion"] });
    },
  });

  const handleResponseUpdate = (controlId: string, status: string, notes?: string, evidence?: string) => {
    saveResponseMutation.mutate({
      controlId,
      status,
      notes,
      evidence
    });
  };

  const handleScopingUpdate = (controlId: string, applicable: boolean, reason?: string) => {
    saveScopingDecisionMutation.mutate({
      controlId,
      applicable,
      reason
    });
  };

  const isLoading = isLoadingAssessment || isLoadingResponses || isLoadingScopingDecisions || isLoadingStats;

  // Filter controls based on search query
  const filteredControls = cmmcLevel2Controls.filter(control => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();
    return (
      control.id.toLowerCase().includes(searchLower) ||
      control.name.toLowerCase().includes(searchLower) ||
      control.description.toLowerCase().includes(searchLower)
    );
  });

  // Organize controls by domain
  const controlsByDomain = filteredControls.reduce((acc, control) => {
    if (!acc[control.domain]) {
      acc[control.domain] = [];
    }
    acc[control.domain].push(control);
    return acc;
  }, {} as Record<string, typeof cmmcLevel2Controls>);

  return (
    <>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">CMMC Level 2 Assessment</h1>
          <p className="mt-2 text-sm text-slate-600">110 controls across 14 domains</p>
        </div>
        <div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            {assessment?.completedPercentage || 0}% Complete
          </Badge>
        </div>
      </div>

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="flex border-b border-slate-200">
            <button 
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'assessment' ? 'text-primary border-b-2 border-primary' : 'text-slate-600'}`}
              onClick={() => setActiveTab('assessment')}
            >
              Assessment
            </button>
            <button 
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'scoping' ? 'text-primary border-b-2 border-primary' : 'text-slate-600'}`}
              onClick={() => setActiveTab('scoping')}
            >
              Scoping
            </button>
          </div>

          {activeTab === 'assessment' && (
            <div className="px-4 py-5 sm:px-6">
              <ProgressSummary 
                isLoading={isLoading}
                stats={stats}
              />
            </div>
          )}

          {activeTab === 'scoping' && (
            <div className="px-4 py-5 sm:px-6">
              <div className="mb-4">
                <h3 className="text-base font-medium text-slate-900 mb-2">Scoping Instructions</h3>
                <p className="text-sm text-slate-600 mb-4">
                  Use this section to determine which controls are applicable to your organization. 
                  Non-applicable controls will be excluded from your compliance calculation.
                </p>
                <div className="p-4 bg-blue-50 rounded-md text-sm text-blue-800 mb-4">
                  <div className="flex">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>
                      For CMMC Level 2, you must carefully consider each control's applicability to your environment. 
                      When marking a control as not applicable, provide a justification for exclusion.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search controls by ID, name or description..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md"
        />
      </div>

      {/* Domain Assessment */}
      {isLoading ? (
        // Loading skeleton
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-0">
                <div className="px-4 py-5 sm:px-6 border-b border-slate-200">
                  <Skeleton className="h-6 w-48" />
                </div>
                <div className="p-4">
                  <Skeleton className="h-32 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        // Domain accordions
        <div className="space-y-4">
          {Object.keys(controlsByDomain).length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-slate-600">No controls found matching your search query.</p>
            </div>
          ) : (
            Object.entries(controlsByDomain).map(([domain, controls]) => (
              <DomainAccordion
                key={domain}
                domain={domain}
                controls={controls}
                responses={responses}
                scopingDecisions={scopingDecisions}
                onResponseUpdate={handleResponseUpdate}
                onScopingUpdate={handleScopingUpdate}
                showScoping={activeTab === 'scoping'}
              />
            ))
          )}
        </div>
      )}

      <div className="mt-8 flex justify-end space-x-4">
        <Button 
          variant="outline" 
          onClick={() => {
            queryClient.invalidateQueries({ queryKey: ["/api/assessments/2"] });
            queryClient.invalidateQueries({ queryKey: ["/api/assessments"] });
          }}
        >
          Save Progress
        </Button>
        <Button onClick={() => {
          window.location.href = "/reports";
        }}>
          Export Assessment
        </Button>
      </div>
    </>
  );
};

export default AssessmentLevel2;
