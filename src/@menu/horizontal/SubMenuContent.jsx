"use client";

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import styled from "@emotion/styled";
import { menuClasses } from "../utils/menuClasses";

const Container = styled.div`
  /* CRITICAL: Fixed positioning works reliably with Portal bounding boxes */
  position: fixed; 
  box-sizing: border-box;
  padding: 6px;
  background: var(--mui-palette-background-paper, #ffffff);
  border: 1px solid var(--mui-palette-divider, rgba(225, 230, 240, 0.12));
  box-shadow: 0 12px 32px -4px rgba(15, 23, 42, 0.18);
  border-radius: 12px;
  z-index: 9999;

  /* Transitions */
  opacity: 0;
  visibility: hidden;
  transform: translateY(6px);
  transition:
    opacity ${({ transitionDuration }) => transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1),
    transform ${({ transitionDuration }) => transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;

  &.${menuClasses.open} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
    pointer-events: auto;
  }

  /* Hover Hitbox Bridge */
  &::before {
    content: "";
    position: absolute;
    top: -12px;
    bottom: -12px;
    left: -12px;
    right: -12px;
    z-index: -1;
  }

  ul,
  ul:not([class]) {
    list-style: none;
    margin: 0;
    margin-block: 0;
    padding: 0;
    padding-inline-start: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
  }

  ul > li {
    width: 100%;
    margin: 0;
    padding: 0;
  }

  ul > li > * {
    width: 100%;
    box-sizing: border-box;
  }

  ${({ rootStyles }) => rootStyles}
`;

const SubMenuContent = (props, ref) => {
  const {
    children,
    open,
    level = 0,
    transitionDuration = 200,
    anchorRef,
    rootStyles,
    ...rest
  } = props;

  const elRef = useRef(null);
  const [styles, setStyles] = useState({
    left: -9999,
    top: -9999,
    minWidth: 180,
    maxWidth: 360,
    transformOrigin: "top left",
    isReady: false,
  });

  useImperativeHandle(ref, () => elRef.current);

  useEffect(() => {
    const anchor = anchorRef?.current;
    if (!open || !anchor) {
      setStyles((prev) => ({ ...prev, isReady: false }));
      return;
    }

    const updatePosition = () => {
      const anchorRect = anchor.getBoundingClientRect();
      const viewportW = window.innerWidth;
      const viewportH = window.innerHeight;

      // Desired dimensions
      const preferredWidth = Math.min(360, Math.max(200, anchorRect.width));
      const contentMargin = 10; 
      const contentWidth = Math.min(preferredWidth, viewportW - contentMargin * 2);

      const measuredHeight = elRef.current?.offsetHeight || 0;
      const contentHeight = measuredHeight || 200;

      let left = 0;
      let top = 0;
      let transformOrigin = "top left";

      if (level === 0) {
        // --- LEVEL 0: OPEN DOWNWARDS ---
        left = anchorRect.left;
        top = anchorRect.bottom + 4;

        // Overflow Right -> Align right edge of menu with right edge of anchor
        if (left + contentWidth > viewportW - contentMargin) {
          left = Math.max(contentMargin, anchorRect.right - contentWidth);
          transformOrigin = "top right";
        }
      } else {
        // --- LEVEL > 0: NESTED SUBMENU FLYOUT ---
        // Open to the right by default
        left = anchorRect.right + contentMargin;
        top = anchorRect.top - 6;

        // Check horizontal overflow (Flip to LEFT side)
        if (left + contentWidth > viewportW - contentMargin) {
          left = anchorRect.left - contentWidth - contentMargin;
          transformOrigin = "top right";
        }
      }

      // Check vertical overflow (Flip UP)
      if (top + contentHeight > viewportH - contentMargin) {
        top = Math.max(contentMargin, anchorRect.bottom - contentHeight);
        transformOrigin = transformOrigin.includes("right") ? "bottom right" : "bottom left";
      }

      setStyles({
        left,
        top,
        minWidth: Math.max(160, Math.min(360, contentWidth)),
        maxWidth: Math.min(480, viewportW - contentMargin * 2),
        transformOrigin,
        isReady: true,
      });
    };

    const rafId = requestAnimationFrame(updatePosition);

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open, anchorRef, level, children]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <Container
      ref={elRef}
      className={open && styles.isReady ? menuClasses.open : ""}
      transitionDuration={transitionDuration}
      rootStyles={rootStyles}
      style={{
        position: "fixed", /* FIXED avoids coordinate bugs with body scrolling */
        left: styles.left,
        top: styles.top,
        minWidth: styles.minWidth,
        maxWidth: styles.maxWidth,
        transformOrigin: styles.transformOrigin,
      }}
      {...rest}
    >
      <ul>{children}</ul>
    </Container>,
    document.body
  );
};

export default forwardRef(SubMenuContent);