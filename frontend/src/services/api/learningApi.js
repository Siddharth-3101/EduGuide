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
    const response = await apiClient.get('/learning/recommendations', { params });
    return response.data;
  },

  async getCourseById(courseId) {
    if (USE_MOCK) {
      await delay(120);
      const course = MOCK_COURSES.find((c) => c.id === courseId) || MOCK_COURSES[0];
      return course;
    }
    const response = await apiClient.get(`/learning/courses/${courseId}`);
    return response.data;
  },

  async enrollCourse(courseId) {
    if (USE_MOCK) {
      await delay(200);
      return { success: true, message: 'Enrolled in course successfully' };
    }
    const response = await apiClient.post(`/learning/courses/${courseId}/enroll`);
    return response.data;
  }
};
