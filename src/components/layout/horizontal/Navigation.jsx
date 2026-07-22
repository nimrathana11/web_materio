'use client'

// MUI Imports
import { Box } from '@mui/material'
import classnames from 'classnames'

// Component & Core Hook Imports
import HorizontalMenu from './HorizontalMenu'
import HorizontalNav from '@menu/horizontal/HorizontalNav'
import { useSettings } from '@core/hooks/useSettings'

// Util Imports
import { horizontalLayoutClasses } from '@layouts/utils/layoutClasses'

const Navigation = () => {
  // Hooks
  const { settings } = useSettings()
  // Determine if Compact (boxed) mode is active
  const isContentCompact = settings.contentWidth === 'compact'

  // If layout is vertical, this component is not rendered
  if (settings.layout !== 'horizontal') return null
  
  return (
    <HorizontalNav customBreakpoint='800px'>
      <Box
        component="div"
        className={horizontalLayoutClasses.navigation}
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <HorizontalMenu isHorizontal={true} scrolled={false} />
      </Box>
    </HorizontalNav>
  )
}

export default Navigation