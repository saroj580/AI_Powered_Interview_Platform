import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Password123!", 10);

  const organization = await prisma.organization.upsert({
    where: { slug: "interviewai" },
    update: {},
    create: {
      name: "InterviewAI",
      slug: "interviewai",
    },
  });

  await prisma.user.upsert({
    where: { email: "admin@interviewai.com" },
    update: {
      name: "Admin User",
      password: passwordHash,
      role: "ADMIN",
      organizationId: organization.id,
    },
    create: {
      name: "Admin User",
      email: "admin@interviewai.com",
      password: passwordHash,
      role: "ADMIN",
      organizationId: organization.id,
    },
  });

  const existingInterview = await prisma.interview.findFirst({
    where: { title: "Full Stack Interview" },
  });

  if (!existingInterview) {
    await prisma.interview.create({
      data: {
        title: "Full Stack Interview",
        description: "A mixed technical interview for full stack candidates.",
        type: "MIXED",
        status: "DRAFT",
        targetRole: "Full Stack Engineer",
        difficulty: "MEDIUM",
        questionCount: 8,
        durationMinutes: 55,
        organizationId: organization.id,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
