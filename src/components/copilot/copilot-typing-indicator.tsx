export function CopilotTypingIndicator() {
    return (
        <div className="flex items-center gap-1 px-4 py-3">
            <span className="sr-only">Interview Copilot is typing</span>
            {[0, 1, 2].map((i) => (
                <span
                    key={i}
                    className="h-2 w-2 rounded-full bg-[#9CA3AF] animate-bounce"
                    style={{ animationDelay: `${i * 150}ms`, animationDuration: "0.9s" }}
                />
            ))}
        </div>
    );
}
