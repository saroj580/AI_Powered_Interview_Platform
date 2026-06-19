"use client";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";

const stats = [
    { value: 500, suffix: "+", label: "Engineering Teams" },
    { value: 50000, suffix: "+", label: "Interviews Conducted" },
    { value: 94, suffix: "%", label: "Candidate Satisfaction" },
    { value: 3, suffix: "x", label: "Faster Hiring Process" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    let start = 0;
                    const duration = 1800;
                    const step = (timestamp: number) => {
                        if (!start) start = timestamp;
                        const progress = Math.min((timestamp - start) / duration, 1);
                        setCount(Math.floor(progress * to));
                        if (progress < 1) requestAnimationFrame(step);
                    };
                    requestAnimationFrame(step);
                    observer.disconnect();
                }
            },
            { threshold: 0.5 }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [to]);

    return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export function StatsSection() {
    return (
        <section className="py-16 bg-muted/30 border-y border-border">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className="text-center"
                        >
                            <div className="text-3xl sm:text-4xl font-bold mb-2 text-foreground">
                                <CountUp to={stat.value} suffix={stat.suffix} />
                            </div>
                            <p className="text-muted-foreground text-sm">{stat.label}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}