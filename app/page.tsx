"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Brain, Loader2 } from "lucide-react"
import Link from "next/link"
import { FeaturedQuizzes } from "@/components/featured-quizzes"
import { PopularCategories } from "@/components/popular-categories"
import { TrendingQuizzes } from "@/components/trending-quizzes"
import { useEffect, useState, useCallback } from "react"
import { sdk } from "@farcaster/frame-sdk"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/components/ui/use-toast"

export default function Home() {
  const [isInMiniApp, setIsInMiniApp] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [authAttempted, setAuthAttempted] = useState(false)
  const { user, signIn, isLoading } = useAuth()
  const { toast } = useToast()

  // Initialize app and detect environment
  useEffect(() => {
    const initApp = async () => {
      setIsInitializing(true)
      try {
        console.log("Initializing Frame SDK...")
        
        // Check if we're in a Farcaster mini app
        const isMiniApp = await sdk.isInMiniApp()
        console.log("Is in mini app:", isMiniApp)
        setIsInMiniApp(isMiniApp)

        if (isMiniApp) {
          // Set up share state provider
          sdk.setShareStateProvider(() => {
            return {
              path: window.location.pathname,
              params: window.location.search,
            }
          })

          // CRITICAL: Hide splash screen when app is ready
          console.log("Calling actions.ready()...")
          await sdk.actions.ready()
          console.log("App ready!")
        }
      } catch (error) {
        console.error("Error initializing app:", error)
      } finally {
        setIsInitializing(false)
      }
    }

    initApp()
  }, [])

  // Separate effect for authentication to avoid infinite loops
  const attemptSignIn = useCallback(async () => {
    if (!isInMiniApp || isLoading || user || authAttempted) return
    
    try {
      console.log("Attempting auto sign-in with Farcaster...")
      setAuthAttempted(true)
      await signIn("farcaster")
      toast({
        title: "Welcome to BrainCast!",
        description: "You've been automatically signed in with Farcaster."
      })
    } catch (error) {
      console.error("Auto sign-in error:", error)
    }
  }, [isInMiniApp, isLoading, user, authAttempted, signIn, toast])

  useEffect(() => {
    if (!isInitializing) {
      attemptSignIn()
    }
  }, [isInitializing, attemptSignIn])

  return (
    <div className="container max-w-md md:max-w-4xl mx-auto px-4 py-4 md:py-8">
      <div className="flex flex-col items-center justify-center text-center mb-6 md:mb-10">
        <div className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-purple-600 mb-3">
          <Brain className="h-6 w-6 md:h-8 md:w-8 text-white" />
        </div>
        <h1 className="text-2xl md:text-4xl font-bold text-white">BrainCast</h1>
        <p className="text-sm md:text-base text-slate-300">The Ultimate Quiz Experience</p>
        
        {isInitializing && isInMiniApp && (
          <div className="flex items-center mt-2 text-sm text-slate-400">
            <Loader2 className="h-3 w-3 animate-spin mr-1" />
            Initializing...
          </div>
        )}
      </div>

      <div className="mb-6 md:mb-10 md:max-w-md md:mx-auto">
        <Button className="w-full" size="sm" asChild>
          <Link href="/explore">Explore Quizzes</Link>
        </Button>
      </div>

      <div className="space-y-6 md:space-y-10 md:grid md:grid-cols-2 md:gap-6 md:space-y-0">
        <section className="md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold">Featured</h2>
            <Link href="/explore?filter=featured" className="text-xs md:text-sm text-purple-400">
              See all
            </Link>
          </div>
          <FeaturedQuizzes />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold">Categories</h2>
            <Link href="/categories" className="text-xs md:text-sm text-purple-400">
              See all
            </Link>
          </div>
          <PopularCategories />
        </section>

        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg md:text-xl font-bold">Trending Now</h2>
            <Link href="/explore?filter=trending" className="text-xs md:text-sm text-purple-400">
              See all
            </Link>
          </div>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-3">
              <TrendingQuizzes />
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}