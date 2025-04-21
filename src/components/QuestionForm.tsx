
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, RefreshCw } from "lucide-react";

interface Framework {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

interface QuestionFormProps {
  frameworks: Framework[];
  isLoadingFrameworks: boolean;
  selectedFramework: string;
  setSelectedFramework: (id: string) => void;
  numQuestions: number;
  setNumQuestions: (val: number) => void;
  focusAreas: string;
  setFocusAreas: (val: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const QuestionForm: React.FC<QuestionFormProps> = ({
  frameworks,
  isLoadingFrameworks,
  selectedFramework,
  setSelectedFramework,
  numQuestions,
  setNumQuestions,
  focusAreas,
  setFocusAreas,
  onGenerate,
  isLoading
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Generate Questions</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Sustainability Framework</label>
          {isLoadingFrameworks ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Loading frameworks...</span>
            </div>
          ) : (
            <Select 
              value={selectedFramework} 
              onValueChange={setSelectedFramework}
            >
              <SelectTrigger>
                <SelectValue placeholder="Choose a framework" />
              </SelectTrigger>
              <SelectContent>
                {frameworks.map((framework) => (
                  <SelectItem key={framework._id} value={framework._id}>
                    {framework.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Number of Questions</label>
          <Input
            type="number"
            placeholder="Number of Questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(parseInt(e.target.value) || 3)}
            min={1}
            max={10}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Focus Areas (optional)</label>
          <Input
            placeholder="e.g., emissions, water usage"
            value={focusAreas}
            onChange={(e) => setFocusAreas(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Comma-separated topics to filter questions (e.g., "climate, water, diversity")
          </p>
        </div>
        <Button 
          onClick={onGenerate}
          disabled={isLoading || !selectedFramework}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate Questions
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default QuestionForm;
