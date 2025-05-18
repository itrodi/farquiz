"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useFarcasterAuth, type FarcasterUser } from "@/lib/improved-farcaster-auth"

type AuthContextType = {
  user: FarcasterUser | null
  isAuthenticated: boolean
  isLoading: boolean
  isInFarcaster: boolean
  signIn: () => Promise<boolean>
  signOut: () => void
}

// Create the context
const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInFarcaster: false,
  signIn: async () => false,
  signOut: () => {},
});

// Auth provider component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    isInitializing,
    isInFarcaster,
    user,
    signIn,
    signOut,
    isAuthenticated
  } = useFarcasterAuth();

  const [autoSignInAttempted, setAutoSignInAttempted] = useState(false);

  // Try auto sign-in once
  useEffect(() => {
    if (isInFarcaster && !isInitializing && !isAuthenticated && !autoSignInAttempted) {
      const attemptSignIn = async () => {
        try {
          await signIn();
        } catch (error) {
          console.error("Auto sign-in error:", error);
        } finally {
          setAutoSignInAttempted(true);
        }
      };
      
      // Add a delay to ensure everything is ready
      const timer = setTimeout(attemptSignIn, 1000);
      return () => clearTimeout(timer);
    }
  }, [isInFarcaster, isInitializing, isAuthenticated, autoSignInAttempted, signIn]);

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading: isInitializing,
    isInFarcaster,
    signIn,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};