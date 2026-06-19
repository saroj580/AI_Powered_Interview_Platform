"use client";
import { CopilotLauncher } from "@/components/copilot/copilot-launcher";
import { CopilotPanel } from "@/components/copilot/copilot-panel";
import { useCopilotVisibility } from "@/hooks/use-copilot-visibility";

export function InterviewCopilot() {
    useCopilotVisibility();

    return (
        <>
            <CopilotLauncher />
            <CopilotPanel />
        </>
    );
}
