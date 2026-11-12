export function Logo() {
  return (
    <div className="flex gap-2 items-center relative shrink-0 select-none">
      <div className="h-6 w-6 md:h-7 md:w-7 relative shrink-0">
        <img src="/Logo.svg" alt="Logo" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col font-sans justify-center">
        <span className="text-base md:text-lg font-normal text-foreground leading-none">
          AI Ethics Navigator
        </span>
      </div>
    </div>
  );
}
