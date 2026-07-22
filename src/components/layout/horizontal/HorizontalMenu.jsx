'use client'

// React Imports
import { useState, useMemo, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// MUI Imports
import { Box, Paper, Button, Drawer, useTheme } from '@mui/material'
import { alpha } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

// Local Imports
import Link from '@/components/Link'
import VerticalMenu from './VerticalMenu'
import { MenuData } from '@data/navigation/MenuData'
import useHorizontalNav from '@menu/hooks/useHorizontalNav'

const getNodeKey = (node, index, parentPath = '') => {
  return [parentPath, node?.label, index].filter(Boolean).join('-')
}

// Desktop Top Level Button (for horizontal nav)
const TopLevelButton = ({ node, isLinkActive, theme, transitionDuration = 150 }) => {
  const [open, setOpen] = useState(false)
  const [closeTimer, setCloseTimer] = useState(null)
  const active = isLinkActive(node.href)

  const clearCloseTimer = () => {
    if (closeTimer) {
      window.clearTimeout(closeTimer)
      setCloseTimer(null)
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setOpen(true)
  }

  const closeMenu = () => {
    clearCloseTimer()
    setCloseTimer(window.setTimeout(() => setOpen(false), transitionDuration))
  }

  useEffect(() => {
    return () => clearCloseTimer()
  }, [closeTimer])

  const buttonStyles = {
    textTransform: 'none',
    fontWeight: 500,
    fontSize: '0.875rem',
    px: 4,
    py: 1.5,
    borderRadius: '50px',
    transition: `all ${transitionDuration}ms ease-in-out`,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 1.5,
    ...(active
      ? {
          bgcolor: 'primary.main',
          color: 'common.white',
          boxShadow: '0px 4px 10px rgba(140, 87, 255, 0.3)',
          '&:hover': {
            bgcolor: 'primary.dark',
            color: 'common.white',
          },
        }
      : {
          color: 'text.secondary',
          bgcolor: 'transparent',
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.text.primary, 0.06),
            color: 'text.primary',
          },
        }),
  }

  if (node.type === 'item') {
    return (
      <Button component={Link} href={node.href || '#'} variant="text" sx={buttonStyles}>
        {node.icon && (
          <Box sx={{ display: 'flex', fontSize: '1.2rem', color: active ? 'inherit' : 'text.secondary' }}>
            {node.icon}
          </Box>
        )}
        {node.label}
      </Button>
    )
  }

  if (node.type === 'submenu') {
    return (
      <Box onMouseEnter={openMenu} onMouseLeave={closeMenu} sx={{ position: 'relative', display: 'inline-flex' }}>
        <Button
          variant="text"
          onClick={openMenu}
          sx={buttonStyles}
          endIcon={<ExpandMoreIcon fontSize="small" sx={{ ml: -0.5, color: active ? 'inherit' : 'text.secondary' }} />}
        >
          {node.icon && (
            <Box sx={{ display: 'flex', fontSize: '1.2rem', color: active ? 'inherit' : 'text.secondary' }}>
              {node.icon}
            </Box>
          )}
          {node.label}
        </Button>

        {open && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              left: 0,
              minWidth: 230,
              py: 1.5,
              borderRadius: '8px',
              bgcolor: 'background.paper',
              zIndex: 1600
            }}
          >
            {/* You can keep recursive submenu or use VerticalMenu style if preferred */}
            {node.children?.map((child, idx) => (
              <MenuEntry
                key={getNodeKey(child, idx, node.label)}
                node={child}
                closeParent={closeMenu}
                isLinkActive={isLinkActive}
                transitionDuration={transitionDuration}
              />
            ))}
          </Paper>
        )}
      </Box>
    )
  }

  return null
}

// Submenu renderer for desktop dropdowns
const MenuEntry = ({ node, closeParent, isLinkActive, transitionDuration = 150 }) => {
  const [open, setOpen] = useState(false)
  const [closeTimer, setCloseTimer] = useState(null)
  const active = isLinkActive(node.href)

  const clearCloseTimer = () => {
    if (closeTimer) {
      window.clearTimeout(closeTimer)
      setCloseTimer(null)
    }
  }

  const openMenu = () => {
    clearCloseTimer()
    setOpen(true)
  }

  const closeMenu = () => {
    clearCloseTimer()
    setCloseTimer(window.setTimeout(() => setOpen(false), transitionDuration))
  }

  const handleSelect = () => {
    clearCloseTimer()
    setOpen(false)
    closeParent?.()
  }

  useEffect(() => {
    return () => clearCloseTimer()
  }, [closeTimer])

  if (node.type === 'item') {
    return (
      <Box
        component={Link}
        href={node.href || '#'}
        onClick={handleSelect}
        sx={{
          width: '100%',
          border: 'none',
          background: 'transparent',
          textAlign: 'left',
          textDecoration: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 4,
          py: 2.5,
          color: active ? 'primary.main' : 'text.secondary',
          fontSize: '0.9rem',
          fontWeight: 500,
          transition: `all ${transitionDuration}ms ease`,
          '&:hover': {
            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
            color: 'primary.main'
          }
        }}
      >
        {node.icon && <Box sx={{ display: 'flex', fontSize: '1.2rem' }}>{node.icon}</Box>}
        <Box sx={{ flex: 1 }}>{node.label}</Box>
      </Box>
    )
  }

  // Add submenu support inside dropdown if needed...
  return null
}

const HorizontalMenu = () => {
  const theme = useTheme()
  const pathname = usePathname()
  const {
    isBreakpointReached,
    isToggled,
    toggleVerticalNav,
    transitionDuration
  } = useHorizontalNav()
  const shadowRef = useRef(null)

  const isLinkActive = (href) =>
    Boolean(href && (pathname === href || pathname.startsWith(`${href}/`)))

  const flattenedMenuItems = useMemo(() => {
    return MenuData.flatMap((item) =>
      item.type === 'section' ? item.children || [] : item
    )
  }, [])

  const handleDrawerClose = () => {
    toggleVerticalNav(false)
  }

  const scrollMenu = (container) => {
    const shadow = document.getElementById('menu-scroll-shadow')
    if (!shadow) return

    const scrollContainer = container?.target || container
    const scrollTop = scrollContainer?.scrollTop || 0

    if (scrollTop > 10) {
      shadow.classList.add('scrolled')
    } else {
      shadow.classList.remove('scrolled')
    }
  }

  return (
    <>
      {/* Mobile Drawer – Using VerticalMenu for full consistency */}
      <Drawer
        open={isBreakpointReached && isToggled}
        onClose={handleDrawerClose}
        ModalProps={{ keepMounted: true }}
        PaperProps={{
          sx: {
            width: 280,
            borderRight: '1px solid',
            borderColor: 'divider',
            bgcolor: 'background.paper',
            boxShadow: 8
          }
        }}
        transitionDuration={transitionDuration}
      >
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <VerticalMenu scrollMenu={scrollMenu} />
          </Box>
        </Box>
      </Drawer>

      {/* Desktop Horizontal Navigation */}
      {!isBreakpointReached && (
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            py: 2,
            px: { xs: 4, md: 6 }
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            {flattenedMenuItems.map((item, idx) => (
              <TopLevelButton
                key={getNodeKey(item, idx, 'top')}
                node={item}
                isLinkActive={isLinkActive}
                theme={theme}
                transitionDuration={transitionDuration}
              />
            ))}
          </Box>
        </Box>
      )}
    </>
  )
}

export default HorizontalMenu