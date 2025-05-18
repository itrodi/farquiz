// lib/farcaster.ts
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
    
    console.log("Sign-in successful, creating session...");
    
    // For the demo app, we'll simplify and create a user object from Farcaster data
    // without persisting it to localStorage
    const userData = {
      fid: userContext.fid,
      username: userContext.username || `user_${userContext.fid}`,
      displayName: userContext.displayName || `User ${userContext.fid}`,
      pfpUrl: userContext.pfpUrl || null,
      // Add minimal session info for the demo
      session: {
        id: `session_${nonce}`,
        authenticated: true
      }
    };
    
    console.log("Authentication complete:", userData);
    
    return {
      user: userData,
      session: userData.session,
    };
  } catch (error) {
    console.error("Error signing in with Farcaster:", error);
    throw error;
  }
}

function generateNonce() {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

// Function to check if we're in a Farcaster environment
export async function checkFarcasterEnvironment() {
  try {
    return await sdk.isInMiniApp();
  } catch (error) {
    console.error("Error checking Farcaster environment:", error);
    return false;
  }
}

// Function to safely access user context
export function getFarcasterUserContext() {
  try {
    return sdk.context.user;
  } catch (error) {
    console.error("Error accessing user context:", error);
    return null;
  }
}