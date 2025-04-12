import { 
  users, type User, type InsertUser,
  assessments, type Assessment, type InsertAssessment,
  controlResponses, type ControlResponse, type InsertControlResponse,
  activityLogs, type ActivityLog, type InsertActivityLog,
  scopingDecisions, type ScopingDecision, type InsertScopingDecision
} from "@shared/schema";

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

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private controlResponses: Map<number, ControlResponse>;
  private activityLogs: Map<number, ActivityLog>;
  private scopingDecisions: Map<number, ScopingDecision>;
  private userId: number;
  private assessmentId: number;
  private responseId: number;
  private logId: number;
  private scopingId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.controlResponses = new Map();
    this.activityLogs = new Map();
    this.scopingDecisions = new Map();
    this.userId = 1;
    this.assessmentId = 1;
    this.responseId = 1;
    this.logId = 1;
    this.scopingId = 1;

    // Initialize with sample data
    this.createUser({ username: "admin", password: "password" });
    this.createAssessment({
      name: "CMMC Initial Assessment",
      level: "level1",
      organizationName: "Acme Inc."
    });
    this.createAssessment({
      name: "CMMC Level 2 Assessment",
      level: "level2",
      organizationName: "Acme Inc."
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Assessment methods
  async getAssessments(): Promise<Assessment[]> {
    return Array.from(this.assessments.values());
  }

  async getAssessment(id: number): Promise<Assessment | undefined> {
    return this.assessments.get(id);
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.assessmentId++;
    const now = new Date();
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      createdAt: now,
      updatedAt: now,
      completedPercentage: 0
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async updateAssessment(id: number, assessmentUpdate: Partial<InsertAssessment>): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;

    const updatedAssessment: Assessment = {
      ...assessment,
      ...assessmentUpdate,
      updatedAt: new Date()
    };
    this.assessments.set(id, updatedAssessment);
    return updatedAssessment;
  }

  async updateAssessmentCompletionPercentage(id: number, percentage: number): Promise<Assessment | undefined> {
    const assessment = this.assessments.get(id);
    if (!assessment) return undefined;

    const updatedAssessment: Assessment = {
      ...assessment,
      completedPercentage: percentage,
      updatedAt: new Date()
    };
    this.assessments.set(id, updatedAssessment);
    return updatedAssessment;
  }

  async deleteAssessment(id: number): Promise<boolean> {
    return this.assessments.delete(id);
  }

  // Control response methods
  async getControlResponses(assessmentId: number): Promise<ControlResponse[]> {
    return Array.from(this.controlResponses.values()).filter(
      (response) => response.assessmentId === assessmentId
    );
  }

  async getControlResponse(assessmentId: number, controlId: string): Promise<ControlResponse | undefined> {
    return Array.from(this.controlResponses.values()).find(
      (response) => response.assessmentId === assessmentId && response.controlId === controlId
    );
  }

  async saveControlResponse(insertResponse: InsertControlResponse): Promise<ControlResponse> {
    // Check if response already exists
    const existingResponse = await this.getControlResponse(
      insertResponse.assessmentId,
      insertResponse.controlId
    );

    if (existingResponse) {
      const updatedResponse: ControlResponse = {
        ...existingResponse,
        ...insertResponse,
        updatedAt: new Date()
      };
      this.controlResponses.set(existingResponse.id, updatedResponse);
      return updatedResponse;
    }

    // Create new response
    const id = this.responseId++;
    const response: ControlResponse = {
      ...insertResponse,
      id,
      updatedAt: new Date(),
      evidence: insertResponse.evidence || null,
      notes: insertResponse.notes || null
    };
    this.controlResponses.set(id, response);
    return response;
  }

  async updateControlResponse(id: number, responseUpdate: Partial<InsertControlResponse>): Promise<ControlResponse | undefined> {
    const response = this.controlResponses.get(id);
    if (!response) return undefined;

    const updatedResponse: ControlResponse = {
      ...response,
      ...responseUpdate,
      updatedAt: new Date()
    };
    this.controlResponses.set(id, updatedResponse);
    return updatedResponse;
  }

  // Activity log methods
  async getActivityLogs(assessmentId: number, limit?: number): Promise<ActivityLog[]> {
    const logs = Array.from(this.activityLogs.values())
      .filter((log) => log.assessmentId === assessmentId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    return limit ? logs.slice(0, limit) : logs;
  }

  async addActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const id = this.logId++;
    const log: ActivityLog = {
      ...insertLog,
      id,
      timestamp: new Date()
    };
    this.activityLogs.set(id, log);
    return log;
  }

  // Scoping decision methods
  async getScopingDecisions(assessmentId: number): Promise<ScopingDecision[]> {
    return Array.from(this.scopingDecisions.values()).filter(
      (decision) => decision.assessmentId === assessmentId
    );
  }

  async saveScopingDecision(insertDecision: InsertScopingDecision): Promise<ScopingDecision> {
    // Check if decision already exists
    const existingDecision = Array.from(this.scopingDecisions.values()).find(
      (decision) => decision.assessmentId === insertDecision.assessmentId && decision.controlId === insertDecision.controlId
    );

    if (existingDecision) {
      const updatedDecision: ScopingDecision = {
        ...existingDecision,
        ...insertDecision
      };
      this.scopingDecisions.set(existingDecision.id, updatedDecision);
      return updatedDecision;
    }

    // Create new decision
    const id = this.scopingId++;
    const decision: ScopingDecision = {
      ...insertDecision,
      id,
      reason: insertDecision.reason || null
    };
    this.scopingDecisions.set(id, decision);
    return decision;
  }

  async updateScopingDecision(id: number, decisionUpdate: Partial<InsertScopingDecision>): Promise<ScopingDecision | undefined> {
    const decision = this.scopingDecisions.get(id);
    if (!decision) return undefined;

    const updatedDecision: ScopingDecision = {
      ...decision,
      ...decisionUpdate,
      reason: decisionUpdate.reason || decision.reason
    };
    this.scopingDecisions.set(id, updatedDecision);
    return updatedDecision;
  }
}

export const storage = new MemStorage();
