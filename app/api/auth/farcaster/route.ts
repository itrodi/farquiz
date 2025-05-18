import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = createClient();
  
  try {
    const { signature, message, fid, username, displayName, pfpUrl } = await request.json();
    
    // Verify the signature (in a production app)
    // This would use @farcaster/core to verify the signature
    
    // Check if the user exists in our database
    let { data: user } = await supabase
      .from('profiles')
      .select('*')
      .eq('fid', fid)
      .single();
      
    if (!user) {
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
        
      if (error) throw error;
      user = newUser;
    }
    
    // Create a session for the user
    const { data: session, error } = await supabase.auth.signInWithCustomToken({
      token: signature, // Use the signature as a token
    });
    
    if (error) throw error;
    
    return NextResponse.json({ 
      success: true, 
      user,
      session
    });
  } catch (error) {
    console.error("Authentication error:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Authentication failed" 
    }, { status: 401 });
  }
}