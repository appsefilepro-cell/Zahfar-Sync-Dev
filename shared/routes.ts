import { z } from 'zod';
import { insertSyncOperationSchema, syncOperations } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  syncs: {
    list: {
      method: 'GET' as const,
      path: '/api/syncs' as const,
      responses: {
        200: z.array(z.custom<typeof syncOperations.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/syncs/:id' as const,
      responses: {
        200: z.custom<typeof syncOperations.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/syncs' as const,
      input: insertSyncOperationSchema,
      responses: {
        201: z.custom<typeof syncOperations.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    clear: {
      method: 'DELETE' as const,
      path: '/api/syncs' as const,
      responses: {
        204: z.void()
      }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

export type SyncInput = z.infer<typeof api.syncs.create.input>;
export type SyncResponse = z.infer<typeof api.syncs.create.responses[201]>;
export type SyncListResponse = z.infer<typeof api.syncs.list.responses[200]>;
