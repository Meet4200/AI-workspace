import React from 'react';

interface ResumeData {
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
}

interface TemplateProps {
  data: ResumeData;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;
  return (
    <div className="bg-white text-slate-800 p-8 shadow-inner font-sans min-h-[842px] max-w-[595px] mx-auto text-left flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="border-b-2 border-purple-600 pb-4 mb-6">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">{personalInfo.name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-slate-600 font-medium">
            {personalInfo.email && <span>Email: {personalInfo.email}</span>}
            {personalInfo.phone && <span>Phone: {personalInfo.phone}</span>}
            {personalInfo.socialLinks?.map((link, idx) => (
              <span key={idx}>{link}</span>
            ))}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-700 mb-2">Professional Summary</h2>
            <p className="text-xs leading-relaxed text-slate-700">{personalInfo.summary}</p>
          </div>
        )}

        <div className="grid grid-cols-3 gap-6">
          {/* Experience & Education (Left 2 cols) */}
          <div className="col-span-2 space-y-6">
            {/* Experience */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-700 border-b border-slate-200 pb-1 mb-3">
                Experience
              </h2>
              {experience.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No experience added yet.</p>
              ) : (
                <div className="space-y-4">
                  {experience.map((exp) => (
                    <div key={exp.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{exp.role}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          {exp.startDate} – {exp.endDate}
                        </span>
                      </div>
                      <div className="text-[11px] text-purple-600 font-medium mb-1">
                        {exp.company} {exp.location && `• ${exp.location}`}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Education */}
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-purple-700 border-b border-slate-200 pb-1 mb-3">
                Education
              </h2>
              {education.length === 0 ? (
                <p className="text-[11px] text-slate-400 italic">No education added yet.</p>
              ) : (
                <div className="space-y-3">
                  {education.map((edu) => (
                    <div key={edu.id} className="text-xs">
                      <div className="flex justify-between font-bold text-slate-900">
                        <span>{edu.degree}</span>
                        <span className="text-[10px] text-slate-500 font-normal">{edu.graduationDate}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {edu.school} {edu.gpa && `• GPA: ${edu.gpa}`}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills (Right 1 col) */}
          <div className="col-span-1">
            <h2 className="text-sm font-bold uppercase tracking-wider text-purple-700 border-b border-slate-200 pb-1 mb-3">
              Skills
            </h2>
            {skills.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic">No skills listed.</p>
            ) : (
              <div className="flex flex-wrap gap-1.5">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-slate-100 border border-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-[9px] text-slate-400 border-t border-slate-100 pt-4 mt-6">
        Generated by IntelliDesk AI Workspace
      </div>
    </div>
  );
};

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;
  return (
    <div className="bg-slate-50 text-slate-800 shadow-inner font-sans min-h-[842px] max-w-[595px] mx-auto text-left flex flex-col justify-between">
      <div>
        {/* Header Block */}
        <div className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white p-8">
          <h1 className="text-3xl font-extrabold tracking-tight">{personalInfo.name || 'Your Name'}</h1>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-xs text-indigo-100 font-medium">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.socialLinks?.map((link, idx) => (
              <span key={idx}>{link}</span>
            ))}
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Summary */}
          {personalInfo.summary && (
            <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
              <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">About Me</h2>
              <p className="text-xs leading-relaxed text-slate-600">{personalInfo.summary}</p>
            </div>
          )}

          <div className="grid grid-cols-3 gap-6">
            {/* Experience (Left 2 cols) */}
            <div className="col-span-2 space-y-6">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-3">
                  Work History
                </h2>
                {experience.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No experience added yet.</p>
                ) : (
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp.id} className="text-xs relative pl-4 border-l-2 border-indigo-200">
                        <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500"></div>
                        <div className="flex justify-between font-bold text-slate-900">
                          <span>{exp.role}</span>
                          <span className="text-[10px] text-slate-500 font-normal">
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 mb-1">
                          {exp.company} {exp.location && `| ${exp.location}`}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Panel (Skills & Education) */}
            <div className="col-span-1 space-y-6">
              {/* Skills */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-3">
                  Core Expertise
                </h2>
                <div className="flex flex-wrap gap-1">
                  {skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-semibold border border-indigo-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-600 border-b border-indigo-100 pb-1 mb-3">
                  Academic Info
                </h2>
                {education.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No education listed.</p>
                ) : (
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="text-xs">
                        <div className="font-bold text-slate-900">{edu.degree}</div>
                        <div className="text-[10px] text-slate-500">{edu.school}</div>
                        <div className="text-[9px] text-slate-400">Grad: {edu.graduationDate}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center text-[9px] text-slate-400 p-4 border-t border-slate-100">
        Generated by IntelliDesk AI Workspace
      </div>
    </div>
  );
};

export const MinimalistTemplate: React.FC<TemplateProps> = ({ data }) => {
  const { personalInfo, experience, education, skills } = data;
  return (
    <div className="bg-white text-slate-800 p-10 font-serif min-h-[842px] max-w-[595px] mx-auto text-left flex flex-col justify-between">
      <div>
        {/* Centered Name */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-normal text-slate-900 tracking-wide uppercase">{personalInfo.name || 'Your Name'}</h1>
          <div className="flex justify-center flex-wrap gap-3 mt-2 text-[10px] text-slate-500 font-sans">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>•</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.socialLinks?.map((link, idx) => (
              <React.Fragment key={idx}>
                <span>•</span>
                <span>{link}</span>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6 text-center">
            <p className="text-[11px] leading-relaxed text-slate-600 italic px-6">{personalInfo.summary}</p>
          </div>
        )}

        <div className="space-y-6 font-sans">
          {/* Experience */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-3 text-center">
              Experience
            </h2>
            {experience.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center">No experience added yet.</p>
            ) : (
              <div className="space-y-4">
                {experience.map((exp) => (
                  <div key={exp.id} className="text-xs">
                    <div className="flex justify-between font-bold text-slate-950">
                      <span>{exp.role} — <span className="font-normal text-slate-600">{exp.company}</span></span>
                      <span className="text-[10px] text-slate-500 font-normal">
                        {exp.startDate} – {exp.endDate}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 italic mb-1">{exp.location}</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed whitespace-pre-line">{exp.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-3 text-center">
              Education
            </h2>
            {education.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center">No education added yet.</p>
            ) : (
              <div className="space-y-3">
                {education.map((edu) => (
                  <div key={edu.id} className="text-xs flex justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{edu.degree}</span>
                      <span className="text-slate-600">, {edu.school}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">{edu.graduationDate}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b border-slate-200 pb-0.5 mb-3 text-center">
              Skills
            </h2>
            {skills.length === 0 ? (
              <p className="text-[11px] text-slate-400 italic text-center">No skills listed.</p>
            ) : (
              <p className="text-[11px] text-slate-600 text-center leading-normal">
                {skills.join(' • ')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center text-[8px] text-slate-400 font-sans border-t border-slate-100 pt-4 mt-6">
        Generated by IntelliDesk AI Workspace
      </div>
    </div>
  );
};
