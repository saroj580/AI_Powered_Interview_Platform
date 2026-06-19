import Link from "next/link";

const links = {
    Product: ["Features", "Pricing", "Changelog", "Roadmap"],
    Company: ["About", "Blog", "Careers", "Press"],
    Resources: ["Documentation", "Help Center", "API", "Status"],
    Legal: ["Privacy", "Terms", "Cookies", "Security"],
};

export function Footer() {
    return (
        <footer className="border-t border-border bg-muted/20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-4 text-foreground">
                            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                                <span className="text-white font-bold text-xs">IA</span>
                            </div>
                            <span>InterviewAI</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed">AI-powered interviews for modern hiring teams and ambitious candidates.</p>
                    </div>
                    {Object.entries(links).map(([section, items]) => (
                        <div key={section}>
                            <h4 className="font-semibold text-sm mb-4">{section}</h4>
                            <ul className="space-y-2.5">
                                {items.map(item => (
                                    <li key={item}>
                                        <Link href="#" className="text-muted-foreground hover:text-foreground text-sm transition-colors">{item}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-muted-foreground text-sm">© 2025 InterviewAI. All rights reserved.</p>
                    <p className="text-muted-foreground text-sm">Built with ❤️ using Next.js & Gemini AI</p>
                </div>
            </div>
        </footer>
    );
}