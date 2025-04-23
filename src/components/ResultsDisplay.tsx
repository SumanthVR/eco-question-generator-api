
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

// Added Question interface for types
interface Question {
  _id?: string;
  question?: string;
  text?: string;
  category?: string;
  tags?: string[];
}

interface ResultsDisplayProps {
  error: string | null;
  questions: Question[];
  originalQuestions?: Question[];
  jsonResult: string;
  isLoading: boolean;
}

// Export as before
const exportQuestionsToJson = (questions: Question[]) => {
  const json = JSON.stringify(questions, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "questions.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  error,
  questions,
  originalQuestions = [],
  jsonResult,
  isLoading
}) => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Questions Comparison</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Original questions list - left */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">Original Framework Questions</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportQuestionsToJson(originalQuestions)}
              className="gap-1"
              title="Export original questions as JSON"
            >
              <FileText className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-auto">
            {originalQuestions && originalQuestions.length > 0 ? (
              originalQuestions.map((q, index) => (
                <li key={q._id || index} className="bg-white border p-3 rounded-md">
                  <p className="font-medium">{q.question || q.text}</p>
                  {q.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {q.category}
                    </p>
                  )}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {q.tags.map((tag, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">No original questions found.</li>
            )}
          </ul>
        </div>

        {/* Generated questions list - right */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">Generated Questions</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportQuestionsToJson(questions)}
              className="gap-1"
              title="Export generated questions as JSON"
            >
              <FileText className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
          <ul className="space-y-2 max-h-96 overflow-auto">
            {questions && questions.length > 0 ? (
              questions.map((q, index) => (
                <li key={q._id || index} className="bg-white border p-3 rounded-md">
                  <p className="font-medium">{q.question || q.text}</p>
                  {q.category && (
                    <p className="text-xs text-gray-500 mt-1">
                      Category: {q.category}
                    </p>
                  )}
                  {q.tags && q.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {q.tags.map((tag, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="text-gray-500 text-sm">None generated yet.</li>
            )}
          </ul>
        </div>
      </div>
      {jsonResult && (
        <div className="mt-6">
          <h3 className="font-medium text-lg mb-2">Raw JSON Response</h3>
          <div className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-auto max-h-96">
            <pre className="text-xs">
              {jsonResult}
            </pre>
          </div>
        </div>
      )}
      {!isLoading && !error && !jsonResult && (
        <p className="text-gray-500 text-center py-6">
          Select framework(s) and click "Generate Questions" to see results here
        </p>
      )}
    </Card>
  );
};

export default ResultsDisplay;
