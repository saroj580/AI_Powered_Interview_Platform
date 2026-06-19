"use client";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare } from "lucide-react";
import { NUDGE_MESSAGES } from "@/lib/copilot/knowledge";
import { useCopilotStore } from "@/stores/copilot-store";
import { useEffect } from "react";

export function CopilotLauncher() {
    const isLauncherVisible = useCopilotStore((s) => s.isLauncherVisible);
    const isOpen = useCopilotStore((s) => s.isOpen);
    const isMinimized = useCopilotStore((s) => s.isMinimized);
    const showNudge = useCopilotStore((s) => s.showNudge);
    const open = useCopilotStore((s) => s.open);
    const dismissNudge = useCopilotStore((s) => s.dismissNudge);

    const nudgeText = NUDGE_MESSAGES[0];

    useEffect(() => {
        if (!showNudge) return;
        const timer = setTimeout(dismissNudge, 6000);
        return () => clearTimeout(timer);
    }, [showNudge, dismissNudge]);

    const showButton = isLauncherVisible && (!isOpen || isMinimized);

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.85 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="fixed z-50 bottom-4 right-4 sm:bottom-6 sm:right-6"
                >
                    <AnimatePresence>
                        {showNudge && (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 4 }}
                                className="absolute bottom-[calc(100%+12px)] right-0 whitespace-nowrap rounded-lg border border-[#E5E7EB] bg-white px-3.5 py-2 text-sm text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.08)]"
                            >
                                {nudgeText}
                                <span className="absolute -bottom-1.5 right-6 h-3 w-3 rotate-45 border-r border-b border-[#E5E7EB] bg-white" />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <button
                        type="button"
                        onClick={open}
                        aria-label="Open Interview Copilot"
                        className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-[#2563EB] text-white shadow-[0_4px_20px_rgba(37,99,235,0.35)] transition-shadow duration-300 hover:shadow-[0_6px_24px_rgba(37,99,235,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563EB] focus-visible:ring-offset-2"
                    >
                        <MessageSquare className="h-6 w-6" strokeWidth={2} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
