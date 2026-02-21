import { pgTable, text, serial, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const syncOperations = pgTable("sync_operations", {
  id: serial("id").primaryKey(),
  mode: text("mode").notNull(),
  target: text("target").notNull(),
  status: text("status", { enum: ["pending", "in_progress", "success", "failed"] }).notNull().default("pending"),
  logs: text("logs").default(""),
  startedAt: timestamp("started_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

export const insertSyncOperationSchema = createInsertSchema(syncOperations).omit({
  id: true,
  startedAt: true,
  completedAt: true,
  logs: true
});

export type SyncOperation = typeof syncOperations.$inferSelect;
export type InsertSyncOperation = z.infer<typeof insertSyncOperationSchema>;

export type CreateSyncRequest = InsertSyncOperation;
export type SyncResponse = SyncOperation;
export type SyncListResponse = SyncOperation[];
