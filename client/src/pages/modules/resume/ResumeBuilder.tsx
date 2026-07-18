import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../../lib/api.js';
import { ModernTemplate, CreativeTemplate, MinimalistTemplate } from './ResumeTemplates.js';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Loader2,
  Save,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  Layout,
  TrendingUp,
  Plus,
  Trash2,
  Sparkles,
  RefreshCw,
  FileDown,
  History,
  AlertTriangle,
  CheckCircle,
  X
} from 'lucide-react';

interface ResumeData {
  id: string;
  title: string;
  templateId: string;
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    summary: string;
    socialLinks?: string[];
  };
  experience: Array<{
    id: string;
    company: string;
    role: string;
    description: string;
    startDate: string;
    endDate: string;
    location?: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    graduationDate: string;
    gpa?: string;
  }>;
  skills: string[];
  atsScore: number;
  version: number;
}

export const ResumeBuilder: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'info' | 'experience' | 'education' | 'skills' | 'template' | 'ats'>('info');

  // Local Resume state for fast editing before autosave
  const [localResume, setLocalResume] = useState<ResumeData | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // AI loading indicators
  const [aiLoading, setAiLoading] = useState<string | null>(null);

  // ATS Optimization state
  const [jobDescription, setJobDescription] = useState('');
  const [atsReport, setAtsReport] = useState<{
    score: number;
    matchRatio: string;
    feedback: string;
    suggestions: string[];
  } | null>(null);

  // Fetch Resume Data
  const { data: fetchedResume, isLoading } = useQuery({
    queryKey: ['resume', id],
    queryFn: async () => {
      const res = await api.get(`/resumes/${id}`);
      return res.data.resume;
    },
    enabled: !!id
  });

  // Sync fetched resume with local editing state
  useEffect(() => {
    if (fetchedResume) {
      setLocalResume({
        id: fetchedResume.id,
        title: fetchedResume.title,
        templateId: fetchedResume.templateId,
        personalInfo: fetchedResume.personalInfo || { name: '', email: '', phone: '', summary: '', socialLinks: [] },
        experience: fetchedResume.experience || [],
        education: fetchedResume.education || [],
        skills: fetchedResume.skills || [],
        atsScore: fetchedResume.atsScore,
        version: fetchedResume.version
      });
    }
  }, [fetchedResume]);

  // Update Resume Mutation
  const updateResumeMutation = useMutation({
    mutationFn: async (vars: { data: Partial<ResumeData>; saveVersion?: boolean }) => {
      const res = await api.put(`/resumes/${id}`, {
        ...vars.data,
        saveVersion: vars.saveVersion
      });
      return res.data.resume;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resume', id] });
      queryClient.invalidateQueries({ queryKey: ['resumes'] });
      setIsSaving(false);
    }
  });

  // Auto-save debounce effect
  useEffect(() => {
    if (!localResume) return;

    const delay = setTimeout(() => {
      setIsSaving(true);
      updateResumeMutation.mutate({ data: localResume, saveVersion: false });
    }, 2000); // Trigger auto-save 2s after user stops typing

    return () => clearTimeout(delay);
  }, [localResume]);

  const handleFieldChange = (section: keyof ResumeData, value: any) => {
    if (!localResume) return;
    setLocalResume({
      ...localResume,
      [section]: value
    });
  };

  const handlePersonalInfoChange = (field: string, value: any) => {
    if (!localResume) return;
    setLocalResume({
      ...localResume,
      personalInfo: {
        ...localResume.personalInfo,
        [field]: value
      }
    });
  };

  // 1. SUMMARY AI GENERATOR
  const handleAISummary = async () => {
    if (!localResume) return;
    setAiLoading('summary');
    try {
      const res = await api.post('/resumes/ai/summary', {
        jobTitle: localResume.personalInfo.name || 'Software Professional',
        skills: localResume.skills
      });
      handlePersonalInfoChange('summary', res.data.summary);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  // 2. EXPERIENCE ADD/REMOVE/EDIT
  const handleAddExperience = () => {
    if (!localResume) return;
    const newExp = {
      id: Math.random().toString(36).substring(2, 9),
      company: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
      location: ''
    };
    handleFieldChange('experience', [...localResume.experience, newExp]);
  };

  const handleRemoveExperience = (idx: number) => {
    if (!localResume) return;
    const filtered = localResume.experience.filter((_, i) => i !== idx);
    handleFieldChange('experience', filtered);
  };

  const handleExperienceChange = (idx: number, field: string, value: any) => {
    if (!localResume) return;
    const updated = localResume.experience.map((exp, i) => {
      if (i === idx) {
        return { ...exp, [field]: value };
      }
      return exp;
    });
    handleFieldChange('experience', updated);
  };

  const handleAIExperience = async (idx: number) => {
    if (!localResume) return;
    const exp = localResume.experience[idx];
    if (!exp.company || !exp.role) {
      alert('Please fill in Company and Role first!');
      return;
    }
    setAiLoading(`exp-${idx}`);
    try {
      const res = await api.post('/resumes/ai/experience', {
        company: exp.company,
        role: exp.role,
        keywords: localResume.skills
      });
      handleExperienceChange(idx, 'description', res.data.bulletPoint);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  const handleAIRewriteExp = async (idx: number) => {
    if (!localResume) return;
    const exp = localResume.experience[idx];
    if (!exp.description) {
      alert('Please write some details first!');
      return;
    }
    setAiLoading(`rewrite-${idx}`);
    try {
      const res = await api.post('/resumes/ai/rewrite', {
        text: exp.description,
        tone: 'professional'
      });
      handleExperienceChange(idx, 'description', res.data.rewritten);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  // 3. EDUCATION ADD/REMOVE/EDIT
  const handleAddEducation = () => {
    if (!localResume) return;
    const newEdu = {
      id: Math.random().toString(36).substring(2, 9),
      school: '',
      degree: '',
      graduationDate: '',
      gpa: ''
    };
    handleFieldChange('education', [...localResume.education, newEdu]);
  };

  const handleRemoveEducation = (idx: number) => {
    if (!localResume) return;
    const filtered = localResume.education.filter((_, i) => i !== idx);
    handleFieldChange('education', filtered);
  };

  const handleEducationChange = (idx: number, field: string, value: any) => {
    if (!localResume) return;
    const updated = localResume.education.map((edu, i) => {
      if (i === idx) {
        return { ...edu, [field]: value };
      }
      return edu;
    });
    handleFieldChange('education', updated);
  };

  // 4. SKILLS ADD/REMOVE & AI SUGGESTIONS
  const [skillInput, setSkillInput] = useState('');
  const handleAddSkill = (skillText: string) => {
    if (!localResume || !skillText.trim()) return;
    if (localResume.skills.includes(skillText.trim())) return;
    handleFieldChange('skills', [...localResume.skills, skillText.trim()]);
    setSkillInput('');
  };

  const handleRemoveSkill = (idx: number) => {
    if (!localResume) return;
    const filtered = localResume.skills.filter((_, i) => i !== idx);
    handleFieldChange('skills', filtered);
  };

  // 5. ATS SCORING
  const handleCalculateScore = async () => {
    if (!localResume || !jobDescription) return;
    setAiLoading('ats');
    try {
      const res = await api.post('/resumes/score', {
        jobDescription,
        skills: localResume.skills
      });
      setAtsReport(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setAiLoading(null);
    }
  };

  // 6. EXPORT / PRINT
  const handleExportPDF = () => {
    window.print();
  };

  if (isLoading || !localResume) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-purple-500" size={32} />
        <p className="mt-2 text-sm text-muted-foreground">Loading workstation details...</p>
      </div>
    );
  }

  const renderTemplatePreview = () => {
    switch (localResume.templateId) {
      case 'creative':
        return <CreativeTemplate data={localResume} />;
      case 'minimalist':
        return <MinimalistTemplate data={localResume} />;
      case 'modern':
      default:
        return <ModernTemplate data={localResume} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title Bar */}
      <div className="flex items-center justify-between border-b border-border pb-4 print:hidden">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/resume')}
            className="p-2 border border-border hover:bg-muted/30 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <input
              type="text"
              value={localResume.title}
              onChange={(e) => handleFieldChange('title', e.target.value)}
              className="text-2xl font-bold bg-transparent border-b border-transparent hover:border-border focus:outline-none focus:border-purple-500 font-heading text-foreground"
            />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-muted-foreground">Version: {localResume.version}</span>
              <span className="text-[10px] text-muted-foreground">•</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                {isSaving ? (
                  <>
                    <Loader2 size={10} className="animate-spin" /> Saving changes...
                  </>
                ) : (
                  <>
                    <Save size={10} className="text-emerald-400" /> Saved to cloud
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => updateResumeMutation.mutate({ data: localResume, saveVersion: true })}
            className="px-3.5 py-1.5 border border-purple-500/20 bg-purple-500/5 text-purple-300 hover:bg-purple-500/10 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all"
          >
            <History size={14} /> Freeze Version
          </button>

          <button
            onClick={handleExportPDF}
            className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-all shadow-lg shadow-purple-600/15"
          >
            <FileDown size={14} /> Print / Export PDF
          </button>
        </div>
      </div>

      {/* Editor Layout Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Hand: Controls & Steps Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* Tabs Navigation */}
          <div className="flex border-b border-border overflow-x-auto whitespace-nowrap scrollbar-none gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'info' ? 'border-purple-500 text-purple-300' : 'border-transparent hover:text-foreground'
              }`}
            >
              <User size={14} /> Profile
            </button>
            <button
              onClick={() => setActiveTab('experience')}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'experience' ? 'border-purple-500 text-purple-300' : 'border-transparent hover:text-foreground'
              }`}
            >
              <Briefcase size={14} /> Jobs
            </button>
            <button
              onClick={() => setActiveTab('education')}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'education' ? 'border-purple-500 text-purple-300' : 'border-transparent hover:text-foreground'
              }`}
            >
              <GraduationCap size={14} /> Study
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'skills' ? 'border-purple-500 text-purple-300' : 'border-transparent hover:text-foreground'
              }`}
            >
              <Wrench size={14} /> Skills
            </button>
            <button
              onClick={() => setActiveTab('template')}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'template' ? 'border-purple-500 text-purple-300' : 'border-transparent hover:text-foreground'
              }`}
            >
              <Layout size={14} /> Design
            </button>
            <button
              onClick={() => setActiveTab('ats')}
              className={`pb-2 px-1 border-b-2 flex items-center gap-1.5 transition-colors ${
                activeTab === 'ats' ? 'border-purple-500 text-purple-300' : 'border-transparent hover:text-foreground'
              }`}
            >
              <TrendingUp size={14} /> ATS Match
            </button>
          </div>

          {/* Form views */}
          <div className="space-y-4">
            {activeTab === 'info' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Full Name</label>
                    <input
                      type="text"
                      value={localResume.personalInfo.name}
                      onChange={(e) => handlePersonalInfoChange('name', e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Email Address</label>
                    <input
                      type="email"
                      value={localResume.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Phone Number</label>
                    <input
                      type="text"
                      value={localResume.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                      className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Professional Summary</label>
                    <button
                      type="button"
                      onClick={handleAISummary}
                      disabled={aiLoading === 'summary'}
                      className="text-[10px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-1 disabled:opacity-50"
                    >
                      {aiLoading === 'summary' ? (
                        <Loader2 className="animate-spin" size={10} />
                      ) : (
                        <Sparkles size={10} />
                      )}
                      AI Auto-Generate
                    </button>
                  </div>
                  <textarea
                    rows={6}
                    value={localResume.personalInfo.summary}
                    onChange={(e) => handlePersonalInfoChange('summary', e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>
              </motion.div>
            )}

            {activeTab === 'experience' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Experience Blocks</span>
                  <button
                    onClick={handleAddExperience}
                    className="text-xs px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium rounded-lg flex items-center gap-1 hover:bg-purple-500/20 transition-all"
                  >
                    <Plus size={12} /> Add Job
                  </button>
                </div>

                {localResume.experience.map((exp, idx) => (
                  <div key={exp.id} className="p-4 rounded-xl border border-border bg-muted/10 space-y-3 relative group">
                    <button
                      onClick={() => handleRemoveExperience(idx)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">Company</label>
                        <input
                          type="text"
                          value={exp.company}
                          onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">Role Title</label>
                        <input
                          type="text"
                          value={exp.role}
                          onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">Duration (e.g. 2022 - Present)</label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={(e) => handleExperienceChange(idx, 'location', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">Description & Achievements</label>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => handleAIExperience(idx)}
                            disabled={aiLoading === `exp-${idx}`}
                            className="text-[9px] text-purple-400 hover:text-purple-300 font-semibold flex items-center gap-0.5"
                          >
                            {aiLoading === `exp-${idx}` ? <Loader2 size={8} className="animate-spin" /> : <Sparkles size={8} />}
                            Gen Bullets
                          </button>
                          <button
                            type="button"
                            onClick={() => handleAIRewriteExp(idx)}
                            disabled={aiLoading === `rewrite-${idx}`}
                            className="text-[9px] text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-0.5"
                          >
                            {aiLoading === `rewrite-${idx}` ? <Loader2 size={8} className="animate-spin" /> : <RefreshCw size={8} />}
                            AI Polish
                          </button>
                        </div>
                      </div>
                      <textarea
                        rows={4}
                        value={exp.description}
                        onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                        className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'education' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Education Blocks</span>
                  <button
                    onClick={handleAddEducation}
                    className="text-xs px-2.5 py-1 bg-purple-500/10 border border-purple-500/20 text-purple-300 font-medium rounded-lg flex items-center gap-1 hover:bg-purple-500/20 transition-all"
                  >
                    <Plus size={12} /> Add School
                  </button>
                </div>

                {localResume.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-xl border border-border bg-muted/10 space-y-3 relative">
                    <button
                      onClick={() => handleRemoveEducation(idx)}
                      className="absolute top-2 right-2 p-1 text-muted-foreground hover:text-red-400 hover:bg-red-500/10 rounded"
                    >
                      <Trash2 size={14} />
                    </button>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">School / University</label>
                        <input
                          type="text"
                          value={edu.school}
                          onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">Degree / Major</label>
                        <input
                          type="text"
                          value={edu.degree}
                          onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">Graduation Date (e.g. 2024)</label>
                        <input
                          type="text"
                          value={edu.graduationDate}
                          onChange={(e) => handleEducationChange(idx, 'graduationDate', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-muted-foreground block">GPA / Grade (Optional)</label>
                        <input
                          type="text"
                          value={edu.gpa}
                          onChange={(e) => handleEducationChange(idx, 'gpa', e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}

            {activeTab === 'skills' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Add Technical Skill</label>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleAddSkill(skillInput);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      placeholder="e.g. React"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      className="flex-1 px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-sm focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button
                      type="submit"
                      className="px-3 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm"
                    >
                      Add
                    </button>
                  </form>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {localResume.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1.5"
                    >
                      {skill}
                      <button
                        onClick={() => handleRemoveSkill(idx)}
                        className="text-purple-400 hover:text-purple-200"
                      >
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>

                {/* AI Suggestions block */}
                <div className="border-t border-border pt-4 mt-4 space-y-2">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">AI Suggested Skills</span>
                  <div className="flex flex-wrap gap-1.5">
                    {['PostgreSQL', 'TypeScript', 'Node.js', 'Express', 'React', 'Prisma', 'Tailwind', 'Docker']
                      .filter(s => !localResume.skills.includes(s))
                      .map((skill) => (
                        <button
                          key={skill}
                          onClick={() => handleAddSkill(skill)}
                          className="px-2 py-0.5 border border-border hover:border-purple-500/30 hover:bg-purple-500/5 text-muted-foreground hover:text-purple-300 text-[10px] font-medium rounded transition-all"
                        >
                          + {skill}
                        </button>
                      ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'template' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Choose Resume Design</span>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'modern', name: 'Modern', desc: 'Clean slate' },
                    { id: 'creative', name: 'Creative', desc: 'Sleek colors' },
                    { id: 'minimalist', name: 'Minimalist', desc: 'Elegant serif' }
                  ].map((temp) => (
                    <button
                      key={temp.id}
                      onClick={() => handleFieldChange('templateId', temp.id)}
                      className={`p-3 rounded-xl border text-left space-y-1.5 transition-all ${
                        localResume.templateId === temp.id
                          ? 'border-purple-500 bg-purple-500/5 text-purple-300'
                          : 'border-border hover:border-white/10 hover:bg-muted/20'
                      }`}
                    >
                      <span className="font-bold text-xs block">{temp.name}</span>
                      <span className="text-[10px] text-muted-foreground">{temp.desc}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'ats' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block">Target Job Description</label>
                  <textarea
                    placeholder="Paste job details here to evaluate keyword matching..."
                    rows={6}
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-muted/40 rounded-lg border border-border text-foreground text-xs focus:outline-none focus:ring-1 focus:ring-purple-500 resize-none"
                  />
                </div>

                <button
                  onClick={handleCalculateScore}
                  disabled={aiLoading === 'ats' || !jobDescription}
                  className="w-full py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  {aiLoading === 'ats' ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                  Analyze Keywords & Score
                </button>

                {atsReport && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-xl border border-white/5 bg-muted/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider">ATS Score</span>
                      <span className={`text-base font-bold flex items-center gap-1 ${
                        atsReport.score > 70 ? 'text-emerald-400' : 'text-amber-400'
                      }`}>
                        {atsReport.score > 70 ? <CheckCircle size={16} /> : <AlertTriangle size={16} />} {atsReport.score}/100
                      </span>
                    </div>

                    <p className="text-[11px] text-muted-foreground leading-normal">{atsReport.feedback}</p>

                    <div className="space-y-1.5 border-t border-border pt-3">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide block">Recommendations:</span>
                      <ul className="space-y-1 text-[10px] text-amber-300">
                        {atsReport.suggestions.map((sug, idx) => (
                          <li key={idx} className="flex items-start gap-1">
                            <span>•</span> <span>{sug}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Right Hand: Live Preview Panel (7 Cols) */}
        <div className="lg:col-span-7 flex justify-center bg-muted/20 p-6 rounded-2xl border border-border/50 relative overflow-hidden print:bg-white print:p-0 print:border-none">
          <div className="absolute top-2 left-2 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-muted/80 border border-border text-[10px] text-muted-foreground print:hidden">
            <Layout size={10} /> Page Width: 595px (A4 Scale)
          </div>
          <div className="w-full max-w-[595px] print:w-full">
            {renderTemplatePreview()}
          </div>
        </div>
      </div>
    </div>
  );
};
