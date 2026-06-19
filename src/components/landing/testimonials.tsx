"use client";
import { motion } from "framer-motion";

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Software Engineer @ Google",
        avatar: "PS",
        content: "InterviewAI helped me practice for 3 weeks before my Google interview. The AI feedback was incredibly detailed — it even caught that I was using filler words too much.",
    },
    {
        name: "Rahul Mehta",
        role: "Senior Dev @ Microsoft",
        avatar: "RM",
        content: "The coding interview module is phenomenal. Having hidden test cases and AI code review made it feel like a real FAANG interview experience.",
    },
    {
        name: "Ananya Patel",
        role: "Tech Lead @ Amazon",
        avatar: "AP",
        content: "As a recruiter, the assessment tools are exactly what we needed. Creating custom evaluations and tracking candidates through the pipeline is seamless.",
    },
    {
        name: "Vikram Singh",
        role: "Full Stack Dev @ Stripe",
        avatar: "VS",
        content: "Resume analyzer gave me a completely new perspective on how ATS systems work. My next resume scored 23 points higher and I got 3x more callbacks.",
    },
];

export function TestimonialsSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Testimonials</p>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                        Loved by candidates and recruiters alike
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-6">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-xl border border-border bg-card p-6 card-hover"
                        >
                            <p className="text-foreground leading-relaxed mb-6 text-[15px]">{t.content}</p>
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-primary-100 text-primary-700 dark:bg-primary/25 dark:text-primary-200 flex items-center justify-center font-bold text-sm">
                                    {t.avatar}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm text-foreground">{t.name}</p>
                                    <p className="text-muted-foreground text-xs">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}