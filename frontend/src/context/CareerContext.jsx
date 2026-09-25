import React, { createContext, useContext, useState, useEffect } from 'react';
import { careerApi } from '../services/api/careerApi';
import { profileApi } from '../services/api/profileApi';
import { readinessApi } from '../services/api/readinessApi';

const CareerContext = createContext(null);

export const CareerProvider = ({ children }) => {
  const [targetRoleId, setTargetRoleId] = useState('backend-developer');
  const [roadmap, setRoadmap] = useState(null);
  const [profile, setProfile] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCareerData = async (roleId = targetRoleId) => {
    try {
      setLoading(true);
      const [roadmapData, profileData, readinessData] = await Promise.all([
        careerApi.getRoleRoadmap(roleId).catch(() => null),
        profileApi.getProfile().catch(() => null),
        readinessApi.getReadiness().catch(() => null)
      ]);
      setRoadmap(roadmapData);
      setProfile(profileData);
      setReadiness(readinessData);
    } catch (err) {
      console.error('Error fetching career data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerData(targetRoleId);
  }, [targetRoleId]);

  const selectTargetRole = async (roleId) => {
    setTargetRoleId(roleId);
    try {
      await careerApi.selectTargetRole(roleId);
    } catch (ignored) {}
    fetchCareerData(roleId);
  };

  const updateProfileData = async (updates) => {
    const updated = await profileApi.updateProfile(updates);
    setProfile(updated);
    fetchCareerData(targetRoleId);
    return updated;
  };

  const verifiedCount = readiness?.verifiedSkills?.length ?? 5;
  const partialCount = readiness?.partialSkills?.length ?? 1;
  const missingCount = readiness?.missingSkills?.length ?? 2;
  const coverage = readiness?.competencyCoveragePercentage ?? 67;

  const value = {
    targetRoleId,
    roadmap,
    profile,
    readiness,
    stats: {
      targetRoleTitle: readiness?.targetRoleTitle || profile?.targetRoleTitle || 'Backend Developer',
      competencyCoverage: coverage,
      verifiedCount: verifiedCount,
      partialCount: partialCount,
      missingCount: missingCount
    },
    nextBestAction: readiness?.nextBestAction || {
      title: 'Docker Fundamentals',
      actionType: 'ASSESSMENT',
      description: 'Verifying Docker competency will elevate your readiness.'
    },
    loading,
    selectTargetRole,
    updateProfileData,
    refreshCareerData: () => fetchCareerData(targetRoleId)
  };

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>;
};

export const useCareer = () => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
