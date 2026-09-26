import { apiClient, USE_MOCK, delay } from './apiClient';
import { MOCK_ASSESSMENTS, MOCK_DEFAULT_RESULT } from '../../data/mock/assessments';
import { GLOBAL_ASSESSMENTS, getAssessmentById as getGlobalAssessment } from '../../data/mock/assessmentsData';
import { skillsApi } from './skillsApi';

export const assessmentApi = {
  async getAssessments(category) {
    const globalMapped = GLOBAL_ASSESSMENTS.map(a => ({
      id: a.id,
      title: a.title,
      description: a.description,
      skillId: a.skillId,
      category: a.category || 'Engineering',
      duration: `${a.durationMinutes || 15} mins`,
      questionsCount: a.totalQuestions || a.questions?.length || 5,
      passScore: a.passingScore || 75,
      difficulty: a.difficulty || 'Intermediate',
      proctored: true
    }));

    if (USE_MOCK) {
      await delay(150);
      const combined = [...globalMapped, ...MOCK_ASSESSMENTS];
      if (!category || category === 'All') return combined;
      return combined.filter((a) => (a.category || '').toLowerCase() === category.toLowerCase());
    }

    try {
      const response = await apiClient.get('/api/assessments', { timeout: 1500 });
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
      const combined = [...globalMapped, ...mapped];
      if (category && category !== 'All') {
        return combined.filter(a => (a.category || '').toLowerCase() === category.toLowerCase());
      }
      return combined;
    } catch (e) {
      // Fallback to combined
      if (!category || category === 'All') return [...globalMapped, ...MOCK_ASSESSMENTS];
      return [...globalMapped, ...MOCK_ASSESSMENTS].filter((a) => (a.category || '').toLowerCase() === category.toLowerCase());
    }
  },

  async getAssessmentById(id) {
    // 1. Check global assessments bank first
    const globalMatch = getGlobalAssessment(id) || GLOBAL_ASSESSMENTS.find(a =>
      a.id === id ||
      a.skillId?.toLowerCase() === id?.toLowerCase() ||
      a.id.replace('asmt-', '') === id?.toLowerCase() ||
      a.id.replace('asm-', '') === id?.toLowerCase()
    );
    if (globalMatch) {
      return {
        ...globalMatch,
        duration: `${globalMatch.durationMinutes || 15} mins`,
        passScore: globalMatch.passingScore || 75
      };
    }

    if (USE_MOCK) {
      await delay(120);
      const assessment = MOCK_ASSESSMENTS.find((a) => a.id == id || a.skillId === id) || MOCK_ASSESSMENTS[0];
      return assessment;
    }

    try {
      const [detailRes, questRes] = await Promise.all([
        apiClient.get(`/api/assessments/${id}`, { timeout: 1500 }),
        apiClient.get(`/api/assessments/${id}/questions`, { timeout: 1500 }).catch(() => ({ data: { data: [] } }))
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
          prompt: q.questionText,
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
    } catch (err) {
      const fallback = MOCK_ASSESSMENTS.find((a) => a.id == id) || MOCK_ASSESSMENTS[0];
      return fallback;
    }
  },

  async submitAssessment(id, answers) {
    // Check if it's a global assessment
    const globalMatch = getGlobalAssessment(id) || GLOBAL_ASSESSMENTS.find(a =>
      a.id === id || a.skillId === id
    );

    if (globalMatch || USE_MOCK) {
      await delay(400);
      const assessment = globalMatch || MOCK_ASSESSMENTS.find((a) => a.id == id) || MOCK_ASSESSMENTS[0];
      let correct = 0;
      if (assessment.questions && answers) {
        assessment.questions.forEach((q) => {
          if (answers[q.id] === q.correctAnswer) correct++;
        });
      }
      const total = assessment.questions?.length || 5;
      const scorePercentage = Math.round((correct / total) * 100);
      const passBenchmark = assessment.passingScore || assessment.passScore || 70;
      const passed = scorePercentage >= passBenchmark;

      if (assessment.skillId && passed) {
        try {
          await skillsApi.verifySkill(assessment.skillId, {
            type: 'Assessment',
            name: `${assessment.title} Passed`,
            score: `${scorePercentage}%`
          });
        } catch (e) {
          console.warn('Skill verification update failed:', e);
        }
      }

      return {
        ...MOCK_DEFAULT_RESULT,
        assessmentId: id,
        title: assessment.title,
        skillId: assessment.skillId,
        score: scorePercentage,
        passed: passed,
        competencyLevel: scorePercentage >= 85 ? 'Intermediate / Advanced' : 'Intermediate',
        message: passed
          ? `Outstanding! You scored ${scorePercentage}%. Your competency is officially verified.`
          : `You scored ${scorePercentage}%. The passing threshold is ${passBenchmark}%. Review the materials and retry.`
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
