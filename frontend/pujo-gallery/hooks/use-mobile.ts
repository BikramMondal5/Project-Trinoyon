"use client"

import { useState, useEffect } from "react"

export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia(query)

    const handleMatch = (event: MediaQueryListEvent) => {
      setMatches(event.matches)
    }

    setMatches(mediaQuery.matches)

    mediaQuery.addEventListener("change", handleMatch)

    return () => {
      mediaQuery.removeEventListener("change", handleMatch)
    }
  }, [query])

  return matches
}
