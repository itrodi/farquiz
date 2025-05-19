"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useFarcasterAuth, type FarcasterUser } from "@/lib/farcaster-auth-from-docs"

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
  // Use our Farcaster auth hook
  const {
    user,
    isAuthenticated,
    isInitializing: isLoading,
    isInFarcaster,
    signIn,
    signOut
  } = useFarcasterAuth();

  // Context value
  const value = {
    user,
    isAuthenticated,
    isLoading,
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