"use client";
import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
    {
        name: "Priya Sharma",
        role: "Software Engineer @ Google",
        avatar: "PS",
        content: "InterviewAI helped me practice for 3 weeks before my Google interview. The AI feedback was incredibly detailed — it even caught that I was using filler words too much.",
        score: 94,
        color: "from-violet-500 to-purple-600",
    },
    {
        name: "Rahul Mehta",
        role: "Senior Dev @ Microsoft",
        avatar: "RM",
        content: "The coding interview module is phenomenal. Having hidden test cases and AI code review made it feel like a real FAANG interview experience.",
        score: 91,
        color: "from-blue-500 to-indigo-600",
    },
    {
        name: "Ananya Patel",
        role: "Tech Lead @ Amazon",
        avatar: "AP",
        content: "As a recruiter, the assessment tools are exactly what we needed. Creating custom evaluations and tracking candidates through the pipeline is seamless.",
        score: 96,
        color: "from-emerald-500 to-teal-600",
    },
    {
        name: "Vikram Singh",
        role: "Full Stack Dev @ Stripe",
        avatar: "VS",
        content: "Resume analyzer gave me a completely new perspective on how ATS systems work. My next resume scored 23 points higher and I got 3x more callbacks.",
        score: 88,
        color: "from-amber-500 to-orange-600",
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
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                        Loved by candidates and <span className="gradient-text">recruiters alike</span>
                    </h2>
                </motion.div>

                <div className="grid md:grid-cols-2 gap-5">
                    {testimonials.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="rounded-2xl border border-border p-6 card-hover bg-card"
                        >
                            <Quote className="h-8 w-8 text-primary/30 mb-4" />
                            <p className="text-foreground/80 leading-relaxed mb-5 text-[15px]">{t.content}</p>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`h-10 w-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm`}>
                                        {t.avatar}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-sm">{t.name}</p>
                                        <p className="text-muted-foreground text-xs">{t.role}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="flex gap-0.5 mb-0.5 justify-end">
                                        {[1, 2, 3, 4, 5].map(s => <Star key={s} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                                    </div>
                                    <span className="text-xs text-muted-foreground">Score: <span className="text-emerald-500 font-bold">{t.score}</span></span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}