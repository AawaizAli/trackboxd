// app/api/auth/logout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    
    // Determine the base URL using environment variable or request origin
    let baseUrl: string;
    if (process.env.NEXTAUTH_URL) {
      baseUrl = process.env.NEXTAUTH_URL;
    } else {
      // Fallback to request origin if env variable is not set
      baseUrl = request.nextUrl.origin;
    }
    
    // Ensure proper URL formatting
    const redirectUrl = new URL("/", baseUrl);
    
    const response = NextResponse.redirect(redirectUrl);

    // Delete all relevant cookies
    [
      'next-auth.session-token',
      '__Secure-next-auth.session-token',
      'spotify-access-token',
      'spotify-refresh-token'
    ].forEach(cookieName => {
      response.cookies.delete(cookieName);
    });

    return response;
  } catch (error) {
    console.error("Logout failed:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}