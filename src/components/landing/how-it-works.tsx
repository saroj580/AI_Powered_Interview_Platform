"use client";
import { motion } from "framer-motion";
import { Settings2, Cpu, MessageSquare, FileBarChart } from "lucide-react";

const steps = [
    {
        step: "01",
        icon: Settings2,
        title: "Set Up Your Interview",
        description: "Choose your target role, experience level, difficulty, interview type, and number of questions.",
        color: "text-violet-500",
    },
    {
        step: "02",
        icon: Cpu,
        title: "AI Generates Questions",
        description: "Gemini 2.5 Pro creates a custom set of technical, behavioral, and problem-solving questions tailored to your profile.",
        color: "text-blue-500",
    },
    {
        step: "03",
        icon: MessageSquare,
        title: "Complete the Interview",
        description: "Answer questions via text or voice. The AI follows up with context-aware questions based on your responses.",
        color: "text-emerald-500",
    },
    {
        step: "04",
        icon: FileBarChart,
        title: "Get AI Feedback",
        description: "Receive a detailed report with scores, strengths, weaknesses, improvement suggestions, and a learning plan.",
        color: "text-amber-500",
    },
];

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">How It Works</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        From setup to feedback in <span className="gradient-text">minutes</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
                    {/* Connector line on desktop */}
                    <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={step.step}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.12 }}
                            className="flex flex-col items-center text-center"
                        >
                            <div className="relative mb-6">
                                <div className={`h-20 w-20 rounded-2xl bg-background border-2 border-border flex items-center justify-center shadow-card`}>
                                    <step.icon className={`h-8 w-8 ${step.color}`} />
                                </div>
                                <span className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center">
                                    {i + 1}
                                </span>
                            </div>
                            <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}