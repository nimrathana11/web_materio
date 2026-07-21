'use client'

// React Imports
import { useState, useMemo, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// MUI Imports
import {
  Box,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material'
import { alpha } from '@mui/material/styles'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'

// Local Imports
import Link from '@/components/Link'
import { MenuData } from '@data/navigation/MenuData'
import { useSettings } from '@core/hooks/useSettings'

const getNodeKey = (node, index, parentPath = '') => {
  return [parentPath, node?.label, index].filter(Boolean).join('-')
}

// Submenu Option Renderer
const MenuEntry = ({ node, closeParent, isLinkActive, theme }) => {
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
    setCloseTimer(window.setTimeout(() => setOpen(false), 140))
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
          transition: 'all 0.2s ease',
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

  if (node.type === 'submenu') {
    return (
      <Box onMouseEnter={openMenu} onMouseLeave={closeMenu} sx={{ position: 'relative' }}>
        <Box
          component='button'
          onClick={openMenu}
          sx={{
            width: '100%',
            border: 'none',
            background: 'transparent',
            textAlign: 'left',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: 4,
            py: 2.5,
            color: active ? 'primary.main' : 'text.secondary',
            fontSize: '0.9rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
            '&:hover': {
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
              color: 'primary.main'
            }
          }}
        >
          {node.icon && <Box sx={{ display: 'flex', fontSize: '1.2rem' }}>{node.icon}</Box>}
          <Box sx={{ flex: 1 }}>{node.label}</Box>
          <ExpandMoreIcon fontSize='small' sx={{ transform: 'rotate(-90deg)', opacity: 0.8 }} />
        </Box>

        {open && (
          <Paper
            elevation={8}
            sx={{
              position: 'absolute',
              top: 0,
              left: '100%',
              ml: 1,
              minWidth: 230,
              py: 1.5,
              borderRadius: '8px',
              bgcolor: 'background.paper',
              zIndex: 1600
            }}
          >
            {node.children?.map((child, idx) => (
              <MenuEntry
                key={getNodeKey(child, idx, node.label)}
                node={child}
                closeParent={() => {
                  clearCloseTimer()
                  setOpen(false)
                  closeParent?.()
                }}
                isLinkActive={isLinkActive}
                theme={theme}
              />
            ))}
          </Paper>
        )}
      </Box>
    )
  }

  return null
}

const TopLevelButton = ({ node, isLinkActive, theme }) => {
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
    setCloseTimer(window.setTimeout(() => setOpen(false), 160))
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
    borderRadius: '50px', // Perfect pill design capsule
    transition: 'all 0.2s ease-in-out',
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
      <Button component={Link} href={node.href || '#'} variant='text' sx={buttonStyles}>
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
          variant='text'
          onClick={openMenu}
          sx={buttonStyles}
          endIcon={<ExpandMoreIcon fontSize='small' sx={{ ml: -0.5, color: active ? 'inherit' : 'text.secondary' }} />}
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
            {node.children?.map((child, idx) => (
              <MenuEntry
                key={getNodeKey(child, idx, node.label)}
                node={child}
                closeParent={closeMenu}
                isLinkActive={isLinkActive}
                theme={theme}
              />
            ))}
          </Paper>
        )}
      </Box>
    )
  }

  return null
}

const HorizontalMenu = () => {
  const theme = useTheme()
  const pathname = usePathname()

  const isLinkActive = href => Boolean(href && (pathname === href || pathname.startsWith(`${href}/`)))

  const flattenedMenuItems = useMemo(() => {
    return MenuData.flatMap(item => {
      if (item.type === 'section') {
        return item.children || []
      }
      return item
    })
  }, [])

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        py: 2, // Consistent padding for standard pill height alignment
        px: { xs: 4, md: 6 }
      }}
    >
      {(
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
          {flattenedMenuItems.map((item, idx) => (
            <TopLevelButton
              key={getNodeKey(item, idx, 'top')}
              node={item}
              isLinkActive={isLinkActive}
              theme={theme}
            />
          ))}
        </Box>
      )}
    </Box>
  )
}

export default HorizontalMenu