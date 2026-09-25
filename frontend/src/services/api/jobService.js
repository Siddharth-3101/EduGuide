import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_JOBS } from '../../data/mock/jobs';

export const jobService = {
  async getJobs(filters = {}) {
    if (USE_MOCK) {
      await delay(140);
      let list = [...MOCK_JOBS];
      if (filters.search) {
        const query = filters.search.toLowerCase();
        list = list.filter(
          (j) =>
            j.title.toLowerCase().includes(query) ||
            j.company.toLowerCase().includes(query) ||
            j.location.toLowerCase().includes(query)
        );
      }
      return list;
    }
    const response = await apiClient.get('/api/jobs', { params: filters });
    const list = response.data?.data || response.data || [];
    return list.map(j => {
      const skillsArr = typeof j.requiredSkills === 'string' ? j.requiredSkills.split(', ') : (j.requiredSkills || ['Java', 'Spring Boot', 'SQL']);
      return {
        id: String(j.id),
        jobId: j.id,
        title: j.jobTitle || j.title,
        company: j.company,
        location: j.location,
        type: j.employmentType || 'Full-time',
        employmentType: j.employmentType || 'Full-time',
        workMode: j.remote ? 'Remote' : 'On-site',
        salary: j.salary,
        skills: skillsArr,
        requiredSkills: skillsArr,
        matchPercentage: j.competencyMatchPercentage || 85,
        competencyMatch: j.competencyMatchPercentage || 85,
        experienceLevel: j.experienceLevel || 'Entry Level',
        url: j.applicationUrl || 'https://careers.example.com'
      };
    });
  },

  async getJobById(jobId) {
    if (USE_MOCK) {
      await delay(110);
      const job = MOCK_JOBS.find((j) => String(j.id) === String(jobId)) || MOCK_JOBS[0];
      return job;
    }
    const [detailRes, matchRes] = await Promise.all([
      apiClient.get(`/api/jobs/${jobId}`),
      apiClient.get(`/api/jobs/${jobId}/match`).catch(() => ({ data: { data: null } }))
    ]);

    const j = detailRes.data?.data || detailRes.data;
    const match = matchRes.data?.data || matchRes.data;

    const skillsArr = typeof j.requiredSkills === 'string' ? j.requiredSkills.split(', ') : (j.requiredSkills || ['Java', 'Spring Boot', 'SQL']);

    return {
      id: String(j.id),
      jobId: j.id,
      title: j.jobTitle || j.title,
      company: j.company,
      location: j.location,
      type: j.employmentType || 'Full-time',
      employmentType: j.employmentType || 'Full-time',
      workMode: j.remote ? 'Remote' : 'On-site',
      salary: j.salary,
      skills: skillsArr,
      requiredSkills: skillsArr,
      matchPercentage: match?.competencyMatchPercentage || 85,
      competencyMatch: match?.competencyMatchPercentage || 85,
      matchedSkills: match?.matchedSkills || skillsArr.slice(0, 2),
      missingSkills: match?.missingSkills || [],
      experienceLevel: j.experienceLevel || 'Entry Level',
      url: j.applicationUrl || 'https://careers.example.com'
    };
  }
};

export const jobApi = jobService;
