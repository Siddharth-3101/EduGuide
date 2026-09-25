import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_JOBS } from '../../data/mock/jobs';

export const jobApi = {
  async getJobs(filters = {}) {
    if (USE_MOCK) {
      await delay(160);
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

      if (filters.roleCategory && filters.roleCategory !== 'All') {
        list = list.filter((j) => j.roleCategory === filters.roleCategory);
      }

      if (filters.workplaceType && filters.workplaceType !== 'All') {
        list = list.filter((j) => j.workplaceType.toLowerCase() === filters.workplaceType.toLowerCase());
      }

      if (filters.minMatch && filters.minMatch > 0) {
        list = list.filter((j) => j.competencyMatch >= Number(filters.minMatch));
      }

      return list;
    }
    const response = await apiClient.get('/jobs', { params: filters });
    return response.data;
  },

  async getJobById(jobId) {
    if (USE_MOCK) {
      await delay(120);
      const job = MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];
      return job;
    }
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  }
};
