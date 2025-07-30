import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

async function handleLogout() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  // Sign out from Supabase
  const { error } = await supabase.auth.signOut();
  if (error) throw error;

  // Clear client-side token cookie
  return NextResponse.json(
    { message: "Logout successful" },
    { 
      status: 200,
      headers: { 
        'Set-Cookie': `token=; Path=/; HttpOnly; SameSite=Lax; Expires=${new Date(0).toUTCString()}` 
      } 
    }
  );
}

export async function POST() {
  try {
    return await handleLogout();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}

// Add GET handler
export async function GET() {
  try {
    return await handleLogout();
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}