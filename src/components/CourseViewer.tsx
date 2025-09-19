import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, PlayCircle, FileText, Video, Brain, Clock, Play, Pause } from 'lucide-react';
import { useLearning } from '../hooks/useLearning';
import { useAuth } from '../hooks/useAuth';
import { Course, Module } from '../types';
import { aiService } from '../services/aiService';

interface CourseViewerProps {
  courseId: string;
  onBack: () => void;
}

export const CourseViewer: React.FC<CourseViewerProps> = ({ courseId, onBack }) => {
  const { user } = useAuth();
  const { courses, completeModule, getCourseProgress } = useLearning();
  const [course, setCourse] = useState<Course | null>(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [adaptedContent, setAdaptedContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [videoProgress, setVideoProgress] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    const foundCourse = courses.find(c => c.id === courseId);
    if (foundCourse) {
      setCourse(foundCourse);
      loadAdaptedContent(foundCourse.modules[0]);
    }
    setLoading(false);
  }, [courseId, courses]);

  const loadAdaptedContent = async (module: Module) => {
    if (!user) return;
    
    setLoading(true);
    setVideoProgress(0);
    setIsVideoPlaying(false);
    try {
      const adapted = await aiService.adaptContent(module.content, user);
      setAdaptedContent(adapted);
    } catch (error) {
      console.error('Failed to adapt content:', error);
      setAdaptedContent(module.content);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleComplete = () => {
    if (!course) return;
    
    const currentModule = course.modules[currentModuleIndex];
    completeModule(course.id, currentModule.id, 100);
    
    // Move to next module if available
    if (currentModuleIndex < course.modules.length - 1) {
      const nextIndex = currentModuleIndex + 1;
      setCurrentModuleIndex(nextIndex);
      loadAdaptedContent(course.modules[nextIndex]);
    }
  };

  const handleModuleSelect = (index: number) => {
    if (!course) return;
    
    setCurrentModuleIndex(index);
    loadAdaptedContent(course.modules[index]);
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
    // Simulate video progress
    const interval = setInterval(() => {
      setVideoProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsVideoPlaying(false);
          return 100;
        }
        return prev + 1;
      });
    }, 200); // Update every 200ms for smooth progress
  };

  const handleVideoPause = () => {
    setIsVideoPlaying(false);
  };

  const handleVideoSeek = (percentage: number) => {
    setVideoProgress(percentage);
  };
  const getModuleIcon = (type: Module['type']) => {
    switch (type) {
      case 'video':
        return Video;
      case 'interactive':
        return Brain;
      case 'quiz':
        return CheckCircle;
      default:
        return FileText;
    }
  };

  if (!course) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Course not found</h2>
          <button
            onClick={onBack}
            className="text-indigo-600 hover:text-indigo-700"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const currentModule = course.modules[currentModuleIndex];
  const progress = getCourseProgress(course.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Courses
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{course.title}</h1>
            <p className="text-gray-600">{course.description}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500 mb-1">Course Progress</div>
          <div className="flex items-center space-x-2">
            <div className="bg-gray-200 rounded-full h-2 w-32">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Module Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Course Modules</h2>
            <div className="space-y-2">
              {course.modules.map((module, index) => {
                const Icon = getModuleIcon(module.type);
                const isActive = index === currentModuleIndex;
                const isCompleted = module.completed;
                
                return (
                  <button
                    key={module.id}
                    onClick={() => handleModuleSelect(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all hover:shadow-sm ${
                      isActive
                        ? 'bg-indigo-50 border-2 border-indigo-200'
                        : 'hover:bg-gray-50 border-2 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded ${
                        isCompleted ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        {isCompleted ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <Icon className="w-4 h-4 text-gray-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-900">
                          {module.title}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <Clock className="w-3 h-3 mr-1" />
                          {module.duration} min
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            {/* Module Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{currentModule.title}</h2>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {currentModule.duration} minutes
                    </div>
                    <div className="flex items-center">
                      {React.createElement(getModuleIcon(currentModule.type), { className: "w-4 h-4 mr-1" })}
                      {currentModule.type}
                    </div>
                  </div>
                </div>
                {currentModule.completed && (
                  <div className="flex items-center text-green-600">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Completed
                  </div>
                )}
              </div>
            </div>

            {/* Module Content */}
            <div className="p-6">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
              ) : (
                <div className="prose max-w-none">
                  {user?.learningStyle && (
                    <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                      <div className="flex items-center text-indigo-700 mb-2">
                        <Brain className="w-5 h-5 mr-2" />
                        <span className="font-medium">Personalized for {user.learningStyle} learners</span>
                      </div>
                      <p className="text-sm text-indigo-600">
                        This content has been adapted to match your learning style and skill level.
                      </p>
                    </div>
                  )}
                  
                  <div className="text-gray-800 leading-relaxed">
                    {adaptedContent.split('\n').map((paragraph, index) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  {currentModule.type === 'interactive' && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Interactive Exercise</h3>
                      <p className="text-gray-600 mb-4">
                        Try implementing the concepts you've learned in this hands-on exercise.
                      </p>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                        Start Exercise
                      </button>
                    </div>
                  )}

                  {/* Video Player for Video Modules */}
                  {currentModule.type === 'video' && (
                    <div className="mb-8">
                      <div className="bg-black rounded-lg overflow-hidden">
                        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                          {/* Video Placeholder */}
                          <div className="text-center text-white">
                            <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                            <h3 className="text-lg font-medium mb-2">{currentModule.title}</h3>
                            <p className="text-sm opacity-75">Educational Video Content</p>
                          </div>
                          
                          {/* Play/Pause Overlay */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <button
                              onClick={isVideoPlaying ? handleVideoPause : handleVideoPlay}
                              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all"
                            >
                              {isVideoPlaying ? (
                                <Pause className="w-8 h-8 text-white" />
                              ) : (
                                <Play className="w-8 h-8 text-white ml-1" />
                              )}
                            </button>
                          </div>
                        </div>
                        
                        {/* Video Controls */}
                        <div className="bg-gray-900 p-4">
                          <div className="flex items-center space-x-4">
                            <button
                              onClick={isVideoPlaying ? handleVideoPause : handleVideoPlay}
                              className="text-white hover:text-gray-300 transition-colors"
                            >
                              {isVideoPlaying ? (
                                <Pause className="w-5 h-5" />
                              ) : (
                                <Play className="w-5 h-5" />
                              )}
                            </button>
                            
                            {/* Progress Bar */}
                            <div className="flex-1">
                              <div className="bg-gray-700 rounded-full h-2 cursor-pointer"
                                   onClick={(e) => {
                                     const rect = e.currentTarget.getBoundingClientRect();
                                     const percentage = ((e.clientX - rect.left) / rect.width) * 100;
                                     handleVideoSeek(percentage);
                                   }}>
                                <div
                                  className="bg-indigo-500 h-2 rounded-full transition-all"
                                  style={{ width: `${videoProgress}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="text-white text-sm">
                              {Math.floor((videoProgress / 100) * currentModule.duration)}:00 / {currentModule.duration}:00
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Auto-complete when video finishes */}
                      {videoProgress >= 100 && !currentModule.completed && (
                        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center text-green-700">
                              <CheckCircle className="w-5 h-5 mr-2" />
                              <span className="font-medium">Video completed!</span>
                            </div>
                            <button
                              onClick={handleModuleComplete}
                              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm"
                            >
                              Mark as Complete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  {currentModule.type === 'quiz' && (
                    <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Knowledge Check</h3>
                      <p className="text-gray-600 mb-4">
                        Test your understanding with this quick quiz.
                      </p>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors">
                        Take Quiz
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Module Actions */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <button
                onClick={() => handleModuleSelect(Math.max(0, currentModuleIndex - 1))}
                disabled={currentModuleIndex === 0}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </button>

              <div className="flex items-center space-x-4">
                {!currentModule.completed && (
                  <button
                    onClick={handleModuleComplete}
                    className="flex items-center px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Mark Complete
                  </button>
                )}

                <button
                  onClick={() => handleModuleSelect(Math.min(course.modules.length - 1, currentModuleIndex + 1))}
                  disabled={currentModuleIndex === course.modules.length - 1}
                  className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};