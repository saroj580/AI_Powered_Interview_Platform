import { InterviewSetupWizard } from "@/components/interview/setup-wizard";

export default function NewInterviewPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Start New Interview</h1>
                <p className="text-muted-foreground text-sm mt-1">Configure your AI-powered interview session</p>
            </div>
            <InterviewSetupWizard />
        </div>
    );
}