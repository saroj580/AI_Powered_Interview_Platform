import { NextRequest } from "next/server";
import { extractToken, verifyToken, AuthPayload } from "./auth";

export function getAuthUser(req: NextRequest): AuthPayload | null {
  const token = extractToken(req);
  if (!token) return null;
  return verifyToken(token);
}
