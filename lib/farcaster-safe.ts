"use client"

import { useState, useEffect } from "react"
import { sdk } from "@farcaster/frame-sdk"

// Safe functions to work with Farcaster SDK
export async function signInWithFarcaster() {
  try {
    console.log("Starting Farcaster sign-in process...");
    
    // Generate a secure nonce
    const nonce = generateNonce();
    
    // Try to sign in
    let signInResult;
    try {
      signInResult = await sdk.actions.signIn({ nonce });
      console.log("Sign-in successful");
    } catch (error) {
      console.error("Error during sign-in:", error);
      throw new Error("Failed to sign in with Farcaster");
    }
    
    // Create user data manually without accessing methods on SDK objects
    const userData = {
      // Handle user context properties carefully
      fid: getContextValue(sdk.context.user, 'fid'),
      username: getContextValue(sdk.context.user, 'username'),
      displayName: getContextValue(sdk.context.user, 'displayName'),
      pfpUrl: getContextValue(sdk.context.user, 'pfpUrl'),
      authenticated: true
    };
    
    return { user: userData, signature: signInResult?.signature };
  } catch (error) {
    console.error("Error in signInWithFarcaster:", error);
    throw error;
  }
}

// Helper function to safely check if we're in a Farcaster environment
export function useFarcasterStatus() {
  const [status, setStatus] = useState({
    isChecking: true,
    isInFarcaster: false
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const isInMiniApp = await sdk.isInMiniApp();
        setStatus({
          isChecking: false,
          isInFarcaster: isInMiniApp
        });
      } catch (error) {
        console.warn("Error checking Farcaster status:", error);
        setStatus({
          isChecking: false,
          isInFarcaster: false
        });
      }
    };
    
    checkStatus();
  }, []);

  return status;
}

// Helper function to safely initialize the app
export function useInitFarcaster() {
  const { isInFarcaster } = useFarcasterStatus();
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    if (!isInFarcaster) {
      setIsInitialized(true);
      return;
    }
    
    const initApp = async () => {
      try {
        // Call ready to hide splash screen
        await sdk.actions.ready();
        console.log("App ready!");
        
        // Try to set up share state provider
        try {
          sdk.setShareStateProvider(() => ({
            path: window.location.pathname,
            params: window.location.search,
          }));
        } catch (error) {
          console.warn("Error setting share state provider:", error);
        }
        
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing Farcaster app:", error);
        setIsInitialized(true); // Still mark as initialized to not block UI
      }
    };
    
    initApp();
  }, [isInFarcaster]);
  
  return { isInitialized, isInFarcaster };
}

// Helper functions to avoid direct property access
function generateNonce() {
  return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
}

function getContextValue(obj: any, key: string) {
  if (!obj) return null;
  
  try {
    // Use bracket notation to access property without calling methods
    let value = null;
    // Need to handle this very carefully to avoid forbidden operations
    try {
      value = obj[key];
      // Make a simple copy for strings and numbers
      if (typeof value === 'string' || typeof value === 'number') {
        return String(value);
      }
      return value;
    } catch (error) {
      console.warn(`Error accessing ${key} from context:`, error);
      return null;
    }
  } catch (error) {
    console.warn(`Error in getContextValue for ${key}:`, error);
    return null;
  }
}

// Safely get first character from string (for avatar fallbacks)
export function safeGetFirstChar(str: string | null | undefined) {
  if (!str) return '?';
  
  try {
    // Create a safe copy
    const safeStr = String(str);
    // Get first char using bracket notation
    return safeStr[0] || '?';
  } catch (error) {
    return '?';
  }
}