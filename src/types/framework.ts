
export interface Question {
  _id: string;
  category?: string;
  question: string;
  labelGuidance?: string;
  mandatory?: string;
  answerType?: string;
  ref?: string;
  group?: string;
  children?: Question[];
}

export interface Framework {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  questions: Question[];
  detailedQuestions: Question[];
  questionsMenu?: string[];
}
