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
  min-width: 240px;
  max-width: 380px;
  max-height: min(400px, calc(100vh - 120px));
  overflow-y: auto;
  overflow-x: visible;
  box-sizing: border-box;
  border-radius: 22px;
  background: var(--mui-palette-background-paper);
  border: 1px solid transparent;
  box-shadow: 0 24px 80px rgba(15, 23, 42, 0.16);
  z-index: 9999;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition:
    opacity ${({ transitionDuration }) => transitionDuration}ms ease,
    transform ${({ transitionDuration }) => transitionDuration}ms ease,
    box-shadow ${({ transitionDuration }) => transitionDuration}ms ease;
  pointer-events: none;

  &.${menuClasses.open} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  ${({ isNested, isOverflowRight }) =>
    isNested &&
    `
      top: 0;
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

  ul {
    list-style: none;
    padding: 4px 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  ul > li {
    margin: 0;
    padding: 0;
    border-radius: 16px;
    transition: background-color 0.2s ease;
    display: block;
    width: 100%;
  }

  ul > li > * {
    display: block;
    width: 100%;
    border-radius: inherit;
  }

  ul > li:hover {
    background-color: var(--mui-palette-action-hover);
  }

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(15, 23, 42, 0.16);
    border-radius: 999px;
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
      const overflowRight = rect.right > window.innerWidth - 8;
      const overflowLeft = rect.left < 8;

      setIsOverflowRight(overflowRight);

      if (overflowLeft && !overflowRight) {
        setIsOverflowRight(false);
      }
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
