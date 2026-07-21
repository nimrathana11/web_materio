'use client'

import { createContext, useCallback, useMemo, useState } from 'react'

const HorizontalNavContext = createContext(null)

export const HorizontalNavProvider = ({ children }) => {
  // Existing States
  const [isBreakpointReached, setIsBreakpointReached] = useState(false)
  const [activeMenu, setActiveMenuState] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  // New States matching Vertical Navigation control variables
  const [isToggled, setIsToggled] = useState(false)

  // Stable callbacks
  const updateIsBreakpointReached = useCallback(value => {
    setIsBreakpointReached(Boolean(value))
  }, [])

  const setActiveMenu = useCallback(menu => {
    setActiveMenuState(menu)
  }, [])

  // Added toggleVerticalNav-equivalent handler for Horizontal Context compatibility
  const toggleVerticalNav = useCallback(value => {
    setIsToggled(prev => (value !== undefined ? Boolean(value) : !prev))
  }, [])

  // Memoized Context Value
  // Removing static handlers from dependencies prevents the infinite render-loop trap!
  const value = useMemo(
    () => ({
      isBreakpointReached,
      activeMenu,
      isDropdownOpen,
      isToggled,
      updateIsBreakpointReached,
      setActiveMenu,
      setIsDropdownOpen,
      toggleVerticalNav,
    }),
    [
      isBreakpointReached,
      activeMenu,
      isDropdownOpen,
      isToggled,
    ]
  )

  return (
    <HorizontalNavContext.Provider value={value}>
      {children}
    </HorizontalNavContext.Provider>
  )
}

export default HorizontalNavContext