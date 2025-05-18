// app/feed/page.tsx
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default async function FeedPage() {
  const supabase = createClient()
  
  // Fetch recent quiz scores with user details
  const { data: recentScores } = await supabase
    .from("user_scores")
    .select(`
      *,
      profiles(id, username, display_name, avatar_url),
      quizzes(id, title, emoji, category_id, categories(name, emoji))
    `)
    .order("completed_at", { ascending: false })
    .limit(20)
  
  return (
    <div className="container max-w-md md:max-w-4xl mx-auto px-4 py-4 md:py-8">
      <h1 className="text-xl md:text-2xl font-bold mb-6">Quiz Activity Feed</h1>
      
      <div className="space-y-4">
        {recentScores?.map((score) => (
          <Card key={score.id} className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Avatar>
                  <AvatarImage src={score.profiles?.avatar_url || undefined} />
                  <AvatarFallback>
                    {score.profiles?.display_name?.charAt(0) || score.profiles?.username?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <Link href={`/social/profile/${score.profiles?.id}`} className="font-medium hover:underline">
                        {score.profiles?.display_name || score.profiles?.username || "Anonymous"}
                      </Link>
                      <span className="text-slate-400 text-sm"> completed a quiz</span>
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(score.completed_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <Link href={`/quiz/preview/${score.quiz_id}`} className="block p-3 bg-slate-700 rounded-lg mb-2 hover:bg-slate-600 transition-colors">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{score.quizzes?.emoji || "🎮"}</span>
                      <span className="font-medium">{score.quizzes?.title}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-sm text-slate-400">
                      <span>{score.quizzes?.categories?.name}</span>
                      <span>•</span>
                      <span>Score: {score.percentage}%</span>
                      <span>•</span>
                      <span>{score.time_taken}s</span>
                    </div>
                  </Link>
                  
                  <div className="flex justify-end">
                    <Link 
                      href={`/quiz/${score.quiz_id}`} 
                      className="text-sm text-purple-400 hover:text-purple-300"
                    >
                      Try this quiz →
                    </Link>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {(!recentScores || recentScores.length === 0) && (
          <div className="text-center py-8 text-slate-400">
            No quiz activity yet. Be the first to complete a quiz!
          </div>
        )}
      </div>
    </div>
  )
}