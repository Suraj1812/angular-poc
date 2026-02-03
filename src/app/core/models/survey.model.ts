export interface Survey {
  id: number;
  name: string;
  description: string;
  status: "draft" | "published";
  createdDate: Date;
  responseCount: number;
  tenantId: string;
  questions: Question[];
}

export interface Question {
  id: number;
  text: string;
  type: "text" | "single-choice";
  required: boolean;
  options?: string[];
}

export interface SurveyResponse {
  surveyId: number;
  responses: Answer[];
  submittedAt: Date;
  userId: number;
}

export interface Answer {
  questionId: number;
  answer: string;
}
