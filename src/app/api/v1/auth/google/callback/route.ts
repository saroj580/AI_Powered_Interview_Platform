import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken, AUTH_COOKIE_NAME } from "@/lib/auth";

interface GoogleTokenResponse {
  access_token: string;
  id_token: string;
  error?: string;
}

interface GoogleUserInfo {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified: boolean;
}

export async function GET(req: NextRequest) {
  // Use the stored origin (set during initiation) so redirect_uri matches exactly
  const savedOrigin = req.cookies.get("oauth_origin")?.value;
  const origin = savedOrigin ?? `${new URL(req.url).protocol}//${new URL(req.url).host}`;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? origin;

  try {
    const { searchParams } = req.nextUrl;
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error || !code) {
      return NextResponse.redirect(`${appUrl}/login?error=google_denied`);
    }

    // Validate CSRF state
    const savedState = req.cookies.get("oauth_state")?.value;
    if (!savedState || savedState !== state) {
      return NextResponse.redirect(`${appUrl}/login?error=invalid_state`);
    }

    // Exchange code for tokens — use same origin as the initiation request
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID ?? "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        redirect_uri: `${origin}/api/v1/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });

    const tokens = (await tokenRes.json()) as GoogleTokenResponse;

    if (tokens.error || !tokens.access_token) {
      console.error("[google/callback] token exchange failed", tokens);
      return NextResponse.redirect(`${appUrl}/login?error=token_exchange`);
    }

    // Get user info from Google
    const userRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    const googleUser = (await userRes.json()) as GoogleUserInfo;

    if (!googleUser.email) {
      return NextResponse.redirect(`${appUrl}/login?error=no_email`);
    }

    // Find existing user by googleId or email
    let user = await prisma.user.findFirst({
      where: {
        OR: [{ googleId: googleUser.sub }, { email: googleUser.email }],
      },
    });

    if (user) {
      // Link Google account if not already linked
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { googleId: googleUser.sub, image: user.image ?? googleUser.picture },
        });
      }
    } else {
      // Create new user
      user = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.sub,
          image: googleUser.picture,
          role: "CANDIDATE",
          onboardingCompleted: false,
        },
      });
    }

    const token = signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      onboardingCompleted: user.onboardingCompleted,
      name: user.name,
    });

    const redirectTo = user.onboardingCompleted
      ? user.role === "RECRUITER"
        ? "/recruiter/dashboard"
        : "/candidate/dashboard"
      : "/onboarding";

    const response = NextResponse.redirect(`${appUrl}${redirectTo}`);

    response.cookies.set(AUTH_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    response.cookies.delete("oauth_state");
    response.cookies.delete("oauth_origin");

    return response;
  } catch (err) {
    console.error("[google/callback]", err);
    return NextResponse.redirect(`${appUrl}/login?error=server_error`);
  }
}
