import type { Response, ScopingDecision } from "./typeAdapters";

// CMMC Level 2 consists of 110 practices across domains
// The SPRS score is based on compliance with these practices

// SPRS score calculation parameters
const MAX_SPRS_SCORE = 110;  // Maximum possible score (all controls implemented)
const WEIGHT_COMPLIANT = 1.0;  // Full weight for compliant controls
const WEIGHT_PARTIAL = 0.5;  // Partial weight for partially implemented controls
const WEIGHT_NON_COMPLIANT = 0.0;  // No weight for non-compliant controls

/**
 * Calculate the SPRS score for CMMC Level 2 based on control responses and scoping decisions
 * @param responses The control responses for the assessment
 * @param scopingDecisions The scoping decisions for the assessment
 * @returns Object containing the SPRS score and related metrics
 */
export function calculateSprsScore(
  responses: Response[],
  scopingDecisions: ScopingDecision[]
) {
  // Create a map of scoping decisions by controlId for quick lookup
  const scopingMap = new Map<string, ScopingDecision>();
  scopingDecisions.forEach(decision => {
    scopingMap.set(decision.controlId, decision);
  });

  // Initialize counters and arrays
  const totalControls = MAX_SPRS_SCORE; // 110 practices in CMMC Level 2
  let inScopeControls = 0;
  let compliantControls = 0;
  let partialControls = 0;
  let nonCompliantControls = 0;
  let notAssessedControls = 0;

  // Track which controls have been assessed
  const controlIds = new Set<string>();
  
  // Process each response
  responses.forEach(response => {
    controlIds.add(response.controlId);
    
    // Check if the control is in scope
    const scopingDecision = scopingMap.get(response.controlId);
    const isInScope = !scopingDecision || scopingDecision.applicable !== false;
    
    // Only include in-scope controls in the calculation
    if (isInScope) {
      inScopeControls++;
      
      // Count based on status
      switch (response.status) {
        case 'yes':
          compliantControls++;
          break;
        case 'partial':
          partialControls++;
          break;
        case 'no':
          nonCompliantControls++;
          break;
        // 'not_applicable' is handled by the scoping decisions
      }
    }
  });

  // Calculate controls not yet assessed (in-scope only)
  const outOfScopeCount = scopingDecisions.filter(d => !d.applicable).length;
  notAssessedControls = totalControls - outOfScopeCount - controlIds.size;
  if (notAssessedControls < 0) notAssessedControls = 0;
  
  // Include not-assessed controls in the non-compliant category for SPRS calculation
  const totalNonCompliant = nonCompliantControls + notAssessedControls;
  
  // SPRS score calculation based on DoD methodology:
  // Start with maximum score and deduct points
  // Non-compliant controls = -1 point each
  // Partially compliant controls = -0.5 points each
  const deductions = totalNonCompliant + (partialControls * WEIGHT_PARTIAL);
  const sprsScore = Math.max(0, Math.round(totalControls - deductions));
  
  // Calculate implementation percentage
  const implementationPercentage = inScopeControls > 0 
    ? Math.round((sprsScore / inScopeControls) * 100) 
    : 0;
    
  // Return the SPRS score and related metrics
  return {
    sprsScore,
    totalControls,
    inScopeControls,
    compliantControls,
    partialControls,
    nonCompliantControls,
    notAssessedControls,
    totalNonCompliant,
    implementationPercentage
  };
}

// Helper to determine SPRS implementation level based on score
export function getSprsImplementationLevel(score: number): string {
  if (score >= 110) return "Level 2 (110+ practices)";
  if (score >= 100) return "Level 2 (100-109 practices)";
  if (score >= 80) return "Level 2 (80-99 practices)";
  if (score >= 60) return "Level 1 (60-79 practices)";
  if (score >= 1) return "Level 1 (1-59 practices)";
  return "Not Scored (0 practices)";
}

// Helper to determine SPRS implementation factor based on percentage
export function getSprsImplementationFactor(percentage: number): string {
  if (percentage >= 100) return "1.0";
  if (percentage >= 95) return "0.95";
  if (percentage >= 90) return "0.9";
  if (percentage >= 85) return "0.85";
  if (percentage >= 80) return "0.8";
  if (percentage >= 75) return "0.75";
  if (percentage >= 70) return "0.7";
  if (percentage >= 65) return "0.65";
  if (percentage >= 60) return "0.6";
  if (percentage >= 50) return "0.5";
  if (percentage >= 40) return "0.4";
  if (percentage >= 30) return "0.3";
  if (percentage >= 20) return "0.2";
  if (percentage >= 10) return "0.1";
  return "0.0";
}