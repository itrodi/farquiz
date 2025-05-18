"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithFarcaster, checkFarcasterEnvironment, getFarcasterUserContext } from "@/lib/farcaster"

type AuthContextType = {
  user: any | null
  profile: any | null
  isAuthenticated: boolean
  isLoading: boolean
  isInFarcaster: boolean
  signIn: (provider: "farcaster") => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,
  isInFarcaster: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInFarcaster, setIsInFarcaster] = useState(false);
  const router = useRouter();

  // On initial load, check if in Farcaster environment
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Check if we're in a Farcaster environment
        const isFarcaster = await checkFarcasterEnvironment();
        setIsInFarcaster(isFarcaster);
        
        // If in Farcaster, try to get user context
        if (isFarcaster) {
          const context = getFarcasterUserContext();
          if (context && context.fid) {
            // Just create a simplified user object
            setUser({
              fid: context.fid,
              username: context.username || `user_${context.fid}`,
              displayName: context.displayName || `User ${context.fid}`,
              pfpUrl: context.pfpUrl || null,
              authenticated: false // Not fully authenticated until signIn is called
            });
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const signIn = async (provider: "farcaster") => {
    try {
      setIsLoading(true);

      if (provider === "farcaster") {
        if (!isInFarcaster) {
          throw new Error("Not in a Farcaster environment");
        }
        
        const result = await signInWithFarcaster();
        
        if (!result) {
          throw new Error("Failed to sign in with Farcaster");
        }
        
        setUser(result.user);
        return;
      }

      throw new Error(`Unsupported provider: ${provider}`);
    } catch (error) {
      console.error("Error signing in:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Just reset state, don't try to persist
      setUser(null);
      
      // In a real app, you'd need to handle this differently
      // as there's no real "sign out" from Farcaster in a mini app
      
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    profile: user, // Use the same object for both user and profile for simplicity
    isAuthenticated: !!user && (user.session?.authenticated || false),
    isLoading,
    isInFarcaster,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};