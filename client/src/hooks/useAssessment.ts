import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";

export function useAssessment(assessmentId: number) {
  // Get assessment details
  const { data: assessment, isLoading: isLoadingAssessment } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}`],
  });

  // Get control responses
  const { data: responses, isLoading: isLoadingResponses } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/responses`],
  });

  // Get scoping decisions
  const { data: scopingDecisions, isLoading: isLoadingScopingDecisions } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/scoping`],
  });

  // Get completion statistics
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: [`/api/assessments/${assessmentId}/calculate-completion`],
  });

  // Mutation to save control response
  const saveResponseMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", `/api/assessments/${assessmentId}/responses`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/assessments/${assessmentId}/responses`] });
      queryClient.invalidateQueries({ queryKey: [`/api/assessments/${assessmentId}/calculate-completion`] });
    },
  });

  // Mutation to save scoping decision
  const saveScopingDecisionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", `/api/assessments/${assessmentId}/scoping`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/assessments/${assessmentId}/scoping`] });
      queryClient.invalidateQueries({ queryKey: [`/api/assessments/${assessmentId}/calculate-completion`] });
    },
  });

  // Mutation to add activity log
  const addActivityLogMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", `/api/assessments/${assessmentId}/activities`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/assessments/${assessmentId}/activities`] });
    },
  });

  // Determine if anything is loading
  const isLoading = isLoadingAssessment || isLoadingResponses || isLoadingScopingDecisions || isLoadingStats;

  // Helper function to update a control response
  const updateControlResponse = (controlId: string, status: string, notes?: string, evidence?: string) => {
    saveResponseMutation.mutate({
      controlId,
      status,
      notes,
      evidence
    });

    // Optionally log the activity
    addActivityLogMutation.mutate({
      action: "updated_control",
      details: {
        controlId,
        status
      }
    });
  };

  // Helper function to update a scoping decision
  const updateScopingDecision = (controlId: string, applicable: boolean, reason?: string) => {
    saveScopingDecisionMutation.mutate({
      controlId,
      applicable,
      reason
    });

    // Log the activity
    addActivityLogMutation.mutate({
      action: "updated_scoping",
      details: {
        controlId,
        applicable
      }
    });
  };

  // Helper function to log evidence upload
  const logEvidenceUpload = (controlId: string) => {
    addActivityLogMutation.mutate({
      action: "uploaded_evidence",
      details: {
        controlId
      }
    });
  };

  // Helper function to log domain completion
  const logDomainCompletion = (domainId: string, domainName: string) => {
    addActivityLogMutation.mutate({
      action: "completed_domain",
      details: {
        domainId,
        domainName
      }
    });
  };

  return {
    assessment,
    responses,
    scopingDecisions,
    stats,
    isLoading,
    updateControlResponse,
    updateScopingDecision,
    logEvidenceUpload,
    logDomainCompletion
  };
}
