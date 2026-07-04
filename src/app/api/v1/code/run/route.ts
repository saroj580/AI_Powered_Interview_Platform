import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const LANG_CONFIG: Record<string, { language: string; version: string }> = {
  javascript: { language: "javascript", version: "18.15.0" },
  python:     { language: "python",     version: "3.10.0"  },
  java:       { language: "java",       version: "15.0.2"  },
};

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { code, language } = await req.json() as { code: string; language: string };
  if (!code?.trim()) return NextResponse.json({ output: "", stderr: "", exitCode: 0 });

  const lang = LANG_CONFIG[language] ?? LANG_CONFIG.javascript;

  try {
    const res = await fetch(PISTON_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language: lang.language,
        version: lang.version,
        files: [{ content: code }],
      }),
    });

    if (!res.ok) throw new Error(`Piston API error: ${res.status}`);

    const data = await res.json();
    const output = (data.run?.stdout ?? "") + (data.run?.output ?? "");
    const stderr = (data.run?.stderr ?? "") + (data.compile?.stderr ?? "");
    const exitCode = data.run?.code ?? 0;

    return NextResponse.json({ output, stderr, exitCode });
  } catch (err) {
    console.error("[code/run]", err);
    return NextResponse.json({ error: "Failed to run code — try again shortly" }, { status: 500 });
  }
}
