import { sdk } from "@farcaster/frame-sdk";

export async function signInWithFarcaster() {
  try {
    // Verify we're in a Farcaster mini-app environment
    const isInMiniApp = await sdk.isInMiniApp();
    if (!isInMiniApp) {
      throw new Error("Not in a Farcaster mini app environment");
    }

    // Generate a secure nonce
    const nonce = generateNonce();

    // Request sign-in with the nonce
    const signInResult = await sdk.actions.signIn({ nonce });
    
    // Get user context from Farcaster
    const userContext = sdk.context.user;
    
    if (!userContext || !userContext.fid) {
      throw new Error("Failed to get user context from Farcaster");
    }
    
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
    
    const authData = await response.json();
    
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