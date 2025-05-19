"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

type SafeAvatarProps = {
  user?: {
    pfpUrl?: any
    displayName?: any
    username?: any
  } | null
  fallbackText?: string
  className?: string
}

export function SafeAvatar({ user, fallbackText, className }: SafeAvatarProps) {
  // Safely get avatar URL - only use pfpUrl if it's a string
  const avatarUrl = (() => {
    if (user?.pfpUrl && typeof user.pfpUrl === 'string') {
      return user.pfpUrl
    }
    return undefined
  })()
  
  // Get fallback text (first letter of name or provided fallback)
  const getFallback = () => {
    if (fallbackText) return fallbackText
    
    if (user?.displayName && typeof user.displayName === 'string' && user.displayName.length > 0) {
      return user.displayName.charAt(0)
    }
    if (user?.username && typeof user.username === 'string' && user.username.length > 0) {
      return user.username.charAt(0)
    }
    return '?'
  }
  
  return (
    <Avatar className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt="Profile" />}
      <AvatarFallback>{getFallback()}</AvatarFallback>
    </Avatar>
  )
}