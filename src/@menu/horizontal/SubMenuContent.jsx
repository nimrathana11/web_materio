"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "@emotion/styled";
import { menuClasses } from "../utils/menuClasses";

const StyledSubMenuContent = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  max-width: 320px;
  box-sizing: border-box;
  padding: 6px;
  background: var(--mui-palette-background-paper, #ffffff);
  border: 1px solid var(--mui-palette-divider, rgba(225, 230, 240, 0.12));
  box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.18);
  z-index: 9999;

  /* Smooth Fade & Slide Transitions */
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition: opacity ${({ transitionDuration }) => transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1), transform ${({ transitionDuration }) => transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  &.${menuClasses.open} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Nested Flyout Positioning */
  ${({ isNested, isOverflowRight }) =>
    isNested &&
    `
      top: 0; /* Align with parent item top */
      margin-top: 0;

      ${
        isOverflowRight
          ? `
            right: calc(100% + 8px);
            left: auto;
          `
          : `
            left: calc(100% + 8px);
            right: auto;
          `
      }
    `}

  /* Clean Single Column Layout */
  ul, ul:not([class]) {
    margin: 0;
    margin-block: 0;
    padding: 0;
    padding-inline-start: 0; /* Clears the unwanted 40px indent */
    list-style: none;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  ul > li {
    margin: 0;
    padding: 0;
    width: 100%;
  }

  /* Make direct children (buttons/links) fill the full width neatly */
  ul > li > * {
    width: 100%;
  }

  ${({ rootStyles }) => rootStyles}
`;

const SubMenuContent = (props, ref) => {
  const {
    children,
    open,
    level = 0,
    transitionDuration = 200,
    ...rest
  } = props;

  const contentRef = useRef(null);
  const [isOverflowRight, setIsOverflowRight] = useState(false);

  useImperativeHandle(ref, () => contentRef.current);

  useEffect(() => {
    if (!open || !contentRef.current) {
      setIsOverflowRight(false);
      return;
    }

    const checkPosition = () => {
      const rect = contentRef.current.getBoundingClientRect();
      const overflowRight = rect.right > window.innerWidth - 12;

      setIsOverflowRight(overflowRight);
    };

    requestAnimationFrame(checkPosition);
    window.addEventListener("resize", checkPosition);

    return () => {
      window.removeEventListener("resize", checkPosition);
    };
  }, [open]);

  return (
    <StyledSubMenuContent
      ref={contentRef}
      className={open ? menuClasses.open : ""}
      transitionDuration={transitionDuration}
      isNested={level > 0}
      isOverflowRight={isOverflowRight}
      {...rest}
    >
      <ul>{children}</ul>
    </StyledSubMenuContent>
  );
};

export default forwardRef(SubMenuContent);