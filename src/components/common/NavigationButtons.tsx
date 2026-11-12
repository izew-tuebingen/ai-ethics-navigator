/**
 * NavigationButtons Component
 * Reusable navigation button group for pages
 */

import { Button } from "../Button";

interface NavigationButtonsProps {
    buttons: Array<{
        label: string;
        onClick: () => void;
        isActive?: boolean;
        disabled?: boolean;
    }>;
}

export function NavigationButtons({ buttons }: NavigationButtonsProps) {
    return (
        <div className="flex flex-wrap gap-2.5 justify-end">
            {buttons.map((button) => (
                <Button
                    key={button.label}
                    variant="outline"
                    onClick={button.onClick}
                    disabled={button.disabled}
                    isActive={button.isActive}
                >
                    {button.label}
                </Button>
            ))}
        </div>
    );
}
