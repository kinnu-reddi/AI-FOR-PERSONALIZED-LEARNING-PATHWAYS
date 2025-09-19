import React, { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import { LoginForm } from './components/LoginForm';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { CourseList } from './components/CourseList';
import { CourseViewer } from './components/CourseViewer';
import { Profile } from './components/Profile';

function App() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  const handleCourseSelect = (courseId: string) => {
    setSelectedCourseId(courseId);
    setCurrentView('course-viewer');
  };

  const handleBackToCourses = () => {
    setSelectedCourseId(null);
    setCurrentView('courses');
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    if (view !== 'course-viewer') {
      setSelectedCourseId(null);
    }
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard 
            onViewChange={handleViewChange}
            onCourseSelect={handleCourseSelect}
          />
        );
      case 'courses':
        return <CourseList onCourseSelect={handleCourseSelect} />;
      case 'course-viewer':
        return selectedCourseId ? (
          <CourseViewer 
            courseId={selectedCourseId}
            onBack={handleBackToCourses}
          />
        ) : (
          <CourseList onCourseSelect={handleCourseSelect} />
        );
      case 'profile':
        return <Profile />;
      default:
        return (
          <Dashboard 
            onViewChange={handleViewChange}
            onCourseSelect={handleCourseSelect}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      <main>
        {renderCurrentView()}
      </main>
    </div>
  );
}


export default App