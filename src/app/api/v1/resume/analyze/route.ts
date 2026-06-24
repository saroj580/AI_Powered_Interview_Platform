import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/get-auth-user";
import { groqChat } from "@/lib/groq";

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    // pdf-parse v2 API: PDFParse class with { data: buffer }
    const { PDFParse } = await import("pdf-parse");
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    return result.text ?? "";
  } catch (err) {
    console.error("[pdf-parse error]", err);
    return "";
  }
}

function extractTextFromDOCX(buffer: Buffer): string {
  try {
    // DOCX is a ZIP; the raw buffer contains XML with <w:t> text nodes
    const content = buffer.toString("latin1");
    const matches = content.match(/<w:t(?:\s[^>]*)?>([^<]+)<\/w:t>/g) ?? [];
    return matches
      .map((m) => m.replace(/<[^>]+>/g, ""))
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  const user = getAuthUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const isPDF = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
    const isDOCX =
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");

    let resumeText = "";

    if (isPDF) {
      resumeText = await extractTextFromPDF(buffer);
    } else if (isDOCX) {
      resumeText = extractTextFromDOCX(buffer);
    }

    if (!resumeText || resumeText.length < 50) {
      return NextResponse.json(
        {
          error:
            "Could not extract text from your file. Make sure it is a text-based (non-scanned) PDF or a DOCX file.",
        },
        { status: 422 }
      );
    }

    // Truncate to avoid token limits (~6000 chars ≈ ~1500 tokens)
    const truncated = resumeText.slice(0, 6000);

    const prompt = `You are an expert ATS (Applicant Tracking System) and career coach. Analyze the following resume and return a JSON object with this exact structure:

{
  "atsScore": <integer 0-100>,
  "percentileBeat": <integer 0-100, estimated % of candidates this resume beats>,
  "skills": [<detected technical and soft skills, max 15 strings>],
  "strengths": [<3-5 specific strengths as short strings>],
  "improvements": [<3-5 specific actionable improvement suggestions>],
  "suggestedRoles": [<3-5 job titles this resume targets well>],
  "experienceLevel": "<one of: Junior | Mid-level | Senior | Lead>",
  "keyHighlights": [<2-3 standout achievements or facts>],
  "missingKeywords": [<5-8 important ATS keywords missing for the target roles>]
}

Resume:
${truncated}

Return ONLY valid JSON. No markdown, no explanation.`;

    const response = await groqChat(
      [{ role: "user", content: prompt }],
      { temperature: 0.3, maxTokens: 1024 }
    );

    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("AI returned no valid JSON");
    }

    const analysis = JSON.parse(jsonMatch[0]);
    return NextResponse.json({ success: true, analysis });
  } catch (err) {
    console.error("[resume/analyze]", err);
    return NextResponse.json(
      { error: "Resume analysis failed. Please try again." },
      { status: 500 }
    );
  }
}
