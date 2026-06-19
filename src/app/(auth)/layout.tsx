import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
            <header className="p-6 sm:p-8">
                <Link href="/" className="flex items-center gap-2.5 font-semibold text-lg w-fit text-[#111827]">
                    <div className="h-8 w-8 rounded-lg bg-[#6D28D9] flex items-center justify-center">
                        <span className="text-white font-bold text-sm">IA</span>
                    </div>
                    <span>InterviewAI</span>
                </Link>
            </header>

            <main className="flex-1 flex items-center justify-center px-4 pb-12 sm:px-6">
                {children}
            </main>
        </div>
    );
}
