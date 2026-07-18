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
          title: 'Senior Full Stack Engineer - AI & Web',
          templateId: 'modern',
          personalInfo: {
            name: 'Alex Rivera',
            email: 'alex.rivera@intellidesk.ai',
            phone: '+1 (415) 555-0192',
            summary: 'Senior Full Stack Engineer with 8+ years of experience specializing in React, TypeScript, Node.js, and distributed microservices architectures. Passionate about developer tooling and performance optimization.',
            socialLinks: { github: 'github.com/alexrivera', linkedin: 'linkedin.com/in/alexrivera' }
          },
          experience: [
            { company: 'Stripe', role: 'Staff Engineer', duration: '2022 - Present', description: 'Architected credit ledger APIs handling 5M+ transaction updates daily. Guided development of internal UI libraries using React and Tailwind CSS.' },
            { company: 'Vercel', role: 'Senior Software Engineer', duration: '2019 - 2022', description: 'Contributed core enhancements to Next.js routing performance. Reduced runtime bundle sizes by 18% across serverless modules.' }
          ],
          education: [
            { institution: 'Stanford University', degree: 'M.S. in Computer Science', duration: '2017 - 2019' }
          ],
          skills: ['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'Kubernetes', 'Next.js'],
          atsScore: 92,
          version: 1,
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-resume-2',
          userId: 'mock-admin-id-12345',
          title: 'Machine Learning & NLP Specialist',
          templateId: 'minimalist',
          personalInfo: {
            name: 'Sarah Chen',
            email: 'sarah.chen@ai-labs.org',
            phone: '+1 (650) 555-9831',
            summary: 'AI Research Scientist specializing in Natural Language Processing and Large Language Model fine-tuning. Experienced in training transformer models and integrating custom vector search indices.',
            socialLinks: { github: 'github.com/schen-nlp', linkedin: 'linkedin.com/in/sarahchen' }
          },
          experience: [
            { company: 'OpenAI', role: 'Research Engineer', duration: '2023 - Present', description: 'Fine-tuned internal code-generation models. Optimized context-window utilization algorithms reducing inference overhead.' },
            { company: 'Hugging Face', role: 'ML Engineer', duration: '2021 - 2023', description: 'Developed open-source tokenizer wrappers and optimized model loading for Edge deployments using WebAssembly.' }
          ],
          education: [
            { institution: 'MIT', degree: 'Ph.D. in Artificial Intelligence', duration: '2016 - 2021' }
          ],
          skills: ['PyTorch', 'Python', 'Transformers', 'LLMs', 'FAISS', 'Pinecone', 'CUDA', 'Git'],
          atsScore: 89,
          version: 1,
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-resume-3',
          userId: 'mock-admin-id-12345',
          title: 'Technical Product Manager - SaaS',
          templateId: 'professional',
          personalInfo: {
            name: 'David Kojo',
            email: 'david.kojo@saasgrowth.com',
            phone: '+1 (212) 555-7384',
            summary: 'Technical PM with a background in software development. Proven track record of launching developer-focused platforms, increasing developer signups by 150%, and driving product roadmap strategy.',
            socialLinks: { github: 'github.com/dkojo-pm', linkedin: 'linkedin.com/in/davidkojo' }
          },
          experience: [
            { company: 'Datadog', role: 'Senior Product Manager', duration: '2022 - Present', description: 'Managed core monitoring dashboard products. Defined user stories and technical scope for real-time visualization widgets.' },
            { company: 'Twilio', role: 'Product Manager', duration: '2020 - 2022', description: 'Launched voice API enhancements. Collaborated with core engineering to establish high-throughput API SLAs.' }
          ],
          education: [
            { institution: 'UC Berkeley', degree: 'B.S. in Electrical Engineering & Computer Science', duration: '2014 - 2018' }
          ],
          skills: ['Product Strategy', 'SaaS Metrics', 'Agile/Scrum', 'API Design', 'System Architecture', 'SQL', 'Data Analytics'],
          atsScore: 87,
          version: 1,
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-resume-4',
          userId: 'mock-admin-id-12345',
          title: 'DevOps & Cloud Infrastructure Architect',
          templateId: 'creative',
          personalInfo: {
            name: 'Elena Rostova',
            email: 'elena.rostova@cloudops.net',
            phone: '+1 (312) 555-4921',
            summary: 'DevOps Architect with 10 years of expertise building resilient cloud infrastructures. Expert in AWS, infrastructure-as-code (Terraform), and automated CI/CD pipelines for Kubernetes deployments.',
            socialLinks: { github: 'github.com/elenaops', linkedin: 'linkedin.com/in/elenarostova' }
          },
          experience: [
            { company: 'HashiCorp', role: 'Solutions Architect', duration: '2021 - Present', description: 'Designed high-availability architectures for enterprise Terraform setups. Conducted infrastructure reviews for Fortune 500 tech clients.' },
            { company: 'Amazon Web Services', role: 'Cloud Engineer', duration: '2017 - 2021', description: 'Managed container deployments on ECS and EKS. Automated regional failover services reducing downtime by 35%.' }
          ],
          education: [
            { institution: 'Georgia Tech', degree: 'B.S. in Computer Engineering', duration: '2013 - 2017' }
          ],
          skills: ['AWS', 'Terraform', 'Kubernetes', 'Docker', 'GitHub Actions', 'Prometheus', 'Grafana', 'Python'],
          atsScore: 94,
          version: 1,
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-resume-5',
          userId: 'mock-admin-id-12345',
          title: 'UI/UX Product Designer',
          templateId: 'creative',
          personalInfo: {
            name: 'Marcus Vance',
            email: 'marcus.vance@designstudios.com',
            phone: '+1 (510) 555-3810',
            summary: 'Product Designer focusing on interactive dashboards, visual design systems, and web application usability. Skilled in translating complex database configurations into intuitive interactive controls.',
            socialLinks: { github: 'github.com/mvance-design', linkedin: 'linkedin.com/in/marcusvance' }
          },
          experience: [
            { company: 'Figma', role: 'Senior Product Designer', duration: '2022 - Present', description: 'Designed properties editor interactions. Established grid system guidelines and color variables for dark-mode interfaces.' },
            { company: 'Airbnb', role: 'Interaction Designer', duration: '2019 - 2022', description: 'Created prototyping animations. Maintained cross-platform component libraries for React Web and React Native.' }
          ],
          education: [
            { institution: 'Rhode Island School of Design', degree: 'B.F.A. in Industrial Design', duration: '2014 - 2018' }
          ],
          skills: ['Figma', 'Design Systems', 'Wireframing', 'Prototyping', 'CSS/HTML', 'User Research', 'Motion Design'],
          atsScore: 82,
          version: 1,
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
        }
      ];
    }

    if (this.coverLetters.length === 0) {
      this.coverLetters = [
        {
          id: 'mock-cover-1',
          userId: 'mock-admin-id-12345',
          title: 'Google - Senior Staff Engineer Letter',
          companyName: 'Google',
          roleTitle: 'Senior Full Stack Engineer',
          jobDescription: 'Looking for a Senior Full Stack Engineer with expertise in TypeScript, React, and high-performance server side rendering architectures.',
          tone: 'professional',
          length: 'medium',
          content: `Dear Hiring Team,\n\nI am writing to express my strong interest in the Senior Full Stack Engineer position at Google. Having spent the last eight years scaling web infrastructures and enhancing core web vitals across complex consumer SaaS platforms, I am thrilled by the prospect of contributing to your search-related developer ecosystems.\n\nAt Stripe, I pioneered responsive dashboard features which minimized render latency by 30%. I am eager to bring this same dedication to performance optimization to Google's engineering team.\n\nThank you for your time and consideration.\n\nSincerely,\nAlex Rivera`,
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-cover-2',
          userId: 'mock-admin-id-12345',
          title: 'OpenAI - AI Systems Engineer Letter',
          companyName: 'OpenAI',
          roleTitle: 'AI Research Engineer',
          jobDescription: 'Seeking an ML systems engineer with custom training experience and deep understanding of transformer context architectures.',
          tone: 'bold',
          length: 'medium',
          content: `Dear OpenAI Recruiters,\n\nArtificial Intelligence is reshaping how humanity accesses, creates, and synthesizes code. I am writing to apply for the Research Engineer role, bringing a robust background in large-scale NLP tokenizer tuning and custom GPU parallelization systems.\n\nDuring my Ph.D. at MIT, I published benchmark studies on transformer cache optimizations. Joining OpenAI represents the logical next step in applying my research directly to models serving millions of developers globally. Let us build the future of agentic coding together.\n\nBest regards,\nSarah Chen`,
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-cover-3',
          userId: 'mock-admin-id-12345',
          title: 'Stripe - Technical PM Application',
          companyName: 'Stripe',
          roleTitle: 'Technical Product Manager',
          jobDescription: 'Help build Stripe Billing APIs. Strong developer empathy, software development background, and SaaS subscription knowledge required.',
          tone: 'professional',
          length: 'medium',
          content: `Dear Stripe Product Team,\n\nDeveloper tools work best when they focus on simplicity, consistency, and clear API boundaries. I am writing to apply for the Technical PM position on the Stripe Billing product group.\n\nAs a software developer who transitioned to Product Management at Datadog, I understand how crucial it is to design APIs that feel natural and developer-friendly. I have guided several billing migrations from legacy structures to automated recurring streams. I would love to shape the future of international transaction ledgers at Stripe.\n\nSincerely,\nDavid Kojo`,
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-cover-4',
          userId: 'mock-admin-id-12345',
          title: 'Netflix - Senior Cloud DevOps Engineer',
          companyName: 'Netflix',
          roleTitle: 'Senior Cloud DevOps Engineer',
          jobDescription: 'Build high-availability global streaming network overlays. Extensive Kubernetes and regional multi-cloud failure simulation experience.',
          tone: 'warm',
          length: 'medium',
          content: `Dear Netflix Infrastructure Team,\n\nI have spent the last half-decade orchestrating containerized architectures that withstand peak user traffic surges. I am writing to apply for the DevOps Architect position, combining my automation expertise with your world-famous cloud engineering culture.\n\nAt AWS, I automated multi-region backup systems that safely recovered services in under 12 seconds during real-time drills. I admire Netflix's Chaos Monkey philosophy, and I would be thrilled to help maintain system stability for your global user base.\n\nWarmly,\nElena Rostova`,
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-cover-5',
          userId: 'mock-admin-id-12345',
          title: 'Airbnb - Staff UI designer application',
          companyName: 'Airbnb',
          roleTitle: 'Staff UX/UI Designer',
          jobDescription: 'Looking for a Staff Designer to lead our new guest travel maps experiences. Experience building complex design systems required.',
          tone: 'bold',
          length: 'medium',
          content: `Dear Design Recruiters,\n\nDesign is not just what a product looks like; it is how it behaves and communicates trust. I am applying for the Staff UX/UI Designer role, bringing a passion for micro-animations and unified component tokens.\n\nAt Figma, I designed interactive panels that reduced clicks by 20% for power users. I look forward to bringing this user-first focus to Airbnb's travel mapping experiences.\n\nBest,\nMarcus Vance`,
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
        }
      ];
    }

    if (this.emails.length === 0) {
      this.emails = [
        {
          id: 'mock-email-1',
          userId: 'mock-admin-id-12345',
          subject: 'Pitch: Automated LLM Workspaces - IntelliDesk AI',
          body: `Hi Sarah,\n\nI hope you are having a productive week.\n\nI am pitching IntelliDesk AI, an integrated workstation where developers access multi-tool AI panels (resume builders, OCR caption generators, and transcript parsers) under one unified credits dashboard.\n\nWe have achieved 1,200 active signups in our first month. I would love to schedule a quick 10-minute demo this Thursday if your team has availability.\n\nBest,\nAlex Rivera\nFounder, IntelliDesk`,
          purpose: 'cold_outreach',
          tone: 'bold',
          recipient: 'investments@sequoiacap.com',
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-email-2',
          userId: 'mock-admin-id-12345',
          subject: 'Follow up: Staff ML Engineer Application',
          body: `Dear Hiring Team,\n\nI hope this message finds you well. I am following up on my application for the Staff ML Engineer position at OpenAI.\n\nI wanted to share my recent publication on transformer token optimization, which matches several goals listed in your team's roadmap. I remain extremely excited about the opportunity.\n\nBest regards,\nSarah Chen`,
          purpose: 'application',
          tone: 'professional',
          recipient: 'jobs@openai.com',
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-email-3',
          userId: 'mock-admin-id-12345',
          subject: 'Thank you for the interview: Product Manager Role',
          body: `Hi Julia,\n\nThank you for taking the time to discuss the Stripe Billing PM position with me yesterday. I enjoyed our conversation about API lifecycle versioning and billing SLAs.\n\nOur chat confirmed my enthusiasm for Stripe's dev-centric culture. I look forward to hearing about the next steps.\n\nBest,\nDavid Kojo`,
          purpose: 'thank_you',
          tone: 'warm',
          recipient: 'julia.recruiter@stripe.com',
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-email-4',
          userId: 'mock-admin-id-12345',
          subject: 'Client Pitch: Cloud Infrastructure Migration Project',
          body: `Hi Thomas,\n\nFollowing our brief chat at the tech summit, I prepared a summary of how migrating your legacy servers to AWS container pods could reduce your monthly cloud bill by up to 25%.\n\nI have attached our previous migration case studies. Please let me know if you would like to discuss next Tuesday.\n\nWarm regards,\nElena Rostova`,
          purpose: 'cold_outreach',
          tone: 'professional',
          recipient: 'thomas.director@legacycorp.com',
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-email-5',
          userId: 'mock-admin-id-12345',
          subject: 'Resignation Notice - Marcus Vance',
          body: `Dear Tech Lead,\n\nPlease accept this email as formal notification that I am resigning from my position as Product Designer, with my last day being August 4th.\n\nThank you for the support and opportunities during my time here. I will ensure a smooth handover of Figma design files before my departure.\n\nSincerely,\nMarcus Vance`,
          purpose: 'resignation',
          tone: 'professional',
          recipient: 'lead@designstudios.com',
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
        }
      ];
    }

    if (this.pdfDocuments.length === 0) {
      this.pdfDocuments = [
        {
          id: 'mock-pdf-1',
          userId: 'mock-admin-id-12345',
          name: 'React_Core_Optimization_2026.pdf',
          type: 'PDF',
          fileUrl: '/uploads/react_optimization.pdf',
          content: 'React Server Components optimize initial page loading. Caching API calls with React Query minimizes server roundtrips. Memoization reduces re-renders. Always load heavy routes dynamically.',
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-pdf-2',
          userId: 'mock-admin-id-12345',
          name: 'PostgreSQL_Query_Indexing_SLA.pdf',
          type: 'PDF',
          fileUrl: '/uploads/postgres_indexes.pdf',
          content: 'B-Tree indexes speed up single column searches. Partial indexes filter null values, saving memory. Use EXPLAIN ANALYZE to diagnose sluggish query plans.',
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-pdf-3',
          userId: 'mock-admin-id-12345',
          name: 'Docker_Production_Containerization.pdf',
          type: 'PDF',
          fileUrl: '/uploads/docker_best_practices.pdf',
          content: 'Multi-stage builds decrease final image sizes. Pin version tags (like node:20-alpine) instead of using latest to prevent runtime breaking updates.',
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-pdf-4',
          userId: 'mock-admin-id-12345',
          name: 'NextJS_App_Router_Architecture.pdf',
          type: 'PDF',
          fileUrl: '/uploads/nextjs_architecture.pdf',
          content: 'Use folder groupings to organize routes without affecting URL segments. Fetch data at the component level to optimize caching and revalidation.',
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-pdf-5',
          userId: 'mock-admin-id-12345',
          name: 'Stripe_SaaS_Checkout_API_Guide.pdf',
          type: 'PDF',
          fileUrl: '/uploads/stripe_guide.pdf',
          content: 'Listen to Stripe webhooks (like invoice.paid) to provision user credits. Secure webhook payloads by verifying header signatures.',
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
        }
      ];
    }

    if (this.meetings.length === 0) {
      this.meetings = [
        {
          id: 'mock-meeting-1',
          userId: 'mock-admin-id-12345',
          title: 'Sprint Planning Meeting',
          audioUrl: '/uploads/meeting.wav',
          transcript: `Speaker 1: Welcome to the kick-off meeting. Today we align on target milestones.
Speaker 2: I will build the database schemas.
Speaker 1: Great. Let's aim to finish by Friday.`,
          summary: 'The team discussed kickoff alignments and scheduled schema designs to be completed by Friday.',
          actionItems: ['Complete database schema layout (Developer)', 'Finalize UI wireframes (Designer)'],
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-meeting-2',
          userId: 'mock-admin-id-12345',
          title: 'NextJS Architecture Review',
          audioUrl: '/uploads/meeting2.wav',
          transcript: `Speaker 1: Let's discuss Next.js dynamic routing.
Speaker 2: I suggest code-splitting the dashboard chunks.
Speaker 1: Agreed. It will decrease render latency.`,
          summary: 'Review of the migration plans to NextJS. Confirmed that code-splitting dashboards will resolve chunk load delays.',
          actionItems: ['Split dashboard routes into lazy imports (Frontend Lead)'],
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-meeting-3',
          userId: 'mock-admin-id-12345',
          title: 'VC Seed Pitch Sync',
          audioUrl: '/uploads/meeting3.wav',
          transcript: `Speaker 1: The investor asked for our signup metrics.
Speaker 2: We have 1,200 active users.
Speaker 1: Excellent. Let's emphasize our 40% growth week-over-week.`,
          summary: 'Prepped slide decks for investor sync. Agreed to lead with weekly registration growth metrics.',
          actionItems: ['Update signup growth slide (Founder)', 'Prepare demo workspace accounts (Technical Lead)'],
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-meeting-4',
          userId: 'mock-admin-id-12345',
          title: 'User Feedback Interview',
          audioUrl: '/uploads/meeting4.wav',
          transcript: `Speaker 1: What is your favorite feature on the dashboard?
Speaker 2: The split-screen PDF RAG chat. It saves a lot of time.
Speaker 1: Any suggestions?
Speaker 2: Add alt text options to image generation.`,
          summary: 'User research session. Highlighted RAG utility, and suggested ALT tag options for caption workspaces.',
          actionItems: ['Incorporate SEO alt text options in captions generator (UX Designer)'],
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-meeting-5',
          userId: 'mock-admin-id-12345',
          title: 'Post-Mortem: DB Connection Lag',
          audioUrl: '/uploads/meeting5.wav',
          transcript: `Speaker 1: Why did database query latencies spike yesterday?
Speaker 2: The pool connection limit was set too low.
Speaker 1: Let's increase client pool sizes and add automatic retries.`,
          summary: 'Discussed postgres pool exhaustions. Resolved to increase pool limits and establish health check retry intervals.',
          actionItems: ['Increase Prisma pool connection limit config (DevOps Lead)', 'Establish database fallback layers (Developer)'],
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString(),
          updatedAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
        }
      ];
    }

    if (this.interviews.length === 0) {
      this.interviews = [
        {
          id: 'mock-interview-1',
          userId: 'mock-admin-id-12345',
          position: 'React Frontend Architect',
          transcript: [
            { question: 'What is the virtual DOM?', answer: 'It is a lightweight representation of the real DOM used for reconciliation.', evaluation: 'Correct definition and clear delivery.' }
          ],
          confidenceScore: 85,
          communicationScore: 90,
          suggestions: ['Use standard behavioral structured examples (STAR method)', 'Detail bundle performance metrics'],
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-interview-2',
          userId: 'mock-admin-id-12345',
          position: 'System Design Interview',
          transcript: [
            { question: 'How do you scale a global ledger?', answer: 'We partition data by user id and place caches in regional endpoints.', evaluation: 'Strong caching insights, could detail master-replica replication.' }
          ],
          confidenceScore: 88,
          communicationScore: 82,
          suggestions: ['Explain fallback strategies in case caches disconnect', 'Describe database replication mechanisms'],
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-interview-3',
          userId: 'mock-admin-id-12345',
          position: 'Behavioral Leadership',
          transcript: [
            { question: 'Describe a conflict with a lead.', answer: 'We disagreed on routing models, so we built a prototype and compared metrics.', evaluation: 'Excellent compromise demonstration and data-driven approach.' }
          ],
          confidenceScore: 92,
          communicationScore: 95,
          suggestions: ['Keep conflict descriptions brief to focus on resolutions'],
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-interview-4',
          userId: 'mock-admin-id-12345',
          position: 'AI & Python Algorithms',
          transcript: [
            { question: 'Explain token masking.', answer: 'It hides parts of a sentence so models learn to predict missing words.', evaluation: 'Clear and simple explanation of MLM.' }
          ],
          confidenceScore: 80,
          communicationScore: 85,
          suggestions: ['Mention context limitations in transformer training'],
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-interview-5',
          userId: 'mock-admin-id-12345',
          position: 'SQL & Database Tuning',
          transcript: [
            { question: 'Why use partial indexes?', answer: 'They store subsets of rows, saving space when querying specific flags.', evaluation: 'Accurate insight into indexing overhead savings.' }
          ],
          confidenceScore: 90,
          communicationScore: 88,
          suggestions: ['Mention when partial index plans could be bypassed by queries'],
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
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
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-caption-2',
          userId: 'mock-admin-id-12345',
          imageUrl: '/uploads/workspace.jpg',
          instaText: 'Morning light and coffee cup: prime debugging setups. ☕✨ #CleanCode #WFH',
          linkedInText: 'Creating a clean workspace is step one to keeping software architecture clean. Focus on simplicity.',
          twitterText: 'Clean workspace = clean code. 💻 #Workplace',
          hashtags: ['Aesthetics', 'Workspace', 'Devlife'],
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-caption-3',
          userId: 'mock-admin-id-12345',
          imageUrl: '/uploads/schema.jpg',
          instaText: 'Migrated database tables! Green logs feel good. 💚 #Prisma #PostgreSQL',
          linkedInText: 'Delighted to share our recent database restructuring. Migrating to localized JSON fields minimized queries.',
          twitterText: 'Database migrations: successful. 📊 #DB',
          hashtags: ['Prisma', 'Postgres', 'Backend'],
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-caption-4',
          userId: 'mock-admin-id-12345',
          imageUrl: '/uploads/launch.jpg',
          instaText: 'IntelliDesk AI is live! Build, write, and chat with files instantly. 🌐 #SaaS #ProductLaunch',
          linkedInText: 'Today we launched IntelliDesk AI, a central dashboard wrapping multiple productivity tools.',
          twitterText: 'IntelliDesk AI is officially live! Check it out. 🚀 #AI',
          hashtags: ['SaaS', 'Startup', 'Launch'],
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-caption-5',
          userId: 'mock-admin-id-12345',
          imageUrl: '/uploads/milestone.jpg',
          instaText: 'Celebrating 1,000 active dashboard signups! 🥂🎉 #Milestone #Growth',
          linkedInText: 'Incredibly grateful for the developer community helping us reach 1,200 active users this week.',
          twitterText: 'Just crossed 1k signups! Thank you all. 🙌 #Metrics',
          hashtags: ['Growth', 'DeveloperTools', 'Success'],
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
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
          createdAt: new Date(Date.now() - 5*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-payment-2',
          userId: 'mock-admin-id-12345',
          stripeInvoiceId: 'inv_refill_2',
          amount: 1000,
          currency: 'usd',
          status: 'paid',
          createdAt: new Date(Date.now() - 4*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-payment-3',
          userId: 'mock-admin-id-12345',
          stripeInvoiceId: 'inv_refill_3',
          amount: 2900,
          currency: 'usd',
          status: 'paid',
          createdAt: new Date(Date.now() - 3*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-payment-4',
          userId: 'mock-admin-id-12345',
          stripeInvoiceId: 'inv_refill_4',
          amount: 1000,
          currency: 'usd',
          status: 'paid',
          createdAt: new Date(Date.now() - 2*24*60*60*1000).toISOString()
        },
        {
          id: 'mock-payment-5',
          userId: 'mock-admin-id-12345',
          stripeInvoiceId: 'inv_refill_5',
          amount: 1000,
          currency: 'usd',
          status: 'paid',
          createdAt: new Date(Date.now() - 1*24*60*60*1000).toISOString()
        }
      ];
    }
  }
}

MockStore.initialize();
export default MockStore;
