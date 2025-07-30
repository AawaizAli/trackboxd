import { getServerSession } from "next-auth";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      return NextResponse.json({ session: null }, { status: 200 });
    }
    
    return NextResponse.json({
      session: {
        user: {
          id: session.user.id,
          email: session.user.email,
          spotifyId: session.user.user_metadata.provider_id
        }
      }
    }, { status: 200 });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}