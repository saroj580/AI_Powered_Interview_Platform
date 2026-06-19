"use client";
import { motion } from "framer-motion";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const plans = [
    {
        name: "Free",
        price: 0,
        description: "Perfect for getting started",
        features: ["3 AI Interviews/month", "5 Coding Challenges", "1 Resume Analysis", "Basic AI Feedback", "Progress Dashboard"],
        cta: "Start Free",
        highlighted: false,
    },
    {
        name: "Pro",
        price: 29,
        description: "For serious job seekers",
        features: ["50 AI Interviews/month", "100 Coding Challenges", "10 Resume Analyses", "Detailed AI Reports", "Voice Interviews", "Export PDF Reports", "Priority Support"],
        cta: "Start Pro Trial",
        highlighted: true,
        badge: "Most Popular",
    },
    {
        name: "Enterprise",
        price: 99,
        description: "For teams & recruiters",
        features: ["Unlimited Interviews", "Unlimited Coding", "Recruiter Dashboard", "Custom Assessments", "Candidate Pipeline", "Team Analytics", "API Access", "Dedicated Support"],
        cta: "Contact Sales",
        highlighted: false,
    },
];

export function PricingSection() {
    return (
        <section id="pricing" className="py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <p className="text-primary font-semibold text-sm uppercase tracking-widest mb-3">Pricing</p>
                    <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Simple, transparent pricing</h2>
                    <p className="text-muted-foreground text-lg">Start free. Upgrade when you're ready.</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={cn(
                                "relative rounded-2xl p-7 border flex flex-col",
                                plan.highlighted
                                    ? "bg-gradient-primary border-primary/30 shadow-glow-purple-lg text-white scale-105"
                                    : "bg-card border-border card-hover"
                            )}
                        >
                            {plan.badge && (
                                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-primary font-semibold px-3 shadow-md">
                                    <Sparkles className="h-3 w-3 mr-1" />{plan.badge}
                                </Badge>
                            )}
                            <div className="mb-6">
                                <h3 className={cn("text-xl font-bold mb-1", plan.highlighted ? "text-white" : "text-foreground")}>{plan.name}</h3>
                                <p className={cn("text-sm mb-4", plan.highlighted ? "text-white/70" : "text-muted-foreground")}>{plan.description}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold">${plan.price}</span>
                                    {plan.price > 0 && <span className={plan.highlighted ? "text-white/60" : "text-muted-foreground"}>/month</span>}
                                </div>
                            </div>
                            <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                                {plan.features.map((f) => (
                                    <li key={f} className="flex items-start gap-2 text-sm">
                                        <Check className={cn("h-4 w-4 mt-0.5 shrink-0", plan.highlighted ? "text-white" : "text-primary")} />
                                        <span className={plan.highlighted ? "text-white/85" : "text-foreground/80"}>{f}</span>
                                    </li>
                                ))}
                            </ul>
                            <Button
                                className={cn("w-full font-semibold", plan.highlighted
                                    ? "bg-white text-primary hover:bg-white/90"
                                    : "bg-gradient-primary text-white border-0 hover:opacity-90")}
                            >
                                {plan.cta}
                            </Button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}