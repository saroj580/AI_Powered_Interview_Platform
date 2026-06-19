export type CopilotMessageRole = "user" | "assistant";

export interface CopilotMessage {
    id: string;
    role: CopilotMessageRole;
    content: string;
    timestamp: number;
}

export interface QuickAction {
    id: string;
    label: string;
    emoji: string;
    prompt: string;
}

export type CopilotPageContext =
    | "landing"
    | "pricing"
    | "resume"
    | "mock-interview"
    | "interview-report"
    | "coding"
    | "dashboard"
    | "progress"
    | "general";
