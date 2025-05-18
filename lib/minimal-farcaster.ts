"use client"

import { sdk } from "@farcaster/frame-sdk"
import { useState, useEffect } from "react"

// Minimal utility to initialize Farcaster
export function useMinimalFarcasterInit() {
  const [status, setStatus] = useState({
    isInitializing: true,
    isInFarcaster: false,
    isReady: false
  });

  useEffect(() => {
    const init = async () => {
      try {
        // Check if in Farcaster environment
        let inFarcaster = false;
        try {
          inFarcaster = await sdk.isInMiniApp();
        } catch (error) {
          console.warn("Error checking mini app status:", error);
        }

        // Call ready if in Farcaster
        if (inFarcaster) {
          try {
            await sdk.actions.ready();
            console.log("App ready!");
          } catch (error) {
            console.error("Error calling ready():", error);
          }
        }

        // Update status
        setStatus({
          isInitializing: false,
          isInFarcaster: inFarcaster,
          isReady: true
        });
      } catch (error) {
        console.error("Error initializing:", error);
        setStatus({
          isInitializing: false,
          isInFarcaster: false,
          isReady: true
        });
      }
    };

    init();
  }, []);

  return status;
}

// Minimal sign-in function
export async function minimalSignIn() {
  try {
    console.log("Starting Farcaster sign-in process...");
    
    // Generate a nonce
    const nonce = Math.random().toString(36).substring(2);
    
    // Try to sign in
    try {
      await sdk.actions.signIn({ nonce });
      console.log("Sign-in successful");
      return true;
    } catch (error) {
      console.error("Error during sign-in:", error);
      return false;
    }
  } catch (error) {
    console.error("Sign-in process error:", error);
    return false;
  }
}