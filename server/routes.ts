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
import { generateCsvReport, generateExcelReport, generatePdfReport } from "./reportGenerator";
import { calculateSprsScore } from "../client/src/lib/sprsCalculator";

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
      
      // Verify assessment exists first
      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }
      
      const decisions = await storage.getScopingDecisions(assessmentId);
      // Return empty array instead of throwing if no decisions found
      res.json(decisions || []);
    } catch (error) {
      console.error('Error fetching scoping decisions:', error);
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
      
      // Use the sprsCalculator to get the score with proper DOD weights
      const sprsData = calculateSprsScore(responses, scopingDecisions);
      
      res.json(sprsData);
    } catch (error) {
      console.error('Error calculating SPRS score:', error);
      res.status(500).json({ message: "Failed to calculate SPRS score" });
    }
  });

  // Report generation endpoint
  app.post("/api/assessments/:assessmentId/generate-report", async (req: Request, res: Response) => {
    try {
      const assessmentId = Number(req.params.assessmentId);
      const { format } = req.body;

      // Get all necessary data
      const assessment = await storage.getAssessment(assessmentId);
      if (!assessment) {
        return res.status(404).json({ message: "Assessment not found" });
      }

      const responses = await storage.getControlResponses(assessmentId);
      const scopingDecisions = await storage.getScopingDecisions(assessmentId);
      
      // Calculate SPRS score for Level 2
      let sprsScore = null;
      if (assessment.level === "level2") {
        sprsScore = calculateSprsScore(responses, scopingDecisions);
      }

      // Generate report based on format
      let reportContent;
      const timestamp = new Date().toISOString().split('T')[0];
      
      switch (format) {
        case 'csv':
          reportContent = generateCsvReport(assessment, responses, scopingDecisions, sprsScore);
          res.setHeader('Content-Type', 'text/csv');
          res.setHeader('Content-Disposition', `attachment; filename=cmmc-assessment-${timestamp}.csv`);
          break;
          
        case 'excel':
          reportContent = await generateExcelReport(assessment, responses, scopingDecisions, sprsScore);
          res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
          res.setHeader('Content-Disposition', `attachment; filename=cmmc-assessment-${timestamp}.xlsx`);
          break;
          
        case 'pdf':
        default:
          reportContent = await generatePdfReport(assessment, responses, scopingDecisions, sprsScore);
          res.setHeader('Content-Type', 'application/pdf');
          res.setHeader('Content-Disposition', `attachment; filename=cmmc-assessment-${timestamp}.pdf`);
          break;
      }
      
      res.send(reportContent);
    } catch (error) {
      console.error('Error generating report:', error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
