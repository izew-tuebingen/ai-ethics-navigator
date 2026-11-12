/**
 * Centralized SVG path definitions for all value icons.
 * Used across components to maintain consistency and follow DRY principle.
 */

export const ICON_PATHS = {
  triangle: 'M8.50082 0.882612C8.69124 0.539129 9.18507 0.539129 9.37549 0.882612L17.1869 14.9762C17.3717 15.3094 17.1307 15.7186 16.7497 15.7186H1.1267C0.745673 15.7186 0.504665 15.3094 0.689373 14.9762L8.50082 0.882612Z',
  square: 'M2 2h16v16H2z',
  hexagon: 'M8.66016 0L17.3204 5V15L8.66016 20L-9.82285e-05 15V5L8.66016 0Z',
  diamond: 'M10 0L20 10L10 20L0 10L10 0Z',
  heart: 'M10 18.1C10 18.1 3 13.8 3 8.5C3 5.5 5.5 3 8 3C9.1 3 10.1 3.4 10 3.4C10 3.4 10.9 3 12 3C14.5 3 17 5.5 17 8.5C17 13.8 10 18.1 10 18.1Z',
  circle: 'M0 10 A10 10 0 1 0 20 10 A10 10 0 1 0 0 10',
} as const;

export type IconType = keyof typeof ICON_PATHS;

/**
 * Get SVG path for a given icon type.
 * @param iconName - The name of the icon (triangle, square, hexagon, diamond, circle)
 * @returns SVG path string, defaults to triangle if not found
 */
export function getIconPath(iconName: string): string {
  return ICON_PATHS[iconName as IconType] || ICON_PATHS.triangle;
}
