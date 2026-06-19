"use client";
import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
    { q: "Is the AI interview similar to a real interview?", a: "Yes. Gemini 2.5 Pro generates role-specific, context-aware questions that adapt based on your answers — simulating real technical and behavioral interviews at top companies." },
    { q: "What coding languages are supported?", a: "We support JavaScript, TypeScript, Python, Java, C++, Go, Rust, and C#. Code is executed via Judge0 with real test cases." },
    { q: "Can I use InterviewAI to screen candidates as a recruiter?", a: "Absolutely. The Enterprise plan includes custom assessment creation, candidate invitations, a pipeline management board, and PDF report exports." },
    { q: "How accurate is the AI evaluation?", a: "Our evaluation covers technical accuracy, communication clarity, problem-solving approach, and confidence. Scores are calibrated against thousands of real interview benchmarks." },
    { q: "Is my interview data private?", a: "Yes. All sessions are encrypted and private to your account. We never share or train on individual interview data without explicit consent." },
    { q: "Can I try it for free?", a: "Yes — the Free plan includes 3 full AI interviews, 5 coding challenges, and 1 resume analysis with no credit card required." },
];

export function FaqSection() {
    return (
        <section className="py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-14"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">Frequently asked questions</h2>
                </motion.div>
                <Accordion className="space-y-3">
                    {faqs.map((faq, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                            <AccordionItem value={`item-${i}`} className="border border-border rounded-xl px-5 bg-card">
                                <AccordionTrigger className="text-left font-medium text-[15px] hover:no-underline py-4">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">{faq.a}</AccordionContent>
                            </AccordionItem>
                        </motion.div>
                    ))}
                </Accordion>
            </div>
        </section>
    );
}