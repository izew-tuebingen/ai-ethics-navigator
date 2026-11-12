/**
 * Component prop types
 */

import { ReactNode } from "react";
import { ValueIcon } from "./values.types";

/** Button variants */
export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

/** Button sizes */
export type ButtonSize = "small" | "medium" | "large";

/** Common button props */
export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Info card props */
export interface InfoCardProps {
  title: string;
  description: string;
  onLearnMore?: () => void;
}

/** Value icon props */
export interface ValueIconProps {
  icon: ValueIcon;
  color: string;
  size?: number;
}

/** Panel props */
export interface PanelProps {
  isOpen: boolean;
  onClose: () => void;
}
