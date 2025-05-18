// app/api/auth/farcaster/route.ts
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  console.log("API: Handling Farcaster auth request");
  
  try {
    const { fid, username, displayName, pfpUrl, signature, message } = await request.json();
    console.log("API: Got auth request for FID:", fid);
    
    // For demo purposes, we'll create a simplified user object 
    // In a real app, you would verify the signature and connect to your database
    const user = {
      id: `user_${fid}`,
      fid,
      username: username || `user_${fid}`,
      display_name: displayName || `User ${fid}`,
      avatar_url: pfpUrl,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      total_score: 0,
      quizzes_taken: 0,
      quizzes_created: 0
    };
    
    // Create a simple session object
    const session = {
      id: `session_${Date.now()}`,
      user_id: user.id,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
    };
    
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
    }, { status: 200 }); // Return 200 even on error to avoid CORS issues in the demo
  }
}

// Mock endpoint for GET requests
export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Farcaster auth endpoint is working. Use POST to authenticate."
  });
}