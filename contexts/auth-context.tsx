"use client"

import { createContext, useContext, useState } from "react"

// Create an empty context - we won't actually use it for data in this minimal version
type MinimalAuthContextType = {
  isInitialized: boolean
}

const MinimalAuthContext = createContext<MinimalAuthContextType>({
  isInitialized: false
});

// Minimal auth provider that doesn't do much
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized] = useState(true);

  return (
    <MinimalAuthContext.Provider value={{ isInitialized }}>
      {children}
    </MinimalAuthContext.Provider>
  );
}

// Export a minimal useAuth hook that returns some defaults
export const useAuth = () => {
  const context = useContext(MinimalAuthContext);
  
  // Return a minimal context with dummy values
  return {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    isInFarcaster: false,
    signIn: async () => {},
    signOut: async () => {}
  };
};