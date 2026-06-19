"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, X, Send } from "lucide-react";
import { useCopilotStore } from "@/stores/copilot-store";
import { useCopilotChat } from "@/hooks/use-copilot-chat";
import { QUICK_ACTIONS, SUGGESTED_QUESTIONS } from "@/lib/copilot/knowledge";
import { CopilotTypingIndicator } from "@/components/copilot/copilot-typing-indicator";
import { cn } from "@/lib/utils";

function CopilotHeader({ onMinimize, onClose }: { onMinimize: () => void; onClose: () => void }) {
    return (
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-3.5 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0">
                    <div className="h-9 w-9 rounded-full bg-[#2563EB]/10 flex items-center justify-center">
                        <span className="text-[#2563EB] font-semibold text-xs">IC</span>
                    </div>
                    <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                </div>
                <div className="min-w-0">
                    <p className="font-semibold text-sm text-[#111827] truncate">Interview Copilot</p>
                    <p className="text-xs text-[#6B7280]">Usually replies instantly</p>
                </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
                <button
                    type="button"
                    onClick={onMinimize}
                    aria-label="Minimize"
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors"
                >
                    <Minus className="h-4 w-4" />
                </button>
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close"
                    className="h-8 w-8 flex items-center justify-center rounded-lg text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#111827] transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
}

function MessageBubble({ role, content }: { role: "user" | "assistant"; content: string }) {
    const isUser = role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn("flex", isUser ? "justify-end" : "justify-start")}
        >
            <div
                className={cn(
                    "max-w-[88%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed whitespace-pre-wrap",
                    isUser
                        ? "bg-[#2563EB] text-white"
                        : "bg-[#F3F4F6] text-[#111827]"
                )}
            >
                {content}
            </div>
        </motion.div>
    );
}

function WelcomeScreen({ onSelect }: { onSelect: (text: string) => void }) {
    return (
        <div className="space-y-5">
            <div>
                <h3 className="text-base font-semibold text-[#111827] mb-1.5">
                    Welcome to Interview Copilot
                </h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">
                    Get personalized guidance for interviews, resumes, coding assessments, and career preparation.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-2">
                {QUICK_ACTIONS.map((action) => (
                    <button
                        key={action.id}
                        type="button"
                        onClick={() => onSelect(action.prompt)}
                        className="flex items-center gap-2.5 rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-left text-sm text-[#111827] hover:bg-[#F8FAFC] hover:border-[#D1D5DB] transition-colors"
                    >
                        <span className="text-base leading-none" aria-hidden="true">{action.emoji}</span>
                        <span className="font-medium">{action.label}</span>
                    </button>
                ))}
            </div>

            <div>
                <p className="text-xs font-medium text-[#6B7280] uppercase tracking-wide mb-2.5">
                    Suggested questions
                </p>
                <div className="flex flex-col gap-2">
                    {SUGGESTED_QUESTIONS.map((q) => (
                        <button
                            key={q}
                            type="button"
                            onClick={() => onSelect(q)}
                            className="rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-3.5 py-2.5 text-left text-[13px] text-[#374151] hover:bg-white hover:border-[#D1D5DB] transition-colors"
                        >
                            {q}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ChatInput({ onSend, disabled }: { onSend: (text: string) => void; disabled: boolean }) {
    const [value, setValue] = useState("");

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
    }

    return (
        <form onSubmit={handleSubmit} className="border-t border-[#E5E7EB] p-3 shrink-0 bg-white">
            <div className="flex items-end gap-2">
                <textarea
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    placeholder="Ask about interviews, resumes, coding…"
                    rows={1}
                    disabled={disabled}
                    className="flex-1 resize-none rounded-xl border border-[#E5E7EB] bg-white px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/20 disabled:opacity-50 max-h-24"
                />
                <button
                    type="submit"
                    disabled={disabled || !value.trim()}
                    aria-label="Send message"
                    className="shrink-0 h-10 w-10 flex items-center justify-center rounded-xl bg-[#2563EB] text-white disabled:opacity-40 hover:bg-[#1D4ED8] transition-colors"
                >
                    <Send className="h-4 w-4" />
                </button>
            </div>
        </form>
    );
}

function CopilotChatBody() {
    const messages = useCopilotStore((s) => s.messages);
    const hasStartedChat = useCopilotStore((s) => s.hasStartedChat);
    const { sendMessage, isTyping } = useCopilotChat();
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }, [messages, isTyping]);

    return (
        <>
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 min-h-0">
                {!hasStartedChat ? (
                    <WelcomeScreen onSelect={sendMessage} />
                ) : (
                    <div className="space-y-3">
                        {messages.map((msg) => (
                            <MessageBubble key={msg.id} role={msg.role} content={msg.content} />
                        ))}
                        {isTyping && <CopilotTypingIndicator />}
                    </div>
                )}
            </div>
            <ChatInput onSend={sendMessage} disabled={isTyping} />
        </>
    );
}

function DesktopPanel() {
    const isOpen = useCopilotStore((s) => s.isOpen);
    const close = useCopilotStore((s) => s.close);
    const minimize = useCopilotStore((s) => s.minimize);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.96, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: 8 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="hidden sm:flex fixed z-50 bottom-6 right-6 w-[380px] max-h-[70vh] h-[600px] flex-col rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_8px_40px_rgba(0,0,0,0.12)] overflow-hidden"
                >
                    <CopilotHeader onMinimize={minimize} onClose={close} />
                    <CopilotChatBody />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

function MobileSheet() {
    const isOpen = useCopilotStore((s) => s.isOpen);
    const close = useCopilotStore((s) => s.close);
    const minimize = useCopilotStore((s) => s.minimize);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="sm:hidden fixed inset-0 z-50 bg-black/20"
                        onClick={close}
                        aria-hidden="true"
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
                        className="sm:hidden fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-2xl border-t border-[#E5E7EB] bg-white shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
                        style={{ height: "min(85vh, 640px)" }}
                    >
                        <div className="flex justify-center pt-2.5 pb-1 shrink-0">
                            <span className="h-1 w-10 rounded-full bg-[#E5E7EB]" />
                        </div>
                        <CopilotHeader onMinimize={minimize} onClose={close} />
                        <CopilotChatBody />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function CopilotPanel() {
    return (
        <>
            <DesktopPanel />
            <MobileSheet />
        </>
    );
}
