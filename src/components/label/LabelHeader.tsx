/**
 * LabelHeader Component
 * Title and description for label page
 */

interface LabelHeaderProps {
    title?: string;
    description?: string;
    action?: React.ReactNode;
}

export function LabelHeader({
    title = "Your Label",
    description = "Your overall AI Ethics Label based on your responses across all values.",
    action,
}: LabelHeaderProps) {
    return (
        <div className="flex flex-col gap-3 md:gap-5 items-start w-full lg:flex-1 lg:max-w-[470px]">
            <div className="flex flex-col items-start justify-start">
                <h1 className="font-bold text-[#474747] text-2xl md:text-3xl leading-tight md:leading-snug">
                    {title}
                </h1>
            </div>
            <div className="flex items-start justify-start">
                <p className="font-normal text-xs md:text-sm text-black leading-[1.4]">
                    {description}
                </p>
            </div>
            {action && <div className="mt-1 md:mt-2">{action}</div>}
        </div>
    );
}

