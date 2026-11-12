/**
 * PageFooter Component
 * Standard footer with links and university branding
 */

export function PageFooter() {
    return (
        <div className="flex flex-col-reverse md:flex-row gap-4 md:gap-10 items-center justify-between p-4 md:py-5 border-t border-border bg-card">
            <div className="flex gap-5">
                <span className="text-[14px] font-normal text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Datenschutz
                </span>
                <span className="text-[14px] font-normal text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Impressum
                </span>
                <span className="text-[14px] font-normal text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Hinweise
                </span>
            </div>
            <div className="flex gap-5 items-center">
                {/* University Logo from public/IZEW_engl.svg */}
                <img
                    src="IZEW-engl.svg"
                    alt="University Logo"
                    className="h-6 w-auto"
                />
            </div>
        </div>
    );
}
