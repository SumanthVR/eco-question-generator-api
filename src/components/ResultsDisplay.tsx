
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileExport } from "lucide-react";

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
  jsonResult: string;
  isLoading: boolean;
}

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
  jsonResult,
  isLoading
}) => {
  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">API Response</h2>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-md mb-4">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}
      {questions.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-lg">Generated Questions</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportQuestionsToJson(questions)}
              className="gap-1"
              title="Export questions as JSON"
            >
              <FileExport className="w-4 h-4 mr-1" />
              Export as JSON
            </Button>
          </div>
          <ul className="space-y-2">
            {questions.map((q, index) => (
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
            ))}
          </ul>
        </div>
      )}
      {jsonResult && (
        <div>
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
          Select a framework and click "Generate Questions" to see results here
        </p>
      )}
    </Card>
  );
};

export default ResultsDisplay;

