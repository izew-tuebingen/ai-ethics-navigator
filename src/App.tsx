import {
  BrowserRouter,
  Route,
  Routes,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Toaster } from "sonner";
import { AiAssistProvider } from "./contexts/AiAssistContext";
import { FrameworkProvider } from "./contexts/FrameworkContext";
import { RepositoryProvider } from "./contexts/RepositoryContext";
import { AboutPage } from "./pages/AboutPage";
import { HomePage } from "./pages/HomePage";
import { LabelPageRefactored as LabelPage } from "./pages/LabelPage";
import { QuestionPageRefactored as QuestionPage } from "./pages/QuestionPage";
import { TeamDemoPage } from "./pages/TeamDemoPage";
import { ValuesPageRefactored as ValuesPage } from "./pages/ValuesPage";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

function HomeRoute() {
  const navigate = useNavigate();

  return (
    <HomePage
      onReviewClick={() => navigate("/values")}
      onEditClick={() => window.open("https://ai-ethics-editor--ai-ethics-editor-preview-42stbd80.web.app/", "_blank")}
      onAboutClick={() => navigate("/about")}
      onTeamClick={() => navigate("/teams")}
      onLearnMoreHelp={() => navigate("/about#vcio-approach")}
      onLearnMoreValues={() => navigate("/about#values")}
    />
  );
}

function ValuesRoute() {
  const navigate = useNavigate();

  return (
    <ValuesPage
      onValueClick={(valueName) => {
        navigate(`/question?value=${encodeURIComponent(valueName)}`);
      }}
      onHomeClick={() => navigate("/")}
      onReviewClick={() => navigate("/values")}
      onLabelClick={() => navigate("/label")}
    />
  );
}

function LabelRoute() {
  const navigate = useNavigate();

  return (
    <LabelPage
      onHomeClick={() => navigate("/")}
      onReviewClick={() => navigate("/values")}
      onLabelClick={() => navigate("/label")}
    />
  );
}

function TeamDemoRoute() {
  const navigate = useNavigate();

  return <TeamDemoPage onHomeClick={() => navigate("/")} />;
}

function AboutRoute() {
  const navigate = useNavigate();

  return (
    <AboutPage
      onHomeClick={() => navigate("/")}
    />
  );
}

function QuestionRoute() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const valueName = searchParams.get("value") || "Transparency";

  return (
    <QuestionPage
      onBack={() => navigate("/values")}
      valueName={valueName}
    />
  );
}

export default function App() {
  return (
    <RepositoryProvider>
      <AiAssistProvider>
        <FrameworkProvider>
          <BrowserRouter>
            <div className="min-h-screen w-full">
              <Routes>
                <Route path="/" element={<HomeRoute />} />
                <Route path="/values" element={<ValuesRoute />} />
                <Route path="/about" element={<AboutRoute />} />
                <Route path="/label" element={<LabelRoute />} />
                <Route path="/question" element={<QuestionRoute />} />
                <Route path="/teams" element={<TeamDemoRoute />} />
              </Routes>
              <Toaster position="top-right" richColors />
            </div>
          </BrowserRouter>
        </FrameworkProvider>
      </AiAssistProvider>
    </RepositoryProvider>
  );
}
