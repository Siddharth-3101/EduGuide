import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_ASSESSMENTS, MOCK_DEFAULT_RESULT } from '../../data/mock/assessments';
import { skillsApi } from './skillsApi';

export const assessmentApi = {
  async getAssessments(category) {
    if (USE_MOCK) {
      await delay(150);
      if (!category || category === 'All') return [...MOCK_ASSESSMENTS];
      return MOCK_ASSESSMENTS.filter((a) => a.category.toLowerCase() === category.toLowerCase());
    }
    const response = await apiClient.get('/api/assessments');
    const list = response.data?.data || response.data || [];
    let mapped = list.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      skillId: a.skillId,
      category: a.category || 'Engineering',
      duration: `${a.durationMinutes || 15} mins`,
      questionsCount: a.questionCount || 5,
      passScore: a.passScore || 70,
      difficulty: a.difficulty || 'Intermediate'
    }));
    if (category && category !== 'All') {
      mapped = mapped.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    return mapped;
  },

  async getAssessmentById(id) {
    if (USE_MOCK) {
      await delay(120);
      const assessment = MOCK_ASSESSMENTS.find((a) => a.id == id) || MOCK_ASSESSMENTS[0];
      return assessment;
    }
    const [detailRes, questRes] = await Promise.all([
      apiClient.get(`/api/assessments/${id}`),
      apiClient.get(`/api/assessments/${id}/questions`).catch(() => ({ data: { data: [] } }))
    ]);

    const detail = detailRes.data?.data || detailRes.data;
    const questionsRaw = questRes.data?.data || questRes.data || [];

    const questions = questionsRaw.map(q => {
      let opts = [];
      if (typeof q.optionsJson === 'string') {
        try { opts = JSON.parse(q.optionsJson); } catch (e) { opts = []; }
      } else if (Array.isArray(q.optionsJson)) {
        opts = q.optionsJson;
      }
      return {
        id: q.id,
        questionText: q.questionText,
        options: opts,
        correctAnswer: q.correctOptionIndex,
        explanation: q.explanation
      };
    });

    return {
      id: detail.id,
      title: detail.title,
      description: detail.description,
      skillId: detail.skillId,
      duration: `${detail.durationMinutes || 15} mins`,
      passScore: detail.passScore || 70,
      difficulty: detail.difficulty || 'Intermediate',
      questions: questions.length > 0 ? questions : (MOCK_ASSESSMENTS[0]?.questions || [])
    };
  },

  async submitAssessment(id, answers) {
    if (USE_MOCK) {
      await delay(400);
      const assessment = MOCK_ASSESSMENTS.find((a) => a.id == id) || MOCK_ASSESSMENTS[0];
      let correct = 0;
      if (assessment.questions && answers) {
        assessment.questions.forEach((q) => {
          if (answers[q.id] === q.correctAnswer) correct++;
        });
      }
      const scorePercentage = assessment.questions?.length
        ? Math.round((correct / assessment.questions.length) * 100)
        : 86;

      if (assessment.skillId && scorePercentage >= 70) {
        await skillsApi.verifySkill(assessment.skillId, {
          type: 'Assessment',
          name: `${assessment.title} Passed`,
          score: `${scorePercentage}%`
        });
      }

      return {
        ...MOCK_DEFAULT_RESULT,
        assessmentId: id,
        title: assessment.title,
        skillId: assessment.skillId,
        score: scorePercentage,
        passed: scorePercentage >= 70,
        competencyLevel: scorePercentage >= 85 ? 'Intermediate / Advanced' : 'Intermediate'
      };
    }

    // Start attempt to obtain valid attemptId if needed
    let attemptId = 1;
    try {
      const startRes = await apiClient.post(`/api/assessments/${id}/start`);
      const startData = startRes.data?.data || startRes.data;
      if (startData?.attemptId || startData?.id) {
        attemptId = startData.attemptId || startData.id;
      }
    } catch (ignored) {}

    const response = await apiClient.post(`/api/assessments/${id}/submit`, {
      attemptId: attemptId,
      answers: answers
    });

    const resData = response.data?.data || response.data;
    const attempt = resData.attempt || {};
    const passed = attempt.passed || resData.skillVerificationStatus === 'VERIFIED';
    const finalScore = attempt.score || 85;

    return {
      assessmentId: id,
      title: attempt.assessmentTitle || 'Assessment Attempt',
      skillId: attempt.skillId || 'skill',
      score: finalScore,
      passed: passed,
      competencyLevel: attempt.competencyLevel || (finalScore >= 85 ? 'Advanced' : 'Intermediate'),
      message: resData.message || 'Assessment completed successfully',
      breakdown: [
        { area: 'Core Knowledge', score: finalScore },
        { area: 'Practical Application', score: Math.min(100, finalScore + 5) }
      ]
    };
  }
};
