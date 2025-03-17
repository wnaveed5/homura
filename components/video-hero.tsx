"use client"

import { useEffect, useState } from "react"
import { useMobile } from "@/hooks/use-mobile"
import Image from "next/image"

export function VideoHero() {
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Create video URLs with direct access - both MP4 now
  const mobileVideoUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iphone-CaqAGeJLsTBIq2VDal7aI8wTecc5AX.mp4"
  const desktopVideoUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desktop-FwBVyhAc36R9ZmFaRbIaHb2VgSmskG.mp4"

  // Create a fallback image URL from the first frame of the video
  const fallbackImageUrl = "/placeholder.svg?height=1080&width=1920"

  // If not loaded yet, show a loading state
  if (!isLoaded) {
    return <div className="w-full h-screen bg-black" />
  }

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Fallback image that's always present */}
      <div className="absolute inset-0">
        <Image src={fallbackImageUrl || "/placeholder.svg"} alt="Background" fill className="object-cover" priority />
      </div>

      {/* Video element with improved handling */}
      <div className="absolute inset-0">
        {/* Use an iframe for better compatibility */}
        <iframe
          src={isMobile ? mobileVideoUrl : desktopVideoUrl}
          className="w-full h-full border-0"
          allow="autoplay; fullscreen"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      </div>

      {/* Overlay to ensure text is visible - keeping a slight overlay for contrast */}
      <div className="absolute inset-0 bg-black/10" />

      {/* Logo overlay removed as requested */}
    </div>
  )
}

