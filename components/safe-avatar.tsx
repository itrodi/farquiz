"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { safeGetFirstChar } from "@/lib/farcaster-safe"

// Safe avatar component for Farcaster environment
export function SafeAvatar({ 
  user, 
  className = "" 
}: { 
  user: { 
    displayName?: string | null; 
    username?: string | null; 
    pfpUrl?: string | null; 
  } | null; 
  className?: string 
}) {
  // Safely determine fallback content
  let fallback = '?';
  
  if (user) {
    if (user.displayName) {
      fallback = safeGetFirstChar(user.displayName);
    } else if (user.username) {
      fallback = safeGetFirstChar(user.username);
    }
  }

  return (
    <Avatar className={className}>
      <AvatarImage src={user?.pfpUrl || undefined} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}