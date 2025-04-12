import { 
  users, type User, type InsertUser,
  assessments, type Assessment, type InsertAssessment,
  controlResponses, type ControlResponse, type InsertControlResponse,
  activityLogs, type ActivityLog, type InsertActivityLog,
  scopingDecisions, type ScopingDecision, type InsertScopingDecision
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Assessment methods
  getAssessments(): Promise<Assessment[]>;
  getAssessment(id: number): Promise<Assessment | undefined>;
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  updateAssessment(id: number, assessment: Partial<InsertAssessment>): Promise<Assessment | undefined>;
  updateAssessmentCompletionPercentage(id: number, percentage: number): Promise<Assessment | undefined>;
  deleteAssessment(id: number): Promise<boolean>;

  // Control response methods
  getControlResponses(assessmentId: number): Promise<ControlResponse[]>;
  getControlResponse(assessmentId: number, controlId: string): Promise<ControlResponse | undefined>;
  saveControlResponse(response: InsertControlResponse): Promise<ControlResponse>;
  updateControlResponse(id: number, response: Partial<InsertControlResponse>): Promise<ControlResponse | undefined>;

  // Activity log methods
  getActivityLogs(assessmentId: number, limit?: number): Promise<ActivityLog[]>;
  addActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Scoping decision methods
  getScopingDecisions(assessmentId: number): Promise<ScopingDecision[]>;
  saveScopingDecision(decision: InsertScopingDecision): Promise<ScopingDecision>;
  updateScopingDecision(id: number, decision: Partial<InsertScopingDecision>): Promise<ScopingDecision | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAssessments(): Promise<Assessment[]> {
    return await db.select().from(assessments);
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    const [assessment] = await db.select().from(assessments).where(eq(assessments.id, id));
    return assessment;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async updateAssessment(id: number, assessmentUpdate: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const [updated] = await db
      .update(assessments)
      .set({
        ...assessmentUpdate,
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, id))
      .returning();
    return updated;
  }

  async updateAssessmentCompletionPercentage(id: number, percentage: number): Promise<Assessment | undefined> {
    const [updated] = await db
      .update(assessments)
      .set({
        completedPercentage: percentage,
        updatedAt: new Date(),
      })
      .where(eq(assessments.id, id))
      .returning();
    return updated;
  }

  async deleteAssessment(id: number): Promise<boolean> {
    try {
      // Delete related data first (foreign key constraints)
      await db.delete(controlResponses).where(eq(controlResponses.assessmentId, id));
      await db.delete(activityLogs).where(eq(activityLogs.assessmentId, id));
      await db.delete(scopingDecisions).where(eq(scopingDecisions.assessmentId, id));
      
      // Then delete the assessment
      const result = await db.delete(assessments).where(eq(assessments.id, id)).returning();
      return result.length > 0;
    } catch (error) {
      console.error('Error deleting assessment:', error);
      return false;
    }
  }

  async getControlResponses(assessmentId: number): Promise<ControlResponse[]> {
    return await db
      .select()
      .from(controlResponses)
      .where(eq(controlResponses.assessmentId, assessmentId));
  }

  async getControlResponse(assessmentId: number, controlId: string): Promise<ControlResponse | undefined> {
    const [response] = await db
      .select()
      .from(controlResponses)
      .where(
        and(
          eq(controlResponses.assessmentId, assessmentId),
          eq(controlResponses.controlId, controlId)
        )
      );
    return response;
  }

  async saveControlResponse(insertResponse: InsertControlResponse): Promise<ControlResponse> {
    // Check if a response already exists for this assessment/control
    const existingResponse = await this.getControlResponse(
      insertResponse.assessmentId,
      insertResponse.controlId
    );

    if (existingResponse) {
      // Update the existing response
      const [updated] = await db
        .update(controlResponses)
        .set({
          ...insertResponse,
          updatedAt: new Date(),
        })
        .where(eq(controlResponses.id, existingResponse.id))
        .returning();
      return updated;
    }

    // Create a new response
    const [response] = await db
      .insert(controlResponses)
      .values({
        ...insertResponse,
        updatedAt: new Date(),
      })
      .returning();
    return response;
  }

  async updateControlResponse(id: number, responseUpdate: Partial<InsertControlResponse>): Promise<ControlResponse | undefined> {
    const [updated] = await db
      .update(controlResponses)
      .set({
        ...responseUpdate,
        updatedAt: new Date(),
      })
      .where(eq(controlResponses.id, id))
      .returning();
    return updated;
  }

  async getActivityLogs(assessmentId: number, limit?: number): Promise<ActivityLog[]> {
    const query = db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.assessmentId, assessmentId))
      .orderBy(desc(activityLogs.id));
    
    if (limit !== undefined) {
      // Create new query with limit
      return await query.limit(limit);
    }
    
    return await query;
  }

  async addActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const [log] = await db
      .insert(activityLogs)
      .values(insertLog)
      .returning();
    return log;
  }

  async getScopingDecisions(assessmentId: number): Promise<ScopingDecision[]> {
    return await db
      .select()
      .from(scopingDecisions)
      .where(eq(scopingDecisions.assessmentId, assessmentId));
  }

  async saveScopingDecision(insertDecision: InsertScopingDecision): Promise<ScopingDecision> {
    // Check if a decision already exists for this assessment/control
    const [existingDecision] = await db
      .select()
      .from(scopingDecisions)
      .where(
        and(
          eq(scopingDecisions.assessmentId, insertDecision.assessmentId),
          eq(scopingDecisions.controlId, insertDecision.controlId)
        )
      );

    if (existingDecision) {
      // Update the existing decision
      const [updated] = await db
        .update(scopingDecisions)
        .set(insertDecision)
        .where(eq(scopingDecisions.id, existingDecision.id))
        .returning();
      return updated;
    }

    // Create a new decision
    const [decision] = await db
      .insert(scopingDecisions)
      .values(insertDecision)
      .returning();
    return decision;
  }

  async updateScopingDecision(id: number, decisionUpdate: Partial<InsertScopingDecision>): Promise<ScopingDecision | undefined> {
    const [updated] = await db
      .update(scopingDecisions)
      .set(decisionUpdate)
      .where(eq(scopingDecisions.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();