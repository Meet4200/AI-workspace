// Global In-Memory Database Store for Offline/Credential-less local testing
export class MockStore {
  static resumes: any[] = [];
  static coverLetters: any[] = [];
  static emails: any[] = [];
  static pdfDocuments: any[] = [];
  static pdfChats: any[] = [];
  static meetings: any[] = [];
  static interviews: any[] = [];
  static captions: any[] = [];
  static payments: any[] = [];
  static users: any[] = [];

  static initialize() {
    if (this.resumes.length === 0) {
      this.resumes = [
        {
          id: 'mock-resume-1',
          userId: 'mock-admin-id-12345',
          title: 'Senior Software Engineer Resume',
          templateId: 'modern',
          personalInfo: {
            name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '+1 (555) 019-2834',
            summary: 'Experienced full stack engineer specializing in React, Node.js, and scalable cloud architectures.',
            socialLinks: { github: 'github.com/johndoe', linkedin: 'linkedin.com/in/johndoe' }
          },
          experience: [
            { company: 'TechCorp', role: 'Senior Engineer', duration: '2022 - Present', description: 'Led frontend migration to React, improving core web vitals by 40%.' }
          ],
          education: [
            { institution: 'State University', degree: 'B.S. Computer Science', duration: '2015 - 2019' }
          ],
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker'],
          atsScore: 85,
          version: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    if (this.coverLetters.length === 0) {
      this.coverLetters = [
        {
          id: 'mock-cover-1',
          userId: 'mock-admin-id-12345',
          title: 'Google Senior Engineer Cover Letter',
          companyName: 'Google',
          roleTitle: 'Senior Full Stack Engineer',
          jobDescription: 'Looking for a Senior Full Stack Engineer with expertise in TypeScript and Node.',
          tone: 'professional',
          length: 'medium',
          content: `Dear Hiring Team,\n\nI am writing to express my strong interest in the Senior Full Stack Engineer position at Google. With over 8 years of experience building scalable systems and polished user interfaces, I am confident in my ability to contribute to your engineering excellence.\n\nSincerely,\nJohn Doe`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    if (this.emails.length === 0) {
      this.emails = [
        {
          id: 'mock-email-1',
          userId: 'mock-admin-id-12345',
          subject: 'Application follow-up: Senior Engineer',
          body: `Hi Hiring Manager,\n\nI hope this email finds you well. I am following up on my application for the Senior Engineer role. I remain highly interested in the opportunity.\n\nBest regards,\nJohn`,
          purpose: 'follow_up',
          tone: 'professional',
          recipient: 'hiring@google.com',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    if (this.pdfDocuments.length === 0) {
      this.pdfDocuments = [
        {
          id: 'mock-pdf-1',
          userId: 'mock-admin-id-12345',
          name: 'React_Optimization_Guide.pdf',
          type: 'PDF',
          fileUrl: '/uploads/react_optimization.pdf',
          content: 'React Server Components optimize initial page loading. Caching API calls with React Query minimizes server roundtrips. Memoization reduces re-renders.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    if (this.meetings.length === 0) {
      this.meetings = [
        {
          id: 'mock-meeting-1',
          userId: 'mock-admin-id-12345',
          title: 'Project Kickoff Meeting',
          audioUrl: '/uploads/meeting.wav',
          transcript: `Speaker 1: Welcome to the kick-off meeting. Today we align on target milestones.
Speaker 2: I will build the database schemas.
Speaker 1: Great. Let's aim to finish by Friday.`,
          summary: 'The team discussed kickoff alignments and scheduled schema designs to be completed by Friday.',
          actionItems: ['Complete database schema layout (Developer)', 'Finalize UI wireframes (Designer)'],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];
    }

    if (this.interviews.length === 0) {
      this.interviews = [
        {
          id: 'mock-interview-1',
          userId: 'mock-admin-id-12345',
          position: 'React Architect',
          transcript: [
            { question: 'What is the virtual DOM?', answer: 'It is a lightweight representation of the real DOM used for reconciliation.', evaluation: 'Correct definition and clear delivery.' }
          ],
          confidenceScore: 85,
          communicationScore: 90,
          suggestions: ['Use standard behavioral structured examples (STAR method)'],
          createdAt: new Date().toISOString()
        }
      ];
    }

    if (this.captions.length === 0) {
      this.captions = [
        {
          id: 'mock-caption-1',
          userId: 'mock-admin-id-12345',
          imageUrl: '/uploads/code.jpg',
          instaText: 'Ready to deploy another React app! 🚀 #React #Vite #Webdev',
          linkedInText: 'Just completed migrating our client assets to Vite, dropping compile times from 15s to 3s.',
          twitterText: 'Vite makes development feel incredibly fast. ⚡ #Coding',
          hashtags: ['React', 'Vite', 'Fullstack'],
          createdAt: new Date().toISOString()
        }
      ];
    }

    if (this.payments.length === 0) {
      this.payments = [
        {
          id: 'mock-payment-1',
          userId: 'mock-admin-id-12345',
          stripeInvoiceId: 'inv_kickstart',
          amount: 1000,
          currency: 'usd',
          status: 'paid',
          createdAt: new Date().toISOString()
        }
      ];
    }
  }
}

MockStore.initialize();
export default MockStore;
