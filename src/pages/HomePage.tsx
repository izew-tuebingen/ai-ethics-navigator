
/**
 * @file HomePage.tsx
 * @description This file defines the HomePage component, which serves as the main landing page for the application.
 * Provides navigation to the assessment, editor, and information about the AI Ethics Navigator.
**/
import { Button } from "@/components/Button";
import { InfoCard } from "@/components/InfoCard";
import { FrameworkSelector } from "@/components/common/FrameworkSelector";
import { Logo } from "@/components/common/Logo";
import { PageFooter } from "@/components/common/PageFooter";
import { DEMO_CURRENT_USER_NAME, DEMO_TEAM } from "@/demo/teamDemoData";
import { toast } from "sonner";

/**
 * @interface HomePageProps
 * @description Props for the HomePage component.
 * It includes three optional callback functions: onReviewClick, onEditClick, and onAboutClick.
 * @param onReviewClick - Callback function to handle the "Review your AI-product" button click event.
 * @param onEditClick - Callback function to handle the the "Edit tool content" button click event.
 * @param onAboutClick - Callback function to handle  the "About VCIO" button click event.
 */
interface HomePageProps {
  onReviewClick?: () => void;
  onEditClick?: () => void;
  onAboutClick?: () => void;
  onTeamClick?: () => void;
}

/**
 * @function TopBar
 * @description Homepage navigation bar.
 * @param props - The props for the components
 * @param  user - The user object from the authentication context
 * @param  profile - The profile object from the authentication context.
 * @returns {JSX.Element} - The rendered TopBar component.
 */
function TopBar({
  onAboutClick,
  onTeamClick,
}: {
  onAboutClick?: () => void;
  onTeamClick?: () => void;
}) {
  return (
    <div className="sticky top-0 z-50 w-full flex items-center justify-center px-4 md:px-8 lg:px-16 py-1.5 md:py-2 bg-lighter/90 backdrop-blur-sm shrink-0 h-11 md:h-12">
      <div className="w-full max-w-[1320px] flex items-center justify-between">
        <Logo />
        <div className="flex items-center gap-4 lg:gap-6">
          <Button variant="secondary" size="small" onClick={onAboutClick}>
            About VCIO
          </Button>
          <div className="flex items-center gap-2 md:gap-4">
            <span className="hidden text-sm font-medium text-text-subtitle md:block">
              Hi, {DEMO_CURRENT_USER_NAME}
            </span>
            <Button variant="secondary" size="small" onClick={onTeamClick}>
              {DEMO_TEAM.name}
            </Button>
            <Button
              variant="primary"
              size="small"
              onClick={() => toast.info("Logout is not available in this demo.")}
            >
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
/**
 * @function HeroSection
 * @description Homepage hero section.
 * @param props - The props for the components
 * @returns {JSX.Element} - The rendered HeroSection component.
 */

function HeroSection({
  onReviewClick,
  onEditClick,
}: {
  onReviewClick?: () => void;
  onEditClick?: () => void;
}) {
  return (
    <div className="w-full flex flex-col items-center justify-center px-4 md:px-8 lg:px-16 py-2 lg:py-2 flex-grow">
      <div className="flex flex-col items-center gap-2 lg:gap-3 w-full max-w-[1320px]">
        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-text-title leading-tight lg:leading-tight text-center">
          AI Ethics Navigator
        </h1>
        <p className="text-base lg:text-lg xl:text-xl font-light text-text-subtitle leading-tight lg:leading-relaxed text-center">
          Guidance for the trustworthy design of your AI product
        </p>
        <div className="flex justify-center w-full pt-2">
          <FrameworkSelector />
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-center pt-2 gap-3 lg:gap-3 w-full sm:w-auto">
          <Button variant="primary" size="large" onClick={onReviewClick}>
            Review your AI product
          </Button>
          <Button variant="primary" size="large" onClick={onEditClick}>
            Edit tool content
          </Button>
        </div>
      </div>
    </div>
  );
}
/**
 * @function InfoSection
 * @description InfoSection Component: Homepage information section.
  * @param onLearnMoreHelp - Callback function to handle the "Learn more" button click event for the navigator help card.
  * @param onLearnMoreValues - Callback function to handle the "Learn more" button click event for the values considered card.
 * @returns {JSX.Element} - The rendered InfoSection component.
 */

const INFO_CARD_CONTENT = {
  navigatorHelp: {
    title: "How does the AI Ethics Navigator help me?",
    description: "The VCIO approach allows you to specify, operationalize, and measure vague ethical principles, making them practicable, comparable, and measurable using the VDE Spec 90012 standard.",
  },
  valuesConsidered: {
    title: "Which values are considered?",
    description: "The VDE Spec 90012 standard assesses five core values: Fairness, Accountability, Transparency, Privacy, and Reliability. Each value is broken down into criteria, indicators, and observables.",
  },
};

function InfoSection({ onLearnMoreHelp, onLearnMoreValues }: { onLearnMoreHelp?: () => void, onLearnMoreValues?: () => void }) {
  return (
    <div className="w-full flex flex-col items-center px-4 md:px-8 lg:px-16 py-2 lg:py-4 bg-lighter">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-16 w-full max-w-[1320px]">
        <InfoCard
          title={INFO_CARD_CONTENT.navigatorHelp.title}
          description={INFO_CARD_CONTENT.navigatorHelp.description}
          onLearnMore={onLearnMoreHelp}
        />
        <InfoCard
          title={INFO_CARD_CONTENT.valuesConsidered.title}
          description={INFO_CARD_CONTENT.valuesConsidered.description}
          onLearnMore={onLearnMoreValues}
        />
      </div>
    </div>
  );
}
/**
 * HomePage Component: 
 * @description The main homepage component.
 * @param props - The props for the components
 * @param onLearnMoreHelp - Callback function to handle the "Learn more" button click event for the navigator help card.
 * @param onLearnMoreValues - Callback function to handle the "Learn more" button click event for the values considered card.
 * @returns {JSX.Element} - The rendered HomePage component.
 */

export function HomePage({
  onReviewClick,
  onEditClick,
  onAboutClick,
  onTeamClick,
  onLearnMoreHelp,
  onLearnMoreValues,
}: HomePageProps & {
  onLearnMoreHelp?: () => void;
  onLearnMoreValues?: () => void;
}) {
  return (
    <div
      className="relative min-h-screen w-full flex flex-col"
      style={{
        background:
          "radial-gradient(ellipse at 37% 54%, rgba(220,252,255,1) 0%, rgba(220,252,255,1) 18.86%, rgba(243,225,255,1) 42.29%, rgba(255,240,221,1) 100%)",
      }}
    >
      <TopBar onAboutClick={onAboutClick} onTeamClick={onTeamClick} />
      <HeroSection onReviewClick={onReviewClick} onEditClick={onEditClick} />
      <div className="mt-auto">
        <InfoSection onLearnMoreHelp={onLearnMoreHelp} onLearnMoreValues={onLearnMoreValues} />
        <PageFooter />
      </div>
    </div>
  );
}
