import React from 'react';
import { BookOpen, TrendingUp, Clock, Award, ChevronRight, Play } from 'lucide-react';
import { useLearning } from '../hooks/useLearning';
import { useAuth } from '../hooks/useAuth';

interface DashboardProps {
  onViewChange: (view: string) => void;
  onCourseSelect: (courseId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onViewChange, onCourseSelect }) => {
  const { user } = useAuth();
  const { 
    recommendations, 
    learningPath, 
    getEnrolledCourses, 
    getCourseProgress,
    getRecommendedCourses,
    loading 
  } = useLearning();

  const enrolledCourses = getEnrolledCourses();
  const recommendedCourses = getRecommendedCourses();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  const stats = [
    {
      name: 'Courses Enrolled',
      value: enrolledCourses.length,
      icon: BookOpen,
      color: 'bg-blue-500',
    },
    {
      name: 'Hours Learned',
      value: Math.floor(enrolledCourses.reduce((acc, course) => acc + (course.duration / 60), 0)),
      icon: Clock,
      color: 'bg-green-500',
    },
    {
      name: 'Avg Progress',
      value: enrolledCourses.length > 0 
        ? Math.round(enrolledCourses.reduce((acc, course) => acc + getCourseProgress(course.id), 0) / enrolledCourses.length)
        : 0,
      icon: TrendingUp,
      color: 'bg-yellow-500',
      suffix: '%',
    },
    {
      name: 'Certificates',
      value: enrolledCourses.filter(course => getCourseProgress(course.id) === 100).length,
      icon: Award,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">Continue your personalized learning journey</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.name} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className={`${stat.color} rounded-md p-3`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}{stat.suffix || ''}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Continue Learning */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Continue Learning</h2>
          </div>
          <div className="p-6">
            {enrolledCourses.length > 0 ? (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((course) => {
                  const progress = getCourseProgress(course.id);
                  return (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
                      onClick={() => onCourseSelect(course.id)}
                    >
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{course.category}</p>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Progress</span>
                            <span className="font-medium">{Math.round(progress)}%</span>
                          </div>
                          <div className="mt-1 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 ml-4" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">No courses enrolled yet</p>
                <button
                  onClick={() => onViewChange('courses')}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Browse Courses
                </button>
              </div>
            )}
          </div>
        </div>

        {/* AI Recommendations */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">AI Recommendations</h2>
            <p className="text-sm text-gray-500">Personalized for your learning style</p>
          </div>
          <div className="p-6">
            {recommendedCourses.length > 0 ? (
              <div className="space-y-4">
                {recommendedCourses.slice(0, 3).map((course) => {
                  const recommendation = recommendations.find(r => r.courseId === course.id);
                  return (
                    <div
                      key={course.id}
                      className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors cursor-pointer"
                      onClick={() => onCourseSelect(course.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{course.title}</h3>
                          <p className="text-sm text-gray-500 mt-1">{course.description}</p>
                          {recommendation && (
                            <p className="text-xs text-indigo-600 mt-2 bg-indigo-50 px-2 py-1 rounded">
                              {recommendation.reason}
                            </p>
                          )}
                        </div>
                        <div className="ml-4 flex items-center space-x-2">
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                            {course.difficulty}
                          </span>
                          <Play className="w-4 h-4 text-indigo-600" />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Loading personalized recommendations...</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Learning Path */}
      {learningPath && (
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Learning Path</h2>
          <div className="flex items-center space-x-4 overflow-x-auto">
            {learningPath.courses.map((course, index) => (
              <div key={course.id} className="flex items-center space-x-4 flex-shrink-0">
                <div
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    course.id === learningPath.currentCourse
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                  onClick={() => onCourseSelect(course.id)}
                >
                  <div className="text-sm font-medium">{course.title}</div>
                  <div className="text-xs opacity-75">{course.duration} min</div>
                </div>
                {index < learningPath.courses.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};