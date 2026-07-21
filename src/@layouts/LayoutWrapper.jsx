'use client'

import { useState } from 'react'
import ThemeCustomizer from '@components/theme/ThemeCustomizer'
import { useTheme } from '@mui/material/styles'
import useVerticalNav from '@menu/hooks/useVerticalNav'
import { useSettings } from '@core/hooks/useSettings'

const LayoutWrapper = ({ verticalLayout, horizontalLayout }) => {
  const [open, setOpen] = useState(false)
  const theme = useTheme()
  const { settings } = useSettings()
  const { isBreakpointReached } = useVerticalNav()
  const isHorizontalLayout = settings.layout === 'horizontal'
  const activeLayout = isHorizontalLayout ? horizontalLayout : verticalLayout

  return (
    <div className='flex flex-col flex-auto'>
      {activeLayout}

      {!isBreakpointReached && (
        <>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="pulse"
            style={{
              position: 'fixed',
              top: 200,
              insetInlineEnd: 0,
              zIndex: 1000,
              width: 40,
              height: 40,
              borderStartStartRadius: 20,
              borderEndStartRadius: 20,
              backgroundColor: theme.palette.primary.main,
              border: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            <i className="ri-settings-3-line" />
          </button>

          {/* Theme Customizer */}
          <ThemeCustomizer open={open} onClose={() => setOpen(false)} />
        </>
      )}
    </div>
  )
}

export default LayoutWrapper