"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCopilotStore } from "@/stores/copilot-store";

const TIME_THRESHOLD_MS = 20_000;
const SCROLL_THRESHOLD = 0.4;

function matchesPath(pathname: string, patterns: string[]) {
    return patterns.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function useCopilotVisibility() {
    const pathname = usePathname();
    const setLauncherVisible = useCopilotStore((s) => s.setLauncherVisible);
    const isLauncherVisible = useCopilotStore((s) => s.isLauncherVisible);
    const triggered = useRef(false);

    useEffect(() => {
        if (triggered.current || isLauncherVisible) return;

        const instantPaths = [
            "/candidate/resume",
            "/candidate/interviews/new",
            "/candidate/coding",
        ];

        if (matchesPath(pathname, ["/candidate/interviews"]) && pathname.includes("/report")) {
            triggered.current = true;
            setLauncherVisible(true);
            return;
        }

        if (
            matchesPath(pathname, ["/candidate/interviews"]) &&
            pathname.includes("/session")
        ) {
            triggered.current = true;
            setLauncherVisible(true);
            return;
        }

        if (instantPaths.some((p) => pathname === p || pathname.startsWith(p))) {
            triggered.current = true;
            setLauncherVisible(true);
            return;
        }

        const timer = setTimeout(() => {
            if (!triggered.current) {
                triggered.current = true;
                setLauncherVisible(true);
            }
        }, TIME_THRESHOLD_MS);

        const onScroll = () => {
            if (triggered.current) return;
            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollHeight <= 0) return;
            const depth = window.scrollY / scrollHeight;
            if (depth >= SCROLL_THRESHOLD) {
                triggered.current = true;
                setLauncherVisible(true);
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        onScroll();

        let pricingObserver: IntersectionObserver | null = null;
        const pricingEl = document.getElementById("pricing");
        if (pricingEl) {
            pricingObserver = new IntersectionObserver(
                ([entry]) => {
                    if (entry.isIntersecting && !triggered.current) {
                        triggered.current = true;
                        setLauncherVisible(true);
                    }
                },
                { threshold: 0.3 }
            );
            pricingObserver.observe(pricingEl);
        }

        return () => {
            clearTimeout(timer);
            window.removeEventListener("scroll", onScroll);
            pricingObserver?.disconnect();
        };
    }, [pathname, setLauncherVisible, isLauncherVisible]);
}

export function resolvePageContext(pathname: string) {
    if (pathname.includes("/report")) return "interview-report" as const;
    if (pathname.includes("/candidate/resume")) return "resume" as const;
    if (pathname.includes("/candidate/interviews")) return "mock-interview" as const;
    if (pathname.includes("/candidate/coding")) return "coding" as const;
    if (pathname.includes("/candidate/progress")) return "progress" as const;
    if (pathname.includes("/candidate/dashboard")) return "dashboard" as const;
    if (pathname === "/" || pathname.includes("marketing")) return "landing" as const;
    return "general" as const;
}
