import { pgTable, text, serial, integer, boolean, timestamp, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table for authentication
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Assessment table to store assessment metadata
export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  level: text("level").notNull(), // "level1" or "level2"
  organizationName: text("organization_name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedPercentage: integer("completed_percentage").default(0),
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  completedPercentage: true,
});

export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type Assessment = typeof assessments.$inferSelect;

// Control responses table to store user responses to control assessments
export const controlResponses = pgTable("control_responses", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  controlId: text("control_id").notNull(), // e.g. "AC.1.001"
  status: text("status").notNull(), // "yes", "partial", "no", "not_applicable"
  evidence: text("evidence"),
  notes: text("notes"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertControlResponseSchema = createInsertSchema(controlResponses).omit({
  id: true,
  updatedAt: true,
});

export type InsertControlResponse = z.infer<typeof insertControlResponseSchema>;
export type ControlResponse = typeof controlResponses.$inferSelect;

// Activity log table to track user actions
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  action: text("action").notNull(), // e.g. "completed_domain", "uploaded_evidence", etc.
  details: json("details").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  timestamp: true,
});

export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
export type ActivityLog = typeof activityLogs.$inferSelect;

// Scoping decisions table to store which controls are applicable
export const scopingDecisions = pgTable("scoping_decisions", {
  id: serial("id").primaryKey(),
  assessmentId: integer("assessment_id").notNull(),
  controlId: text("control_id").notNull(),
  applicable: boolean("applicable").notNull(),
  reason: text("reason"),
});

export const insertScopingDecisionSchema = createInsertSchema(scopingDecisions).omit({
  id: true,
});

export type InsertScopingDecision = z.infer<typeof insertScopingDecisionSchema>;
export type ScopingDecision = typeof scopingDecisions.$inferSelect;
