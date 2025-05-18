"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { sdk } from "@farcaster/frame-sdk"
import { Loader2, Share2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface QuizShareFrameProps {
  quizId: string
  quizTitle: string
  score: number
  maxScore: number
  percentage: number
}

export function QuizShareFrame({ quizId, quizTitle, score, maxScore, percentage }: QuizShareFrameProps) {
  const [isSharing, setIsSharing] = useState(false)
  const { toast } = useToast()
  
  const handleShare = async () => {
    setIsSharing(true)
    try {
      // Format the share text
      const shareText = `I scored ${score}/${maxScore} (${percentage}%) on the "${quizTitle}" quiz on BrainCast! Think you can beat my score?`;
      
      // Define the embed URL - this is the quiz preview page
      const embedUrl = `${window.location.origin}/quiz/preview/${quizId}`;
      
      // Use Farcaster SDK to compose a cast
      await sdk.actions.composeCast({
        text: shareText,
        embeds: [embedUrl],
      });
      
      toast({
        title: "Shared successfully!",
        description: "Your quiz result has been shared to Farcaster",
      });
    } catch (error) {
      console.error("Error sharing to Farcaster:", error);
      toast({
        title: "Share failed",
        description: "There was an error sharing your result to Farcaster",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };
  
  return (
    <Button 
      onClick={handleShare} 
      disabled={isSharing} 
      className="flex items-center gap-2"
      variant="outline"
    >
      {isSharing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {isSharing ? "Sharing..." : "Share to Farcaster"}
    </Button>
  );
}