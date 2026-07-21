import Chip from '@mui/material/Chip'

export const MenuData = [
  {
    type: 'item',
    label: 'Dashboard',
    icon: <i className='ri-home-smile-line' />,
    href: '/'
  },
  {
    type: 'section',
    label: 'Apps & Pages',
    children: [
      {
        type: 'item',
        label: 'Account Settings',
        href: '/account-settings',
        icon: <i className='ri-user-settings-line' />
      },
      {
        type: 'submenu',
        label: 'Auth Pages',
        icon: <i className='ri-shield-keyhole-line' />,
        children: [
          { type: 'item', label: 'Login', href: '/login', target: '_blank' },
          { type: 'item', label: 'Register', href: '/register', target: '_blank' },
          { type: 'item', label: 'Forgot Password', href: '/forgot-password', target: '_blank' }
        ]
      },
      {
        type: 'item',
        label: 'Cards',
        href: '/card-basic',
        icon: <i className='ri-bar-chart-box-line' />
      }
    ]
  },
  {
    type: 'section',
    label: 'Forms & Tables',
    children: [
      {
        type: 'item',
        label: 'Form Layouts',
        href: '/form-layouts',
        icon: <i className='ri-layout-4-line' />
      },
      {
        type: 'submenu',
        label: 'Others',
        icon: <i className='ri-more-line' />,
        children: [
          {
            type: 'item',
            label: 'Item With Badge',
            suffix: <Chip label='New' size='small' color='info' />
          },
          {
            type: 'item',
            label: 'External Link',
            suffix: <i className='ri-external-link-line text-xl' />
          },
          {
            type: 'submenu',
            label: 'Menu Levels',
            children: [
              { type: 'item', label: 'Menu Level 2', href: '/card-basic' },
              {
                type: 'submenu',
                label: 'Menu Level 2',
                children: [
                  { type: 'item', label: 'Menu Level 3' },
                  { type: 'item', label: 'Menu Level 3' }
                ]
              }
            ]
          },
          { type: 'item', label: 'Disabled Menu', disabled: true }
        ]
      }
    ]
  }
]