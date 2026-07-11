import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";

// Rextester language IDs — free, no auth required (JS runs client-side)
const REXTESTER_LANG: Record<string, number> = {
  python: 5,  // Python 3
  java:   4,  // Java
};

const REXTESTER_URL = "https://rextester.com/rundotnet/api";

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code, language } = await req.json() as { code: string; language: string };
  if (!code?.trim()) return NextResponse.json({ output: "", stderr: "", exitCode: 0 });

  const langId = REXTESTER_LANG[language];
  if (!langId) {
    return NextResponse.json(
      { error: `Server-side execution not supported for ${language}` },
      { status: 400 },
    );
  }

  try {
    const body = new URLSearchParams({
      LanguageChoiceWrapper: String(langId),
      Program: code,
      Input: "",
      CompilerArgs: "",
    });

    const res = await fetch(REXTESTER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: body.toString(),
    });

    if (!res.ok) throw new Error(`Rextester API error: ${res.status}`);

    const data = await res.json();
    const output = data.Result ?? "";
    const stderr = data.Errors ?? "";
    const exitCode = data.Errors ? 1 : 0;

    return NextResponse.json({ output, stderr, exitCode });
  } catch (err) {
    console.error("[code/run]", err);
    return NextResponse.json({ error: "Failed to run code — try again shortly" }, { status: 500 });
  }
}
