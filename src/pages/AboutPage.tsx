/** 
@file AboutPage.tsx
@description About Page for the VCIO Application.

Provides users with information about the VCIO approach, its values, criteria, indicators, and observables.
 It also explains the AI Trust Label and its structure, aggregation methodology, and use.

 */


import { Button } from "@/components/Button";
import { Logo } from "@/components/common/Logo";
import { PageFooter } from "@/components/common/PageFooter";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
Props for the AboutPage component.
It includes an optional callback for returning home.

@param onHomeClick - Optional callback function to handle the Home button click event.

*/

interface AboutPageProps {
    onHomeClick?: () => void;
}

/** 
TopBar Component: Home navigation and a Logo
@param props - The props for the components.
@param onHomeClick - Optional callback function to handle the Home button click event.
@returns {JSX.Element} - The rendered TopBar component.
*/

function TopBar({
    onHomeClick,
}: {
    onHomeClick?: () => void;
}) {
    return (
        <div className="sticky top-0 z-50 w-full flex items-center justify-center px-4 md:px-8 lg:px-16 py-1.5 md:py-2 bg-white/90 backdrop-blur-sm border-b border-gray-100 shrink-0 h-11 md:h-12">
            <div className="w-full max-w-[1320px] flex items-center justify-between">
                <div onClick={onHomeClick} className="cursor-pointer">
                    <Logo />
                </div>
                <div className="flex items-center gap-4 lg:gap-6">
                    <Button variant="secondary" size="small" onClick={onHomeClick}>
                        Home
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Main Page of "About" displays the information about the VCIO approach and the AI Trust Label.
 * Controls the scrolling behavior based on the URL hash and renders.
 * @params props - see AboutPageProps for details.
 * @returns JSX.Element - The rendered AboutPage component.
 */

export function AboutPage({ onHomeClick }: AboutPageProps) {
    const { hash } = useLocation();

    useEffect(() => {
        if (hash) {
            const element = document.getElementById(hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "smooth" });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [hash]);

    return (
        <div className="min-h-screen w-full flex flex-col bg-white">
            <TopBar onHomeClick={onHomeClick} />

            <main className="flex-grow flex flex-col items-center px-4 md:px-8 lg:px-16 py-8 lg:py-12">
                <div className="w-full max-w-[800px] flex flex-col gap-8 text-text-primary">

                    <section>
                        <h1 className="text-3xl lg:text-4xl font-bold mb-6 text-text-title">About VCIO</h1>

                        <h2 id="vcio-approach" className="text-xl lg:text-2xl font-bold mb-4 text-text-title">Executive Summary — VCIO Approach</h2>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Full Description of the Approach:</h3>
                            <p className="mb-2">
                                Bertelsmann Stiftung and VDE, “From Principles to Practice: An interdisciplinary framework to operationalise AI ethics,” 2020, DOI: 10.11586/2020013.
                            </p>
                        </div>

                        <div className="mb-6">
                            <h3 className="font-semibold mb-2">Description of the developed Standard VDE Spec 90012:</h3>
                            <p>
                                Wulf Loh, Andreas Hauschke, Michael Puntschuh, and Sebastian Hallensleben. 2022. VDE SPEC 90012 V1.0 - VCIO based description of systems for AI trustworthiness characterisation. (April 2022)
                            </p>
                        </div>
                    </section>

                    <section>
                        <h2 id="values" className="text-2xl font-bold mb-4 text-text-title">1. The VCIO Approach (Values, Criteria, Indicators, Observables)</h2>
                        <p className="mb-4 text-lg leading-relaxed">
                            The VCIO (Values, Criteria, Indicators, Observables) framework is an interdisciplinary approach designed to bridge the gap between abstract ethical principles and their practical application in AI systems. Its main goal is to allow to specify, operationalize, and measure otherwise vague ethical principles to make them practicable, comparable, and measurable.
                        </p>

                        <p className="mb-4 leading-relaxed">
                            The VCIO model operates on four hierarchical levels:
                        </p>

                        <p className="mb-4 leading-relaxed">
                            To describe the levels, the paper proposes a series of questions on six core values drawing on current discourse and functionality. These later form an AI ethics rating based on an assessment of the observables in each value (for concrete hierarchy and questions, see VDE Spec for five of the six values): Justice/Fairness, Accountability, Transparency, Privacy, and Reliability, Sustainability.
                        </p>

                        <ul className="list-decimal pl-5 space-y-4 mb-6">
                            <li className="pl-2">
                                <strong>Values (V):</strong> These formulate general ethical values that should guide actions (e.g., justice or transparency) at the highest value.
                            </li>
                            <li className="pl-2">
                                <strong>Criteria (C):</strong> These specify the conditions that define the fulfillment or violation of the respective value.
                            </li>
                            <li className="pl-2">
                                <strong>Indicators (I):</strong> Since criteria are typically not directly observable, indicators are necessary to monitor whether a criterion is met. Indicators are necessary conditions for the fulfillment of criteria on an abstract level and cannot be logically deduced from the criteria. They form necessary conditions for the criteria on an abstract level and require deliberative processes for their determination. (The authors note that it is typical that several indicators are required to evaluate the fulfillment of a criterion. Also, an indicator can be used to assess the fulfillment of various criteria.)
                            </li>
                            <li className="pl-2">
                                <strong>Observables (O):</strong> These are quantifiable or qualifiable values that provide insight into the implementation status of a specific indicator. These explain the explicit operationalisation and are assigned ratings, proposed as letters from "A" (best/fully fulfilled) to "G" (worst/not fulfilled)
                            </li>
                        </ul>

                        <p className="mb-4 leading-relaxed">
                            The VCIO approach performs three tasks: it clarifies the meaning of a value, explains how to check or observe its fulfillment (measurement). In the paper it also acknowledges and explains how to deal with value conflicts depending on the application context (balancing) (see pages XX-XX).
                        </p>

                        <p className="mb-4 leading-relaxed">
                            <strong>Normative load:</strong> The definition of lower levels (C, I, O) cannot be derived deductively from the higher levels (V) but requires new deliberation and negotiation. The operationalization of values using VCIO combines both a system perspective (defining ethical requirements for the AI system itself) and a process perspective (specifying requirements for the design and implementation processes).
                        </p>

                        <p className="mb-4 leading-relaxed">
                            For us, this means that we also want to showcase and implement the possibility to input new data to create new sets of values/criteria/indicator and observables to provide flexibility for diﬀerent deliberation and negotiation contexts. As the authors write in their approach „the provided questions can oﬀer orientation to system developers and users alike and help regulators, watchdog and standard-setting organisations to specify their requirements for ethical and trustworthy algorithmic decision-making systems“.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-text-title">2. AI Trust Label</h2>
                        <p className="mb-4 leading-relaxed">
                            The VCIO model serves as the foundation for a proposed context-independent AI Ethics Label (Trust Label) in the paper. The proposed visualisation is inspired by the energy eﬃciency label and aims „to communicate an AI system’s ethical characteristics in a way that citizens, users, and consumers can easily understand“.
                        </p>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Label Structure and Levels:</h3>
                            <p className="mb-2 leading-relaxed">
                                The label includes one aggregated rating for each of the values. The proposed ratings are indicated by letters (e.g., A to G), with "A" signifying (close to) complete value fulfillment. In general, a system of 5 to 7 levels is suggested to provide suﬃcient diﬀerentiation while maintaining clarity.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Aggregation Methodology:</h3>
                            <p className="mb-2 leading-relaxed">
                                To aggregate the numerous observables collected under a specific value into a single rating level, the paper discusses two primary methods:
                            </p>
                            <ol className="list-decimal pl-5 space-y-2 mb-2">
                                <li className="pl-2">Average Value Calculation: Aggregating metrics by computing an average (e.g., where a bad mark can be oﬀset by a good mark, like in school grades).</li>
                                <li className="pl-2">Minimum Requirements Approach: Defining the minimum requirements for the observables that must be met to reach a specific overall system rating</li>
                            </ol>
                            <p className="mb-2 leading-relaxed">
                                <strong>Recommendation:</strong> The paper recommends the minimum requirements approach for aggregation. (preferred because all indicators are considered technically equally important and necessary for an "ethical" AI system). As necessary conditions, indicators cannot be set oﬀ against or substituted for each other. For instance, if potential biases are checked but not addressed, the result is the same as if they were never checked at all.
                            </p>
                        </div>

                        <div className="mb-4">
                            <h3 className="font-semibold mb-2">Use of the Label:</h3>
                            <p className="mb-2 leading-relaxed">
                                The AI Ethics Label is proposed to be assigned to an AI system independently of its future use (e.g., a system receives the same rating whether used in parole hearings or post-release reintegration measures). Depending on the application scenarios, the minimum requirements for the fulfilment of diﬀerent values can diﬀer or can be regulated as cross-sectional specifications.
                            </p>
                            <p className="leading-relaxed italic mt-4 text-gray-600">
                                (Context: You can read in the paper that assessing whether an AI system is deemed ethical in a given situation should require combining this context-independent ethics rating with a context-dependent classification of the application context, determined using a Risk Matrix. Regulators are then recommended to use this combination to demand that AI systems satisfy specific minimum levels within the ethics rating for higher-risk applications.
                            </p>
                            <p className="leading-relaxed italic mt-2 text-gray-600">
                                Since we now have a context of compliance (AI Act, etc.) and existing definitions for high-risk applications in the EU, a diﬀerent context for the application of the VCIO model is used. Therefore, we approach this diﬀerently by providing an interface for creating own/new question sets as noted above as well as experiment with using LLMs to allow for specific contextualisations)
                            </p>
                        </div>
                    </section>

                </div>
            </main>

            <PageFooter />
        </div>
    );
}
