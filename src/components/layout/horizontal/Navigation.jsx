'use client'

// Component & Core Hook Imports
import HorizontalMenu from './HorizontalMenu'
import { useSettings } from '@core/hooks/useSettings'
import themeConfig from '@configs/themeConfig'

const Navigation = () => {
  // Hooks
  const { settings } = useSettings()

  // If layout is vertical, this component is not rendered
  if (settings.layout !== 'horizontal') return null
  
  return (
    <div 
      style={{
        paddingInline: `${themeConfig.layoutPadding}px`,
        transition: 'padding 0.3s ease',
        paddingBlock: '2px',
      }}
    >
      <HorizontalMenu />
    </div>
  )
}

export default Navigation