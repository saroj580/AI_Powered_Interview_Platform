import type { CopilotPageContext } from "./types";

interface ResponseContext {
    pageContext: CopilotPageContext;
    message: string;
}

const FEATURE_LINKS = {
    mockInterview: "/candidate/interviews/new",
    resume: "/candidate/resume",
    coding: "/candidate/coding",
    progress: "/candidate/progress",
    pricing: "/#pricing",
    register: "/register",
} as const;

function includesAny(text: string, keywords: string[]) {
    return keywords.some((k) => text.includes(k));
}

export function generateCopilotResponse({ pageContext, message }: ResponseContext): string {
    const text = message.toLowerCase();

    if (includesAny(text, ["resume", "ats", "cv", "upload"])) {
        return `Our Resume Analyzer parses your PDF, extracts skills, and scores ATS compatibility. Upload your resume at the analyzer, then use those insights to tailor mock interviews.

Based on your goal, you may benefit from a resume review first — then a Mock Interview session aligned to your target role.

→ Resume Analyzer: ${FEATURE_LINKS.resume}`;
    }

    if (includesAny(text, ["coding", "leetcode", "algorithm", "dsa", "monaco"])) {
        return `Coding Assessments include a Monaco editor, hidden test cases, and AI code review — similar to a real technical screen.

Start with easy challenges to warm up, then move to medium problems in your stack. I recommend pairing coding practice with mock interviews for full coverage.

→ Coding Challenges: ${FEATURE_LINKS.coding}`;
    }

    if (includesAny(text, ["react", "frontend", "javascript", "typescript", "vue", "angular"])) {
        return `For React interviews, focus on: hooks (useCallback, useMemo, useEffect), state management, performance optimization, and component architecture.

Practice explaining trade-offs out loud — interviewers care as much about communication as correctness. InterviewAI generates React-specific questions based on your experience level.

Based on your goal, you may benefit from a Mock Interview session with technical + behavioral questions.

→ Start Mock Interview: ${FEATURE_LINKS.mockInterview}`;
    }

    if (includesAny(text, ["java", "backend", "spring", "node", "api"])) {
        return `Backend interviews typically cover: REST API design, databases, concurrency, caching, and system design basics.

Here are sample areas to prepare:
• OOP principles and design patterns
• SQL vs NoSQL trade-offs
• Authentication and authorization
• Rate limiting and scalability

I can help you generate Java backend questions tailored to your level in a mock session.

→ Generate questions: ${FEATURE_LINKS.mockInterview}`;
    }

    if (includesAny(text, ["system design", "architecture", "scalability", "distributed"])) {
        return `System design interviews evaluate how you break down large problems: requirements, scale estimates, high-level architecture, data model, and bottlenecks.

A strong approach:
1. Clarify functional and non-functional requirements
2. Estimate traffic and storage
3. Draw core components and data flow
4. Discuss trade-offs and failure modes

Practice with our mixed-difficulty mock interviews that include system design prompts.

→ Practice now: ${FEATURE_LINKS.mockInterview}`;
    }

    if (includesAny(text, ["hr", "behavioral", "star", "tell me about yourself", "soft skill"])) {
        return `HR and behavioral rounds use the STAR method: Situation, Task, Action, Result.

Common questions:
• Tell me about yourself
• Describe a conflict with a teammate
• A time you failed and what you learned
• Why do you want this role?

Record voice answers in InterviewAI to get feedback on clarity, pacing, and confidence.

→ Voice Mock Interview: ${FEATURE_LINKS.mockInterview}`;
    }

    if (includesAny(text, ["company", "google", "amazon", "meta", "microsoft", "faang", "startup"])) {
        return `Company-specific prep means aligning your stories and technical depth with that company's bar.

Steps:
1. Research the role's interview loop (phone screen → technical → onsite)
2. Study their stack and recent engineering blog posts
3. Practice timed mock sessions at the target difficulty
4. Review your Interview Report for weak areas before the real interview

→ Company-aligned mock interview: ${FEATURE_LINKS.mockInterview}`;
    }

    if (includesAny(text, ["roadmap", "learn", "study plan", "improve", "performance", "score", "weak"])) {
        return `Your Progress Dashboard tracks scores across technical, communication, problem-solving, and confidence over time.

To improve faster:
• Review Interview Reports after every session
• Focus on one weak area per week
• Alternate coding practice with mock interviews
• Re-analyze your resume as skills evolve

→ View progress: ${FEATURE_LINKS.progress}`;
    }

    if (includesAny(text, ["price", "pricing", "plan", "pro", "free", "upgrade", "cost"])) {
        return `InterviewAI offers a Free plan to get started (3 AI interviews, 5 coding challenges, 1 resume analysis) and Pro for serious preparation with detailed reports and voice interviews.

The Free plan is enough to evaluate the platform. Upgrade when you're practicing weekly and want unlimited sessions.

→ Compare plans: ${FEATURE_LINKS.pricing}`;
    }

    if (includesAny(text, ["platform", "feature", "help", "what can", "how does"])) {
        return `InterviewAI is your end-to-end interview preparation platform:

• Mock Interviews — AI-generated, adaptive questions
• Coding Assessments — real editor + test cases
• Resume Analyzer — ATS score and skill extraction
• Progress Dashboard — track improvement over time
• Interview Reports — detailed feedback and learning plans

What would you like to focus on first?`;
    }

    if (includesAny(text, ["generate", "question"])) {
        return `I can guide you to generate personalized questions based on your role, experience level, and interview type (technical, behavioral, coding, or voice).

Head to Mock Interview setup, enter your target role, and InterviewAI builds a custom question set from your profile.

→ Start setup: ${FEATURE_LINKS.mockInterview}`;
    }

    if (includesAny(text, ["project", "portfolio", "github"])) {
        return `Strong resume projects should show measurable impact: users served, latency improved, revenue influenced, or team outcomes.

Include 2–3 projects with:
• Your specific contribution (not just "team project")
• Tech stack and architecture decisions
• Quantified results where possible

Run your resume through our analyzer to see how recruiters might parse it.

→ Analyze resume: ${FEATURE_LINKS.resume}`;
    }

    const contextual: Record<CopilotPageContext, string> = {
        pricing: `You're viewing pricing — the Free plan is a great way to try mock interviews and resume analysis. Pro unlocks voice interviews, detailed PDF reports, and higher limits when you're preparing seriously.

What role are you interviewing for? I can suggest the right plan.`,
        resume: `You're on the Resume Analyzer — upload a PDF or DOCX and we'll extract skills, score ATS compatibility, and suggest target roles. Follow up with a mock interview tailored to your resume.`,
        "mock-interview": `You're setting up a mock interview — choose your interview type, role, difficulty, and question count. The AI adapts follow-up questions based on your answers in real time.`,
        "interview-report": `You're reviewing an interview report — focus on strengths to reinforce and weaknesses for your next study sprint. Retry similar questions after practicing weak topics.`,
        coding: `You're in coding assessments — start with problems matching your target level, then review AI feedback on time and space complexity.`,
        progress: `Your progress dashboard shows trends over time — look for consistent improvement in your lowest-scoring dimension.`,
        dashboard: `Welcome back — pick up where you left off with a mock interview, coding challenge, or resume refresh.`,
        landing: `InterviewAI helps you prepare like it's the real interview — mock sessions, coding challenges, resume analysis, and detailed feedback.

What are you preparing for? I can point you to the right feature.`,
        general: `I'm here to help with interview prep, resume strategy, coding practice, and navigating InterviewAI.

Tell me your target role or what you'd like to work on today.`,
    };

    return contextual[pageContext] ?? contextual.general;
}
