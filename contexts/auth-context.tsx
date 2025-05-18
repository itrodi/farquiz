"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { signInWithFarcaster, useFarcasterStatus } from "@/lib/farcaster-safe"

type AuthContextType = {
  user: any | null
  isAuthenticated: boolean
  isLoading: boolean
  isInFarcaster: boolean
  signIn: (provider: "farcaster") => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  isInFarcaster: false,
  signIn: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isInFarcaster, isChecking } = useFarcasterStatus();
  const router = useRouter();

  const signIn = async (provider: "farcaster") => {
    if (isLoading || !isInFarcaster) return;
    
    try {
      setIsLoading(true);

      if (provider === "farcaster") {
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
      setUser(null);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user && !!user.authenticated,
    isLoading: isLoading || isChecking,
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