"use client"

import { Suspense, useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context" 
import { Card, CardContent } from "@/components/ui/card"
import { SafeAvatar } from "@/components/SafeAvatar"
import { ProfileData } from "@/components/ProfileData"
import { Skeleton } from "@/components/ui/skeleton"

// Stats placeholder component - will be server rendered
function StatsPlaceholder() {
  return (
    <div className="flex flex-wrap justify-center sm:justify-start gap-4">
      <div className="text-center">
        <p className="text-2xl font-bold"><Skeleton className="h-8 w-16 bg-slate-700" /></p>
        <p className="text-sm text-gray-400">Total Score</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold"><Skeleton className="h-8 w-16 bg-slate-700" /></p>
        <p className="text-sm text-gray-400">Quizzes Taken</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold"><Skeleton className="h-8 w-16 bg-slate-700" /></p>
        <p className="text-sm text-gray-400">Quizzes Created</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold"><Skeleton className="h-8 w-16 bg-slate-700" /></p>
        <p className="text-sm text-gray-400">Achievements</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const { user, isAuthenticated } = useAuth()
  
  // Safely get display values
  const displayName = (() => {
    if (user?.displayName && typeof user.displayName === 'string') return user.displayName
    if (user?.username && typeof user.username === 'string') return user.username
    return "Anonymous"
  })()
  
  const username = user?.username && typeof user.username === 'string' ? `@${user.username}` : null
  
  // Stats from server component will be injected here
  const [stats, setStats] = useState({
    total_score: 0,
    quizzes_taken: 0,
    quizzes_created: 0,
    achievements_count: 0
  })
  
  // Extract stats from hidden div in ProfileData component
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'childList') {
          const hiddenDiv = document.querySelector('.hidden')
          if (hiddenDiv && hiddenDiv.textContent) {
            try {
              const extractedStats = JSON.parse(hiddenDiv.textContent)
              setStats(extractedStats)
            } catch (e) {
              console.warn('Failed to parse stats', e)
            }
          }
        }
      }
    })
    
    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="container max-w-md md:max-w-4xl mx-auto px-4 py-4 md:py-8">
      <Card className="mb-8 bg-slate-800 border-slate-700">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <SafeAvatar 
              user={user}
              className="w-24 h-24"
            />

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-2xl font-bold mb-1">{displayName}</h1>
              {username && <p className="text-gray-400 mb-4">{username}</p>}

              <Suspense fallback={<StatsPlaceholder />}>
                <div className="flex flex-wrap justify-center sm:justify-start gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.total_score}</p>
                    <p className="text-sm text-gray-400">Total Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.quizzes_taken}</p>
                    <p className="text-sm text-gray-400">Quizzes Taken</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.quizzes_created}</p>
                    <p className="text-sm text-gray-400">Quizzes Created</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold">{stats.achievements_count}</p>
                    <p className="text-sm text-gray-400">Achievements</p>
                  </div>
                </div>
              </Suspense>
            </div>
          </div>
        </CardContent>
      </Card>

      <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
        <ProfileData userId={user?.fid?.toString()} />
      </Suspense>
    </div>
  )
}