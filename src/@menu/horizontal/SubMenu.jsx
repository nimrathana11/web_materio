'use client'

import React, { Children, cloneElement, forwardRef, useEffect, useId, useRef, useState } from 'react'
import classnames from 'classnames'
import { menuClasses } from '../utils/menuClasses'

import MenuButton from '../vertical/MenuButton'
import useHorizontalMenu from '../hooks/useHorizontalMenu'
import StyledMenuLabel from '../styles/StyledMenuLabel'
import StyledMenuPrefix from '../styles/StyledMenuPrefix'
import StyledMenuSuffix from '../styles/StyledMenuSuffix'
import StyledHorizontalSubMenu from './styles/StyledHorizontalSubMenu'
import StyledHorizontalSubMenuContent from './styles/StyledHorizontalSubMenuContent'

const SubMenu = (props, ref) => {
  const { children, className, contentClassName, label, icon, title, prefix, suffix, defaultOpen, level = 0, disabled = false, rootStyles, onOpenChange, onClick, onKeyUp, ...rest } = props

  const [active, setActive] = useState(false)
  const contentRef = useRef(null)
  const id = useId()

  const { renderExpandedMenuItemIcon, menuItemStyles, openSubmenu, toggleOpenSubmenu, transitionDuration, openSubmenusRef, textTruncate, isCollapsed } = useHorizontalMenu()

  const childNodes = Children.toArray(children).filter(Boolean)
  const isSubMenuOpen = openSubmenu?.some(item => item.id === id) ?? false

  const handleSlideToggle = () => {
    toggleOpenSubmenu?.({ level, label, active, id })
    onOpenChange?.(!isSubMenuOpen)
    if (openSubmenusRef?.current && openSubmenusRef?.current.length > 0) openSubmenusRef.current = []
  }

  useEffect(() => {
    if (defaultOpen) openSubmenusRef?.current.push({ level, label, active: false, id })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    // set active if any child url matches - simplified: no pathname check here
    // Could be enhanced similar to vertical implementation
  }, [])

  const getSubMenuItemStyles = element => {
    if (menuItemStyles) {
      const params = { level, disabled, active, isSubmenu: true, open: isSubMenuOpen }
      const styleFunction = menuItemStyles[element]
      if (styleFunction) return typeof styleFunction === 'function' ? styleFunction(params) : styleFunction
    }
  }

  const submenuContent = (
    <StyledHorizontalSubMenuContent ref={contentRef} open={isSubMenuOpen} level={level} transitionDuration={transitionDuration} className={classnames(menuClasses.subMenuContent, contentClassName)} rootStyles={{ ...getSubMenuItemStyles('subMenuContent') }}>
      <ul className="horizontal-submenu-ul">{childNodes.map(node => cloneElement(node, { level: level + 1 }))}</ul>
    </StyledHorizontalSubMenuContent>
  )

  return (
    <StyledHorizontalSubMenu
      ref={ref}
      className={classnames(menuClasses.subMenuRoot, { [menuClasses.active]: active }, { [menuClasses.disabled]: disabled }, { [menuClasses.open]: isSubMenuOpen }, className)}
      level={level}
      disabled={disabled}
      menuItemStyles={getSubMenuItemStyles('root')}
      buttonStyles={getSubMenuItemStyles('button')}
      rootStyles={rootStyles}
      {...rest}
    >
      <MenuButton ref={null} onClick={e => { onClick?.(e); handleSlideToggle() }} onKeyUp={onKeyUp} title={title} className={classnames(menuClasses.button, { [menuClasses.active]: active })} tabIndex={disabled ? -1 : 0}>
        {icon && <span className={menuClasses.icon} style={getSubMenuItemStyles('icon')}>{icon}</span>}
        {prefix && <StyledMenuPrefix className={menuClasses.prefix} rootStyles={getSubMenuItemStyles('prefix')}>{prefix}</StyledMenuPrefix>}
        <StyledMenuLabel className={menuClasses.label} rootStyles={getSubMenuItemStyles('label')} textTruncate={textTruncate}>{label}</StyledMenuLabel>
        {suffix && <StyledMenuSuffix className={menuClasses.suffix} rootStyles={getSubMenuItemStyles('suffix')}>{suffix}</StyledMenuSuffix>}
      </MenuButton>

      {submenuContent}
    </StyledHorizontalSubMenu>
  )
}

export default forwardRef(SubMenu)
