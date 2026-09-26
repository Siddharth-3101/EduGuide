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
    try {
      // First attempt AI Jobs Intelligence backend (port 8000)
      const aiResponse = await fetch('http://127.0.0.1:8000/api/jobs', {
        headers: { 'Accept': 'application/json' }
      }).catch(() => null);

      if (aiResponse && aiResponse.ok) {
        const rawList = await aiResponse.json();
        if (Array.isArray(rawList) && rawList.length > 0) {
          return rawList.map(j => {
            const reqSkills = Array.isArray(j.required_skills)
              ? j.required_skills.map(s => s.skill_name)
              : (typeof j.requiredSkills === 'string' ? j.requiredSkills.split(', ') : ['Python', 'SQL']);
            const prefSkills = Array.isArray(j.preferred_skills)
              ? j.preferred_skills.map(s => s.skill_name)
              : [];
            const allSkills = [...reqSkills, ...prefSkills];
            return {
              id: String(j.job_id || j.id),
              jobId: j.job_id || j.id,
              title: j.title || j.jobTitle,
              company: j.company,
              location: j.location,
              type: j.employment_type || j.employmentType || 'Full-time',
              workMode: j.work_mode || (j.remote ? 'Remote' : 'Hybrid'),
              experience: j.experience_level || j.experienceLevel || 'Entry Level (0-2 yrs)',
              salary: j.salary_range || j.salary,
              description: j.description,
              skills: allSkills,
              matchingSkills: reqSkills.slice(0, 3),
              missingSkills: prefSkills.length > 0 ? prefSkills.slice(0, 2) : ['Docker'],
              matchPercentage: 84,
              source: 'Naukri',
              naukriSearchUrl: j.naukri_search_url,
              linkedinSearchUrl: j.linkedin_search_url,
              applicationUrl: j.application_url
            };
          });
        }
      }

      // Next attempt Spring Boot backend
      const response = await apiClient.get('/api/jobs', { params: filters, timeout: 1500 });
      const list = response.data?.data || response.data;
      if (Array.isArray(list) && list.length > 0) {
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
            url: j.applicationUrl || 'https://careers.example.com',
            source: 'Naukri'
          };
        });
      }
    } catch (e) {
      console.warn('Jobs API unavailable, using fallback jobs:', e.message);
    }

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
  },

  async getJobById(jobId) {
    if (USE_MOCK) {
      await delay(110);
      const job = MOCK_JOBS.find((j) => String(j.id) === String(jobId)) || MOCK_JOBS[0];
      return job;
    }

    try {
      const [detailRes, matchRes] = await Promise.all([
        apiClient.get(`/api/jobs/${jobId}`, { timeout: 1500 }),
        apiClient.get(`/api/jobs/${jobId}/match`, { timeout: 1500 }).catch(() => ({ data: { data: null } }))
      ]);

      const j = detailRes.data?.data || detailRes.data;
      const match = matchRes.data?.data || matchRes.data;

      if (j) {
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
    } catch (e) {
      console.warn(`Job API for ${jobId} unavailable, using fallback:`, e.message);
    }

    return MOCK_JOBS.find((j) => String(j.id) === String(jobId)) || MOCK_JOBS[0];
  },

  async getNaukriGuide() {
    try {
      const res = await fetch('http://127.0.0.1:8000/api/jobs/naukri/guide', { timeout: 2000 });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Naukri guide endpoint unavailable:', e.message);
    }
    return {
      title: 'Naukri / Info Edge Enterprise API Integration Guide',
      is_configured: false,
      required_credentials: [
        { name: 'NAUKRI_APP_ID', description: 'Assigned by Info Edge India Ltd upon partner registration.', status: 'Missing' },
        { name: 'NAUKRI_SYSTEM_KEY', description: 'Cryptographic system key used in HTTP request headers.', status: 'Missing' },
        { name: 'NAUKRI_CLIENT_SECRET', description: 'OAuth 2.0 client secret for acquiring bearer tokens.', status: 'Missing' }
      ],
      setup_steps: [
        { step: 1, title: 'Register as Info Edge Partner', instruction: 'Naukri does not provide a public open API. Register for a Naukri RMS or Career Portal API agreement via https://recruiter.naukri.com or contact api-support@naukri.com.' },
        { step: 2, title: 'Obtain Gateway Keys', instruction: 'Your enterprise account manager will provision your App ID, System Key, and OAuth Client Credentials.' },
        { step: 3, title: 'Configure Environment Variables', instruction: 'Add NAUKRI_APP_ID, NAUKRI_SYSTEM_KEY, and NAUKRI_CLIENT_SECRET to ai_service/.env.' },
        { step: 4, title: 'Automatic Live Deep-Linking', instruction: 'SkillSync automatically generates live parameterized search queries linking directly to Naukri job feeds.' }
      ]
    };
  },

  async searchNaukriLive(keywords = 'Backend Developer', location = 'Bengaluru', experience = 0) {
    try {
      const params = new URLSearchParams({ keywords, location, experience: String(experience) });
      const res = await fetch(`http://127.0.0.1:8000/api/jobs/naukri/live?${params.toString()}`, { timeout: 3000 });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Naukri live search endpoint unavailable:', e.message);
    }
    return [];
  },

  async getGovernmentExams(filters = {}) {
    try {
      const params = new URLSearchParams();
      if (filters.category && filters.category !== 'All') params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      const url = `http://127.0.0.1:8000/api/jobs/government?${params.toString()}`;
      const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {
      console.warn('Government exams endpoint error:', e.message);
    }
    return [];
  },

  async getGovernmentExamById(examId) {
    try {
      const res = await fetch(`http://127.0.0.1:8000/api/jobs/government/${examId}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(`Government exam ${examId} endpoint error:`, e.message);
    }
    return null;
  }
};

export const jobApi = jobService;
