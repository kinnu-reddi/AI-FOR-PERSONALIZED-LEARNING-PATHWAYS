import React, { useState } from 'react';
import { User, Mail, BookOpen, TrendingUp, Settings, Save } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useLearning } from '../hooks/useLearning';

export const Profile: React.FC = () => {
  const { user, updateUser } = useAuth();
  const { getEnrolledCourses, getCourseProgress } = useLearning();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    learningStyle: user?.learningStyle || 'visual',
    skillLevel: user?.skillLevel || 'beginner',
    interests: user?.interests || [],
  });

  const enrolledCourses = getEnrolledCourses();
  const totalProgress = enrolledCourses.length > 0 
    ? Math.round(enrolledCourses.reduce((acc, course) => acc + getCourseProgress(course.id), 0) / enrolledCourses.length)
    : 0;

  const learningStyles = [
    { value: 'visual', label: 'Visual', description: 'Learn through images, diagrams, and visual aids' },
    { value: 'auditory', label: 'Auditory', description: 'Learn through listening and discussion' },
    { value: 'kinesthetic', label: 'Kinesthetic', description: 'Learn through hands-on activities' },
    { value: 'reading', label: 'Reading/Writing', description: 'Learn through text and written materials' },
  ];

  const skillLevels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
  ];

  const interestOptions = [
    'Programming', 'Web Development', 'Data Science', 'Machine Learning',
    'Mobile Development', 'DevOps', 'Cybersecurity', 'UI/UX Design',
    'Database Management', 'Cloud Computing'
  ];

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow">
        {/* Profile Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-indigo-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Profile Information */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h2>
              
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4 inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Mail className="w-4 h-4 inline mr-2" />
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Learning Style</label>
                    <div className="space-y-2">
                      {learningStyles.map((style) => (
                        <label key={style.value} className="flex items-start space-x-3 cursor-pointer">
                          <input
                            type="radio"
                            name="learningStyle"
                            value={style.value}
                            checked={formData.learningStyle === style.value}
                            onChange={(e) => setFormData(prev => ({ ...prev, learningStyle: e.target.value as any }))}
                            className="mt-1 text-indigo-600 focus:ring-indigo-500"
                          />
                          <div>
                            <div className="text-sm font-medium text-gray-900">{style.label}</div>
                            <div className="text-xs text-gray-500">{style.description}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skill Level</label>
                    <select
                      value={formData.skillLevel}
                      onChange={(e) => setFormData(prev => ({ ...prev, skillLevel: e.target.value as any }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      {skillLevels.map((level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Interests
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {interestOptions.map((interest) => (
                        <label key={interest} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData.interests.includes(interest)}
                            onChange={() => handleInterestToggle(interest)}
                            className="text-indigo-600 focus:ring-indigo-500 rounded"
                          />
                          <span className="text-sm text-gray-700">{interest}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Full Name</div>
                      <div className="text-sm text-gray-600">{user.name}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Email</div>
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <TrendingUp className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Learning Style</div>
                      <div className="text-sm text-gray-600 capitalize">{user.learningStyle}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <BookOpen className="w-5 h-5 text-gray-400" />
                    <div>
                      <div className="text-sm font-medium text-gray-900">Skill Level</div>
                      <div className="text-sm text-gray-600 capitalize">{user.skillLevel}</div>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-gray-900 mb-2">Interests</div>
                    <div className="flex flex-wrap gap-2">
                      {user.interests.map((interest) => (
                        <span
                          key={interest}
                          className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded-full text-xs"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Learning Statistics */}
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Learning Statistics</h2>
              
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Overall Progress</span>
                    <span className="text-sm font-bold text-gray-900">{totalProgress}%</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full transition-all"
                      style={{ width: `${totalProgress}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">{enrolledCourses.length}</div>
                    <div className="text-sm text-blue-800">Courses Enrolled</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {enrolledCourses.filter(course => getCourseProgress(course.id) === 100).length}
                    </div>
                    <div className="text-sm text-green-800">Completed</div>
                  </div>
                </div>

                {enrolledCourses.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Course Progress</h3>
                    <div className="space-y-3">
                      {enrolledCourses.map((course) => {
                        const progress = getCourseProgress(course.id);
                        return (
                          <div key={course.id} className="bg-gray-50 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium text-gray-700">{course.title}</span>
                              <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
                            </div>
                            <div className="bg-gray-200 rounded-full h-1.5">
                              <div
                                className="bg-indigo-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};