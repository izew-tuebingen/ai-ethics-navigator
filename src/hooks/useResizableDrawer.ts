import { useState, useEffect } from "react";

interface UseResizableDrawerOptions {
  initialWidth?: number;
  minWidth?: number;
  maxWidth?: number;
}

export function useResizableDrawer({
  initialWidth = 400,
  minWidth = 300,
  maxWidth = 800,
}: UseResizableDrawerOptions = {}) {
  const [width, setWidth] = useState(initialWidth);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Calculate width from the right edge of the window
      const newWidth = Math.max(minWidth, Math.min(maxWidth, window.innerWidth - e.clientX));
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "default";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "default";
    };
  }, [isDragging, minWidth, maxWidth]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  return { width, isDragging, handleMouseDown };
}
