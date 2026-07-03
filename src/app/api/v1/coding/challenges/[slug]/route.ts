import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { groqChat } from "@/lib/groq";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const challenge = await prisma.codingChallenge.findUnique({ where: { slug } });
  if (!challenge) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Use Groq to expand the short description into a full problem statement
  const prompt = `You are a LeetCode-style problem generator. Given a problem title and short description, return a JSON object with this exact structure:

{
  "fullDescription": "<2-3 sentence problem statement>",
  "examples": [
    { "input": "<example input>", "output": "<example output>", "explanation": "<why>" },
    { "input": "<example input>", "output": "<example output>" }
  ],
  "constraints": ["<constraint 1>", "<constraint 2>", "<constraint 3>"],
  "hints": ["<hint 1>", "<hint 2>"],
  "starterCode": {
    "javascript": "<complete JS function skeleton with JSDoc>",
    "python": "<complete Python function skeleton>",
    "java": "<complete Java Solution class skeleton>"
  }
}

Problem title: ${challenge.title}
Short description: ${challenge.description}
Difficulty: ${challenge.difficulty}
Pattern: ${challenge.pattern}

Return ONLY valid JSON. No markdown.`;

  try {
    const response = await groqChat([{ role: "user", content: prompt }], {
      temperature: 0.3,
      maxTokens: 1024,
    });
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const expanded = JSON.parse(jsonMatch[0]);
      
      // Validate and sanitize the expanded data to ensure all renderable fields are strings
      const sanitized = {
        fullDescription: typeof expanded.fullDescription === 'string' ? expanded.fullDescription : (typeof expanded.fullDescription === 'object' ? JSON.stringify(expanded.fullDescription) : String(expanded.fullDescription ?? '')),
        examples: Array.isArray(expanded.examples) ? expanded.examples.map((ex: any) => ({
          input: typeof ex.input === 'string' ? ex.input : (typeof ex.input === 'object' ? JSON.stringify(ex.input) : String(ex.input ?? '')),
          output: typeof ex.output === 'string' ? ex.output : (typeof ex.output === 'object' ? JSON.stringify(ex.output) : String(ex.output ?? '')),
          explanation: typeof ex.explanation === 'string' ? ex.explanation : (ex.explanation ? (typeof ex.explanation === 'object' ? JSON.stringify(ex.explanation) : String(ex.explanation)) : undefined),
        })) : [],
        constraints: Array.isArray(expanded.constraints) ? expanded.constraints.map((c: any) => typeof c === 'string' ? c : (typeof c === 'object' ? JSON.stringify(c) : String(c))) : [],
        hints: Array.isArray(expanded.hints) ? expanded.hints.map((h: any) => typeof h === 'string' ? h : (typeof h === 'object' ? JSON.stringify(h) : String(h))) : [],
        starterCode: typeof expanded.starterCode === 'object' && expanded.starterCode !== null ? expanded.starterCode : {},
      };
      
      return NextResponse.json({ ...challenge, expanded: sanitized });
    }
  } catch {
    // Fall through — return plain challenge without expansion
  }

  return NextResponse.json({ ...challenge, expanded: null });
}
