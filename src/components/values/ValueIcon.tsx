import { getIconPath } from "../../utils/iconPaths";

interface ValueIconProps {
  type: "triangle" | "square" | "hexagon" | "diamond" | "heart" | "circle";
  color?: string;
}

export function ValueIcon({ type, color }: ValueIconProps) {
  const iconColor = color || "var(--value-icon-color)";
  const iconMap = {
    triangle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="17"
        viewBox="0 0 18 17"
        fill="none"
        style={{ color: iconColor }}
      >
        <path
          d={getIconPath("triangle")}
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    square: (
      <div className="size-[18px]" style={{ backgroundColor: iconColor }} />
    ),
    hexagon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="20"
        viewBox="0 0 18 20"
        fill="none"
      >
        <path d={getIconPath("hexagon")} fill={iconColor} />
      </svg>
    ),
    diamond: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d={getIconPath("diamond")} fill={iconColor} />
      </svg>
    ),
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d={getIconPath("heart")} fill={iconColor} />
      </svg>
    ),
    circle: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
      >
        <path d={getIconPath("circle")} fill={iconColor} />
      </svg>
    ),
  };

  return iconMap[type];
}
