"use client"

import { Brain } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from 'react'
import { sdk } from "@farcaster/frame-sdk"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function Header() {
  // Safely use auth context
  const auth = useAuth()
  const [isInMiniApp, setIsInMiniApp] = useState(false)
  
  useEffect(() => {
    // Check if we're in a Farcaster mini app
    const checkMiniApp = async () => {
      try {
        const result = await sdk.isInMiniApp()
        setIsInMiniApp(result)
      } catch (error) {
        console.error("Error checking mini app status:", error)
        setIsInMiniApp(false)
      }
    }
    
    checkMiniApp()
  }, [])
  
  const handleSignIn = async () => {
    try {
      await auth.signIn("farcaster")
    } catch (error) {
      console.error("Error signing in:", error)
    }
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
          
          {auth && isInMiniApp && !auth.isLoading && !auth.user && (
            <Button 
              onClick={handleSignIn} 
              size="sm"
              variant="secondary"
              className="text-sm font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 250 250" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-1">
                <path d="M125 29.4L125 220.6" stroke="currentColor" strokeWidth="20" strokeLinecap="round"/>
                <path d="M185 100.8L125 160.8L65 100.8" stroke="currentColor" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Sign In
            </Button>
          )}
          
          {auth && auth.user && auth.profile && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={auth.profile.avatar_url} alt={auth.profile.display_name || auth.profile.username} />
                    <AvatarFallback>
                      {auth.profile.display_name?.charAt(0) || auth.profile.username?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-medium">{auth.profile.display_name || auth.profile.username}</p>
                  {auth.profile.username && <p className="text-xs text-slate-400">@{auth.profile.username}</p>}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link className="cursor-pointer" href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => auth.signOut()} className="cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          
          {!isInMiniApp && (
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
          
          {auth && auth.isLoading && (
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