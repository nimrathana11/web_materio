'use client'
// React Imports
import { forwardRef, useEffect, useState } from 'react'
// Third-party Imports
import styled from '@emotion/styled'
// Util Imports
import { menuClasses } from '../utils/menuClasses'

const StyledSubMenuContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 240px;
  margin-top: 8px;
  padding: 8px 0;
  border-radius: 10px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.15);
  z-index: 1600;
  opacity: 0;
  visibility: hidden;
  transform: translateY(12px);
  transition: all ${({ transitionDuration }) => transitionDuration}ms ease-in-out;

  &.${menuClasses.open} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }

  /* Nested submenus (level 2+) */
  ${`.${menuClasses.subMenuRoot}`} & {
    top: 0;
    left: 100%;
    margin-top: 0;
    margin-left: 8px;
  }

  /* RTL Support */
  [dir='rtl'] & {
    left: auto;
    right: 0;
  }

  ${`.${menuClasses.subMenuRoot}`} & {
    [dir='rtl'] & {
      left: 0;
      right: 100%;
      margin-left: 0;
      margin-right: 8px;
    }
  }
`

const SubMenuContent = (props, ref) => {
  const { children, open, transitionDuration = 200, ...rest } = props

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <StyledSubMenuContent
      ref={ref}
      className={open ? menuClasses.open : ''}
      transitionDuration={transitionDuration}
      {...rest}
    >
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {children}
      </ul>
    </StyledSubMenuContent>
  )
}

export default forwardRef(SubMenuContent)