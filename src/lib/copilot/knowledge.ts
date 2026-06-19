import type { QuickAction } from "./types";

export const QUICK_ACTIONS: QuickAction[] = [
    {
        id: "generate-questions",
        label: "Generate Interview Questions",
        emoji: "🎯",
        prompt: "Generate interview questions for my target role.",
    },
    {
        id: "analyze-resume",
        label: "Analyze My Resume",
        emoji: "📄",
        prompt: "How does the resume analyzer work and what should I upload?",
    },
    {
        id: "coding-practice",
        label: "Practice Coding Interview",
        emoji: "💻",
        prompt: "I want to practice coding interviews. Where should I start?",
    },
    {
        id: "hr-questions",
        label: "HR Interview Questions",
        emoji: "🗣",
        prompt: "What are the most common HR interview questions I should prepare for?",
    },
    {
        id: "company-prep",
        label: "Company Specific Preparation",
        emoji: "🏢",
        prompt: "How should I prepare for company-specific interviews?",
    },
    {
        id: "improve-performance",
        label: "Improve Interview Performance",
        emoji: "📈",
        prompt: "How can I improve my interview performance based on my reports?",
    },
    {
        id: "learning-roadmap",
        label: "Learning Roadmap",
        emoji: "🎓",
        prompt: "Create a learning roadmap for interview preparation.",
    },
    {
        id: "platform-help",
        label: "Platform Help",
        emoji: "❓",
        prompt: "What can InterviewAI help me with?",
    },
];

export const SUGGESTED_QUESTIONS = [
    "How should I prepare for a React interview?",
    "What projects should I add to my resume?",
    "Generate Java backend interview questions.",
    "Explain system design interviews.",
    "What are the most common HR questions?",
];

export const NUDGE_MESSAGES = [
    "Need interview guidance?",
    "Ask Interview Copilot",
    "Need help preparing?",
] as const;
