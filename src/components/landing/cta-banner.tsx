"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
    return (
        <section className="py-24 bg-linear-to-br from-primary-700 to-primary-600 relative overflow-hidden">
            <div className="container mx-auto px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-2xl mx-auto"
                >
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-5">
                        Ready to land your dream job?
                    </h2>
                    <p className="text-white/90 text-lg mb-8">
                        Join 50,000+ candidates who practice smarter with InterviewAI. Start your first free session now.
                    </p>
                    <Link href="/register">
                        <Button size="lg" className="bg-white text-primary hover:bg-white/90 h-12 px-8 text-base font-semibold">
                            Start Free — No Credit Card Needed
                            <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </motion.div>
            </div>
        </section>
    );
}