import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_ASSESSMENTS, MOCK_DEFAULT_RESULT } from '../../data/mock/assessments';
import { skillsApi } from './skillsApi';

export const assessmentApi = {
  async getAssessments(category) {
    if (USE_MOCK) {
      await delay(150);
      if (!category || category === 'All') {
        return [...MOCK_ASSESSMENTS];
      }
      return MOCK_ASSESSMENTS.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }
    const response = await apiClient.get('/assessments', { params: { category } });
    return response.data;
  },

  async getAssessmentById(id) {
    if (USE_MOCK) {
      await delay(120);
      const assessment = MOCK_ASSESSMENTS.find((a) => a.id === id) || MOCK_ASSESSMENTS[0];
      return assessment;
    }
    const response = await apiClient.get(`/assessments/${id}`);
    return response.data;
  },

  async submitAssessment(id, answers) {
    if (USE_MOCK) {
      await delay(400);
      const assessment = MOCK_ASSESSMENTS.find((a) => a.id === id) || MOCK_ASSESSMENTS[0];
      
      // Calculate realistic score
      let correct = 0;
      if (assessment.questions && answers) {
        assessment.questions.forEach((q) => {
          if (answers[q.id] === q.correctAnswer) {
            correct++;
          }
        });
      }
      const scorePercentage = assessment.questions?.length
        ? Math.round((correct / assessment.questions.length) * 100)
        : 86;
      
      const finalScore = scorePercentage >= 70 ? scorePercentage : 86; // Ensure passing demo experience if desired

      // Update skill verification in mock state if passed
      if (assessment.skillId && finalScore >= 70) {
        await skillsApi.verifySkill(assessment.skillId, {
          type: 'Assessment',
          name: `${assessment.title} Passed`,
          score: `${finalScore}%`
        });
      }

      return {
        ...MOCK_DEFAULT_RESULT,
        assessmentId: id,
        title: assessment.title,
        skillId: assessment.skillId,
        score: finalScore,
        passed: finalScore >= 70,
        competencyLevel: finalScore >= 85 ? 'Intermediate / Advanced' : 'Intermediate',
        breakdown: [
          { area: 'Fundamentals & Layering', score: Math.min(100, finalScore + 5) },
          { area: 'Application & Networking', score: Math.max(60, finalScore - 4) },
          { area: 'Problem Solving & Security', score: Math.max(65, finalScore - 2) }
        ]
      };
    }
    const response = await apiClient.post(`/assessments/${id}/submit`, { answers });
    return response.data;
  }
};
