/* Types for the bundled AI ethics framework, values, criteria, indicators, and options. */

// answer options for each question

export interface EthicsOption {
  id: string;        // generierte ID
  label: string;     // "A", "B", "C", ...
  text: string;      // Antworttext
}


// indicators are the actual questions, grouped under criteria.

export interface EthicsIndicator {
  id: string;               // generate ID
  code: string;             // e.g. "T1-Q1"
  question: string;         // questiontext
  guidance?: string | null; // optional
  importanceLevel: number;  // 1–5
  required: boolean;        // required?
  options: EthicsOption[];  // answer options
}

// criterion group related indicators together under a value dimension.

export interface EthicsCriterion {
  id: string;               // generate ID
  code: string;             // e.g. "T1"
  name: string;
  description: string;
  indicators: EthicsIndicator[];
}


// value is the top-level dimension, e.g. "Transparency", under which criteria and indicators are organized.

export interface EthicsValue {
  id: string;               // generate ID
  name: string;             // e.g. "Transparency"
  description: string;
  color: string;
  icon: string;
  version: string;          // version of the value definition, e.g. "1.0"
  createdDate: string;      // ISO Datum
  criteria: EthicsCriterion[];
}


// FRAMEWORK 
export interface EthicsFramework {
  id: string;
  lastUpdated: string;
  values: EthicsValue[];
  metadata: {
    source: string;
    version: string;
  };
}
