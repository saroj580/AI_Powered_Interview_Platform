"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
    ResumeSetupMockup,
    QuestionGenerationMockup,
    LiveInterviewMockup,
    FeedbackDashboardMockup,
} from "@/components/landing/how-it-works-mockups";

const steps = [
    {
        number: "01",
        title: "Upload Resume & Define Goal",
        description:
            "Upload your resume, select your target role, experience level, interview type, and difficulty level.",
        benefits: ["ATS Analysis", "Skill Extraction", "Personalized Setup"],
        Mockup: ResumeSetupMockup,
    },
    {
        number: "02",
        title: "AI Generates Personalized Questions",
        description:
            "InterviewAI analyzes your profile and creates a custom interview tailored to your target position.",
        benefits: ["Technical Questions", "Behavioral Questions", "Adaptive Difficulty"],
        Mockup: QuestionGenerationMockup,
    },
    {
        number: "03",
        title: "Take the Interview",
        description:
            "Answer through voice, text, or coding challenges while AI evaluates performance in real time.",
        benefits: ["Coding Environment", "Voice Analysis", "Real-Time Assessment"],
        Mockup: LiveInterviewMockup,
    },
    {
        number: "04",
        title: "Receive Detailed Feedback",
        description:
            "Get a comprehensive performance report with strengths, weaknesses, ATS insights, learning paths, and improvement suggestions.",
        benefits: ["Skill Gap Analysis", "Performance Scores", "Learning Roadmap"],
        Mockup: FeedbackDashboardMockup,
    },
] as const;

const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

function StepContent({
    number,
    title,
    description,
    benefits,
}: {
    number: string;
    title: string;
    description: string;
    benefits: readonly string[];
}) {
    return (
        <div className="flex flex-col justify-center max-w-md lg:max-w-lg">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-4">
                Step {number}
            </p>
            <h3 className="text-2xl sm:text-[1.75rem] font-semibold text-foreground tracking-tight leading-snug mb-4">
                {title}
            </h3>
            <p className="text-[15px] text-muted-foreground leading-relaxed mb-8">
                {description}
            </p>
            <ul className="space-y-2.5">
                {benefits.map((benefit) => (
                    <li key={benefit} className="flex items-center gap-2.5 text-sm text-foreground">
                        <span className="text-primary text-[13px] leading-none" aria-hidden="true">✓</span>
                        {benefit}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-28 sm:py-32 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.header
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, margin: "-80px" }}
                    variants={fadeUp}
                    className="max-w-2xl mb-24 sm:mb-28"
                >
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary mb-4">
                        How It Works
                    </p>
                    <h2 className="text-3xl sm:text-4xl font-semibold text-foreground tracking-tight leading-[1.15] mb-5">
                        Prepare Like a Real Interview. Improve With Every Session.
                    </h2>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                        From resume upload to personalized feedback, InterviewAI guides you through a complete interview preparation journey.
                    </p>
                </motion.header>

                <div className="space-y-28 sm:space-y-36">
                    {steps.map((step, i) => {
                        const reversed = i % 2 === 1;
                        const { Mockup } = step;

                        return (
                            <motion.article
                                key={step.number}
                                initial="hidden"
                                whileInView="show"
                                viewport={{ once: true, margin: "-60px" }}
                                variants={fadeUp}
                                className={cn(
                                    "grid lg:grid-cols-2 gap-12 lg:gap-20 items-center",
                                    reversed && "lg:[&>*:first-child]:order-2 lg:[&>*:last-child]:order-1"
                                )}
                            >
                                <StepContent
                                    number={step.number}
                                    title={step.title}
                                    description={step.description}
                                    benefits={step.benefits}
                                />
                                <div className={cn("w-full", reversed ? "lg:pr-4" : "lg:pl-4")}>
                                    <Mockup />
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
