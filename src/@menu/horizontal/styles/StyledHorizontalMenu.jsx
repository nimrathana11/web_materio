import styled from '@emotion/styled'
import { menuClasses } from '../../utils/menuClasses'

const StyledHorizontalMenu = styled.nav`
  display: flex;
  align-items: center;

  & > ul {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &.${menuClasses.root} {
    ${({ rootStyles }) => rootStyles}
  }
`

export default StyledHorizontalMenu