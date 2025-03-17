"use client"

import { useState, useEffect } from "react"

export function useMobile() {
  // Default to false to prevent hydration mismatch
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Check if window is defined (client-side)
    if (typeof window !== "undefined") {
      // Initial check
      const checkIfMobile = () => {
        const userAgent = window.navigator.userAgent.toLowerCase()
        const isMobileDevice = /iphone|ipad|android|webos|blackberry|windows phone/i.test(userAgent)
        const isSmallScreen = window.innerWidth < 768

        setIsMobile(isMobileDevice || isSmallScreen)
      }

      checkIfMobile()

      // Add event listener for window resize
      window.addEventListener("resize", checkIfMobile)

      // Clean up
      return () => window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return isMobile
}

