import { Button } from "./Button";

interface InfoCardProps {
  title: string;
  description: string;
  onLearnMore?: () => void;
}

export function InfoCard({ title, description, onLearnMore }: InfoCardProps) {
  return (
    <div className="flex-1 flex flex-col justify-between items-start p-4 lg:p-6 gap-2 lg:gap-3 bg-white border border-border-light rounded-3xl backdrop-blur-sm">
      <div className="flex flex-col gap-2 lg:gap-3 w-full">
        <h3 className="text-lg lg:text-xl xl:text-2xl font-medium leading-tight lg:leading-snug text-text-subtitle">
          {title}
        </h3>
        <p className="text-sm lg:text-base xl:text-lg font-light leading-relaxed text-text-description">
          {description}
        </p>
      </div>
      <div className="flex justify-end items-center w-full h-10">
        <Button variant="secondary" size="small" onClick={onLearnMore}>
          Learn more
        </Button>
      </div>
    </div>
  );
}
