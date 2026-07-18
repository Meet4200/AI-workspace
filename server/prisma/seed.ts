import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing records to prevent unique constraints issues
  await prisma.user.deleteMany().catch(() => {});

  const adminPasswordHash = await bcrypt.hash('admin123', 10);
  const userPasswordHash = await bcrypt.hash('user123', 10);

  // 1. Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@intellidesk.ai',
      passwordHash: adminPasswordHash,
      name: 'System Admin',
      role: 'ADMIN',
      profile: {
        create: {
          bio: 'System Administrator for IntelliDesk AI Platform.',
          jobTitle: 'Lead Engineer',
          location: 'San Francisco, CA'
        }
      },
      credit: {
        create: {
          balance: 10000, // Large credit pool for admin
          dailyCredits: 1000,
          monthlyCredits: 10000
        }
      },
      subscription: {
        create: {
          plan: 'ENTERPRISE',
          status: 'active'
        }
      },
      settings: {
        create: {
          darkMode: true,
          emailAlerts: true
        }
      }
    }
  });
  console.log(`- Seeded Admin: ${admin.email}`);

  // 2. Create Standard User
  const standardUser = await prisma.user.create({
    data: {
      email: 'user@intellidesk.ai',
      passwordHash: userPasswordHash,
      name: 'John Doe',
      role: 'USER',
      profile: {
        create: {
          bio: 'Software engineer looking for modern productivity workflows.',
          jobTitle: 'Software Engineer',
          location: 'New York, NY'
        }
      },
      credit: {
        create: {
          balance: 50,
          dailyCredits: 5,
          monthlyCredits: 50
        }
      },
      subscription: {
        create: {
          plan: 'FREE',
          status: 'active'
        }
      },
      settings: {
        create: {
          darkMode: true,
          emailAlerts: true
        }
      },
      notifications: {
        createMany: {
          data: [
            { title: 'Welcome to IntelliDesk AI', message: 'Explore our AI tools including the Resume Builder and Cover Letter generators!' },
            { title: 'Credits Received', message: 'You have been granted 50 free credits to get started.' }
          ]
        }
      }
    }
  });
  console.log(`- Seeded Standard User: ${standardUser.email}`);

  console.log('Seeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
