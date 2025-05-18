"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export function FarcasterSignInButton() {
  const { signIn } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSignIn = async () => {
    setIsLoading(true)
    setError(null)
    try {
      await signIn("farcaster")
    } catch (err) {
      console.error("Sign in error:", err)
      setError("Failed to sign in with Farcaster")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full">
      <Button 
        onClick={handleSignIn} 
        disabled={isLoading} 
        className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700"
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <svg width="20" height="20" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M125 29.4L125 220.6" stroke="white" strokeWidth="20" strokeLinecap="round"/>
            <path d="M185 100.8L125 160.8L65 100.8" stroke="white" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        {isLoading ? "Connecting..." : "Sign in with Farcaster"}
      </Button>
      
      {error && (
        <div className="mt-2 text-sm text-red-500">{error}</div>
      )}
    </div>
  )
}