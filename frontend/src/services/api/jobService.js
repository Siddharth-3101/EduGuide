import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_JOBS } from '../../data/mock/jobs';

/**
 * Normalized Job Service
 * Connects frontend with the Backend Job Aggregation Layer.
 * Consumes normalized job models aggregated from LinkedIn, Naukri, and employer integrations.
 * Strictly calculates Competency Match (NOT hiring or selection probability).
 */
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
            j.location.toLowerCase().includes(query) ||
            j.skills.some((s) => s.toLowerCase().includes(query))
        );
      }

      if (filters.source && filters.source !== 'All') {
        list = list.filter((j) => j.source.toLowerCase() === filters.source.toLowerCase());
      }

      if (filters.workMode && filters.workMode !== 'All') {
        list = list.filter((j) => j.workMode.toLowerCase() === filters.workMode.toLowerCase());
      }

      if (filters.minMatch && filters.minMatch > 0) {
        list = list.filter((j) => (j.matchPercentage || j.competencyMatch) >= Number(filters.minMatch));
      }

      return list;
    }
    const response = await apiClient.get('/jobs', { params: filters });
    return response.data;
  },

  async getJobById(jobId) {
    if (USE_MOCK) {
      await delay(110);
      const job = MOCK_JOBS.find((j) => j.id === jobId) || MOCK_JOBS[0];
      return job;
    }
    const response = await apiClient.get(`/jobs/${jobId}`);
    return response.data;
  }
};

// Aliased export for backward compatibility
export const jobApi = jobService;
