'use client'

// React Imports
import { useEffect } from 'react'

// Third-party Imports
import classnames from 'classnames'

// Hook Imports
import useMediaQuery from '../hooks/useMediaQuery'
import useHorizontalNav from '../hooks/useHorizontalNav'

// Util Imports
import { horizontalNavClasses } from '../utils/menuClasses'

// Styled Component Imports
import StyledHorizontalNav from './styles/StyledHorizontalNav'

// Default Config Imports
import { defaultBreakpoints } from '../defaultConfigs'

const HorizontalNav = props => {
  const {
    breakpoint = 'lg',
    customBreakpoint,
    breakpoints,
    className,
    customStyles,
    children,
    ...rest
  } = props

  const mergedBreakpoints = { ...defaultBreakpoints, ...breakpoints }

  const { updateIsBreakpointReached, isBreakpointReached, toggleVerticalNav } = useHorizontalNav()

  const breakpointReached = useMediaQuery(customBreakpoint ?? (breakpoint ? mergedBreakpoints[breakpoint] : breakpoint))

  useEffect(() => {
    updateIsBreakpointReached(breakpointReached)

    if (!breakpointReached) {
      toggleVerticalNav(false)
    }
  }, [breakpointReached, updateIsBreakpointReached, toggleVerticalNav])

  return (
    <StyledHorizontalNav
      customStyles={customStyles}
      className={classnames(horizontalNavClasses.root, {[horizontalNavClasses.breakpointReached]: isBreakpointReached}, className)}
      {...rest}
    >
      {children}
    </StyledHorizontalNav>
  )
}

export default HorizontalNav