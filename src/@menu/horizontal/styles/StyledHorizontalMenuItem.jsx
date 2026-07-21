// Third-party Imports
import styled from '@emotion/styled'

const StyledHorizontalMenuItem = styled.li`
  display: inline-block;
  position: relative;

  > a, > .menu-button {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.55rem 0.9rem;
    border-radius: 999px;
    color: inherit;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.2s ease;
  }

  &.ts-menu-item-root:hover > a,
  &.ts-menu-item-root:hover > .menu-button {
    background: rgba(15, 23, 42, 0.04);
    color: rgb(33, 150, 243);
  }

  &.ts-active > a,
  &.ts-active > .menu-button {
    background: rgba(33, 150, 243, 0.12);
    color: rgb(33, 150, 243);
    box-shadow: inset 0 0 0 1px rgba(33, 150, 243, 0.16);
  }

  ${({ menuItemStyles }) => menuItemStyles}
  ${({ rootStyles }) => rootStyles}
`

export default StyledHorizontalMenuItem
