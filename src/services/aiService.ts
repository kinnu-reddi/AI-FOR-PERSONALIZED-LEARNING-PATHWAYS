import { User, Course, Recommendation, LearningPath } from '../types';

class AIService {
  async generateRecommendations(user: User, availableCourses: Course[]): Promise<Recommendation[]> {
    // Use local recommendations directly
    return this.generateLocalRecommendations(user, availableCourses);
  }

  async adaptContent(content: string, user: User): Promise<string> {
    // Use local content adaptation
    return this.adaptContentLocally(content, user);
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

  private adaptContentLocally(content: string, user: User): string {
    let adaptedContent = content;
    
    // Adapt based on learning style
    if (user.learningStyle === 'visual') {
      adaptedContent = `📊 Visual Learning Mode\n\n${adaptedContent}\n\n💡 Tip: Look for diagrams and visual examples to enhance your understanding.`;
    } else if (user.learningStyle === 'auditory') {
      adaptedContent = `🎧 Auditory Learning Mode\n\n${adaptedContent}\n\n💡 Tip: Consider reading this content aloud or finding audio resources.`;
    } else if (user.learningStyle === 'kinesthetic') {
      adaptedContent = `🤲 Hands-on Learning Mode\n\n${adaptedContent}\n\n💡 Tip: Try to practice these concepts with real examples or exercises.`;
    }
    
    // Adapt based on skill level
    if (user.skillLevel === 'beginner') {
      adaptedContent = `🌱 Beginner-Friendly Content\n\n${adaptedContent}\n\n📚 Remember: Take your time and don't hesitate to review concepts multiple times.`;
    } else if (user.skillLevel === 'advanced') {
      adaptedContent = `🚀 Advanced Content\n\n${adaptedContent}\n\n⚡ Challenge: Consider how you might apply these concepts to complex real-world scenarios.`;
    }
    
    return adaptedContent;
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