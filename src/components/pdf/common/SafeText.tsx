/**
 * SafeText.tsx
 * A safe wrapper around @react-pdf/renderer's <Text> component.
 * Prevents "Invalid '' string child outside <Text> component" errors by ensuring
 * empty strings or falsy values are not rendered into the PDF view tree.
 */

import React from "react";
import { Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";

interface SafeTextProps {
  children?: React.ReactNode;
  style?: Style | Style[];
  render?: (props: any) => React.ReactNode;
}

export const SafeText: React.FC<SafeTextProps> = ({ children, style, render }) => {
  if (render) {
    return <Text style={style} render={render as any} />;
  }
  // Check if children resolves to an empty string, null, or undefined.
  // We allow numbers (e.g. 0) as they render fine in <Text>.
  if (
    children === "" ||
    children === null ||
    children === undefined ||
    children === false
  ) {
    return null;
  }

  return <Text style={style}>{children}</Text>;
};
