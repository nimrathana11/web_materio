"use client";

// React Imports
import { useState, useEffect } from "react";

// Third-party Imports
import classnames from "classnames";
import styled from "@emotion/styled";
// MUI Imports
import { Box } from "@mui/material";

// Component Imports
import LayoutContent from "./components/horizontal/LayoutContent";
import { useSettings } from "@core/hooks/useSettings";
import useHorizontalNav from "@menu/hooks/useHorizontalNav";
import themeConfig from "@configs/themeConfig";

// Util Imports
import { horizontalLayoutClasses } from "./utils/layoutClasses";

const HorizontalLayout = (props) => {
  const { navbar, footer, navigation, children } = props;
  const { settings } = useSettings();
  const isContentCompact = settings.contentWidth === "compact";
  const { isBreakpointReached } = useHorizontalNav();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const StyledCompactWrapper = styled.div`
    width: 100%;
    margin-inline: auto;
    ${({ isContentCompact }) =>
      isContentCompact &&
      `
        max-inline-size: ${themeConfig.compactContentWidth}px;
    `}
  `;

  return (
    <div
      className={classnames(
        horizontalLayoutClasses.root,
        "flex flex-col min-h-screen",
      )}
    >
      <Box
        component="header"
        className={horizontalLayoutClasses.header}
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          zIndex: 1100,
          transition: "all 0.25s ease-in-out",
          borderBottom: "1px solid",
          borderColor: settings.skin === "default" ? "transparent" : "divider",
          ...(scrolled
            ? {
                backgroundColor:
                  "rgba(var(--mui-palette-background-paperChannel, 255, 255, 255), 0.3)",
                backdropFilter: "blur(40px)",
                WebkitBackdropFilter: "blur(40px) saturate(200%)", // Safari support
                boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.04)",
              }
            : {
                backgroundColor: "background.paper",
                backdropFilter: "none",
                WebkitBackdropFilter: "none",
                boxShadow: "none",
              }),
        }}
      >
        {navbar || null}

        {!isBreakpointReached && (
          <StyledCompactWrapper isContentCompact={isContentCompact}>
            {navigation}
          </StyledCompactWrapper>
        )}
      </Box>

      {/* Main Content Area & Footer */}
      <div
        className={classnames(
          horizontalLayoutClasses.contentWrapper,
          "flex flex-col min-is-0 is-full flex-grow",
        )}
      >
        <LayoutContent>{children}</LayoutContent>
        {footer || null}
      </div>
    </div>
  );
};

export default HorizontalLayout;
