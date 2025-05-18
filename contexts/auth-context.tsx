"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User, Session } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { signInWithFarcaster } from "@/lib/farcaster"

type AuthContextType = {
  user: User | null
  profile: any | null
  session: Session | null
  isLoading: boolean
  signIn: (provider: "farcaster") => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<any | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      try {
        const { data: { session } } = await supabase.auth.getSession()
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Load user profile from Supabase
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          setProfile(userProfile)
        }
      } catch (error) {
        console.error("Error getting session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        // Load user profile from Supabase
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          
        setProfile(userProfile)
      } else {
        setProfile(null)
      }
      
      router.refresh()
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const signIn = async (provider: "farcaster") => {
    try {
      setIsLoading(true)

      if (provider === "farcaster") {
        const result = await signInWithFarcaster()
        
        if (!result) {
          throw new Error("Failed to sign in with Farcaster")
        }
        
        // Refresh the session
        const { data: { session: newSession } } = await supabase.auth.getSession()
        setSession(newSession)
        setUser(newSession?.user ?? null)
        
        // Set the profile
        setProfile(result.user)
        
        return
      }

      throw new Error(`Unsupported provider: ${provider}`)
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signOut = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setProfile(null)
      setSession(null)
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  const value = {
    user,
    profile,
    session,
    isLoading,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}