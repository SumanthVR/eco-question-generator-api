
export interface Question {
  _id: string;
  category?: string;
  question: string;
  labelGuidance?: string;
  mandatory?: string;
  answerType?: string;
  answerSeed?: string;
  minValue?: string;
  maxValue?: string;
  group?: string;
  ref?: string;
  tags?: string[];
  text?: string;
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
  sidebar?: any[];
}
