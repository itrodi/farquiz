import { ImageResponse } from "next/og"
import { createClient } from "@/lib/supabase/server"

export const runtime = "edge"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const quizId = searchParams.get("id")
  
  // Default values if quiz not found
  let title = "BrainCast Quiz"
  let emoji = "🧠"
  let description = "Take this quiz on BrainCast!"
  let category = "Quiz"
  
  if (quizId) {
    try {
      const supabase = createClient()
      
      // Fetch quiz data
      const { data: quiz } = await supabase
        .from("quizzes")
        .select(`
          title, 
          description, 
          emoji,
          categories(name, emoji)
        `)
        .eq("id", quizId)
        .single()
        
      if (quiz) {
        title = quiz.title
        emoji = quiz.emoji || "🧠"
        description = quiz.description || "Take this quiz on BrainCast!"
        category = quiz.categories?.name || "Quiz"
      }
    } catch (error) {
      console.error("Error fetching quiz for OG image:", error)
    }
  }
  
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          background: "linear-gradient(to bottom, #0f172a, #1e293b)",
          color: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 40,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: 80, marginBottom: 20 }}>{emoji}</div>
        <div style={{ fontSize: 60, fontWeight: "bold", marginBottom: 10 }}>{title}</div>
        <div style={{ fontSize: 30, opacity: 0.8, maxWidth: "80%" }}>{description}</div>
        <div
          style={{
            fontSize: 24,
            marginTop: 40,
            opacity: 0.7,
            padding: "8px 16px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.1)",
          }}
        >
          {category} • BrainCast
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}