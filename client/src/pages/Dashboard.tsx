import { useState } from "react";
import { useSyncs, useCreateSync, useClearSyncs } from "@/hooks/use-syncs";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { format } from "date-fns";
import { 
  RefreshCw, 
  Terminal, 
  Trash2, 
  Activity, 
  Server, 
  ShieldCheck, 
  GitBranch,
  Play
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function Dashboard() {
  const { data: syncs, isLoading } = useSyncs();
  const createSync = useCreateSync();
  const clearSyncs = useClearSyncs();
  const { toast } = useToast();

  const [mode, setMode] = useState("developer");
  const [target, setTarget] = useState("replit-bond");

  const handleSync = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mode || !target) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      await createSync.mutateAsync({ mode, target });
      toast({
        title: "Sync Initiated",
        description: `Started sync for ${target} in ${mode} mode`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to start sync operation",
        variant: "destructive",
      });
    }
  };

  const handleClear = async () => {
    try {
      await clearSyncs.mutateAsync();
      toast({
        title: "History Cleared",
        description: "All past sync logs have been removed",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to clear history",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-12 font-sans selection:bg-primary/20">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-border/50 pb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                <RefreshCw className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                Zahfar Sync
              </h1>
            </div>
            <p className="text-muted-foreground text-lg ml-1">
              Mission Control & Synchronization Dashboard
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium">
              <Activity className="w-4 h-4" />
              System Operational
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
              <Server className="w-4 h-4" />
              v2.4.0
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Controls */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-primary" />
                  New Operation
                </CardTitle>
                <CardDescription>
                  Configure and trigger a new sync task.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSync} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="mode" className="text-sm font-medium text-muted-foreground ml-1">
                      Operation Mode
                    </Label>
                    <div className="relative">
                      <ShieldCheck className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="mode"
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="pl-10 bg-background/50 border-border focus:border-primary/50 transition-all font-mono"
                        placeholder="e.g. developer"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="target" className="text-sm font-medium text-muted-foreground ml-1">
                      Target Environment
                    </Label>
                    <div className="relative">
                      <GitBranch className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                      <Input
                        id="target"
                        value={target}
                        onChange={(e) => setTarget(e.target.value)}
                        className="pl-10 bg-background/50 border-border focus:border-primary/50 transition-all font-mono"
                        placeholder="e.g. replit-bond"
                      />
                    </div>
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    disabled={createSync.isPending}
                  >
                    {createSync.isPending ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Initializing...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5 mr-2 fill-current" />
                        Start Sync
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Quick Stats or Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-card border border-border/50 flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-3xl font-bold text-white mono-text">
                  {syncs?.filter(s => s.status === 'success').length || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Successful</span>
              </div>
              <div className="p-4 rounded-xl bg-card border border-border/50 flex flex-col items-center justify-center text-center space-y-1">
                <span className="text-3xl font-bold text-white mono-text">
                  {syncs?.filter(s => s.status === 'failed').length || 0}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Failed</span>
              </div>
            </div>
          </div>

          {/* Right Column: History */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5 text-muted-foreground" />
                Operation History
              </h2>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleClear}
                disabled={clearSyncs.isPending || !syncs?.length}
                className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Clear Logs
              </Button>
            </div>

            <Card className="glass-panel border-border/50 min-h-[500px] flex flex-col">
              <CardContent className="p-0 flex-1">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full min-h-[400px]">
                    <RefreshCw className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : !syncs || syncs.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground space-y-4">
                    <div className="p-4 rounded-full bg-secondary/50">
                      <Terminal className="w-8 h-8 opacity-50" />
                    </div>
                    <p>No sync operations recorded yet.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-border/30">
                    <div className="grid grid-cols-12 gap-4 p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-secondary/20">
                      <div className="col-span-2">Status</div>
                      <div className="col-span-3">Mode</div>
                      <div className="col-span-4">Target</div>
                      <div className="col-span-3 text-right">Started</div>
                    </div>
                    
                    <div className="max-h-[600px] overflow-y-auto">
                      <AnimatePresence initial={false}>
                        {syncs.map((sync) => (
                          <motion.div
                            key={sync.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, height: 0 }}
                            className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-secondary/10 transition-colors group"
                          >
                            <div className="col-span-2">
                              <StatusBadge status={sync.status} />
                            </div>
                            <div className="col-span-3 font-mono text-sm text-foreground/90 truncate">
                              {sync.mode}
                            </div>
                            <div className="col-span-4 font-mono text-sm text-muted-foreground truncate group-hover:text-foreground/90 transition-colors">
                              {sync.target}
                            </div>
                            <div className="col-span-3 text-right text-xs text-muted-foreground mono-text">
                              {sync.startedAt && format(new Date(sync.startedAt), "MMM d, HH:mm:ss")}
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
