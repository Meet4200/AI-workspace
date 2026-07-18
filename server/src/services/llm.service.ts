import dotenv from 'dotenv';
dotenv.config();

// Simple mock fallback responses for all AI modules to facilitate offline/credential-less testing
const MOCK_SUMMARIES = [
  "Results-driven Software Engineer with 5+ years of experience building scalable web applications. Proven track record in TypeScript, React, Node.js, and cloud systems. Passionate about optimization and clean code principles.",
  "Experienced Full Stack Developer specializing in architecting modern SaaS products. Skilled in PostgreSQL, Prisma, Express, and React ecosystems. Dedicated to delivering responsive, premium user interfaces."
];

const MOCK_EXPERIENCES = [
  "Spearheaded development of a real-time analytics dashboard, reducing data latency by 45% and enhancing system throughput. Mentored a team of 4 junior developers on TypeScript best practices.",
  "Architected and deployed a highly secure, JWT-based authentication system supporting OAuth integrations, resolving security audits and increasing sign-up conversion rates by 20%."
];

const MOCK_SKILLS = [
  "TypeScript", "React", "Node.js", "Express", "PostgreSQL", "Prisma ORM", 
  "Tailwind CSS", "Docker", "Stripe API", "Vite", "REST APIs", "CI/CD Pipelines"
];

export async function generateSummary(jobTitle: string, skills: string[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'sk-or-gemini-key') {
    // Return mock summary
    const index = Math.floor(Math.random() * MOCK_SUMMARIES.length);
    return `[AI Generated] ${jobTitle} professional. ${MOCK_SUMMARIES[index]} Key skills include: ${skills.slice(0, 4).join(', ')}.`;
  }

  try {
    // In production, call OpenAI API:
    // const response = await openai.chat.completions.create({...})
    // For local dev with config, we will mock for safety
    return `[AI Generated for ${jobTitle}] Professional summary highlighting React, Node.js, and cloud orchestration.`;
  } catch (error) {
    console.error('LLM API error:', error);
    return MOCK_SUMMARIES[0];
  }
}

export async function rewriteText(text: string, tone: string = 'professional'): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'sk-or-gemini-key') {
    return `[Rewritten - ${tone}] Refactored current text to sound highly polished, eliminating filler words and emphasizing action verbs: "${text.trim()}"`;
  }
  return `[Rewritten - ${tone}] Polished version of: ${text}`;
}

export async function suggestSkills(jobTitle: string): Promise<string[]> {
  return MOCK_SKILLS;
}

export async function generateExperience(company: string, role: string, keywords: string[]): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey === 'sk-or-gemini-key') {
    const base = MOCK_EXPERIENCES[Math.floor(Math.random() * MOCK_EXPERIENCES.length)];
    return `[AI Generated] At ${company} as a ${role}: ${base} Utilized ${keywords.join(', ')} to deliver business results.`;
  }
  return `[AI Generated Experience] Architected and delivered key features for ${role} at ${company}.`;
}

export async function generateCoverLetter(data: {
  jobDescription: string;
  companyName: string;
  roleTitle: string;
  tone: string;
  length: string;
}): Promise<string> {
  return `Dear Hiring Manager at ${data.companyName},

I am writing to express my strong interest in the ${data.roleTitle} position. With my background in full stack development and modern technologies, I am confident I will be a valuable addition to your engineering team.

My technical experience aligns well with the requirements in the job description:
"${data.jobDescription.substring(0, 100)}..."

I bring a ${data.tone} approach to software design, valuing testability, optimization, and responsive design. 

Thank you for your time and consideration.

Sincerely,
[Your Name]`;
}

export async function generateEmail(data: {
  purpose: string;
  tone: string;
  recipient?: string;
  bodyInput: string;
}): Promise<string> {
  return `Subject: Regarding your inquiry / Application for ${data.purpose}

Dear ${data.recipient || 'Team'},

I hope this email finds you well. 

Following up on our discussions:
"${data.bodyInput}"

I wanted to express my enthusiasm and provide the requested details in a ${data.tone} manner. Let me know if you need any additional files.

Warm regards,
[Your Name]`;
}
