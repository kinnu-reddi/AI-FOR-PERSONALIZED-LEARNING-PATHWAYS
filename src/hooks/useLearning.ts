import { useState, useEffect } from 'react';
import { Course, Progress, Recommendation, LearningPath } from '../types';
import { dataService } from '../services/dataService';
import { aiService } from '../services/aiService';
import { useAuth } from './useAuth';

export const useLearning = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [progress, setProgress] = useState<Progress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    
    try {
      const coursesData = dataService.getCourses();
      setCourses(coursesData);

      if (user) {
        const userProgress = dataService.getUserProgress(user.id);
        setProgress(userProgress);

        // Generate AI recommendations
        const recs = await aiService.generateRecommendations(user, coursesData);
        setRecommendations(recs);

        // Generate learning path
        const path = await aiService.generateLearningPath(user, coursesData);
        setLearningPath(path);
      }
    } catch (error) {
      console.error('Failed to load learning data:', error);
    } finally {
      setLoading(false);
    }
  };

  const enrollInCourse = (courseId: string) => {
    if (!user) return;

    const course = courses.find(c => c.id === courseId);
    if (!course) return;

    // Mark first module as current
    const firstModule = course.modules[0];
    if (firstModule) {
      const newProgress: Progress = {
        courseId,
        moduleId: firstModule.id,
        completedAt: new Date(),
        timeSpent: 0,
      };
      
      dataService.saveProgress(newProgress);
      setProgress(prev => [...prev, newProgress]);
    }
  };

  const completeModule = (courseId: string, moduleId: string, score?: number) => {
    if (!user) return;

    const newProgress: Progress = {
      courseId,
      moduleId,
      completedAt: new Date(),
      score,
      timeSpent: 0, // This would be tracked in a real app
    };

    dataService.saveProgress(newProgress);
    setProgress(prev => {
      const filtered = prev.filter(p => !(p.courseId === courseId && p.moduleId === moduleId));
      return [...filtered, newProgress];
    });

    // Update course modules completion status
    setCourses(prev => prev.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: course.modules.map(module => 
            module.id === moduleId ? { ...module, completed: true } : module
          ),
        };
      }
      return course;
    }));
  };

  const getEnrolledCourses = () => {
    if (!user) return [];
    
    const enrolledCourseIds = new Set(progress.map(p => p.courseId));
    return courses.filter(course => enrolledCourseIds.has(course.id));
  };

  const getCourseProgress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;

    const completedModules = progress.filter(p => p.courseId === courseId).length;
    return (completedModules / course.modules.length) * 100;
  };

  const getRecommendedCourses = () => {
    return courses.filter(course => 
      recommendations.some(rec => rec.courseId === course.id)
    );
  };

  return {
    courses,
    recommendations,
    learningPath,
    progress,
    loading,
    enrollInCourse,
    completeModule,
    getEnrolledCourses,
    getCourseProgress,
    getRecommendedCourses,
    refreshData: loadData,
  };
};