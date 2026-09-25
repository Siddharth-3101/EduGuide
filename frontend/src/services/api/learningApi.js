import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_COURSES } from '../../data/mock/courses';

export const learningApi = {
  async getRecommendedCourses(params = {}) {
    if (USE_MOCK) {
      await delay(140);
      let courses = [...MOCK_COURSES];
      if (params.skillId) {
        courses = courses.filter((c) => c.skillId === params.skillId);
      }
      return courses;
    }
    const endpoint = params.skillId ? `/api/learning/skill/${params.skillId}` : '/api/learning/recommended';
    const response = await apiClient.get(endpoint);
    const list = response.data?.data || response.data || [];
    return list.map(c => ({
      id: String(c.id),
      title: c.title,
      platform: c.platform || 'SkillBridge Academy',
      description: c.description,
      duration: c.duration || '6 hours',
      difficulty: c.difficulty || 'Intermediate',
      skillsCovered: typeof c.skillsCovered === 'string' ? c.skillsCovered.split(', ') : (c.skillsCovered || []),
      competenciesCovered: typeof c.competenciesCovered === 'string' ? c.competenciesCovered.split(', ') : (c.competenciesCovered || []),
      isFree: c.isFree !== false,
      recommendationReason: c.recommendationReason || 'Fills identified skill gap for target role.',
      url: c.url || 'https://learning.skillbridge.internal',
      skillId: c.skillId
    }));
  },

  async getCourseById(courseId) {
    if (USE_MOCK) {
      await delay(120);
      const course = MOCK_COURSES.find((c) => String(c.id) === String(courseId)) || MOCK_COURSES[0];
      return course;
    }
    const response = await apiClient.get(`/api/learning/${courseId}`);
    const c = response.data?.data || response.data;
    return {
      id: String(c.id),
      title: c.title,
      platform: c.platform || 'SkillBridge Academy',
      description: c.description,
      duration: c.duration || '6 hours',
      difficulty: c.difficulty || 'Intermediate',
      skillsCovered: typeof c.skillsCovered === 'string' ? c.skillsCovered.split(', ') : (c.skillsCovered || []),
      competenciesCovered: typeof c.competenciesCovered === 'string' ? c.competenciesCovered.split(', ') : (c.competenciesCovered || []),
      isFree: c.isFree !== false,
      recommendationReason: c.recommendationReason || 'Fills identified skill gap.',
      url: c.url || 'https://learning.skillbridge.internal',
      skillId: c.skillId
    };
  },

  async enrollCourse(courseId) {
    if (USE_MOCK) {
      await delay(200);
      return { success: true, message: 'Enrolled in course successfully' };
    }
    const response = await apiClient.post(`/api/learning/${courseId}/progress`, {
      progressPercentage: 5,
      status: 'IN_PROGRESS'
    });
    return response.data?.data || response.data;
  }
};
