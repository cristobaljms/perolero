import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isClient, setIsClient] = React.useState<boolean>(false)

  React.useEffect(() => {
    setIsClient(true)
    
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(mql.matches)
    }
    
    // Establecer valor inicial
    setIsMobile(mql.matches)
    
    // Usar la API moderna preferida
    if (mql.addEventListener) {
      mql.addEventListener("change", onChange)
      return () => mql.removeEventListener("change", onChange)
    } else {
      // Fallback para navegadores antiguos
      mql.addListener(onChange)
      return () => mql.removeListener(onChange)
    }
  }, [])

  // Retornar false durante SSR para evitar hydration mismatch
  return isClient ? isMobile : false
}
