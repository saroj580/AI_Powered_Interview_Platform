"use client";

const companies = [
    { name: "Google", slug: "google" },
    { name: "Microsoft", slug: "microsoft" },
    { name: "Amazon", slug: "amazon" },
    { name: "Meta", slug: "meta" },
    { name: "Apple", slug: "apple" },
    { name: "Stripe", slug: "stripe" },
    { name: "Netflix", slug: "netflix" },
    { name: "Uber", slug: "uber" },
    { name: "Airbnb", slug: "airbnb" },
    { name: "LinkedIn", slug: "linkedin" },
    { name: "Adobe", slug: "adobe" },
    { name: "Atlassian", slug: "atlassian" },
    { name: "Shopify", slug: "shopify" },
    { name: "Salesforce", slug: "salesforce" },
    { name: "Spotify", slug: "spotify" },
    { name: "Notion", slug: "notion" },
    { name: "Vercel", slug: "vercel" },
    { name: "Figma", slug: "figma" },
] as const;

const marqueeItems = [...companies, ...companies];

function LogoItem({ name, slug }: { name: string; slug: string }) {
    return (
        <div className="flex shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={`/logos/${slug}.svg`}
                alt={`${name} logo`}
                className="h-8 w-auto opacity-60 grayscale transition-all duration-300 ease-in-out hover:opacity-100 hover:grayscale-0 md:h-10 lg:h-12"
                draggable={false}
                loading="lazy"
            />
        </div>
    );
}

export function CompaniesSection() {
    return (
        <section className="bg-[#F8FAFC] px-4 py-[120px] sm:px-8 lg:px-16">
            <div className="mx-auto max-w-[1280px] overflow-hidden rounded-3xl border border-[#E5E7EB] bg-white px-8 py-14 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] sm:px-12 sm:py-16 lg:px-16">
                <header className="mb-14 text-center">
                    <p className="mb-3 text-sm text-[#6B7280]">
                        50,000+ interviews completed
                    </p>
                    <h2 className="text-lg font-medium tracking-tight text-[#111827] sm:text-xl">
                        Trusted by candidates hired at
                    </h2>
                </header>

                <div className="marquee-pausable relative">
                    <div
                        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-linear-to-r from-white to-transparent sm:w-28"
                        aria-hidden="true"
                    />
                    <div
                        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-linear-to-l from-white to-transparent sm:w-28"
                        aria-hidden="true"
                    />

                    <div className="marquee-animate flex w-max items-center gap-[72px] motion-reduce:animate-none lg:gap-24">
                        {marqueeItems.map((company, i) => (
                            <LogoItem
                                key={`${company.slug}-${i}`}
                                name={company.name}
                                slug={company.slug}
                            />
                        ))}
                    </div>
                </div>

                <p className="sr-only">
                    Companies where InterviewAI candidates have been hired:{" "}
                    {companies.map((c) => c.name).join(", ")}
                </p>
            </div>
        </section>
    );
}
