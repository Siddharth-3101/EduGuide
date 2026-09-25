import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCareer } from '../../context/CareerContext';
import { CareerProgressCard } from '../../components/dashboard/CareerProgressCard';
import { NextBestAction } from '../../components/dashboard/NextBestAction';
import { SkillOverviewTable } from '../../components/dashboard/SkillOverviewTable';
import { JobOpportunityPreview } from '../../components/dashboard/JobOpportunityPreview';
import { CareerActivityTimeline } from '../../components/dashboard/CareerActivityTimeline';
import { skillsApi } from '../../services/api/skillsApi';
import { jobApi } from '../../services/api/jobApi';
import { profileApi } from '../../services/api/profileApi';
import { CardSkeleton } from '../../components/ui/Skeleton';
import { ErrorState } from '../../components/ui/ErrorState';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, nextBestAction, targetRoleId } = useCareer();

  const [skills, setSkills] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [skillsData, jobsData, activitiesData] = await Promise.all([
        skillsApi.getSkills(),
        jobApi.getJobs(),
        profileApi.getActivities()
      ]);
      setSkills(skillsData);
      setJobs(jobsData);
      setActivities(activitiesData);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      setError('Could not load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (error) {
    return <ErrorState message={error} onRetry={loadDashboardData} />;
  }

  const studentName = user?.fullName || 'Alex Chen';

  return (
    <div className="space-y-6">
      {/* Dashboard Top Greeting Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Good morning, {studentName} 👋
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Here's your progress toward your target career as a{' '}
          <span className="font-semibold text-slate-800">
            {stats?.targetRoleTitle || 'Backend Developer'}
          </span>
          .
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardSkeleton />
          <CardSkeleton />
          <CardSkeleton />
        </div>
      ) : (
        <>
          {/* Top Row: Next Best Action Card & Career Progress Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 flex flex-col justify-between">
              <NextBestAction action={nextBestAction} />
            </div>

            <div className="lg:col-span-5">
              <CareerProgressCard
                stats={stats}
                targetRole={stats?.targetRoleTitle || 'Backend Developer'}
              />
            </div>
          </div>

          {/* Middle Row: Skill Overview Table & Activity Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7">
              <SkillOverviewTable skills={skills} />
            </div>

            <div className="lg:col-span-5">
              <CareerActivityTimeline activities={activities} />
            </div>
          </div>

          {/* Bottom Section: Job Opportunities Matching Your Profile */}
          <div className="pt-2">
            <JobOpportunityPreview jobs={jobs} />
          </div>
        </>
      )}
    </div>
  );
};
