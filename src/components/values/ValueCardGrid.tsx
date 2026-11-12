/**
 * ValueCardGrid Component
 * Grid display of value cards
 */

import type { ValueIcon } from "@/types";
import { ValueCardNew } from "../ValueCardNew";

interface ValueCardGridProps {
    values: Array<{
        id: string;
        name: string;
        icon: string;
        description: string;
        color: string;
        bgColor: string;
        borderColor: string;
        path: string;
    }>;
    valueProgress: Record<
        string,
        {
            completed: number;
            total: number;
        }
    >;
    onValueClick: (valueName: string, path: string) => void;
}

export function ValueCardGrid({
    values,
    valueProgress,
    onValueClick,
}: ValueCardGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {values.map((value) => {
                const progressData = valueProgress?.[value.name] || {
                    completed: 0,
                    total: 0,
                };

                return (
                    <ValueCardNew
                        key={value.name}
                        value={{
                            name: value.name,
                            icon: value.icon as ValueIcon,
                            description: value.description,
                            progress: `${progressData?.completed ?? 0} / ${progressData?.total ?? 0}`,
                            color: value.color,
                            bgColor: value.bgColor,
                            borderColor: value.borderColor,
                        }}
                        onClick={() => onValueClick(value.name, value.path)}
                    />
                );
            })}
        </div>
    );
}
