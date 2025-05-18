"use client"

import { Brain } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
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
  // Use our improved auth context
  const { user, isAuthenticated, isLoading, isInFarcaster, signIn, signOut } = useAuth()
  
  const handleSignIn = async () => {
    if (isInFarcaster) {
      try {
        await signIn()
      } catch (error) {
        console.error("Error signing in:", error)
      }
    }
  }

  // Safely get first character for avatar fallback
  const getFirstChar = (str: string | null) => {
    if (!str) return "U"
    return str.charAt(0) || "U"
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
          
          {isInFarcaster && !isLoading && !isAuthenticated && (
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
          
          {isAuthenticated && user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.pfpUrl || undefined} alt={user.displayName || user.username || "User"} />
                    <AvatarFallback>
                      {getFirstChar(user.displayName || user.username)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>
                  <p className="font-medium">{user.displayName || user.username || "User"}</p>
                  {user.username && <p className="text-xs text-slate-400">@{user.username}</p>}
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
          
          {isLoading && (
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