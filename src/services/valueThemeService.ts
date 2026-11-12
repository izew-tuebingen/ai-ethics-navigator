/**
 * @file valueThemeService.ts
 * @description Provides helpers for applying value-specific theme colors.
 *  This service reads theme metadata for a selected value and applies the corresponding colors as CSS custom properties on the document root.
* @category Services
* @module ValueThemeService
 * 
 */

import type { ValueMetadata } from "@/types";
import { logger } from "@/utils/logger";

/**
 * applyValueTheme: 
 * @description Applies value-specific theme colors to the document root.
 * @param valueColor - Primary color for the selected value.
 * @param valueBg - Background color for  the selected value.
 * @param valueBorder - Border color for the selected value.
 * @returns {void}
 *
 */
export function applyValueTheme(
  valueColor: string,
  valueBg: string,
  valueBorder: string,
): void {
  try {
    if (typeof document === "undefined") return;

    document.documentElement.style.setProperty("--value-color", valueColor);
    document.documentElement.style.setProperty("--value-bg", valueBg);
    document.documentElement.style.setProperty("--value-border", valueBorder);
  } catch (error) {
    logger.warn("Failed to apply value theme:", error);
  }
}

/**
 * getValueTheme:
 * @description  Resolves theme metadata for a selected value.
 * @param valueName - Name of the selected value.
 * @param manifest - Value metadata entries containing colors and icons.
 * @returns { color: string; bgColor: string; *orderColor: string; icon: string }* Theme data for the selected value
 */
export function getValueTheme(
  valueName: string,
  manifest: ValueMetadata[],
): {
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
} {
  const entry = manifest.find((v) => v.name === valueName);

  return {
    color: entry?.color ?? "var(--value-color)",
    bgColor: entry?.bgColor ?? "var(--value-bg)",
    borderColor: entry?.borderColor ?? "var(--value-border)",
    icon: entry?.icon ?? "triangle",
  };
}

/**
 * @description Resets the active value theme on the document root.
 * Removes the CSS custom properties used for value-specific theming so the
 * application can fall back to its default styling
 * The function safely exits when `document` is unavailable.
 *
 * @returns {void}
 */
export function resetValueTheme(): void {
  try {
    if (typeof document === "undefined") return;

    document.documentElement.style.removeProperty("--value-color");
    document.documentElement.style.removeProperty("--value-bg");
    document.documentElement.style.removeProperty("--value-border");
  } catch (error) {
    logger.warn("Failed to reset value theme:", error);
  }
}
