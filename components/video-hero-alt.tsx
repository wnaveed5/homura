"use client"

import { useEffect, useState, useRef } from "react"
import { useMobile } from "@/hooks/use-mobile"

export function VideoHeroAlt() {
  const isMobile = useMobile()
  const [isLoaded, setIsLoaded] = useState(false)
  const [videoFailed, setVideoFailed] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  // Video URLs - both in MP4 format now
  const mobileVideoUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/iphone-CaqAGeJLsTBIq2VDal7aI8wTecc5AX.mp4"
  const desktopVideoUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/desktop-FwBVyhAc36R9ZmFaRbIaHb2VgSmskG.mp4"

  useEffect(() => {
    setIsLoaded(true)

    // Try to load the video when component mounts
    const handleVideoError = () => {
      console.error("Video failed to load")
      setVideoFailed(true)
    }

    if (videoRef.current) {
      videoRef.current.addEventListener("error", handleVideoError)

      // Try to force load the video
      videoRef.current.load()
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener("error", handleVideoError)
      }
    }
  }, [])

  if (!isLoaded || videoFailed) {
    // Show static hero if video fails or is loading
    return (
      <div className="relative w-full h-screen overflow-hidden bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="font-['Poppins'] font-bold text-6xl md:text-8xl text-white inline-flex items-baseline">
            homu
            <span className="relative inline-flex items-center">
              r
              <sup
                className="absolute -top-4 text-[0.6em] leading-none transform -translate-x-1/2"
                style={{ left: "50%" }}
              >
                ®
              </sup>
            </span>
            a
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="/placeholder.svg?height=1080&width=1920"
        onError={() => setVideoFailed(true)}
      >
        <source src={isMobile ? mobileVideoUrl : desktopVideoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Logo overlay removed as requested */}
    </div>
  )
}

