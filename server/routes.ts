import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.syncs.list.path, async (req, res) => {
    const syncs = await storage.getSyncs();
    res.json(syncs);
  });

  app.get(api.syncs.get.path, async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }
    const sync = await storage.getSync(id);
    if (!sync) {
      return res.status(404).json({ message: "Sync operation not found" });
    }
    res.json(sync);
  });

  app.post(api.syncs.create.path, async (req, res) => {
    try {
      const input = api.syncs.create.input.parse(req.body);
      const sync = await storage.createSync(input);
      
      // Simulate sync process in background
      setTimeout(async () => {
        await storage.updateSyncStatus(sync.id, "in_progress", "Starting sync process...\nConnecting to " + sync.target + " in " + sync.mode + " mode...\n");
        setTimeout(async () => {
          const success = Math.random() > 0.2; // 80% success rate
          const finalLogs = "Starting sync process...\nConnecting to " + sync.target + " in " + sync.mode + " mode...\n" + 
            (success ? "Synchronization successful.\n" : "Connection failed. Timeout.\n");
          await storage.updateSyncStatus(sync.id, success ? "success" : "failed", finalLogs);
        }, 3000);
      }, 1000);
      
      res.status(201).json(sync);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.syncs.clear.path, async (req, res) => {
    await storage.clearSyncs();
    res.status(204).end();
  });

  // Seed data
  async function seedDatabase() {
    try {
      const existing = await storage.getSyncs();
      if (existing.length === 0) {
        await storage.createSync({ mode: "developer", target: "replit-bond", status: "success", logs: "Sync completed successfully." });
        await storage.createSync({ mode: "production", target: "aws-us-east-1", status: "failed", logs: "Failed to authenticate." });
      }
    } catch(e) {
      console.log("Error seeding:", e);
    }
  }
  
  // Need to wait for table to exist, handled in index.ts or just fire and forget if tables exist.
  seedDatabase().catch(console.error);

  return httpServer;
}
