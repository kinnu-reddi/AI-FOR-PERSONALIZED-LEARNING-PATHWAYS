import { User, Course, Recommendation, LearningPath } from '../types';

class AIService {
  private apiUrl = 'http://localhost:5000/api';

  async generateRecommendations(user: User, availableCourses: Course[]): Promise<Recommendation[]> {
    try {
      const response = await fetch(`${this.apiUrl}/recommendations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user,
          courses: availableCourses,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('AI Service Error:', error);
      // Fallback to local recommendations
      return this.generateLocalRecommendations(user, availableCourses);
    }
  }

  async adaptContent(content: string, user: User): Promise<string> {
    try {
      const response = await fetch(`${this.apiUrl}/adapt-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          learningStyle: user.learningStyle,
          skillLevel: user.skillLevel,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to adapt content');
      }

      const result = await response.json();
      return result.adaptedContent;
    } catch (error) {
      console.error('Content adaptation error:', error);
      return content; // Return original content as fallback
    }
  }

  async generateLearningPath(user: User, courses: Course[]): Promise<LearningPath> {
    const recommendations = await this.generateRecommendations(user, courses);
    const recommendedCourses = courses.filter(course => 
      recommendations.some(rec => rec.courseId === course.id)
    );

    return {
      id: `path-${user.id}-${Date.now()}`,
      userId: user.id,
      courses: recommendedCourses,
      currentCourse: recommendedCourses[0]?.id,
      estimatedCompletion: new Date(Date.now() + recommendedCourses.length * 7 * 24 * 60 * 60 * 1000),
    };
  }

  private generateLocalRecommendations(user: User, courses: Course[]): Recommendation[] {
    return courses
      .filter(course => {
        // Match skill level
        if (course.difficulty !== user.skillLevel) return false;
        
        // Match interests
        const hasMatchingInterest = course.tags.some(tag => 
          user.interests.some(interest => 
            interest.toLowerCase().includes(tag.toLowerCase())
          )
        );
        
        return hasMatchingInterest;
      })
      .slice(0, 5)
      .map(course => ({
        courseId: course.id,
        reason: `Matches your ${user.skillLevel} level and interests in ${course.category}`,
        confidence: 0.8,
      }));
  }
}

export const aiService = new AIService();