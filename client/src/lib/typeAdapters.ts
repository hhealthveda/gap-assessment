import type { 
  ControlResponse as DbControlResponse, 
  ScopingDecision as DbScopingDecision
} from "@shared/schema";

// Define component-specific types that handle nullable vs undefined
export interface Response {
  id: number;
  assessmentId: number;
  controlId: string;
  status: string;
  evidence?: string;
  notes?: string;
  updatedAt: Date;
}

export interface ScopingDecision {
  id: number;
  assessmentId: number;
  controlId: string;
  applicable: boolean;
  reason?: string;
}

// Adapter functions to convert between database and component types
export function adaptControlResponse(dbResponse: DbControlResponse): Response {
  return {
    ...dbResponse,
    evidence: dbResponse.evidence || undefined,
    notes: dbResponse.notes || undefined
  };
}

export function adaptScopingDecision(dbDecision: DbScopingDecision): ScopingDecision {
  return {
    ...dbDecision,
    reason: dbDecision.reason || undefined
  };
}

// Helper to convert arrays
export function adaptControlResponses(dbResponses: DbControlResponse[]): Response[] {
  return dbResponses.map(adaptControlResponse);
}

export function adaptScopingDecisions(dbDecisions: DbScopingDecision[]): ScopingDecision[] {
  return dbDecisions.map(adaptScopingDecision);
}