"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Search, Trophy, Users, User, LogIn } from "lucide-react"
import { cn } from "@/lib/utils"
import { useFarcasterAuth } from "@/lib/farcaster-auth-from-docs"
import { useEffect, useState } from "react"
import Image from "next/image"

export function MobileNav() {
  const pathname = usePathname()
  const { user, isAuthenticated, isInitializing, isInFarcaster, signIn } = useFarcasterAuth()
  const [autoSignInAttempted, setAutoSignInAttempted] = useState(false)
  
  // Auto sign-in once when in Farcaster and on home page
  useEffect(() => {
    if (isInFarcaster && !isInitializing && !isAuthenticated && !autoSignInAttempted && pathname === '/') {
      const attemptSignIn = async () => {
        try {
          console.log("Mobile nav auto-attempting sign-in...")
          await signIn()
        } catch (error) {
          console.error("Mobile nav auto sign-in error:", error)
        } finally {
          setAutoSignInAttempted(true)
        }
      }
      
      // Add a delay to ensure everything is ready
      const timer = setTimeout(attemptSignIn, 1500) // Slightly longer delay than header
      return () => clearTimeout(timer)
    }
  }, [isInFarcaster, isInitializing, isAuthenticated, autoSignInAttempted, signIn, pathname])

  // Manual sign-in handler
  const handleSignIn = async () => {
    if (!isInFarcaster) return
    
    try {
      await signIn()
    } catch (error) {
      console.error("Mobile nav sign-in error:", error)
    }
  }

  return (
    <div className="md:hidden fixed bottom-0 left-0 z-50 w-full h-16 bg-slate-800 border-t border-slate-700">
      <div className="grid h-full grid-cols-5">
        <Link
          href="/"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-slate-700",
            pathname === "/" && "text-purple-400",
          )}
        >
          <Home className="w-5 h-5" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link
          href="/explore"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-slate-700",
            pathname === "/explore" && "text-purple-400",
          )}
        >
          <Search className="w-5 h-5" />
          <span className="text-xs mt-1">Explore</span>
        </Link>
        <Link
          href="/social"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-slate-700",
            pathname === "/social" && "text-purple-400",
          )}
        >
          <Users className="w-5 h-5" />
          <span className="text-xs mt-1">Social</span>
        </Link>
        <Link
          href="/leaderboard"
          className={cn(
            "inline-flex flex-col items-center justify-center px-5 hover:bg-slate-700",
            pathname === "/leaderboard" && "text-purple-400",
          )}
        >
          <Trophy className="w-5 h-5" />
          <span className="text-xs mt-1">Leaderboard</span>
        </Link>
        
        {isAuthenticated && user ? (
          <Link
            href="/profile"
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-slate-700",
              pathname === "/profile" && "text-purple-400",
            )}
          >
            <div className="relative w-5 h-5 rounded-full overflow-hidden">
              {user.pfpUrl ? (
                <Image 
                  src={user.pfpUrl} 
                  alt="Profile" 
                  width={20} 
                  height={20} 
                  className="object-cover"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </div>
            <span className="text-xs mt-1">Profile</span>
          </Link>
        ) : (
          <button
            onClick={handleSignIn}
            className={cn(
              "inline-flex flex-col items-center justify-center px-5 hover:bg-slate-700 w-full",
            )}
          >
            <LogIn className="w-5 h-5" />
            <span className="text-xs mt-1">Sign In</span>
          </button>
        )}
      </div>
    </div>
  )
}