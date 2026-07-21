'use client'

// React Imports
import { useState, useEffect } from 'react'

// Third-party Imports
import classnames from 'classnames'
import styled from '@emotion/styled'

// MUI Imports
import { Box } from '@mui/material'

// Core & Config Imports
import { useSettings } from '@core/hooks/useSettings'
import themeConfig from '@configs/themeConfig'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

// EMOTION STYLED CONTAINER: Mirroring the StyledMain dynamic logic
const StyledNavbarContent = styled.div`
  width: 100%;
  ${({ isContentCompact }) =>
    isContentCompact &&
    `
    margin-inline: auto;
    max-inline-size: ${themeConfig.compactContentWidth}px;
  `}
`

const Navbar = props => {
  const { children } = props
  const { settings } = useSettings()
  const [scrolled, setScrolled] = useState(false)

  // Navbar configuration fallback
  const navbarConfig = themeConfig.navbar || {}

  // Content width alignment (compact vs wide)
  const navbarContentWidth = settings.contentWidth || navbarConfig.contentWidth
  const isContentCompact = navbarContentWidth === 'compact'

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <Box
      component="div"
      className={classnames(
        horizontalLayoutClasses.navbar,
        scrolled && 'scrolled'
      )}
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottom: '1px solid',
        borderColor: 'divider',
        zIndex: 1100,
        transition: 'all 0.3s ease',
        ...(scrolled && {
          boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
        })
      }}
    >
      {/* Replaced the standard HTML div with our Styled Component.
        By forwarding isContentCompact directly as a prop, Emotion 
        can calculate the exact compact width constraint dynamically!
      */}
      <StyledNavbarContent
        isContentCompact={isContentCompact}
        className={classnames(
          horizontalLayoutClasses.navbarContent,
          'w-full flex items-center justify-between px-6'
        )}
        style={{ minHeight: '64px' }}
      >
        {children}
      </StyledNavbarContent>
    </Box>
  )
}

export default Navbar