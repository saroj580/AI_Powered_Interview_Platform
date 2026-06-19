import { cn, getScoreColor, getScoreLabel } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ScoreBadge({ score }: { score: number }) {
    return (
        <div className="flex items-center gap-2">
            <span className={cn("text-2xl font-black", getScoreColor(score))}>{score}</span>
            <Badge variant="secondary" className="text-xs">{getScoreLabel(score)}</Badge>
        </div>
    );
}