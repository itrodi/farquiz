// app/api/auth/farcaster/route.ts
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("API: Handling Farcaster auth request");
  const supabase = createClient();
  
  try {
    const { fid, username, displayName, pfpUrl, signature, message } = await request.json();
    console.log("API: Got auth request for FID:", fid);
    
    // Check if the user exists in our database
    let { data: user, error: userError } = await supabase
      .from('profiles')
      .select('*')
      .eq('fid', fid)
      .single();
      
    if (userError) {
      console.log("API: User not found, creating new user");
      // Create new user if they don't exist
      const { data: newUser, error } = await supabase
        .from('profiles')
        .insert({
          fid,
          username: username || `user_${fid}`,
          display_name: displayName || `User ${fid}`,
          avatar_url: pfpUrl,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_score: 0,
          quizzes_taken: 0,
          quizzes_created: 0
        })
        .select()
        .single();
        
      if (error) {
        console.error("API: Error creating new user:", error);
        throw error;
      }
      user = newUser;
    }
    
    console.log("API: User found/created, signing in");
    
    // Create a session for the user
    // For simplicity in demo, we're not verifying the signature
    const { data: session, error: sessionError } = await supabase.auth.signInWithCustomToken({
      token: signature, // Use the signature as a token
    });
    
    if (sessionError) {
      console.error("API: Session creation error:", sessionError);
      throw sessionError;
    }
    
    console.log("API: Authentication successful");
    
    return NextResponse.json({ 
      success: true, 
      user,
      session
    });
  } catch (error) {
    console.error("API: Authentication error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Authentication failed" 
    }, { status: 401 });
  }
}