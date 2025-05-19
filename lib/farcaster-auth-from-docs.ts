"use client"

import { useEffect, useState } from "react"
import { sdk } from "@farcaster/frame-sdk"

// Type for user data
export type FarcasterUser = {
  fid: number | null
  username: string | null
  displayName: string | null
  pfpUrl: string | null
}

// Safely extract string value from potentially complex object
function safeGetString(value: any): string | null {
  if (value === null || value === undefined) return null
  
  // For strings, just return them
  if (typeof value === 'string') return value
  
  // For numbers or booleans, convert to string
  if (typeof value === 'number' || typeof value === 'boolean') 
    return String(value)
  
  // For objects, don't try to convert them - just return null
  return null
}

// Hook for Farcaster initialization and auth
export function useFarcasterAuth() {
  const [isInitializing, setIsInitializing] = useState(true)
  const [isInFarcaster, setIsInFarcaster] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<FarcasterUser | null>(null)
  
  // Initialize Farcaster and check environment
  useEffect(() => {
    const init = async () => {
      try {
        console.log("Initializing Farcaster...")
        
        // Check if in Farcaster mini app
        let inMiniApp = false
        try {
          inMiniApp = await sdk.isInMiniApp()
          console.log("Is in mini app:", inMiniApp)
        } catch (error) {
          console.warn("Error checking mini app status:", error)
        }
        
        setIsInFarcaster(inMiniApp)
        
        // Call ready if in Farcaster mini app
        if (inMiniApp) {
          try {
            console.log("Calling ready()...")
            await sdk.actions.ready()
            console.log("App ready!")
            
            // Try to get initial user info from context
            try {
              const userContext = sdk.context.user
              if (userContext) {
                // Safely extract primitive values
                setUser({
                  fid: typeof userContext.fid === 'number' ? userContext.fid : null,
                  username: safeGetString(userContext.username),
                  displayName: safeGetString(userContext.displayName),
                  pfpUrl: safeGetString(userContext.pfpUrl)
                })
              }
            } catch (error) {
              console.warn("Error accessing initial user context:", error)
            }
          } catch (error) {
            console.error("Error calling ready():", error)
          }
        }
      } catch (error) {
        console.error("Error in initialization:", error)
      } finally {
        setIsInitializing(false)
      }
    }
    
    init()
  }, [])
  
  // Function to handle sign-in
  const signIn = async () => {
    if (!isInFarcaster) {
      console.warn("Not in Farcaster environment")
      return false
    }
    
    try {
      console.log("Starting sign-in...")
      
      // Generate nonce
      const nonce = Math.random().toString(36).substring(2)
      
      // Request sign-in
      await sdk.actions.signIn({ nonce })
      console.log("Sign-in successful")
      
      // Get user info after sign-in
      try {
        const userContext = sdk.context.user
        if (userContext) {
          const updatedUser = {
            fid: typeof userContext.fid === 'number' ? userContext.fid : null,
            username: safeGetString(userContext.username),
            displayName: safeGetString(userContext.displayName),
            pfpUrl: safeGetString(userContext.pfpUrl)
          }
          
          setUser(updatedUser)
          setIsAuthenticated(true)
          return true
        }
      } catch (error) {
        console.warn("Error accessing user context after sign-in:", error)
      }
      
      return false
    } catch (error) {
      console.error("Error signing in:", error)
      return false
    }
  }
  
  // Function to handle sign-out (just resets state)
  const signOut = () => {
    setUser(null)
    setIsAuthenticated(false)
  }
  
  return {
    isInitializing,
    isInFarcaster,
    isAuthenticated,
    user,
    signIn,
    signOut
  }
}