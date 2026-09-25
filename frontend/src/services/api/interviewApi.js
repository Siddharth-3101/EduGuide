import { mockInterviewSets, mockRecommendedQuestions } from '../../data/mock/interviews';

// In-memory clone to simulate persistence across frontend navigation
let interviewSetsStore = JSON.parse(JSON.stringify(mockInterviewSets));

export const interviewApi = {
  // Get all interview sets (filtered optionally by ownership)
  getInterviewSets: async () => {
    await new Promise((r) => setTimeout(r, 200));
    return JSON.parse(JSON.stringify(interviewSetsStore));
  },

  // Get specific interview set by id
  getInterviewSetById: async (id) => {
    await new Promise((r) => setTimeout(r, 150));
    const set = interviewSetsStore.find((s) => s.id === id);
    if (!set) {
      throw new Error(`Interview set not found: ${id}`);
    }
    return JSON.parse(JSON.stringify(set));
  },

  // Create new interview set
  createInterviewSet: async (setData) => {
    await new Promise((r) => setTimeout(r, 250));
    const newSet = {
      id: `int-${Date.now()}`,
      title: setData.title || 'Untitled Interview Set',
      description: setData.description || '',
      targetRole: setData.targetRole || 'Backend Developer',
      difficulty: setData.difficulty || 'Intermediate',
      skills: setData.skills || ['Backend Architecture'],
      updatedAt: 'Just now',
      createdAt: new Date().toISOString().split('T')[0],
      ownerId: 'u-alex-chen',
      isSharedWithMe: false,
      collaborators: [
        { id: 'u-1', name: 'Alex Chen', email: 'alex.chen@university.edu', role: 'Owner', status: 'online', avatar: 'AC' }
      ],
      questions: []
    };
    interviewSetsStore.unshift(newSet);
    return JSON.parse(JSON.stringify(newSet));
  },

  // Update interview set metadata
  updateInterviewSet: async (id, updates) => {
    await new Promise((r) => setTimeout(r, 200));
    const idx = interviewSetsStore.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Interview set not found');
    interviewSetsStore[idx] = {
      ...interviewSetsStore[idx],
      ...updates,
      updatedAt: 'Just now'
    };
    return JSON.parse(JSON.stringify(interviewSetsStore[idx]));
  },

  // Delete interview set
  deleteInterviewSet: async (id) => {
    await new Promise((r) => setTimeout(r, 200));
    interviewSetsStore = interviewSetsStore.filter((s) => s.id !== id);
    return { success: true };
  },

  // Add question to set
  addQuestion: async (setId, questionData) => {
    await new Promise((r) => setTimeout(r, 180));
    const set = interviewSetsStore.find((s) => s.id === setId);
    if (!set) throw new Error('Set not found');

    const newQuestion = {
      id: `q-${Date.now()}`,
      title: questionData.title || 'New Question',
      category: questionData.category || 'Technical',
      type: questionData.type || 'Technical',
      difficulty: questionData.difficulty || 'Intermediate',
      skills: questionData.skills || ['General'],
      prompt: questionData.prompt || '',
      expectedAnswer: questionData.expectedAnswer || '',
      explanation: questionData.explanation || '',
      tips: questionData.tips || '',
      evaluationCriteria: questionData.evaluationCriteria || []
    };

    set.questions.push(newQuestion);
    set.updatedAt = 'Just now';
    return JSON.parse(JSON.stringify(newQuestion));
  },

  // Update question
  updateQuestion: async (setId, questionId, updates) => {
    await new Promise((r) => setTimeout(r, 150));
    const set = interviewSetsStore.find((s) => s.id === setId);
    if (!set) throw new Error('Set not found');

    const qIdx = set.questions.findIndex((q) => q.id === questionId);
    if (qIdx === -1) throw new Error('Question not found');

    set.questions[qIdx] = { ...set.questions[qIdx], ...updates };
    set.updatedAt = 'Just now';
    return JSON.parse(JSON.stringify(set.questions[qIdx]));
  },

  // Delete question
  deleteQuestion: async (setId, questionId) => {
    await new Promise((r) => setTimeout(r, 150));
    const set = interviewSetsStore.find((s) => s.id === setId);
    if (!set) throw new Error('Set not found');

    set.questions = set.questions.filter((q) => q.id !== questionId);
    set.updatedAt = 'Just now';
    return { success: true };
  },

  // Duplicate question
  duplicateQuestion: async (setId, questionId) => {
    await new Promise((r) => setTimeout(r, 150));
    const set = interviewSetsStore.find((s) => s.id === setId);
    if (!set) throw new Error('Set not found');

    const orig = set.questions.find((q) => q.id === questionId);
    if (!orig) throw new Error('Question not found');

    const duplicate = {
      ...JSON.parse(JSON.stringify(orig)),
      id: `q-${Date.now()}`,
      title: `${orig.title} (Copy)`
    };

    set.questions.push(duplicate);
    set.updatedAt = 'Just now';
    return JSON.parse(JSON.stringify(duplicate));
  },

  // Invite collaborator
  inviteCollaborator: async (setId, { email, role }) => {
    await new Promise((r) => setTimeout(r, 200));
    const set = interviewSetsStore.find((s) => s.id === setId);
    if (!set) throw new Error('Set not found');

    const nameFromEmail = email.split('@')[0].replace('.', ' ');
    const initials = nameFromEmail
      .split(' ')
      .map((n) => n[0]?.toUpperCase() || '')
      .join('')
      .slice(0, 2) || 'CL';

    const newCollaborator = {
      id: `u-${Date.now()}`,
      name: nameFromEmail.charAt(0).toUpperCase() + nameFromEmail.slice(1),
      email,
      role: role || 'Viewer',
      status: 'offline',
      avatar: initials
    };

    set.collaborators.push(newCollaborator);
    return JSON.parse(JSON.stringify(newCollaborator));
  },

  // Recommended questions
  getRecommendedQuestions: async () => {
    await new Promise((r) => setTimeout(r, 150));
    return JSON.parse(JSON.stringify(mockRecommendedQuestions));
  }
};
