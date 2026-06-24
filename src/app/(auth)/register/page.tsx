"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Briefcase, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/stores/auth-store";

type RoleType = "CANDIDATE" | "RECRUITER";

function GoogleIcon() {
    return (
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

export default function RegisterPage() {
    const router = useRouter();
    const { register, isLoading, error, clearError } = useAuthStore();
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState<RoleType>("CANDIDATE");
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        clearError();
        const name = nameRef.current?.value ?? "";
        const email = emailRef.current?.value ?? "";
        const password = passwordRef.current?.value ?? "";
        const result = await register(name, email, password, role);
        if (result.success) {
            router.push(result.redirectTo);
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full max-w-[420px]"
        >
            <div className="rounded-2xl border border-[#E5E7EB] bg-white p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] sm:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-semibold tracking-tight text-[#111827] mb-2">
                        Create your account
                    </h1>
                    <p className="text-sm text-[#6B7280]">
                        Start practicing interviews for free
                    </p>
                </div>

                <div className="mb-6 grid grid-cols-2 gap-2 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-1">
                    {(["CANDIDATE", "RECRUITER"] as RoleType[]).map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={cn(
                                "flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium transition-all",
                                role === r
                                    ? "bg-white text-[#111827] shadow-sm border border-[#E5E7EB]"
                                    : "text-[#6B7280] hover:text-[#111827]"
                            )}
                        >
                            {r === "CANDIDATE" ? (
                                <User className="h-3.5 w-3.5" />
                            ) : (
                                <Briefcase className="h-3.5 w-3.5" />
                            )}
                            {r === "CANDIDATE" ? "Candidate" : "Recruiter"}
                        </button>
                    ))}
                </div>

                <Button
                    variant="outline"
                    className="w-full h-11 border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8FAFC] font-medium"
                    onClick={() => { window.location.href = "/api/v1/auth/google"; }}
                    type="button"
                >
                    <GoogleIcon />
                    Continue with Google
                </Button>

                <div className="flex items-center gap-3 my-6">
                    <Separator className="flex-1 bg-[#E5E7EB]" />
                    <span className="text-xs text-[#6B7280]">or</span>
                    <Separator className="flex-1 bg-[#E5E7EB]" />
                </div>

                {error && (
                    <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        {error}
                    </div>
                )}

                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-medium text-[#111827]">
                            Full name
                        </Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                            <Input
                                id="name"
                                ref={nameRef}
                                placeholder="Alex Johnson"
                                className="h-11 pl-10 bg-white border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus-visible:border-[#6D28D9] focus-visible:ring-[#6D28D9]/20"
                                required
                                minLength={2}
                                autoComplete="name"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium text-[#111827]">
                            Email
                        </Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                            <Input
                                id="email"
                                ref={emailRef}
                                type="email"
                                placeholder="you@example.com"
                                className="h-11 pl-10 bg-white border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus-visible:border-[#6D28D9] focus-visible:ring-[#6D28D9]/20"
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-sm font-medium text-[#111827]">
                            Password
                        </Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6B7280]" />
                            <Input
                                id="password"
                                ref={passwordRef}
                                type={showPassword ? "text" : "password"}
                                placeholder="Min. 8 characters"
                                className="h-11 pl-10 pr-10 bg-white border-[#E5E7EB] text-[#111827] placeholder:text-[#9CA3AF] focus-visible:border-[#6D28D9] focus-visible:ring-[#6D28D9]/20"
                                required
                                minLength={8}
                                autoComplete="new-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280] hover:text-[#111827] transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-11 bg-[#6D28D9] hover:bg-[#7C3AED] text-white font-semibold"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Creating account…
                            </span>
                        ) : "Create Account"}
                    </Button>
                </form>

                <p className="text-center text-xs text-[#6B7280] mt-6 leading-relaxed">
                    By signing up you agree to our{" "}
                    <Link href="/terms" className="text-[#6D28D9] hover:text-[#7C3AED] transition-colors">
                        Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-[#6D28D9] hover:text-[#7C3AED] transition-colors">
                        Privacy Policy
                    </Link>
                </p>

                <p className="text-center text-sm text-[#6B7280] mt-4">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-[#6D28D9] hover:text-[#7C3AED] transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}
