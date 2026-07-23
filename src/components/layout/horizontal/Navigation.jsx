'use client'

// Component & Core Hook Imports
import HorizontalMenu from './HorizontalMenu'
import { useSettings } from '@core/hooks/useSettings'
import themeConfig from '@configs/themeConfig'
import useHorizontalNav from "@menu/hooks/useHorizontalNav";

const Navigation = () => {
  // Hooks
  const { settings } = useSettings()
  const { isBreakpointReached } = useHorizontalNav();

  // If layout is vertical, this component is not rendered
  if (settings.layout !== 'horizontal') return null
  if (isBreakpointReached) {
    return null;
  }
  
  return (
    <div 
      style={{
        paddingInline: `${themeConfig.layoutPadding}px`,
        transition: 'padding 0.3s ease',
        minHeight: 'calc(var(--header-height) - 5px)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <HorizontalMenu />
    </div>
  )
}

export default Navigation