import type { Response, ScopingDecision } from "./typeAdapters";

// CMMC Level 2 consists of 110 practices across domains
// SPRS score ranges from -203 to 110
// For each control not implemented we deduct DOD value from 110

// SPRS score calculation parameters
const MAX_SPRS_SCORE = 110;  // Maximum possible score
const MIN_SPRS_SCORE = -203; // Minimum possible score
const WEIGHT_COMPLIANT = 1.0;  // Full weight for compliant controls
const WEIGHT_PARTIAL = 0.5;  // Partial weight for partially implemented controls
const WEIGHT_NON_COMPLIANT = 0.0;  // No weight for non-compliant controls

// DOD Score Values for each control
export const DOD_SCORE_VALUES: { [key: string]: number } = {
  "3.1.1": 5, "3.1.2": 5, "3.1.3": 1, "3.1.4": 1, "3.1.5": 3,
  "3.1.6": 1, "3.1.7": 1, "3.1.8": 1, "3.1.9": 1, "3.1.10": 1,
  "3.1.11": 1, "3.1.12": 5, "3.1.13": 5, "3.1.14": 1, "3.1.15": 1,
  "3.1.16": 5, "3.1.17": 5, "3.1.18": 5, "3.1.19": 3, "3.1.20": 1,
  "3.1.21": 1, "3.1.22": 1, "3.2.1": 5, "3.2.2": 5, "3.2.3": 1,
  "3.3.1": 5, "3.3.2": 3, "3.3.3": 1, "3.3.4": 1, "3.3.5": 5,
  "3.3.6": 1, "3.3.7": 1, "3.3.8": 1, "3.3.9": 1, "3.4.1": 5,
  "3.4.2": 5, "3.4.3": 1, "3.4.4": 1, "3.4.5": 5, "3.4.6": 5,
  "3.4.7": 5, "3.4.8": 5, "3.4.9": 1, "3.5.1": 5, "3.5.2": 5,
  "3.5.3": 5, "3.5.4": 1, "3.5.5": 1, "3.5.6": 1, "3.5.7": 1,
  "3.5.8": 1, "3.5.9": 1, "3.5.10": 5, "3.5.11": 1, "3.6.1": 5,
  "3.6.2": 5, "3.6.3": 1, "3.7.1": 3, "3.7.2": 5, "3.7.3": 1,
  "3.7.4": 3, "3.7.5": 5, "3.7.6": 1, "3.8.1": 3, "3.8.2": 3,
  "3.8.3": 5, "3.8.4": 1, "3.8.5": 1, "3.8.6": 1, "3.8.7": 5,
  "3.8.8": 3, "3.8.9": 1, "3.9.1": 3, "3.9.2": 5, "3.10.1": 5,
  "3.10.2": 5, "3.10.3": 1, "3.10.4": 1, "3.10.5": 1, "3.10.6": 1,
  "3.11.1": 3, "3.11.2": 5, "3.11.3": 1, "3.12.1": 5, "3.12.2": 3,
  "3.12.3": 5, "3.13.1": 5, "3.13.2": 5, "3.13.3": 1, "3.13.4": 1,
  "3.13.5": 5, "3.13.6": 5, "3.13.7": 1, "3.13.8": 3, "3.13.9": 1,
  "3.13.10": 1, "3.13.11": 5, "3.13.12": 1, "3.13.13": 1, "3.13.14": 1,
  "3.13.15": 5, "3.13.16": 1, "3.14.1": 5, "3.14.2": 5, "3.14.3": 5,
  "3.14.4": 5, "3.14.5": 3, "3.14.6": 5, "3.14.7": 3
};

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
  let totalDeductions = 0;

  // Track which controls have been assessed
  const controlIds = new Set<string>();
  
  // Process each response
  responses.forEach(response => {
    const controlId = response.controlId;
    controlIds.add(controlId);
    
    // Check if the control is in scope
    const scopingDecision = scopingMap.get(controlId);
    const isInScope = !scopingDecision || scopingDecision.applicable !== false;
    
    // Only include in-scope controls in the calculation
    if (isInScope) {
      inScopeControls++;
      const dodValue = DOD_SCORE_VALUES[controlId] || 1; // Default to 1 if not found
      
      // Calculate deductions based on status
      switch (response.status) {
        case 'yes':
          compliantControls++;
          break;
        case 'partial':
          partialControls++;
          totalDeductions += (dodValue * WEIGHT_PARTIAL);
          break;
        case 'no':
          nonCompliantControls++;
          totalDeductions += dodValue;
          break;
      }
    }
  });

  // Calculate controls not yet assessed (in-scope only)
  const outOfScopeCount = scopingDecisions.filter(d => !d.applicable).length;
  notAssessedControls = totalControls - outOfScopeCount - controlIds.size;
  if (notAssessedControls < 0) notAssessedControls = 0;

  // Add deductions for not assessed controls
  for (const [controlId, value] of Object.entries(DOD_SCORE_VALUES)) {
    if (!controlIds.has(controlId)) {
      const scopingDecision = scopingMap.get(controlId);
      const isInScope = !scopingDecision || scopingDecision.applicable !== false;
      if (isInScope) {
        totalDeductions += value;
      }
    }
  }
  
  // Calculate final SPRS score (can go negative down to -203)
  const sprsScore = Math.max(MIN_SPRS_SCORE, Math.round(MAX_SPRS_SCORE - totalDeductions));
  
  // Calculate implementation percentage based on weighted scores
  const maxPossibleScore = Object.values(DOD_SCORE_VALUES)
    .reduce((sum, value) => sum + value, 0);
  const actualScore = maxPossibleScore - totalDeductions;
  const implementationPercentage = maxPossibleScore > 0 
    ? Math.round((actualScore / maxPossibleScore) * 100)
    : 0;
    
  return {
    sprsScore,
    totalControls,
    inScopeControls,
    compliantControls,
    partialControls,
    nonCompliantControls,
    notAssessedControls,
    totalNonCompliant: nonCompliantControls + notAssessedControls,
    implementationPercentage,
    implementationLevel: getSprsImplementationLevel(sprsScore),
    implementationFactor: getSprsImplementationFactor(implementationPercentage)
  };
}

// Helper to determine SPRS implementation level based on score
export function getSprsImplementationLevel(score: number): string {
  if (score >= 110) return "Level 2 (110 practices)";
  if (score >= 100) return "Level 2 (100-109 practices)";
  if (score >= 80) return "Level 2 (80-99 practices)";
  if (score >= 60) return "Level 1 (60-79 practices)";
  if (score >= 1) return "Level 1 (1-59 practices)";
  if (score >= -100) return "Non-Compliant (0 to -100)";
  return "Severely Non-Compliant (Below -100)";
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