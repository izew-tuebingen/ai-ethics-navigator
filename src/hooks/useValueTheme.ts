/**
 * useValueTheme Hook
 * Manages dynamic value theming for pages
 */

import { applyValueTheme } from "@/services/valueThemeService";
import { useEffect } from "react";

export function useValueTheme(
  valueColor: string,
  valueBg: string,
  valueBorder: string,
  enabled = true,
) {
  useEffect(() => {
    if (!enabled) return;

    applyValueTheme(valueColor, valueBg, valueBorder);

    return () => {
      // Optional: Keep theme when navigating away
      // resetValueTheme();
    };
  }, [valueColor, valueBg, valueBorder, enabled]);

  return {
    cssVariables: {
      "--value-color": valueColor,
      "--value-bg": valueBg,
      "--value-border": valueBorder,
    } as React.CSSProperties,
  };
}
