export const siteConfig = {
    name: "InterviewAI",
    tagline: "AI-Powered Interview Platform for Modern Hiring",
    description:
        "Conduct technical, behavioral and coding interviews with AI-generated questions and real-time evaluation. Practice smarter, get hired faster.",
    url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
};

export const navLinks = {
    marketing: [
        { label: "Features", href: "#features" },
        { label: "How it Works", href: "#how-it-works" },
        { label: "Pricing", href: "/pricing" },
        { label: "Blog", href: "/blog" },
    ],
    candidate: [
        { label: "Dashboard", href: "/candidate/dashboard", icon: "LayoutDashboard" },
        { label: "My Interviews", href: "/candidate/interviews", icon: "Video" },
        { label: "Coding", href: "/candidate/coding", icon: "Code2" },
        { label: "Resume", href: "/candidate/resume", icon: "FileText" },
        { label: "Progress", href: "/candidate/progress", icon: "TrendingUp" },
        { label: "Settings", href: "/candidate/settings", icon: "Settings" },
    ],
    recruiter: [
        { label: "Dashboard", href: "/recruiter/dashboard", icon: "LayoutDashboard" },
        { label: "Assessments", href: "/recruiter/assessments", icon: "ClipboardList" },
        { label: "Candidates", href: "/recruiter/candidates", icon: "Users" },
        { label: "Pipeline", href: "/recruiter/pipeline", icon: "Kanban" },
        { label: "Reports", href: "/recruiter/reports", icon: "BarChart3" },
        { label: "Settings", href: "/recruiter/settings", icon: "Settings" },
    ],
};

export const DIFFICULTIES = ["EASY", "MEDIUM", "HARD"] as const;
export const EXPERIENCE_LEVELS = ["Fresher", "Junior", "Mid-Level", "Senior", "Lead"] as const;
export const INTERVIEW_TYPES = ["Technical", "Behavioral", "Coding", "Voice", "Mixed"] as const;
export const QUESTION_COUNTS = [5, 8, 10, 15, 20] as const;

export const CODING_LANGUAGES = [
    { id: "javascript", label: "JavaScript", judge0Id: 63 },
    { id: "typescript", label: "TypeScript", judge0Id: 74 },
    { id: "python", label: "Python", judge0Id: 71 },
    { id: "java", label: "Java", judge0Id: 62 },
    { id: "cpp", label: "C++", judge0Id: 54 },
    { id: "go", label: "Go", judge0Id: 60 },
    { id: "rust", label: "Rust", judge0Id: 73 },
] as const;