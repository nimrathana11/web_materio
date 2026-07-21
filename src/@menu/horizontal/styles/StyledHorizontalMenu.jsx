// Third-party Imports
import styled from '@emotion/styled'

// Util Imports
import { menuClasses } from '../../utils/menuClasses'

const StyledHorizontalMenu = styled.nav`
  display: block;
  width: 100%;

  & > ul {
    display: flex;
    gap: 0.35rem;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
    flex-wrap: wrap;
  }

  &.${menuClasses.root} {
    ${({ rootStyles }) => rootStyles}
  }
`

export default StyledHorizontalMenu
