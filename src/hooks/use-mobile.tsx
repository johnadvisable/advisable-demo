import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  // Initialize with server-safe default, then set actual value
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)
  const [isInitialized, setIsInitialized] = React.useState(false)

  React.useEffect(() => {
    const getCurrentMobile = () => window.innerWidth < MOBILE_BREAKPOINT
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      const mobile = getCurrentMobile()
      setIsMobile(mobile)
    }
    
    // Set initial value immediately
    const initialMobile = getCurrentMobile()
    setIsMobile(initialMobile)
    setIsInitialized(true)
    
    mql.addEventListener("change", onChange)
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return { isMobile: isMobile ?? false, isInitialized }
}
