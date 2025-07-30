import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Sign out from Supabase
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    return NextResponse.json(
      { message: "Logout successful" },
      { status: 200, headers: { 'Set-Cookie': `token=; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(0).toUTCString()}` } }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}