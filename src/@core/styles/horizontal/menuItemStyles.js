// MUI Imports
import { lighten } from '@mui/material/styles'

// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuItemStyles = (theme, primaryColor) => {
  const mainColor = primaryColor || theme.palette.primary.main
  const lightColor = lighten(mainColor, 0.5)

  return {
    root: {
      [`&.${menuClasses.subMenuRoot}.${menuClasses.open} > .${menuClasses.button}`]: {
        backgroundColor: 'var(--mui-palette-action-selected)',
      },

      [`&.${menuClasses.disabled} > .${menuClasses.button}`]: {
        color: 'var(--mui-palette-text-disabled)',
        cursor: 'default',
        '& .icon': {
          color: 'inherit'
        }
      },

      [`&.${menuClasses.menuItemRoot} > .${menuClasses.button}.${menuClasses.active}`]: {
        color: 'var(--mui-palette-primary-contrastText)',
        background: `linear-gradient(90deg, ${mainColor}, ${lightColor})`,
        '& .icon': {
          color: 'inherit'
        }
      }
    },

    button: {
      padding: '12px 20px',
      borderRadius: '8px',
      transition: 'all 0.2s ease',
      whiteSpace: 'nowrap',

      '&:hover': {
        backgroundColor: 'var(--mui-palette-action-hover)',
      },

      '&[aria-expanded="true"]': {
        backgroundColor: 'var(--mui-palette-action-selected)',
      }
    },

    icon: {
      fontSize: '1.35rem',
      marginRight: '10px',
      transition: 'color 0.2s ease',
      '& > i, & > svg': {
        fontSize: 'inherit'
      }
    },

    label: {
      flex: 1,
    },

    prefix: {
      marginRight: '10px',
    },

    suffix: {
      marginLeft: 'auto',
    },

    subMenuExpandIcon: {
      fontSize: '1.375rem',
      marginInlineStart: theme.spacing(2),
      '& i, & svg': {
        fontSize: 'inherit'
      },
    },
  }
}

export default menuItemStyles