import { User, Course, Progress } from '../types';

class DataService {
  private storageKey = 'learning-platform-data';

  // User Management
  saveUser(user: User): void {
    const data = this.getData();
    data.users = data.users || [];
    const existingIndex = data.users.findIndex(u => u.id === user.id);
    
    if (existingIndex >= 0) {
      data.users[existingIndex] = user;
    } else {
      data.users.push(user);
    }
    
    this.saveData(data);
  }

  getUser(id: string): User | null {
    const data = this.getData();
    return data.users?.find(u => u.id === id) || null;
  }

  getCurrentUser(): User | null {
    const data = this.getData();
    return data.currentUser || null;
  }

  setCurrentUser(user: User): void {
    const data = this.getData();
    data.currentUser = user;
    this.saveData(data);
  }

  // Course Management
  getCourses(): Course[] {
    const data = this.getData();
    return data.courses || this.getDefaultCourses();
  }

  getCourse(id: string): Course | null {
    const courses = this.getCourses();
    return courses.find(c => c.id === id) || null;
  }

  // Progress Management
  saveProgress(progress: Progress): void {
    const data = this.getData();
    data.progress = data.progress || [];
    
    const existingIndex = data.progress.findIndex(p => 
      p.courseId === progress.courseId && p.moduleId === progress.moduleId
    );
    
    if (existingIndex >= 0) {
      data.progress[existingIndex] = progress;
    } else {
      data.progress.push(progress);
    }
    
    this.saveData(data);
  }

  getUserProgress(userId: string): Progress[] {
    const data = this.getData();
    return data.progress?.filter(p => {
      const user = this.getCurrentUser();
      return user?.id === userId;
    }) || [];
  }

  private getData(): any {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  private saveData(data: any): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  }

  private getDefaultCourses(): Course[] {
    return [
      {
        id: 'js-basics',
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        category: 'Programming',
        difficulty: 'beginner',
        duration: 120,
        prerequisites: [],
        tags: ['javascript', 'programming', 'web'],
        modules: [
          {
            id: 'js-1',
            title: 'Variables and Data Types',
            content: 'Understanding JavaScript variables and basic data types',
            type: 'text',
            duration: 30,
            completed: false,
          },
          {
            id: 'js-2',
            title: 'Functions and Scope',
            content: 'Learn about JavaScript functions and variable scope',
            type: 'interactive',
            duration: 45,
            completed: false,
          },
        ],
      },
      {
        id: 'react-intro',
        title: 'Introduction to React',
        description: 'Build modern web applications with React',
        category: 'Web Development',
        difficulty: 'intermediate',
        duration: 180,
        prerequisites: ['js-basics'],
        tags: ['react', 'javascript', 'frontend'],
        modules: [
          {
            id: 'react-1',
            title: 'Components and JSX',
            content: 'Understanding React components and JSX syntax',
            type: 'video',
            duration: 60,
            completed: false,
          },
          {
            id: 'react-2',
            title: 'State and Props',
            content: 'Managing component state and passing props',
            type: 'interactive',
            duration: 90,
            completed: false,
          },
        ],
      },
      {
        id: 'ai-ml-basics',
        title: 'AI and Machine Learning Basics',
        description: 'Introduction to artificial intelligence and machine learning concepts',
        category: 'Data Science',
        difficulty: 'beginner',
        duration: 240,
        prerequisites: [],
        tags: ['ai', 'machine-learning', 'data-science'],
        modules: [
          {
            id: 'ai-1',
            title: 'What is AI?',
            content: 'Understanding artificial intelligence and its applications',
            type: 'text',
            duration: 45,
            completed: false,
          },
          {
            id: 'ai-2',
            title: 'Machine Learning Fundamentals',
            content: 'Basic concepts of machine learning algorithms',
            type: 'video',
            duration: 75,
            completed: false,
          },
        ],
      },
    ];
  }
}

export const dataService = new DataService();