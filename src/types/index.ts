export interface User {
  id: string;
  name: string;
  email: string;
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'reading';
  skillLevel: 'beginner' | 'intermediate' | 'advanced';
  interests: string[];
  progress: Progress[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  modules: Module[];
  prerequisites: string[];
  tags: string[];
}

export interface Module {
  id: string;
  title: string;
  content: string;
  type: 'video' | 'text' | 'interactive' | 'quiz';
  duration: number;
  completed: boolean;
}

export interface Progress {
  courseId: string;
  moduleId: string;
  completedAt: Date;
  score?: number;
  timeSpent: number;
}

export interface Recommendation {
  courseId: string;
  reason: string;
  confidence: number;
  adaptedContent?: string;
}

export interface LearningPath {
  id: string;
  userId: string;
  courses: Course[];
  currentCourse?: string;
  estimatedCompletion: Date;
}