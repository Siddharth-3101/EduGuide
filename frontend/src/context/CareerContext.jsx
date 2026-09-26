import React, { createContext, useContext, useState, useEffect } from 'react';
import { careerApi } from '../services/api/careerApi';
import { profileApi } from '../services/api/profileApi';
import { readinessApi } from '../services/api/readinessApi';

const CareerContext = createContext(null);

import { MOCK_ROLES } from '../data/mock/roles';

export const CareerProvider = ({ children }) => {
  const [targetRoleId, setTargetRoleId] = useState(() => {
    try {
      return localStorage.getItem('skillsync_target_role_id') || 'backend-developer';
    } catch (e) {
      return 'backend-developer';
    }
  });
  const [roadmap, setRoadmap] = useState(null);
  const [profile, setProfile] = useState(null);
  const [readiness, setReadiness] = useState(null);
  const [loading, setLoading] = useState(true);

  const activeRoleObj = MOCK_ROLES.find(r => r.id === targetRoleId || r.careerDomainId === targetRoleId) || MOCK_ROLES[0];
  const activeRoleTitle = activeRoleObj?.title || 'Backend Developer';

  const fetchCareerData = async (roleId = targetRoleId) => {
    try {
      setLoading(true);
      const [roadmapData, profileData, readinessData] = await Promise.all([
        careerApi.getRoleRoadmap(roleId).catch(() => null),
        profileApi.getProfile().catch(() => null),
        readinessApi.getReadinessForRole(roleId).catch(() => null)
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
      localStorage.setItem('skillsync_target_role_id', roleId);
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

  const verifiedCount = readiness?.verifiedSkills?.length ?? 8;
  const partialCount = readiness?.partialSkills?.length ?? 3;
  const missingCount = readiness?.missingSkills?.length ?? 3;
  const coverage = targetRoleId === 'backend-developer' ? 84 : targetRoleId === 'frontend-developer' ? 70 : 76;

  const value = {
    targetRoleId,
    roadmap,
    profile,
    readiness,
    stats: {
      targetRoleTitle: activeRoleTitle,
      competencyCoverage: coverage,
      verifiedCount: verifiedCount,
      partialCount: partialCount,
      missingCount: missingCount
    },
    nextBestAction: readiness?.nextBestAction || {
      title: `${activeRoleTitle} Core Architecture`,
      actionType: 'ASSESSMENT',
      description: `Verifying ${activeRoleTitle} competencies will elevate your readiness.`
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
