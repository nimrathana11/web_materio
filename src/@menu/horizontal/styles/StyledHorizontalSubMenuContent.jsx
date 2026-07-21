// Third-party Imports
import styled from '@emotion/styled'

const StyledHorizontalSubMenuContent = styled.div`
  position: absolute;
  top: calc(100% + 8px);
  left: 0;
  min-width: 13rem;
  background: var(--menu-bg, #fff);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
  padding: 0.45rem 0;
  z-index: 9999;
  display: ${({ open }) => (open ? 'block' : 'none')};

  ul.horizontal-submenu-ul {
    list-style: none;
    margin: 0;
    padding: 0.2rem 0;
  }

  ul.horizontal-submenu-ul > li {
    padding: 0;
  }

  ${({ rootStyles }) => rootStyles}
`

export default StyledHorizontalSubMenuContent
