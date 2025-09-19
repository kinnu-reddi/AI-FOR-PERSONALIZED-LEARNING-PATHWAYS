import React, { useState } from 'react';
import { Brain, User, Mail, BookOpen } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    learningStyle: 'visual' as const,
    skillLevel: 'beginner' as const,
    interests: [] as string[],
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(formData);
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <Brain className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Welcome to AI Learning</h1>
          <p className="text-gray-600">Personalized learning powered by AI</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Full Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail className="w-4 h-4 inline mr-2" />
              Email Address
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter your email"
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
              Interests (Select all that apply)
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
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors font-medium"
          >
            Start Learning Journey
          </button>
        </form>
      </div>
    </div>
  );
};