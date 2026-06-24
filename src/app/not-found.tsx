import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
            <div className="text-center">
                <div className="text-8xl font-black text-white/10 mb-4">404</div>
                <div className="h-14 w-14 rounded-2xl bg-gradient-primary flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-white mb-3">Page not found</h1>
                <p className="text-slate-400 mb-8">This page doesn't exist or was moved.</p>
                <Link href="/">
                    <Button className="bg-gradient-primary text-white border-0 hover:opacity-90">Go Home</Button>
                </Link>


                
            </div>
        </div>
    );
}