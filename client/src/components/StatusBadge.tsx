import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

type Status = "pending" | "in_progress" | "success" | "failed";

interface StatusBadgeProps {
  status: Status | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  switch (status) {
    case "success":
      return (
        <Badge variant="outline" className={cn("bg-green-500/15 text-green-400 border-green-500/30 gap-1.5 pr-3", className)}>
          <CheckCircle className="w-3.5 h-3.5" />
          Success
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="outline" className={cn("bg-red-500/15 text-red-400 border-red-500/30 gap-1.5 pr-3", className)}>
          <XCircle className="w-3.5 h-3.5" />
          Failed
        </Badge>
      );
    case "in_progress":
      return (
        <Badge variant="outline" className={cn("bg-blue-500/15 text-blue-400 border-blue-500/30 gap-1.5 pr-3 animate-pulse", className)}>
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          Running
        </Badge>
      );
    default:
      return (
        <Badge variant="outline" className={cn("bg-zinc-500/15 text-zinc-400 border-zinc-500/30 gap-1.5 pr-3", className)}>
          <Clock className="w-3.5 h-3.5" />
          Pending
        </Badge>
      );
  }
}
