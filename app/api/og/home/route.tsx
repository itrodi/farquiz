// app/api/og/home/route.tsx
import { ImageResponse } from "next/og"

export const runtime = "edge"

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "linear-gradient(to bottom right, #6d28d9, #4f46e5)",
          color: "white",
          padding: 40,
          textAlign: "center",
        }}
      >
        {/* App Logo */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center", 
          background: "#9333ea", 
          borderRadius: "9999px", 
          width: 120, 
          height: 120, 
          marginBottom: 30 
        }}>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="60" 
            height="60" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="white" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          >
            <path d="M22 9.00001C22 13.1086 19.7616 16.9247 16 18.9451C12.2384 16.9247 10 13.1086 10 9.00001L10 4.00001L22 4.00001L22 9.00001Z"></path>
            <path d="M14 22H8L3 3L3 6"></path>
            <path d="M9 12C9 13.6569 7.65685 15 6 15"></path>
          </svg>
        </div>
        
        {/* App Title */}
        <div style={{ 
          fontSize: 72, 
          fontWeight: "bold", 
          marginBottom: 16
        }}>
          BrainCast
        </div>
        
        {/* App Tagline */}
        <div style={{ 
          fontSize: 32, 
          opacity: 0.9, 
          marginBottom: 40
        }}>
          The Ultimate Quiz Experience
        </div>
        
        {/* Features */}
        <div style={{
          display: "flex",
          gap: 24,
          marginBottom: 40
        }}>
          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: 20,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 180
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🎯</div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>Hundreds of Quizzes</div>
          </div>
          
          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: 20,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 180
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>🏆</div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>Compete & Share</div>
          </div>
          
          <div style={{
            background: "rgba(255,255,255,0.2)",
            padding: 20,
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 180
          }}>
            <div style={{ fontSize: 32, marginBottom: 10 }}>📊</div>
            <div style={{ fontSize: 24, fontWeight: "bold" }}>Track Progress</div>
          </div>
        </div>
        
        {/* CTA */}
        <div style={{
          background: "white",
          color: "#4f46e5",
          padding: "16px 32px",
          borderRadius: 999,
          fontSize: 24,
          fontWeight: "bold"
        }}>
          Start Quizzing Now
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  )
}