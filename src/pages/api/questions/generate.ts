
import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

type Question = {
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
};

type Framework = {
  _id: string;
  name: string;
  description?: string;
  logoUrl?: string;
  questions: Question[];
  detailedQuestions: Question[];
  questionsMenu?: string[];
  sidebar?: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { frameworkId, focusAreas = '', numQuestions = 3 } = req.body;

    if (!frameworkId) {
      return res.status(400).json({ error: 'Framework ID is required' });
    }

    // Load frameworks data
    const dataFilePath = path.join(process.cwd(), 'public', 'prism.frameworks.json');
    
    // Check if file exists
    if (!fs.existsSync(dataFilePath)) {
      return res.status(404).json({ 
        error: 'Frameworks data file not found',
        path: dataFilePath
      });
    }

    const rawData = fs.readFileSync(dataFilePath, 'utf8');
    const frameworks: Framework[] = JSON.parse(rawData);

    // Find the selected framework
    const framework = frameworks.find(f => f._id === frameworkId);
    
    if (!framework) {
      return res.status(404).json({ 
        error: 'Selected framework not found', 
        frameworkId,
        availableFrameworks: frameworks.map(f => ({ id: f._id, name: f.name }))
      });
    }

    // Get questions from the framework
    // First try detailed questions, then regular questions
    const allQuestions = (framework.detailedQuestions?.length > 0 ? 
      framework.detailedQuestions : framework.questions) || [];
    
    // If no questions found
    if (allQuestions.length === 0) {
      return res.status(404).json({
        error: 'No questions found in the selected framework',
        frameworkId,
        frameworkName: framework.name
      });
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

    return res.status(200).json({
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
    });
    
  } catch (error) {
    console.error('Error generating questions:', error);
    return res.status(500).json({ 
      error: 'Failed to generate questions',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
