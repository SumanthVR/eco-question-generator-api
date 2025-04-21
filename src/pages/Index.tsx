
import React, { useState, useEffect } from 'react';
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Loader2, RefreshCw } from "lucide-react";

interface Framework {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
}

const Index = () => {
  const [frameworks, setFrameworks] = useState<Framework[]>([]);
  const [selectedFramework, setSelectedFramework] = useState<string>("");
  const [focusAreas, setFocusAreas] = useState<string>("");
  const [numQuestions, setNumQuestions] = useState<number>(3);
  const [questions, setQuestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingFrameworks, setIsLoadingFrameworks] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jsonResult, setJsonResult] = useState<string>("");

  // Fetch frameworks on component mount
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

  // Fetch questions from the API
  const fetchQuestions = async () => {
    if (!selectedFramework) {
      toast({
        title: "Error",
        description: "Please select a framework first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setQuestions([]);
    setJsonResult("");

    try {
      const response = await fetch('/api/questions/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          frameworkId: selectedFramework,
          focusAreas,
          numQuestions,
        }),
      });

      const data = await response.json();
      
      // Display full JSON for debugging
      setJsonResult(JSON.stringify(data, null, 2));

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate questions');
      }

      setQuestions(data.questions || []);
      
      toast({
        title: "Success",
        description: `Generated ${data.questions.length} questions from ${data.framework.name}`,
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Unknown error');
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : 'Failed to generate questions',
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
          {/* Left column - Input form */}
          <div className="space-y-4">
            <Card className="p-4">
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
                  onClick={fetchQuestions}
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
            </Card>
            
            {/* Framework info */}
            {selectedFramework && frameworks.length > 0 && (
              <Card className="p-4">
                <h2 className="text-lg font-medium mb-2">Selected Framework</h2>
                {(() => {
                  const framework = frameworks.find(f => f._id === selectedFramework);
                  return framework ? (
                    <div>
                      <p className="font-semibold">{framework.name}</p>
                      {framework.description && (
                        <p className="text-sm text-gray-600 mt-1">{framework.description}</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-red-500">Framework data not found!</p>
                  );
                })()}
              </Card>
            )}
          </div>
          
          {/* Right column - Results */}
          <div className="space-y-4">
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
                  <h3 className="font-medium text-lg mb-2">Generated Questions</h3>
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
