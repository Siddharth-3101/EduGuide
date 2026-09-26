import { mockInterviewSets, mockRecommendedQuestions, mockInterviewExperiences, mockCompanyDrives } from '../../data/mock/interviews';

// In-memory clone to simulate persistence across frontend navigation
let interviewSetsStore = JSON.parse(JSON.stringify(mockInterviewSets));
let interviewExperiencesStore = JSON.parse(JSON.stringify(mockInterviewExperiences));


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
    if (set) {
      return JSON.parse(JSON.stringify(set));
    }

    // Check if it's a company recruitment drive
    try {
      const drives = await interviewApi.getCompanyDrives();
      const drive = drives.find((d) => d.id === id);
      if (drive) {
        const allQuestions = [];
        (drive.rounds || []).forEach(r => {
          (r.questions || []).forEach(q => {
            allQuestions.push({
              id: q.id,
              title: q.title,
              category: r.title || 'Technical',
              type: 'Technical',
              difficulty: q.difficulty || 'Intermediate',
              skills: Array.isArray(q.tags) ? q.tags : (typeof q.tags === 'string' ? q.tags.split(',') : ['Interview Problem']),
              prompt: q.prompt,
              expectedAnswer: q.tips || '',
              explanation: `Contributed by ${q.contributorName} (${q.college || 'Verified Candidate'})`,
              tips: q.tips || ''
            });
          });
        });

        return {
          id: drive.id,
          title: `${drive.company} — ${drive.role}`,
          description: drive.summary,
          targetRole: drive.targetRole || drive.role,
          difficulty: drive.overallDifficulty || 'Medium',
          skills: ['DSA', 'System Design', 'Core CS'],
          updatedAt: 'Recently',
          createdAt: '2026-03-01',
          ownerId: 'u-1',
          isSharedWithMe: true,
          collaborators: (drive.contributors || []).map((c, i) => ({
            id: `u-${i}`,
            name: c.name,
            email: `${c.name.toLowerCase().replace(/\s+/g, '.')}@college.edu`,
            role: 'Contributor',
            status: 'online',
            avatar: c.name.split(' ').map(n => n[0]).join('')
          })),
          questions: allQuestions
        };
      }
    } catch (e) {
      console.warn('Error resolving drive by id:', e);
    }

    // Graceful fallback to first interview set rather than throwing
    return JSON.parse(JSON.stringify(interviewSetsStore[0] || {
      id,
      title: 'Technical Interview Practice',
      description: 'Collaborative questions for campus placements.',
      questions: []
    }));
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
        { id: 'u-1', name: 'Siddharth G', email: 'siddharth.g@kce.ac.in', role: 'Owner', status: 'online', avatar: 'SG' }
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
  },

  // Collaborative single-record company recruitment drives
  getCompanyDrives: async () => {
    await new Promise((r) => setTimeout(r, 120));
    try {
      const saved = localStorage.getItem('skillsync_company_drives');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}
    return JSON.parse(JSON.stringify(mockCompanyDrives));
  },

  getDriveById: async (driveId) => {
    await new Promise((r) => setTimeout(r, 100));
    const drives = await interviewApi.getCompanyDrives();
    const drive = drives.find((d) => d.id === driveId) || drives[0];
    return JSON.parse(JSON.stringify(drive));
  },

  addQuestionToRound: async (driveId, roundNumber, questionData) => {
    await new Promise((r) => setTimeout(r, 180));
    const drives = await interviewApi.getCompanyDrives();
    const driveIndex = drives.findIndex((d) => d.id === driveId);
    if (driveIndex === -1) throw new Error('Company drive not found');

    const drive = drives[driveIndex];
    let targetRound = drive.rounds.find((r) => r.roundNumber === Number(roundNumber));
    if (!targetRound) {
      targetRound = {
        roundNumber: Number(roundNumber),
        title: `Round ${roundNumber}: Technical Assessment`,
        duration: '60 mins',
        difficulty: 'Medium',
        focus: 'Collaborative Questions',
        questions: []
      };
      drive.rounds.push(targetRound);
    }

    const newQuestion = {
      id: `q-${Date.now()}`,
      contributorName: questionData.contributorName || 'Siddharth G',
      college: questionData.college || 'Karpagam College of Engineering',
      title: questionData.title || 'Technical Interview Problem',
      prompt: questionData.prompt || '',
      difficulty: questionData.difficulty || 'Medium',
      tags: typeof questionData.tags === 'string' ? questionData.tags.split(',').map(t => t.trim()) : (questionData.tags || ['Interview Problem']),
      tips: questionData.tips || 'Explain time complexity and handle edge cases.'
    };

    targetRound.questions = [newQuestion, ...(targetRound.questions || [])];

    // Update contributor list if contributor not already in list
    const hasContributor = drive.contributors?.some(c => c.name === newQuestion.contributorName);
    if (!hasContributor) {
      drive.contributors = [
        { name: newQuestion.contributorName, college: newQuestion.college, date: 'Just now' },
        ...(drive.contributors || [])
      ];
      drive.studentContributorsCount = (drive.studentContributorsCount || 0) + 1;
    }

    drives[driveIndex] = drive;
    try {
      localStorage.setItem('skillsync_company_drives', JSON.stringify(drives));
    } catch (e) {}

    return newQuestion;
  },

  createCompanyDrive: async (driveData) => {
    await new Promise((r) => setTimeout(r, 200));
    const drives = await interviewApi.getCompanyDrives();
    const newDrive = {
      id: `drive-${Date.now()}`,
      company: driveData.company || 'Enterprise Partner',
      role: driveData.role || 'Software Development Engineer',
      driveDate: driveData.driveDate || '2026 Batch Drive',
      status: 'Active Collaborative Pool',
      overallDifficulty: driveData.overallDifficulty || 'Medium-Hard',
      studentContributorsCount: 1,
      targetRole: driveData.role || 'Backend Developer',
      summary: driveData.summary || 'Collaborative interview questions and coding rounds contributed by participating students.',
      contributors: [
        { name: driveData.contributorName || 'Siddharth G', college: driveData.college || 'Karpagam College of Engineering', date: 'Just now' }
      ],
      rounds: [
        {
          roundNumber: 1,
          title: 'Round 1: Online Assessment (OA)',
          duration: '90 mins',
          difficulty: 'Medium',
          focus: 'Coding & Aptitude',
          questions: driveData.round1Question ? [{
            id: `q-${Date.now()}-1`,
            contributorName: driveData.contributorName || 'Siddharth G',
            college: driveData.college || 'Karpagam College of Engineering',
            title: driveData.round1QuestionTitle || 'Coding Assessment Problem',
            prompt: driveData.round1Question,
            difficulty: 'Medium',
            tags: ['DSA', 'OA'],
            tips: driveData.round1Tips || 'Time complexity matters.'
          }] : []
        },
        {
          roundNumber: 2,
          title: 'Round 2: Technical Interview 1 (DSA & Core CS)',
          duration: '60 mins',
          difficulty: 'Medium-Hard',
          focus: 'Live Coding & Problem Solving',
          questions: []
        },
        {
          roundNumber: 3,
          title: 'Round 3: Technical Interview 2 (System Design & Backend)',
          duration: '60 mins',
          difficulty: 'Hard',
          focus: 'Architecture & Scalability',
          questions: []
        },
        {
          roundNumber: 4,
          title: 'Round 4: Managerial & Behavioral (STAR)',
          duration: '45 mins',
          difficulty: 'Medium',
          focus: 'Behavioral & Leadership Principles',
          questions: []
        }
      ]
    };

    const updatedDrives = [newDrive, ...drives];
    try {
      localStorage.setItem('skillsync_company_drives', JSON.stringify(updatedDrives));
    } catch (e) {}

    return newDrive;
  },

  // Backward compatibility aliases
  getInterviewExperiences: async () => {
    return interviewApi.getCompanyDrives();
  },

  addInterviewExperience: async (expData) => {
    return interviewApi.createCompanyDrive(expData);
  }
};

