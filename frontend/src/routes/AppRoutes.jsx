import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from '../components/layout/AppLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Pages
import { LandingPage } from '../pages/landing/LandingPage';
import { LoginPage } from '../pages/auth/LoginPage';
import { RegisterPage } from '../pages/auth/RegisterPage';
import { OnboardingPage } from '../pages/onboarding/OnboardingPage';

import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { CareerRoadmapPage } from '../pages/career/CareerRoadmapPage';
import { SkillsPage } from '../pages/skills/SkillsPage';
import { SkillDetailPage } from '../pages/skills/SkillDetailPage';
import { AssessmentsPage } from '../pages/assessments/AssessmentsPage';
import { AssessmentTakingPage } from '../pages/assessments/AssessmentTakingPage';
import { AssessmentResultPage } from '../pages/assessments/AssessmentResultPage';
import { LearningPage } from '../pages/learning/LearningPage';
import { CourseDetailPage } from '../pages/learning/CourseDetailPage';
import { ProjectsPage } from '../pages/projects/ProjectsPage';
import { ProjectDetailPage } from '../pages/projects/ProjectDetailPage';
import { JobsPage } from '../pages/jobs/JobsPage';
import { JobDetailPage } from '../pages/jobs/JobDetailPage';
import { PortfolioPage } from '../pages/portfolio/PortfolioPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { SettingsPage } from '../pages/settings/SettingsPage';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Standalone Assessment Flow View */}
      <Route path="/assessments/:assessmentId" element={<AssessmentTakingPage />} />

      {/* Main Authenticated Application Layout */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/career" element={<CareerRoadmapPage />} />
          <Route path="/career/:roleId" element={<CareerRoadmapPage />} />

          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/skills/:skillId" element={<SkillDetailPage />} />

          <Route path="/assessments" element={<AssessmentsPage />} />
          <Route path="/assessments/:assessmentId/result" element={<AssessmentResultPage />} />

          <Route path="/learning" element={<LearningPage />} />
          <Route path="/learning/:courseId" element={<CourseDetailPage />} />

          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />

          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/jobs/:jobId" element={<JobDetailPage />} />

          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      {/* 404 / Catch-all redirect */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
