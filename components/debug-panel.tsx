// components/debug-panel.tsx
"use client"

import { useEffect, useState } from 'react'
import { sdk } from "@farcaster/frame-sdk"
import { useAuth } from "@/contexts/auth-context"

export function DebugPanel() {
  const [isInMiniApp, setIsInMiniApp] = useState<boolean | null>(null)
  const [userContext, setUserContext] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const auth = useAuth()

  useEffect(() => {
    const checkEnvironment = async () => {
      try {
        // Check if we're in a mini app
        const isMiniApp = await sdk.isInMiniApp()
        setIsInMiniApp(isMiniApp)
        
        if (isMiniApp) {
          // Get user context
          const context = sdk.context
          setUserContext(context)
        }
      } catch (err) {
        console.error("Debug error:", err)
        setError(err instanceof Error ? err.message : String(err))
      }
    }
    
    checkEnvironment()
  }, [])

  if (!isInMiniApp) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 p-4 bg-black/80 text-white text-xs rounded-lg max-w-xs overflow-auto max-h-60">
      <h3 className="font-bold mb-2">Debug Info</h3>
      <div className="space-y-1">
        <p>In Mini App: {String(isInMiniApp)}</p>
        <p>Auth User: {auth.user ? 'Yes' : 'No'}</p>
        <p>Auth Loading: {String(auth.isLoading)}</p>
        {userContext?.user && (
          <p>FC User: {userContext.user.fid || 'Unknown'}</p>
        )}
        {error && <p className="text-red-400">Error: {error}</p>}
      </div>
      // Add to your main page or layout for debugging
     <DebugPanel />
    </div>
  )
}