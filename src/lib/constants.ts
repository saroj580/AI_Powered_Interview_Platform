export const AUTH_COOKIE_NAME = "interviewai_token";

export const ROLES = ["ADMIN", "RECRUITER", "CANDIDATE"] as const;
export const INTERVIEW_TYPES = ["TECHNICAL", "BEHAVIORAL", "CODING", "VOICE", "MIXED"] as const;
export const INTERVIEW_STATUSES = ["DRAFT", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED"] as const;
export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
