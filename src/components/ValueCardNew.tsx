import type { ValueIcon as ValueIconType } from "@/types";
import { ValueIcon } from "./values/ValueIcon";

interface ValueCardNewProps {
  value: {
    name: string;
    icon: ValueIconType;
    description: string;
    progress: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
  onClick?: () => void;
}

export function ValueCardNew({ value, onClick }: ValueCardNewProps) {
  return (
    <div
      className="relative border border-solid rounded-[27px] w-full cursor-pointer transition-transform hover:scale-105 overflow-hidden bg-[var(--value-bg-color)] border-[var(--value-border-color)]"
      style={{
        ["--value-color" as string]: value.color,
        ["--value-bg-color" as string]: value.bgColor,
        ["--value-border-color" as string]: value.borderColor,
        ["--value-icon-color" as string]: value.color,
      }}
      onClick={onClick}
    >
      <div className="box-border flex flex-col items-start p-3.5 w-full h-full">
        {/* Top Row - Icon */}
        <div className="content-stretch flex items-start justify-between relative shrink-0 w-full mb-4">
          {/* Icon */}
          <div className="box-border content-stretch flex gap-2 items-center justify-center px-1 py-1 relative rounded-[49.421px] shrink-0 w-[28px] h-[28px]">
            <div className="relative shrink-0 size-[16px]">
              <ValueIcon type={value.icon} />
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="content-stretch flex flex-col gap-1 items-start justify-center relative shrink-0 w-full mb-1">
          <div className="flex flex-col font-semibold justify-center leading-[0] not-italic relative shrink-0 text-lg w-full text-[var(--value-color)]">
            <p className="leading-tight whitespace-pre">{value.name}</p>
          </div>
        </div>

        {/* Description */}
        <div className="flex flex-col justify-center leading-[0] relative text-xs w-full mb-3 text-[var(--value-color)]">
          <p className="leading-snug line-clamp-4">{value.description}</p>
        </div>

        {/* Bottom Row - Progress and Arrow */}
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-full mt-auto">
          <div className="bg-inherit h-[32px] relative rounded-full shrink-0">
            <div className="content-stretch flex h-[32px] items-center justify-center overflow-clip relative rounded-[inherit]">
              <div className="box-border content-stretch flex gap-2 items-center justify-center px-3 py-2 relative shrink-0">
                <div className="flex flex-col font-light justify-center leading-[0] relative shrink-0 text-xs text-center text-nowrap tracking-[0.1px] text-[var(--value-color)]">
                  <p className="leading-[20px] whitespace-pre">
                    {value.progress}
                  </p>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="absolute border border-solid inset-[-0.5px] pointer-events-none rounded-[30.5px] border-[var(--value-border-color)]"
            />
          </div>

          <div className="relative shrink-0 size-[32px]">
            <svg
              className="block size-full"
              fill="none"
              viewBox="0 0 32 32"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_97_1520)">
                <path
                  d="M16 0.5C24.5604 0.5 31.5 7.43959 31.5 16C31.5 24.5604 24.5604 31.5 16 31.5C7.43959 31.5 0.5 24.5604 0.5 16C0.5 7.43959 7.43959 0.5 16 0.5Z"
                  stroke="var(--value-color)"
                />
                <path
                  d="M23 16L17 22M23 16L17 10M23 16L9 16"
                  stroke="var(--value-color)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
              <defs>
                <clipPath id="clip0_97_1520">
                  <rect width="32" height="32" fill="white" />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
