'use client'
// React Imports
import { forwardRef } from 'react'

// Third-party Imports
import { css } from '@emotion/react'

// Component Imports
import { RouterLink } from '../components/RouterLink'  

// Util Imports
import { menuClasses } from '../utils/menuClasses'

// Horizontal MenuButton styles
export const menuButtonStyles = props => {
  const { level, disabled } = props

  return css({
    display: 'flex',
    alignItems: 'center',
    boxSizing: 'border-box',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease-in-out',

    '&:hover, &[aria-expanded="true"]': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    },
    '&:focus-visible': {
      outline: 'none',
      backgroundColor: 'rgba(255, 255, 255, 0.08)'
    },
    ...(disabled && {
      pointerEvents: 'none',
      cursor: 'default',
      opacity: 0.5
    }),
  })
}

const MenuButton = ({ className, children, ...rest }, ref) => {
  const buttonClassName = `${className || ''} ${rest.active ? menuClasses.active : ''}`.trim()

  return rest.href ? (
    <RouterLink
      ref={ref}
      className={buttonClassName}
      href={rest.href}
      {...rest}
    >
      {children}
    </RouterLink>
  ) : (
    <a
      ref={ref}
      className={buttonClassName}
      {...rest}
    >
      {children}
    </a>
  )
}

export default forwardRef(MenuButton)