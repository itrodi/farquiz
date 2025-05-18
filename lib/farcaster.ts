import { sdk } from "@farcaster/frame-sdk";

export async function signInWithFarcaster() {
  try {
    console.log("Starting Farcaster sign-in process...");
    
    // Verify we're in a Farcaster mini-app environment
    const isInMiniApp = await sdk.isInMiniApp();
    if (!isInMiniApp) {
      console.log("Not in a Farcaster mini app environment");
      throw new Error("Not in a Farcaster mini app environment");
    }
    
    console.log("Confirmed in mini app, checking context...");
    
    // Get user context from Farcaster - should be available without signing in
    const userContext = sdk.context.user;
    
    if (!userContext || !userContext.fid) {
      console.log("No user context available:", userContext);
      throw new Error("Failed to get user context from Farcaster");
    }
    
    console.log("User context found, generating nonce...");
    
    // Generate a secure nonce
    const nonce = generateNonce();
    
    console.log("Requesting sign-in with nonce...");
    
    // Request sign-in with the nonce
    const signInResult = await sdk.actions.signIn({ nonce });
    
    console.log("Sign-in successful, sending data to backend...");
    
    // Send signature and user data to our backend
    const response = await fetch("/api/auth/farcaster", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        signature: signInResult.signature,
        message: signInResult.message,
        fid: userContext.fid,
        username: userContext.username,
        displayName: userContext.displayName,
        pfpUrl: userContext.pfpUrl,
      }),
    });
    
    if (!response.ok) {
      console.error("Backend authentication failed:", await response.text());
      throw new Error("Backend authentication failed");
    }
    
    const authData = await response.json();
    console.log("Authentication complete:", authData);
    
    return {
      user: authData.user,
      session: authData.session,
      fid: userContext.fid,
      username: userContext.username,
      displayName: userContext.displayName,
      pfpUrl: userContext.pfpUrl,
    };
  } catch (error) {
    console.error("Error signing in with Farcaster:", error);
    throw error;
  }
}

function generateNonce() {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}