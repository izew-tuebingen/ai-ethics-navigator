import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { Circle } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

function RadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Root>) {
  return (
    <RadioGroupPrimitive.Root
      data-slot="radio-group"
      className={cn("grid gap-2", className)}
      {...props}
    />
  );
}

function RadioGroupItem({
  className,
  style,
  ...props
}: React.ComponentProps<typeof RadioGroupPrimitive.Item>) {
  return (
    <RadioGroupPrimitive.Item
      data-slot="radio-group-item"
      className={cn(
        "aspect-square size-4 sm:size-4.5 md:size-5 lg:size-6 rounded-full border-2 border-gray-300 shadow-xs transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--value-color,var(--primary))]/50 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[var(--value-color,var(--primary))] data-[state=checked]:text-[var(--value-color,var(--primary))] flex items-center justify-center shrink-0",
        className
      )}
      style={style}
      {...props}
    >
      <RadioGroupPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="flex items-center justify-center"
      >
        <Circle className="size-2.5 sm:size-3 md:size-3.5 lg:size-4 fill-(--value-color,currentColor) text-(--value-color,currentColor)" />
      </RadioGroupPrimitive.Indicator>
    </RadioGroupPrimitive.Item>
  );
}

export { RadioGroup, RadioGroupItem };
