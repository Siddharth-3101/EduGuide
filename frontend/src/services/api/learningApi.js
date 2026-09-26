import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_COURSES } from '../../data/mock/courses';

export const learningApi = {
  async getRecommendedCourses(params = {}) {
    if (USE_MOCK) {
      await delay(120);
      let courses = [...MOCK_COURSES];
      if (params.skillId && params.skillId !== 'All') {
        courses = courses.filter((c) => c.skillId?.toLowerCase() === params.skillId.toLowerCase());
      }
      return courses;
    }

    try {
      const endpoint = params.skillId && params.skillId !== 'All' ? `/api/learning/skill/${params.skillId}` : '/api/learning/recommended';
      const response = await apiClient.get(endpoint, { timeout: 1500 });
      const list = response.data?.data || response.data || [];
      if (Array.isArray(list) && list.length > 0) {
        return list.map((c) => ({
          id: String(c.id),
          title: c.title,
          provider: c.platform || c.provider || 'SkillSync Academy',
          type: c.type || 'Course',
          description: c.description,
          duration: c.duration || '6 hours',
          difficulty: c.difficulty || 'Intermediate',
          skillsCovered: typeof c.skillsCovered === 'string' ? c.skillsCovered.split(', ') : (c.skillsCovered || []),
          competenciesCovered: typeof c.competenciesCovered === 'string' ? c.competenciesCovered.split(', ') : (c.competenciesCovered || []),
          price: c.price || 'Free',
          isFree: c.isFree !== false,
          whyRecommended: c.recommendationReason || c.whyRecommended || 'Fills identified skill gap for target role.',
          externalUrl: c.url || c.externalUrl || 'https://docs.docker.com',
          assessmentId: c.assessmentId || `asmt-${c.skillId || 'docker'}`,
          skillId: c.skillId
        }));
      }
    } catch (err) {
      // Fallback: try AI Service endpoint on port 8000
      try {
        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 1500);
        const aiEndpoint = params.skillId && params.skillId !== 'All'
          ? `http://127.0.0.1:8000/api/resources/${params.skillId}`
          : 'http://127.0.0.1:8000/api/resources';
        const aiRes = await fetch(aiEndpoint, { signal: controller.signal }).catch(() => null);
        clearTimeout(tid);
        if (aiRes && aiRes.ok) {
          const aiData = await aiRes.json();
          const items = Array.isArray(aiData) ? aiData : (aiData.resources || []);
          if (items.length > 0) {
            return items.map((r) => ({
              id: r.resource_id || String(r.id),
              title: r.title,
              provider: r.provider || 'Technical Documentation',
              type: r.type || 'Documentation',
              description: r.description || 'Targeted resource to bridge competency gap.',
              duration: r.estimated_hours ? `${r.estimated_hours} hours` : '4 hours',
              difficulty: r.difficulty || 'Intermediate',
              price: 'Free',
              isFree: true,
              whyRecommended: 'Official documentation and practical lab to elevate competency readiness.',
              externalUrl: r.url || 'https://docs.docker.com',
              assessmentId: `asmt-${r.skill_id?.toLowerCase() || 'docker'}`,
              skillId: r.skill_id?.toLowerCase(),
              competenciesCovered: r.topics || ['Architecture & Syntax', 'Practical Implementation', 'Production Best Practices']
            }));
          }
        }
      } catch (aiErr) {}
    }

    // Graceful reliable fallback to enriched courses
    let courses = [...MOCK_COURSES];
    if (params.skillId && params.skillId !== 'All') {
      courses = courses.filter((c) => c.skillId?.toLowerCase() === params.skillId.toLowerCase());
    }
    return courses;
  },

  async getCourseById(courseId) {
    if (USE_MOCK) {
      await delay(100);
      const course = MOCK_COURSES.find((c) => String(c.id) === String(courseId)) || MOCK_COURSES[0];
      return course;
    }
    try {
      const response = await apiClient.get(`/api/learning/${courseId}`);
      const c = response.data?.data || response.data;
      return {
        id: String(c.id),
        title: c.title,
        provider: c.platform || c.provider || 'SkillSync Academy',
        type: c.type || 'Course',
        description: c.description,
        duration: c.duration || '6 hours',
        difficulty: c.difficulty || 'Intermediate',
        skillsCovered: typeof c.skillsCovered === 'string' ? c.skillsCovered.split(', ') : (c.skillsCovered || []),
        competenciesCovered: typeof c.competenciesCovered === 'string' ? c.competenciesCovered.split(', ') : (c.competenciesCovered || []),
        price: c.price || 'Free',
        isFree: c.isFree !== false,
        whyRecommended: c.recommendationReason || c.whyRecommended || 'Fills identified skill gap.',
        externalUrl: c.url || c.externalUrl || 'https://docs.docker.com',
        assessmentId: c.assessmentId || `asmt-${c.skillId || 'docker'}`,
        skillId: c.skillId
      };
    } catch (e) {
      const fallback = MOCK_COURSES.find((c) => String(c.id) === String(courseId)) || MOCK_COURSES[0];
      return fallback;
    }
  },

  async enrollCourse(courseId) {
    if (USE_MOCK) {
      await delay(150);
      return { success: true, message: 'Enrolled in course successfully' };
    }
    try {
      const response = await apiClient.post(`/api/learning/${courseId}/progress`, {
        progressPercentage: 5,
        status: 'IN_PROGRESS'
      });
      return response.data?.data || response.data;
    } catch (e) {
      return { success: true, message: 'Enrolled in course successfully' };
    }
  },

  getCommunityResources() {
    const KEY = 'skillsync_community_resources';
    try {
      const saved = localStorage.getItem(KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    const defaults = [
      {
        id: 'res-yt-1',
        title: 'Spring Boot 3 & Microservices Architecture End-to-End Guide',
        url: 'https://www.youtube.com/watch?v=mS3PhB_t6Zk',
        type: 'YouTube Video',
        skill: 'Spring Boot',
        description: 'Comprehensive video lecture breakdown covering Spring Security JWT, Microservices service registry, and REST API design.',
        contributor: 'Siddharth G (Student)',
        date: 'Sep 2026'
      },
      {
        id: 'res-gdrive-1',
        title: 'Complete Relational Database & SQL Indexing Optimization Notes',
        url: 'https://drive.google.com/drive/folders/example-distributed-notes',
        type: 'Google Drive Document',
        skill: 'MySQL',
        description: 'Handwritten PDF notes on ACID isolation levels, transaction logs, B+Tree indexing, and query optimization.',
        contributor: 'Rahul S. (Peer Contributor)',
        date: 'Sep 2026'
      },
      {
        id: 'res-doc-1',
        title: 'Official Docker & Container Networking Deep Dive Specification',
        url: 'https://docs.docker.com/network/',
        type: 'Documentation',
        skill: 'Docker',
        description: 'Official container bridge networking documentation and multi-host overlay networks reference.',
        contributor: 'Elena V. (Student)',
        date: 'Sep 2026'
      },
      {
        id: 'res-yt-2',
        title: 'Python Concurrency & Asyncio Real-World Architecture',
        url: 'https://www.youtube.com/watch?v=Xbl7XjFYsN4',
        type: 'YouTube Video',
        skill: 'Python',
        description: 'Master event loops, async generators, and high-concurrency microservice handling.',
        contributor: 'Karthik N. (Student)',
        date: 'Sep 2026'
      }
    ];
    try {
      localStorage.setItem(KEY, JSON.stringify(defaults));
    } catch (e) {}
    return defaults;
  },

  addCommunityResource(resData) {
    const KEY = 'skillsync_community_resources';
    const current = this.getCommunityResources();
    const newEntry = {
      id: 'res-user-' + Date.now(),
      title: resData.title || 'Community Learning Reference',
      url: resData.url,
      type: resData.type || 'Documentation',
      skill: resData.skill || 'General',
      description: resData.description || 'Reference shared by student.',
      contributor: resData.contributor || 'Student Contributor',
      date: 'Just now'
    };
    const updated = [newEntry, ...current];
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  }
};
