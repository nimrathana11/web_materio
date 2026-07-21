'use client'

import { forwardRef, useEffect, useState } from 'react'
import classnames from 'classnames'
import { usePathname } from 'next/navigation'

import MenuButton from '../vertical/MenuButton'
import useHorizontalMenu from '../hooks/useHorizontalMenu'
import StyledHorizontalMenuItem from './styles/StyledHorizontalMenuItem'
import StyledMenuLabel from '../styles/StyledMenuLabel'
import StyledMenuPrefix from '../styles/StyledMenuPrefix'
import StyledMenuSuffix from '../styles/StyledMenuSuffix'
import { menuClasses } from '../utils/menuClasses'

const MenuItem = (props, ref) => {
  const { children, icon, className, prefix, suffix, level = 0, disabled = false, exactMatch = true, activeUrl, onActiveChange, rootStyles, ...rest } = props

  const [active, setActive] = useState(false)
  const pathname = usePathname()
  const { menuItemStyles, renderExpandedMenuItemIcon, textTruncate } = useHorizontalMenu()

  const getMenuItemStyles = element => {
    if (menuItemStyles) {
      const params = { level, disabled, active, isSubmenu: false }
      const styleFunction = menuItemStyles[element]
      if (styleFunction) return typeof styleFunction === 'function' ? styleFunction(params) : styleFunction
    }
  }

  useEffect(() => {
    const href = rest.href
    if (href) {
      if (exactMatch ? pathname === href : activeUrl && pathname.includes(activeUrl)) {
        setActive(true)
      } else {
        setActive(false)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  return (
    <StyledHorizontalMenuItem
      ref={ref}
      className={classnames(menuClasses.menuItemRoot, { [menuClasses.disabled]: disabled }, { [menuClasses.active]: active }, className)}
      level={level}
      disabled={disabled}
      buttonStyles={getMenuItemStyles('button')}
      menuItemStyles={getMenuItemStyles('root')}
      rootStyles={rootStyles}
    >
      <MenuButton className={classnames(menuClasses.button, { [menuClasses.active]: active })} tabIndex={disabled ? -1 : 0} {...rest}>
        {/* Icon */}
        {icon && <span className={menuClasses.icon} style={getMenuItemStyles('icon')}>{icon}</span>}

        {prefix && <StyledMenuPrefix className={menuClasses.prefix} rootStyles={getMenuItemStyles('prefix')}>{prefix}</StyledMenuPrefix>}

        <StyledMenuLabel className={menuClasses.label} rootStyles={getMenuItemStyles('label')} textTruncate={textTruncate}>{children}</StyledMenuLabel>

        {suffix && <StyledMenuSuffix className={menuClasses.suffix} rootStyles={getMenuItemStyles('suffix')}>{suffix}</StyledMenuSuffix>}
      </MenuButton>
    </StyledHorizontalMenuItem>
  )
}

export default forwardRef(MenuItem)
