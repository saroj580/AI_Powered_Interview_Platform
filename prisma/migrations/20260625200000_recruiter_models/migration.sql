CREATE TYPE "CandidateStage" AS ENUM ('APPLIED', 'INTERVIEW_SCHEDULED', 'INTERVIEW_COMPLETED', 'SHORTLISTED', 'HIRED', 'REJECTED');

CREATE TABLE "Assessment" (
    "id"              TEXT NOT NULL,
    "createdAt"       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"       TIMESTAMP(3) NOT NULL,
    "title"           TEXT NOT NULL,
    "type"            "InterviewType" NOT NULL DEFAULT 'TECHNICAL',
    "difficulty"      "Difficulty" NOT NULL DEFAULT 'MEDIUM',
    "targetRole"      TEXT NOT NULL,
    "questionCount"   INTEGER NOT NULL DEFAULT 5,
    "durationMinutes" INTEGER NOT NULL DEFAULT 30,
    "questions"       JSONB NOT NULL DEFAULT '[]',
    "isActive"        BOOLEAN NOT NULL DEFAULT true,
    "createdById"     TEXT NOT NULL,
    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CandidateInvite" (
    "id"           TEXT NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "assessmentId" TEXT NOT NULL,
    "email"        TEXT NOT NULL,
    "candidateId"  TEXT,
    "stage"        "CandidateStage" NOT NULL DEFAULT 'APPLIED',
    "token"        TEXT NOT NULL,
    "completedAt"  TIMESTAMP(3),
    "score"        DOUBLE PRECISION,
    "notes"        TEXT,
    CONSTRAINT "CandidateInvite_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "AssessmentSession" (
    "id"           TEXT NOT NULL,
    "createdAt"    TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt"    TIMESTAMP(3) NOT NULL,
    "inviteId"     TEXT NOT NULL,
    "startedAt"    TIMESTAMP(3),
    "endedAt"      TIMESTAMP(3),
    "score"        DOUBLE PRECISION,
    "answers"      JSONB NOT NULL DEFAULT '[]',
    "aiEvaluation" JSONB,
    CONSTRAINT "AssessmentSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "CandidateInvite_token_key"          ON "CandidateInvite"("token");
CREATE UNIQUE INDEX "CandidateInvite_assessmentId_email_key" ON "CandidateInvite"("assessmentId", "email");
CREATE UNIQUE INDEX "AssessmentSession_inviteId_key"     ON "AssessmentSession"("inviteId");

ALTER TABLE "Assessment"       ADD CONSTRAINT "Assessment_createdById_fkey"          FOREIGN KEY ("createdById")  REFERENCES "User"("id")             ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CandidateInvite"  ADD CONSTRAINT "CandidateInvite_assessmentId_fkey"    FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id")       ON DELETE CASCADE  ON UPDATE CASCADE;
ALTER TABLE "CandidateInvite"  ADD CONSTRAINT "CandidateInvite_candidateId_fkey"     FOREIGN KEY ("candidateId")  REFERENCES "User"("id")             ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "AssessmentSession" ADD CONSTRAINT "AssessmentSession_inviteId_fkey"     FOREIGN KEY ("inviteId")     REFERENCES "CandidateInvite"("id")  ON DELETE CASCADE  ON UPDATE CASCADE;
