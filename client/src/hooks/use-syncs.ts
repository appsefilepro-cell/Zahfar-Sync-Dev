import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type SyncInput } from "@shared/routes";

export function useSyncs() {
  return useQuery({
    queryKey: [api.syncs.list.path],
    queryFn: async () => {
      const res = await fetch(api.syncs.list.path);
      if (!res.ok) throw new Error("Failed to fetch sync history");
      return api.syncs.list.responses[200].parse(await res.json());
    },
    // Poll every 5 seconds to check for status updates
    refetchInterval: 5000, 
  });
}

export function useSync(id: number) {
  return useQuery({
    queryKey: [api.syncs.get.path, id],
    queryFn: async () => {
      // Manual URL construction since buildUrl is in shared/routes
      const url = api.syncs.get.path.replace(':id', String(id));
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch sync details");
      return api.syncs.get.responses[200].parse(await res.json());
    },
  });
}

export function useCreateSync() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: SyncInput) => {
      const res = await fetch(api.syncs.create.path, {
        method: api.syncs.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          throw new Error("Invalid sync configuration");
        }
        throw new Error("Failed to start sync");
      }
      return api.syncs.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.syncs.list.path] });
    },
  });
}

export function useClearSyncs() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.syncs.clear.path, {
        method: api.syncs.clear.method,
      });
      if (!res.ok) throw new Error("Failed to clear history");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.syncs.list.path] });
    },
  });
}
