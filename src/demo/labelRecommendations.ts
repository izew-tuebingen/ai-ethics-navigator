export interface DemoRecommendation {
  questionId: string;
  text: string;
}

export const DEMO_LABEL_RECOMMENDATIONS: Record<
  string,
  DemoRecommendation[]
> = {
  Transparency: [
    {
      questionId: "T1.1",
      text: "Publish a structured datasheet that records the dataset’s origin, collection method, handling, and responsible owner.",
    },
    {
      questionId: "T1.2",
      text: "Document dataset characteristics, limitations, and known gaps in a consistent format that reviewers can access.",
    },
  ],
  Accountability: [
    {
      questionId: "A1.1",
      text: "Maintain an accessible log of data sources, preparation steps, responsible people, and recovery history.",
    },
    {
      questionId: "A1.2",
      text: "Version and retain development and training records, including the data and system changes made at each stage.",
    },
  ],
  Fairness: [
    {
      questionId: "F1.1",
      text: "Map people and groups affected directly and indirectly by the system, including impacts in its wider social context.",
    },
    {
      questionId: "F1.2",
      text: "Define and justify the intended user and target groups, and review them for reasonably foreseeable misuse cases.",
    },
  ],
  Privacy: [
    {
      questionId: "P1.1",
      text: "Document a GDPR compliance review, assign an owner for privacy obligations, and revisit it when the system or data changes.",
    },
    {
      questionId: "P2.1",
      text: "Assess how much personal information can be inferred from each dataset and apply justified anonymisation or other safeguards.",
    },
  ],
  Reliability: [
    {
      questionId: "R1.1",
      text: "Define and publish the operational design domain, intended use cases, and conditions where the system should not be used.",
    },
    {
      questionId: "R1.2",
      text: "Record how data quality, quantity, and preparation fit the intended purpose and operational design domain.",
    },
  ],
};

export const DEFAULT_DEMO_RECOMMENDATION: DemoRecommendation = {
  questionId: "Assessment",
  text: "Review the lowest-scoring indicators with relevant stakeholders and document measurable improvement actions.",
};
