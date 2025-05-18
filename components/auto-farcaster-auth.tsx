// components/auto-farcaster-auth.tsx
"use client"

import { useAuth } from "@/contexts/auth-context"
import { useEffect, useState } from "react"
import { sdk } from "@farcaster/frame-sdk"

export function AutoFarcasterAuth() {
  const { user, signIn, isLoading } = useAuth()
  const [hasAttemptedSignIn, setHasAttemptedSignIn] = useState(false)
  
  useEffect(() => {
    const attemptAutoSignIn = async () => {
      if (isLoading || user || hasAttemptedSignIn) return
      
      try {
        const isInMiniApp = await sdk.isInMiniApp()
        if (isInMiniApp) {
          console.log("Auto signing in with Farcaster...")
          await signIn("farcaster")
        }
      } catch (error) {
        console.error("Auto sign-in error:", error)
      } finally {
        setHasAttemptedSignIn(true)
      }
    }
    
    attemptAutoSignIn()
  }, [isLoading, user, hasAttemptedSignIn, signIn])
  
  return null // This component doesn't render anything
}