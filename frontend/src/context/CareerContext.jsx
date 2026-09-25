import React, { createContext, useContext, useState, useEffect } from 'react';
import { careerApi } from '../services/api/careerApi';
import { profileApi } from '../services/api/profileApi';

const CareerContext = createContext(null);

export const CareerProvider = ({ children }) => {
  const [targetRoleId, setTargetRoleId] = useState('backend-developer');
  const [roadmap, setRoadmap] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCareerData = async (roleId = targetRoleId) => {
    try {
      setLoading(true);
      const [roadmapData, profileData] = await Promise.all([
        careerApi.getRoleRoadmap(roleId),
        profileApi.getProfile()
      ]);
      setRoadmap(roadmapData);
      setProfile(profileData);
    } catch (err) {
      console.error('Error fetching career data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCareerData(targetRoleId);
  }, [targetRoleId]);

  const selectTargetRole = (roleId) => {
    setTargetRoleId(roleId);
  };

  const updateProfileData = async (updates) => {
    const updated = await profileApi.updateProfile(updates);
    setProfile(updated);
    return updated;
  };

  const value = {
    targetRoleId,
    roadmap,
    profile,
    stats: profile?.stats || {
      targetRoleTitle: 'Backend Developer',
      competencyCoverage: 67,
      verifiedCount: 8,
      partialCount: 3,
      missingCount: 4
    },
    nextBestAction: profile?.nextBestAction,
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
