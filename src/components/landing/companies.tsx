"use client";
import { motion } from "framer-motion";

const companies = ["Google", "Microsoft", "Amazon", "Meta", "Stripe", "Airbnb", "Netflix", "Uber"];

export function CompaniesSection() {
    return (
        <section className="py-14 border-y border-border bg-muted/30">
            <div className="container mx-auto px-4">
                <p className="text-center text-sm text-muted-foreground mb-8 font-medium uppercase tracking-widest">
                    Candidates hired at top companies
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8">
                    {companies.map((company, i) => (
                        <motion.div
                            key={company}
                            initial={{ opacity: 0, y: 8 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.08 }}
                            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors font-semibold text-lg tracking-tight"
                        >
                            {company}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}