export type QAType = 'question' | 'answer';

export type QARole = 'interviewer' | 'interviewee';

export interface QAItem {
  timestamp: string;
  type: QAType;
  content: string;
  role: QARole;
}

export interface BasicInformation {
  name: string;
  graduated_school: string;
  working_years: string;
  tech_stack: string;
  other_information: string;
}

export interface TimelineItem {
  timestamp: string;
  key_name_entity: string;
  highlight: string;
  lowlight: string;
  summary: string;
  timestamp_ref: string[];
}

export interface AnalysisResult {
  basic_information: BasicInformation;
  overall_summary: string;
  timeline: TimelineItem[];
}

// Keep the old interface for backward compatibility
export interface AnalysisItem {
  timestamp: string;
  key_name_entity: string;
  highlight: string;
  lowlight: string;
  summary: string;
}


