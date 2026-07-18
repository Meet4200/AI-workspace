import { Request, Response } from 'express';
import prisma from '../config/db.js';
import {
  generateSummary,
  rewriteText,
  suggestSkills,
  generateExperience
} from '../services/llm.service.js';

export async function getResumes(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const resumes = await prisma.resume.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    });
    return res.status(200).json({ resumes });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function getResumeById(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const resume = await prisma.resume.findFirst({
      where: { id, userId },
      include: { history: { orderBy: { version: 'desc' } } }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Not Found', message: 'Resume not found' });
    }

    return res.status(200).json({ resume });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function createResume(req: Request, res: Response) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const defaultInfo = { name: '', email: '', phone: '', summary: '', socialLinks: [] };
  const emptyArray = [] as any[];

  try {
    // Check user credits
    const credit = await prisma.credit.findUnique({ where: { userId } });
    if (credit && credit.balance < 5) {
      return res.status(403).json({ error: 'Forbidden', message: 'Insufficient credits (5 credits required)' });
    }

    const resume = await prisma.resume.create({
      data: {
        userId,
        title: 'Untitled Resume',
        templateId: 'modern',
        personalInfo: defaultInfo,
        experience: emptyArray,
        education: emptyArray,
        skills: emptyArray,
        atsScore: 35 // Base score for empty resume
      }
    });

    // Deduct credits and log history
    if (credit) {
      await prisma.credit.update({
        where: { userId },
        data: { balance: { decrement: 5 } }
      });
      
      await prisma.history.create({
        data: {
          userId,
          module: 'RESUME',
          action: 'GENERATE',
          creditsUsed: 5
        }
      });
    }

    return res.status(201).json({ resume });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function updateResume(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;
  const { title, templateId, personalInfo, experience, education, skills, saveVersion } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const resume = await prisma.resume.findFirst({
      where: { id, userId }
    });

    if (!resume) {
      return res.status(404).json({ error: 'Not Found', message: 'Resume not found' });
    }

    // Calculate dynamic ATS score
    let score = 35;
    if (personalInfo?.name && personalInfo?.email) score += 15;
    if (personalInfo?.summary && personalInfo?.summary.length > 20) score += 15;
    if (Array.isArray(experience) && experience.length > 0) score += 20;
    if (Array.isArray(education) && education.length > 0) score += 10;
    if (Array.isArray(skills) && skills.length > 0) score += 10;

    const nextVersion = resume.version + 1;

    const updatedResume = await prisma.resume.update({
      where: { id },
      data: {
        title,
        templateId,
        personalInfo,
        experience,
        education,
        skills,
        atsScore: score,
        version: nextVersion
      }
    });

    // Save version history if requested
    if (saveVersion) {
      await prisma.resumeVersion.create({
        data: {
          resumeId: id,
          version: resume.version,
          data: {
            title: resume.title,
            templateId: resume.templateId,
            personalInfo: resume.personalInfo,
            experience: resume.experience,
            education: resume.education,
            skills: resume.skills
          }
        }
      });
    }

    return res.status(200).json({ resume: updatedResume });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

export async function deleteResume(req: Request, res: Response) {
  const userId = req.user?.id;
  const { id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const resume = await prisma.resume.findFirst({ where: { id, userId } });
    if (!resume) {
      return res.status(404).json({ error: 'Not Found', message: 'Resume not found' });
    }

    await prisma.resume.delete({ where: { id } });
    return res.status(200).json({ message: 'Resume deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}

// AI helpers
export async function getAIExtractedScore(req: Request, res: Response) {
  const { jobDescription, skills } = req.body;
  if (!jobDescription) {
    return res.status(400).json({ error: 'Validation Error', message: 'Job description is required' });
  }

  // Basic mock keyword matching algorithm
  const words = jobDescription.toLowerCase().split(/\W+/);
  const userSkills = (skills || []).map((s: string) => s.toLowerCase());
  
  let matches = 0;
  userSkills.forEach((skill: string) => {
    if (words.includes(skill)) {
      matches++;
    }
  });

  const baseMatchScore = Math.min(Math.round((matches / Math.max(userSkills.length, 1)) * 100), 100);
  const finalAtsScore = userSkills.length === 0 ? 10 : Math.max(30, baseMatchScore);

  const keywordsNeeded = ['System Design', 'CI/CD Pipelines', 'AWS Cloud', 'Unit Testing']
    .filter(kw => !words.includes(kw.toLowerCase()));

  return res.status(200).json({
    score: finalAtsScore,
    matchRatio: `${matches}/${userSkills.length}`,
    feedback: finalAtsScore > 75 
      ? 'Excellent matching! Your resume strongly resonates with the role keywords.'
      : 'Moderate matching. Consider incorporating missing keywords into your skills and experience section.',
    suggestions: keywordsNeeded.map(kw => `Add skill or experience relating to: "${kw}"`)
  });
}

export async function suggestSkillsAPI(req: Request, res: Response) {
  const { jobTitle } = req.query;
  try {
    const skills = await suggestSkills(String(jobTitle || 'Software Engineer'));
    return res.status(200).json({ skills });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function rewriteTextAPI(req: Request, res: Response) {
  const { text, tone } = req.body;
  if (!text) {
    return res.status(400).json({ error: 'Text input is required' });
  }
  try {
    const rewritten = await rewriteText(text, tone);
    return res.status(200).json({ rewritten });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function generateSummaryAPI(req: Request, res: Response) {
  const { jobTitle, skills } = req.body;
  if (!jobTitle) {
    return res.status(400).json({ error: 'Job title is required' });
  }
  try {
    const summary = await generateSummary(jobTitle, skills || []);
    return res.status(200).json({ summary });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}

export async function generateExperienceAPI(req: Request, res: Response) {
  const { company, role, keywords } = req.body;
  if (!company || !role) {
    return res.status(400).json({ error: 'Company and role are required' });
  }
  try {
    const bulletPoint = await generateExperience(company, role, keywords || []);
    return res.status(200).json({ bulletPoint });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
