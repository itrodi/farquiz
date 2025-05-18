"use client"

import { sdk } from "@farcaster/frame-sdk"
import { useState, useEffect, useCallback } from "react"

// Authentication state interface
export interface FarcasterUser {
  fid: number | null
  username: string | null
  displayName: string | null
  pfpUrl: string | null
  authenticated: boolean
}

// Global state to persist authentication during the session
let globalAuthState: { user: FarcasterUser | null } = { user: null };

// Hook to handle Farcaster initialization and auth
export function useFarcasterAuth() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [user, setUser] = useState<FarcasterUser | null>(globalAuthState.user);

  // Initialize Farcaster
  useEffect(() => {
    const init = async () => {
      try {
        console.log("Checking Farcaster environment...");
        
        // Check if in Farcaster mini app
        let inMiniApp = false;
        try {
          inMiniApp = await sdk.isInMiniApp();
          console.log("Is in mini app:", inMiniApp);
        } catch (error) {
          console.warn("Error checking mini app status:", error);
        }
        
        setIsInFarcaster(inMiniApp);

        // Call ready() if in Farcaster environment
        if (inMiniApp) {
          try {
            console.log("Calling ready()...");
            await sdk.actions.ready();
            console.log("App ready!");
          } catch (error) {
            console.error("Error calling ready():", error);
          }
          
          // Try to extract user info from context if available
          try {
            const userContext = sdk.context.user;
            if (userContext && userContext.fid) {
              const userData: FarcasterUser = {
                fid: userContext.fid || null,
                username: userContext.username || null,
                displayName: userContext.displayName || null,
                pfpUrl: userContext.pfpUrl || null,
                authenticated: false // Not signed in yet
              };
              
              setUser(userData);
              globalAuthState.user = userData;
            }
          } catch (error) {
            console.warn("Error accessing user context:", error);
          }
        }
        
        setIsReady(true);
      } catch (error) {
        console.error("Error in init:", error);
      } finally {
        setIsInitializing(false);
      }
    };

    init();
  }, []);

  // Perform sign-in
  const signIn = useCallback(async () => {
    if (!isInFarcaster || !isReady) {
      console.warn("Cannot sign in: not in Farcaster or not ready");
      return false;
    }
    
    try {
      console.log("Starting sign-in...");
      
      // Generate nonce
      const nonce = Math.random().toString(36).substring(2);
      
      // Request sign-in
      await sdk.actions.signIn({ nonce });
      console.log("Sign-in successful");
      
      // Update user authenticated state
      if (user) {
        const authenticatedUser = { ...user, authenticated: true };
        setUser(authenticatedUser);
        globalAuthState.user = authenticatedUser;
      } else {
        // Try to get user info again
        try {
          const userContext = sdk.context.user;
          if (userContext && userContext.fid) {
            const userData: FarcasterUser = {
              fid: userContext.fid || null,
              username: userContext.username || null,
              displayName: userContext.displayName || null,
              pfpUrl: userContext.pfpUrl || null,
              authenticated: true
            };
            
            setUser(userData);
            globalAuthState.user = userData;
          }
        } catch (error) {
          console.warn("Error accessing user context after sign-in:", error);
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error signing in:", error);
      return false;
    }
  }, [isInFarcaster, isReady, user]);

  // Sign out (just clear state, no actual SDK call)
  const signOut = useCallback(() => {
    setUser(null);
    globalAuthState.user = null;
  }, []);

  return {
    isInitializing,
    isInFarcaster,
    isReady,
    user,
    signIn,
    signOut,
    isAuthenticated: !!user?.authenticated
  };
}