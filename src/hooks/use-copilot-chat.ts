"use client";
import { useMutation } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { generateCopilotResponse } from "@/lib/copilot/responses";
import type { CopilotMessage } from "@/lib/copilot/types";
import { useCopilotStore } from "@/stores/copilot-store";
import { resolvePageContext } from "@/hooks/use-copilot-visibility";

function createId() {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

export function useCopilotChat() {
    const pathname = usePathname();
    const addMessage = useCopilotStore((s) => s.addMessage);
    const setHasStartedChat = useCopilotStore((s) => s.setHasStartedChat);

    const mutation = useMutation({
        mutationFn: async (userText: string) => {
            const pageContext = resolvePageContext(pathname);
            await new Promise((r) => setTimeout(r, 900 + Math.random() * 600));
            return generateCopilotResponse({ pageContext, message: userText });
        },
        onMutate: (userText) => {
            const userMessage: CopilotMessage = {
                id: createId(),
                role: "user",
                content: userText,
                timestamp: Date.now(),
            };
            addMessage(userMessage);
            setHasStartedChat(true);
        },
        onSuccess: (response) => {
            const assistantMessage: CopilotMessage = {
                id: createId(),
                role: "assistant",
                content: response,
                timestamp: Date.now(),
            };
            addMessage(assistantMessage);
        },
    });

    return {
        sendMessage: mutation.mutate,
        isTyping: mutation.isPending,
    };
}
