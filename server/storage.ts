import { db } from "./db";
import { syncOperations, type CreateSyncRequest, type SyncResponse, type SyncListResponse } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getSyncs(): Promise<SyncListResponse>;
  getSync(id: number): Promise<SyncResponse | undefined>;
  createSync(sync: CreateSyncRequest): Promise<SyncResponse>;
  updateSyncStatus(id: number, status: "pending" | "in_progress" | "success" | "failed", logs?: string): Promise<SyncResponse>;
  clearSyncs(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getSyncs(): Promise<SyncListResponse> {
    return await db.select().from(syncOperations).orderBy(desc(syncOperations.startedAt));
  }

  async getSync(id: number): Promise<SyncResponse | undefined> {
    const [sync] = await db.select().from(syncOperations).where(eq(syncOperations.id, id));
    return sync;
  }

  async createSync(sync: CreateSyncRequest): Promise<SyncResponse> {
    const [newSync] = await db.insert(syncOperations).values(sync).returning();
    return newSync;
  }

  async updateSyncStatus(id: number, status: "pending" | "in_progress" | "success" | "failed", logs?: string): Promise<SyncResponse> {
    const updateData: any = { status };
    if (logs) updateData.logs = logs;
    if (status === "success" || status === "failed") {
      updateData.completedAt = new Date();
    }
    
    const [updated] = await db.update(syncOperations)
      .set(updateData)
      .where(eq(syncOperations.id, id))
      .returning();
    return updated;
  }

  async clearSyncs(): Promise<void> {
    await db.delete(syncOperations);
  }
}

export const storage = new DatabaseStorage();
