
import { Framework } from "../types/framework";

// Function to get questions based on framework ID, focus areas, and number of questions
export const generateQuestions = async (
  frameworkId: string,
  focusAreas: string = "",
  numQuestions: number = 3
): Promise<any> => {
  try {
    // Load frameworks data from the public JSON file
    const response = await fetch('/prism.frameworks.json');
    
    if (!response.ok) {
      throw new Error(`Failed to load frameworks: ${response.status}`);
    }
    
    const frameworks: Framework[] = await response.json();
    
    // Find the selected framework
    const framework = frameworks.find(f => f._id === frameworkId);
    
    if (!framework) {
      throw new Error(`Framework not found: ${frameworkId}`);
    }
    
    // Get questions from the framework (first try detailedQuestions, then regular questions)
    const allQuestions = (framework.detailedQuestions?.length > 0 ? 
      framework.detailedQuestions : framework.questions) || [];
    
    // If no questions found
    if (allQuestions.length === 0) {
      throw new Error(`No questions found in the selected framework: ${framework.name}`);
    }
    
    // Apply filters if needed
    let filteredQuestions = allQuestions;
    
    if (focusAreas) {
      const focusTerms = focusAreas.toLowerCase().split(',').map(term => term.trim());
      
      filteredQuestions = allQuestions.filter(q => 
        focusTerms.some(term => 
          (q.tags && q.tags.some(tag => tag.toLowerCase().includes(term))) ||
          (q.category && q.category.toLowerCase().includes(term)) ||
          (q.question && q.question.toLowerCase().includes(term)) ||
          (q.text && q.text.toLowerCase().includes(term))
        )
      );
      
      // If no matches with filters, return the original set
      if (filteredQuestions.length === 0) {
        filteredQuestions = allQuestions;
      }
    }
    
    // Randomly select the requested number of questions
    let selectedQuestions = filteredQuestions;
    if (filteredQuestions.length > numQuestions) {
      // Shuffle array using Fisher-Yates algorithm
      for (let i = filteredQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredQuestions[i], filteredQuestions[j]] = [filteredQuestions[j], filteredQuestions[i]];
      }
      selectedQuestions = filteredQuestions.slice(0, numQuestions);
    }
    
    return {
      success: true,
      questions: selectedQuestions,
      questionsMenu: framework.questionsMenu || [],
      sidebar: framework.sidebar || [],
      framework: {
        id: framework._id,
        name: framework.name
      },
      totalQuestions: allQuestions.length,
      selectedCount: selectedQuestions.length
    };
    
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};
