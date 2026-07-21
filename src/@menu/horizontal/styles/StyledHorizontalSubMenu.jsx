// Third-party Imports
import styled from '@emotion/styled'

const StyledHorizontalSubMenu = styled.li`
  position: relative;
  display: inline-block;

  > .${/* placeholder for button */ ''} {
    cursor: pointer;
  }

  ${({ menuItemStyles }) => menuItemStyles}
  ${({ rootStyles }) => rootStyles}
`

export default StyledHorizontalSubMenu
