export type Role = "ADMIN" | "RECRUITER" | "CANDIDATE";
export type Difficulty = "EASY" | "MEDIUM" | "HARD";
export type InterviewType = "TECHNICAL" | "BEHAVIORAL" | "CODING" | "VOICE" | "MIXED";
export type InterviewStatus = "DRAFT" | "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type PipelineStage = "APPLIED" | "INTERVIEW_SCHEDULED" | "INTERVIEW_COMPLETED" | "SHORTLISTED" | "REJECTED" | "HIRED";

export interface User {
    id: string;
    name: string;
    email: string;
    image?: string;
    role: Role;
}

export interface Interview {
    id: string;
    title: string;
    type: InterviewType;
    status: InterviewStatus;
    targetRole: string;
    difficulty: Difficulty;
    questionCount: number;
    durationMinutes: number;
    totalScore?: number;
    completedAt?: string;
    createdAt: string;
}

export interface InterviewScore {
    technical: number;
    communication: number;
    problemSolving: number;
    confidence: number;
    overall: number;
}

export interface CodingChallenge {
    id: string;
    title: string;
    slug: string;
    difficulty: Difficulty;
    category: string;
    tags: string[];
    description: string;
    totalSubmissions: number;
    acceptedSubmissions: number;
}

export interface Candidate {
    id: string;
    name: string;
    email: string;
    image?: string;
    targetRole: string;
    experienceLevel: string;
    totalInterviews: number;
    avgScore: number;
    stage: PipelineStage;
    appliedAt: string;
}

export interface Assessment {
    id: string;
    title: string;
    targetRole: string;
    difficulty: Difficulty;
    type: InterviewType;
    durationMinutes: number;
    questionCount: number;
    totalInvites: number;
    completedCount: number;
    isActive: boolean;
    createdAt: string;
}

export interface NavItem {
    label: string;
    href: string;
    icon?: string;
}