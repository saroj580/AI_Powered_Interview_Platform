import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";

// Wandbox compiler IDs — free, no auth required (JavaScript runs client-side)
const WANDBOX_COMPILER: Record<string, string> = {
  python: "cpython-3.12.0",
  java:   "openjdk-21",
};

const WANDBOX_URL = "https://wandbox.org/api/compile.json";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code, language } = await req.json() as { code: string; language: string };
  if (!code?.trim()) return NextResponse.json({ output: "", stderr: "", exitCode: 0 });

  // JavaScript executes client-side; this route handles Python / Java only
  const compiler = WANDBOX_COMPILER[language];
  if (!compiler) {
    return NextResponse.json({ error: `Server-side execution not supported for ${language}` }, { status: 400 });
  }

  try {
    const res = await fetch(WANDBOX_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, compiler }),
    });

    if (!res.ok) throw new Error(`Wandbox API error: ${res.status}`);

    const data = await res.json();
    const output = data.program_output ?? "";
    const stderr = (data.compiler_error ?? "") + (data.program_error ?? "");
    const exitCode = data.status === "0" ? 0 : 1;

    return NextResponse.json({ output, stderr, exitCode });
  } catch (err) {
    console.error("[code/run]", err);
    return NextResponse.json({ error: "Failed to run code — try again shortly" }, { status: 500 });
  }
}
