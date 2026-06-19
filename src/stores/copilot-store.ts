import { create } from "zustand";
import type { CopilotMessage } from "@/lib/copilot/types";

interface CopilotState {
    isLauncherVisible: boolean;
    isOpen: boolean;
    isMinimized: boolean;
    showNudge: boolean;
    nudgeDismissed: boolean;
    hasStartedChat: boolean;
    messages: CopilotMessage[];
    setLauncherVisible: (visible: boolean) => void;
    open: () => void;
    close: () => void;
    minimize: () => void;
    restore: () => void;
    dismissNudge: () => void;
    addMessage: (message: CopilotMessage) => void;
    setHasStartedChat: (started: boolean) => void;
    reset: () => void;
}

export const useCopilotStore = create<CopilotState>((set) => ({
    isLauncherVisible: false,
    isOpen: false,
    isMinimized: false,
    showNudge: false,
    nudgeDismissed: false,
    hasStartedChat: false,
    messages: [],

    setLauncherVisible: (visible) =>
        set((state) => ({
            isLauncherVisible: visible,
            showNudge: visible && !state.nudgeDismissed ? true : state.showNudge,
        })),

    open: () => set({ isOpen: true, isMinimized: false, showNudge: false, nudgeDismissed: true }),
    close: () => set({ isOpen: false, isMinimized: false }),
    minimize: () => set({ isOpen: false, isMinimized: true, showNudge: false }),
    restore: () => set({ isOpen: true, isMinimized: false }),

    dismissNudge: () => set({ showNudge: false, nudgeDismissed: true }),

    addMessage: (message) =>
        set((state) => ({ messages: [...state.messages, message], hasStartedChat: true })),

    setHasStartedChat: (started) => set({ hasStartedChat: started }),

    reset: () =>
        set({
            isOpen: false,
            isMinimized: false,
            showNudge: false,
            hasStartedChat: false,
            messages: [],
        }),
}));
