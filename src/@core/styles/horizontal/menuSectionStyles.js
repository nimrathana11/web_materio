// Util Imports
import { menuClasses } from '@menu/utils/menuClasses'

const menuSectionStyles = (theme) => {
  return {
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      paddingInline: theme.spacing(2),
    },

    [`& .${menuClasses.menuSectionContent}`]: {
      display: 'flex',
      alignItems: 'center',
      color: 'var(--mui-palette-text-secondary)',
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      padding: theme.spacing(1, 2),
      marginBottom: theme.spacing(1),
    },

    [`& .${menuClasses.menuSectionLabel}`]: {
      flexGrow: 1,
      whiteSpace: 'nowrap',
    },

    [`& .${menuClasses.icon}`]: {
      marginRight: theme.spacing(1.5),
      fontSize: '1.25rem',
    },
  }
}

export default menuSectionStyles