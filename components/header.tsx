"use client"

import { Brain, LogIn, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useFarcasterAuth } from "@/lib/farcaster-auth-from-docs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SafeAvatar } from "@/components/safe-avatar" // Import our new component

export function Header() {
  const { user, isAuthenticated, isInitializing, isInFarcaster, signIn, signOut } = useFarcasterAuth()
  const [autoSignInAttempted, setAutoSignInAttempted] = useState(false)
  
  // Auto sign-in once when in Farcaster
  useEffect(() => {
    if (isInFarcaster && !isInitializing && !isAuthenticated && !autoSignInAttempted) {
      const attemptSignIn = async () => {
        try {
          console.log("Auto-attempting sign-in...")
          await signIn()
        } catch (error) {
          console.error("Auto sign-in error:", error)
        } finally {
          setAutoSignInAttempted(true)
        }
      }
      
      // Add a delay to ensure everything is ready
      const timer = setTimeout(attemptSignIn, 1000)
      return () => clearTimeout(timer)
    }
  }, [isInFarcaster, isInitializing, isAuthenticated, autoSignInAttempted, signIn])

  // Manual sign-in handler
  const handleSignIn = async () => {
    if (!isInFarcaster) return
    
    try {
      await signIn()
    } catch (error) {
      console.error("Error signing in:", error)
    }
  }

  // Safely get the display name
  const getDisplayName = () => {
    if (user?.displayName && typeof user.displayName === 'string') {
      return user.displayName
    }
    if (user?.username && typeof user.username === 'string') {
      return user.username
    }
    return "User"
  }

  // Safely get the username
  const getUsername = () => {
    if (user?.username && typeof user.username === 'string') {
      return `@${user.username}`
    }
    return null
  }

  return (
    <header className="bg-slate-800 border-b border-slate-700 py-3 px-4">
      <div className="container max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-600">
            <Brain className="h-5 w-5 text-white" />
          </div>
          <span className="font-bold text-lg">BrainCast</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/explore" className="text-sm font-medium hover:text-white">
            Explore
          </Link>
          <Link href="/leaderboard" className="text-sm font-medium hover:text-white">
            Leaderboard
          </Link>
          <Link href="/social" className="text-sm font-medium hover:text-white">
            Social
          </Link>
          
          {isInFarcaster && !isAuthenticated && !isInitializing && (
            <Button 
              onClick={handleSignIn} 
              size="sm"
              variant="secondary"
              className="text-sm font-medium"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
          
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <SafeAvatar user={user} className="h-8 w-8" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-medium">{getDisplayName()}</p>
                  {getUsername() && <p className="text-xs text-slate-400">{getUsername()}</p>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {!isInFarcaster && (
            <Link href="https://warpcast.com" target="_blank">
              <Button size="sm" variant="outline" className="text-sm font-medium">
                <svg width="16" height="16" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                  <path d="M125 29.4L125 220.6" stroke="currentColor" strokeWidth="20" strokeLinecap="round"/>
                  <path d="M185 100.8L125 160.8L65 100.8" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Open in Warpcast
              </Button>
            </Link>
          )}
          
          {isInitializing && (
            <div className="h-8 w-8 rounded-full bg-slate-700 animate-pulse"></div>
          )}
          
          <Link href="/profile" className="text-sm font-medium hover:text-white">
            Profile
          </Link>
        </nav>
      </div>
    </header>
  )
}