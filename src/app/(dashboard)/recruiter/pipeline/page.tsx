import { KanbanBoard } from "@/components/recruiter/kanban-board";

export default function PipelinePage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Candidate Pipeline</h1>
                <p className="text-muted-foreground text-sm mt-1">Track candidates through each hiring stage</p>
            </div>
            <KanbanBoard />
        </div>
    );
}