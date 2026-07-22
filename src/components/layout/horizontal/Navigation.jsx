'use client'

// Component & Core Hook Imports
import HorizontalMenu from './HorizontalMenu'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports

const Navigation = () => {
  // Hooks
  const { settings } = useSettings()

  // If layout is vertical, this component is not rendered
  if (settings.layout !== 'horizontal') return null
  
  return (
    <HorizontalMenu />
  )
}

export default Navigation