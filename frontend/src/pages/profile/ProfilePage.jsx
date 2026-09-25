import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
  User,
  GraduationCap,
  Briefcase,
  Layers,
  FileText,
  Award,
  Edit2,
  Check,
  Save,
  MapPin,
  Mail,
  ExternalLink
} from 'lucide-react';

export const ProfilePage = () => {
  const { profile, updateProfileData } = useCareer();

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || 'Alex Chen',
    email: profile?.email || 'alex.chen@university.edu',
    headline: profile?.headline || 'Aspiring Backend Systems Engineer',
    location: profile?.location || 'Bangalore, India',
    bio: profile?.bio || 'Focused on distributed systems, relational databases, and REST APIs.'
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    await updateProfileData(formData);
    setIsEditing(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header with Edit Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-blue-600">
              <User className="h-3.5 w-3.5" />
            </span>
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">
              Profile Management
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
            Student Profile
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your personal data, university background, and target roles.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <Check className="h-4 w-4" /> Profile Updated
            </span>
          )}
          <Button
            variant={isEditing ? 'secondary' : 'primary'}
            icon={isEditing ? null : Edit2}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </Button>
        </div>
      </div>

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Personal info & Bio */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="bg-white border border-slate-200 p-6">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
              Personal Information
            </h3>

            {isEditing ? (
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={formData.headline}
                    onChange={(e) => setFormData({ ...formData, headline: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bio</label>
                  <textarea
                    rows={3}
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" variant="primary" icon={Save}>
                    Save Changes
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-slate-900">{formData.fullName}</h4>
                  <p className="text-xs font-semibold text-blue-600 mt-0.5">{formData.headline}</p>
                  <div className="flex items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                      <Mail className="h-3.5 w-3.5 text-slate-400" /> {formData.email}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" /> {formData.location}
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Bio & Aspirations
                  </span>
                  <p className="text-xs text-slate-600 leading-relaxed">{formData.bio}</p>
                </div>
              </div>
            )}
          </Card>

          {/* Education */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <GraduationCap className="h-4.5 w-4.5 text-slate-600" /> Education
            </h3>
            {profile?.education?.map((edu, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>{edu.institution}</span>
                  <span className="text-slate-400 font-normal">{edu.period}</span>
                </div>
                <p className="text-slate-600">{edu.degree}</p>
                <p className="text-emerald-700 font-semibold">{edu.grade}</p>
              </div>
            ))}
          </Card>

          {/* Experience */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
              <Briefcase className="h-4.5 w-4.5 text-slate-600" /> Experience
            </h3>
            {profile?.experience?.map((exp, idx) => (
              <div key={idx} className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-slate-900 text-sm">
                  <span>{exp.role}</span>
                  <span className="text-slate-400 font-normal">{exp.period}</span>
                </div>
                <p className="text-blue-600 font-medium">{exp.company}</p>
                <p className="text-slate-600 leading-relaxed mt-1">{exp.description}</p>
              </div>
            ))}
          </Card>
        </div>

        {/* Right Column: Career Targets, Resume, Certificates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Career Targets */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100">
              Career Targets
            </h3>
            <div className="space-y-2">
              <div className="p-3 rounded-lg bg-blue-50/70 border border-blue-200 text-xs">
                <span className="text-[10px] font-bold uppercase text-blue-700 tracking-wider">
                  Primary Target
                </span>
                <p className="font-bold text-slate-900 mt-0.5">{profile?.targetRole || 'Backend Developer'}</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                  Secondary Target
                </span>
                <p className="font-semibold text-slate-800 mt-0.5">Cloud Engineer</p>
              </div>
            </div>
          </Card>

          {/* Resume Uploaded Record */}
          <Card className="bg-white border border-slate-200">
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-slate-600" /> Uploaded Resume
              </h3>
              <Badge variant="verified">Parsed</Badge>
            </div>
            <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs flex items-center justify-between">
              <div>
                <p className="font-semibold text-slate-800">alex_chen_resume_2026.pdf</p>
                <span className="text-[10px] text-slate-400">124.5 KB • Uploaded 2 weeks ago</span>
              </div>
              <button className="text-blue-600 hover:underline font-semibold text-xs">
                Replace
              </button>
            </div>
          </Card>

          {/* Certificates */}
          <Card className="bg-white border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
              <Award className="h-4 w-4 text-slate-600" /> Verified Credentials
            </h3>
            <div className="space-y-2 text-xs">
              {profile?.certificates?.map((c) => (
                <div key={c.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50">
                  <p className="font-bold text-slate-800">{c.title}</p>
                  <p className="text-slate-400 text-[11px] mt-0.5">{c.issuer}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
