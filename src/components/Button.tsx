/**
 * Custom Button Component for App-Specific Use
 *
 * This is the main button component used throughout the app for navigation,
 * actions, and interactive elements. It provides consistent styling and behavior
 * across all pages (HomePage, ValuesPage, QuestionPage, LabelPage).
 *
 * For shadcn/ui components (Carousel, Pagination, etc.), use /components/ui/button.tsx instead.
 */
import type { ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
export type ButtonSize = "small" | "medium" | "large";

export interface ButtonProps {
  /** Button content/label */
  children: ReactNode;
  /** Click handler */
  onClick?: () => void;
  /** Visual style variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Optional icon (emoji, svg, or React element) */
  icon?: ReactNode;
  /** Icon position */
  iconPosition?: "left" | "right";
  /** Active/selected state (for toggles like Assistant button) */
  isActive?: boolean;
  /** Disabled state */
  disabled?: boolean;
  /** Show small red notification dot */
  hasNotification?: boolean;
  /** Button type */
  type?: "button" | "submit" | "reset";
  /** Additional CSS classes */
  className?: string;
  /** Native tooltip text */
  title?: string;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "medium",
  icon,
  iconPosition = "left",
  isActive = false,
  disabled = false,
  hasNotification = false,
  type,
  className = "",
  title,
}: ButtonProps) {
  // Base classes for all buttons
  const baseClasses =
    "relative flex items-center justify-center rounded-full transition-all cursor-pointer font-sans";

  // Size-based classes
  const sizeClasses = {
    small: "h-9 md:h-10 px-3 md:px-4 text-xs md:text-sm",
    medium: "h-9 md:h-10 px-4 md:px-6 text-xs md:text-sm",
    large:
      "h-10 md:h-12 px-4 md:px-6 text-base md:text-lg font-bold rounded-[36.885px]",
  };

  // Variant-based classes (supports active state)
  const getVariantClasses = () => {
    if (isActive) {
      return "bg-[#E6F0FF] text-[#020051] border-[#020051] border-[1.23px] border-solid hover:bg-[#D1E5FF]";
    }

    switch (variant) {
      case "primary":
        return "bg-[#020051] text-white border-[#020051] border-[1.23px] border-solid hover:bg-[#03006b]";
      case "secondary":
        return "bg-white text-[#111111] border-[#020051] border-[1.23px] border-solid hover:bg-[#f5f5f5]";
      case "outline":
        return "bg-white text-primary border border-primary border-solid hover:bg-[#f5f5f5]";
      case "ghost":
        return "bg-card border border-primary border-solid text-primary hover:bg-gray-50";
      default:
        return "";
    }
  };

  // Icon gap (only if icon exists)
  const iconGap = icon ? "gap-2" : "";

  // Disabled state
  const disabledClasses = disabled ? "opacity-50 cursor-not-allowed" : "";

  return (
    <button
      type={type}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={title}
      className={`${baseClasses} ${sizeClasses[size]} ${getVariantClasses()} ${iconGap} ${disabledClasses} ${className}`}
    >
      {icon && iconPosition === "left" && (
        <span className="flex items-center">{icon}</span>
      )}
      <span className="whitespace-pre">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="flex items-center">{icon}</span>
      )}
      {hasNotification && (
        <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
      )}
    </button>
  );
}

// Legacy component for backward compatibility
export function SmallButton({
  children,
  onClick,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <Button
      variant="ghost"
      size="small"
      onClick={onClick}
      className={className}
    >
      {children}
    </Button>
  );
}
