
import React, { useState, useEffect } from "react";
import { toast } from "@/components/ui/use-toast";
import { generateQuestions } from "../api/questionsApi";
import QuestionForm from "../components/QuestionForm";
import ResultsDisplay from "../components/ResultsDisplay";
import FrameworkInfo from "../components/FrameworkInfo";
import { Card } from "@/components/ui/card";

interface Framework {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

const Index = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string[]>([]);
  const [focusAreas, setFocusAreas] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFrameworks, setIsLoadingFrameworks] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<string>("");

  useEffect(() => {
    const fetchFrameworks = async () => {
      try {
        const response = await fetch('/prism.frameworks.json');
        if (!response.ok) {
          throw new Error(`Failed to load frameworks: ${response.status}`);
        }
        const data = await response.json();
        setFrameworks(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'Error loading frameworks');
        toast({
          title: "Error",
          description: "Failed to load frameworks. Please check console for details.",
          variant: "destructive",
        });
        console.error("Error fetching frameworks:", error);
      } finally {
        setIsLoadingFrameworks(false);
      }
    };

    fetchFrameworks();
  }, []);

  const fetchQuestions = async () => {
    if (selectedFramework.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one framework",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setJsonResult("");

    try {
      let allQuestions: any[] = [];
      let frameworkResults: any[] = [];

      // Process each selected framework
      for (const frameworkId of selectedFramework) {
        const result = await generateQuestions(
          frameworkId,
          focusAreas,
          numQuestions
        );
        
        // Add the current framework's questions to the combined list
        allQuestions = [...allQuestions, ...result.questions];
        
        // Store the complete result for this framework
        frameworkResults.push(result);
      }

      // Create a combined result object
      const combinedResult = {
        success: true,
        questions: allQuestions,
        frameworkResults: frameworkResults,
        totalFrameworks: selectedFramework.length,
        totalQuestions: allQuestions.length
      };

      setJsonResult(JSON.stringify(combinedResult, null, 2));
      setQuestions(allQuestions);
      
      toast({
        title: "Success",
        description: `Generated ${allQuestions.length} questions from ${selectedFramework.length} frameworks`,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate questions",
        variant: "destructive",
      });
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center">Sustainability Questions API</h1>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-4">
            <Card className="p-4">
              <QuestionForm
                frameworks={frameworks}
                isLoadingFrameworks={isLoadingFrameworks}
                selectedFramework={selectedFramework}
                setSelectedFramework={setSelectedFramework}
                numQuestions={numQuestions}
                setNumQuestions={setNumQuestions}
                focusAreas={focusAreas}
                setFocusAreas={setFocusAreas}
                onGenerate={fetchQuestions}
                isLoading={isLoading}
              />
            </Card>
            {selectedFramework.length > 0 && (
              <FrameworkInfo 
                selectedFramework={selectedFramework}
                frameworks={frameworks}
              />
            )}
          </div>
          {/* Right column */}
          <div className="space-y-4">
            <ResultsDisplay
              error={error}
              questions={questions}
              jsonResult={jsonResult}
              isLoading={isLoading}
            />
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            This API allows you to generate sustainability questions based on different reporting frameworks.
            <br />
            Use the form above to test the API or integrate with your applications.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
