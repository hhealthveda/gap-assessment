import express, { type Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertAssessmentSchema, 
  insertControlResponseSchema, 
  insertActivityLogSchema,
  insertScopingDecisionSchema
} from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for assessments
  app.get("/api/assessments", async (req: Request, res: Response) => {
    try {
      const assessments = await storage.getAssessments();
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments" });
    }
  });

  app.get("/api/assessments/:id", async (req: Request, res: Response) => {
    try {
      const assessment = await storage.getAssessment(Number(req.params.id));
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment" });
    }
  });

  app.post("/api/assessments", async (req: Request, res: Response) => {
    try {
      const validatedData = insertAssessmentSchema.parse(req.body);
      const assessment = await storage.createAssessment(validatedData);
      res.status(201).json(assessment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to create assessment" });
    }
  });

  app.patch("/api/assessments/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const validatedData = insertAssessmentSchema.partial().parse(req.body);
      const assessment = await storage.updateAssessment(id, validatedData);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to update assessment" });
    }
  });

  app.patch("/api/assessments/:id/completion", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const { percentage } = req.body;
      
      if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
        return res.status(400).json({ message: "Percentage must be a number between 0 and 100" });
      }
      
      const assessment = await storage.updateAssessmentCompletionPercentage(id, percentage);
      
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to update assessment completion" });
    }
  });

  app.delete("/api/assessments/:id", async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const success = await storage.deleteAssessment(id);
      
      if (!success) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete assessment" });
    }
  });

  // API routes for control responses
  app.get("/api/assessments/:assessmentId/responses", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const responses = await storage.getControlResponses(assessmentId);
      res.json(responses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch control responses" });
    }
  });

  app.get("/api/assessments/:assessmentId/responses/:controlId", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const controlId = req.params.controlId;
      const response = await storage.getControlResponse(assessmentId, controlId);
      
      if (!response) {
        return res.status(404).json({ message: "Control response not found" });
      }
      
      res.json(response);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch control response" });
    }
  });

  app.post("/api/assessments/:assessmentId/responses", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const validatedData = insertControlResponseSchema.parse({
        ...req.body,
        assessmentId
      });
      
      const response = await storage.saveControlResponse(validatedData);
      
      // Add activity log
      await storage.addActivityLog({
        assessmentId,
        action: "updated_control",
        details: {
          controlId: validatedData.controlId,
          status: validatedData.status
        }
      });
      
      res.status(201).json(response);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to save control response" });
    }
  });

  // API routes for activity logs
  app.get("/api/assessments/:assessmentId/activities", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const logs = await storage.getActivityLogs(assessmentId, limit);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  app.post("/api/assessments/:assessmentId/activities", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const validatedData = insertActivityLogSchema.parse({
        ...req.body,
        assessmentId
      });
      
      const log = await storage.addActivityLog(validatedData);
      res.status(201).json(log);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to add activity log" });
    }
  });

  // API routes for scoping decisions
  app.get("/api/assessments/:assessmentId/scoping", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const decisions = await storage.getScopingDecisions(assessmentId);
      res.json(decisions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scoping decisions" });
    }
  });

  app.post("/api/assessments/:assessmentId/scoping", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const validatedData = insertScopingDecisionSchema.parse({
        ...req.body,
        assessmentId
      });
      
      const decision = await storage.saveScopingDecision(validatedData);
      
      // Add activity log
      await storage.addActivityLog({
        assessmentId,
        action: "updated_scoping",
        details: {
          controlId: validatedData.controlId,
          applicable: validatedData.applicable
        }
      });
      
      res.status(201).json(decision);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          details: fromZodError(error).message 
        });
      }
      res.status(500).json({ message: "Failed to save scoping decision" });
    }
  });

  // Simple endpoint to calculate completion percentages
  app.get("/api/assessments/:assessmentId/calculate-completion", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      
      // Get assessment to determine level
      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      // Get all responses for this assessment
      const responses = await storage.getControlResponses(assessmentId);
      
      // Get all scoping decisions
      const scopingDecisions = await storage.getScopingDecisions(assessmentId);
      
      // Calculate statistics
      const totalControls = assessment.level === "level1" ? 17 : 110;
      const applicableControls = totalControls - scopingDecisions.filter(d => !d.applicable).length;
      const answeredControls = responses.filter(r => r.status !== "not_applicable").length;
      
      const compliantControls = responses.filter(r => r.status === "yes").length;
      const partialControls = responses.filter(r => r.status === "partial").length;
      const nonCompliantControls = responses.filter(r => r.status === "no").length;
      
      // Calculate completion percentage
      const completionPercentage = applicableControls > 0
        ? Math.round((answeredControls / applicableControls) * 100)
        : 0;
      
      // Calculate compliance percentage
      const complianceScore = applicableControls > 0
        ? Math.round(((compliantControls + (partialControls * 0.5)) / applicableControls) * 100)
        : 0;
      
      // Update assessment completion percentage
      await storage.updateAssessmentCompletionPercentage(assessmentId, completionPercentage);
      
      res.json({
        totalControls,
        applicableControls,
        answeredControls,
        compliantControls,
        partialControls,
        nonCompliantControls,
        completionPercentage,
        complianceScore
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate completion statistics" });
    }
  });

  // API endpoint for SPRS score calculation (Level 2 only)
  app.get("/api/assessments/:assessmentId/sprs-score", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      
      // Get assessment to determine level
      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      // Only calculate SPRS for Level 2 assessments
      if (assessment.level !== "level2") {
        return res.status(400).json({ 
          message: "SPRS scoring is only available for CMMC Level 2 assessments"
        });
      }
      
      // Get all responses for this assessment
      const responses = await storage.getControlResponses(assessmentId);
      
      // Get all scoping decisions
      const scopingDecisions = await storage.getScopingDecisions(assessmentId);
      
      // Count totals for SPRS calculation
      const totalControls = 110; // Level 2 has 110 practices
      
      // Create a map of scoping decisions by controlId for quick lookup
      const scopingMap = new Map();
      scopingDecisions.forEach(decision => {
        scopingMap.set(decision.controlId, decision);
      });
      
      // Initialize counters and arrays
      let inScopeControls = 0;
      let compliantControls = 0;
      let partialControls = 0;
      let nonCompliantControls = 0;
      let notAssessedControls = 0;
      
      // Process responses based on DoD SPRS calculation methodology
      // For controls not answered, consider them non-compliant
      const controlIds = new Set();
      
      // Count responses by status
      responses.forEach(response => {
        controlIds.add(response.controlId);
        
        // Check if control is in scope
        const scopingDecision = scopingMap.get(response.controlId);
        const isInScope = !scopingDecision || scopingDecision.applicable !== false;
        
        if (isInScope) {
          inScopeControls++;
          
          // Count by status
          if (response.status === "yes") {
            compliantControls++;
          } else if (response.status === "partial") {
            partialControls++;
          } else if (response.status === "no") {
            nonCompliantControls++;
          }
        }
      });
      
      // Calculate controls not yet assessed (only in-scope)
      const outOfScopeCount = scopingDecisions.filter(d => !d.applicable).length;
      notAssessedControls = totalControls - outOfScopeCount - controlIds.size;
      if (notAssessedControls < 0) notAssessedControls = 0;
      
      // Include not-assessed controls in the non-compliant category for SPRS calculation
      const totalNonCompliant = nonCompliantControls + notAssessedControls;
      
      // SPRS score is based on subtracting from full compliance (110 points)
      // Non-compliant controls = -1 point each
      // Partially compliant controls = -0.5 points each
      const deductions = totalNonCompliant + (partialControls * 0.5);
      const sprsScore = Math.max(0, Math.round(totalControls - deductions));
      
      // Calculate implementation percentage based on assessed controls
      const implementationPercentage = inScopeControls > 0 
        ? Math.round((sprsScore / inScopeControls) * 100)
        : 0;
      
      // Determine implementation level and factor according to DoD guidelines
      let implementationLevel = "Not Scored (0 practices)";
      if (sprsScore >= 110) implementationLevel = "Level 2 (110 practices)";
      else if (sprsScore >= 100) implementationLevel = "Level 2 (100-109 practices)";
      else if (sprsScore >= 80) implementationLevel = "Level 2 (80-99 practices)";
      else if (sprsScore >= 60) implementationLevel = "Level 1 (60-79 practices)";
      else if (sprsScore >= 1) implementationLevel = "Level 1 (1-59 practices)";
      
      let implementationFactor = "0.0";
      if (implementationPercentage >= 100) implementationFactor = "1.0";
      else if (implementationPercentage >= 95) implementationFactor = "0.95";
      else if (implementationPercentage >= 90) implementationFactor = "0.9";
      else if (implementationPercentage >= 85) implementationFactor = "0.85";
      else if (implementationPercentage >= 80) implementationFactor = "0.8";
      else if (implementationPercentage >= 75) implementationFactor = "0.75";
      else if (implementationPercentage >= 70) implementationFactor = "0.7";
      else if (implementationPercentage >= 65) implementationFactor = "0.65";
      else if (implementationPercentage >= 60) implementationFactor = "0.6";
      else if (implementationPercentage >= 50) implementationFactor = "0.5";
      else if (implementationPercentage >= 40) implementationFactor = "0.4";
      else if (implementationPercentage >= 30) implementationFactor = "0.3";
      else if (implementationPercentage >= 20) implementationFactor = "0.2";
      else if (implementationPercentage >= 10) implementationFactor = "0.1";
      
      res.json({
        sprsScore,
        totalControls,
        inScopeControls,
        compliantControls,
        partialControls,
        nonCompliantControls,
        notAssessedControls,
        totalNonCompliant,
        implementationPercentage,
        implementationLevel,
        implementationFactor
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate SPRS score" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
