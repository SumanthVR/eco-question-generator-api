
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
  tags?: string[]; // Add tags field which was missing
  text?: string;   // Add text field which was missing
}

export interface Framework {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  questions: Question[];
  detailedQuestions: Question[];
  questionsMenu?: string[];
  sidebar?: any[]; // Add sidebar field which was missing
}
