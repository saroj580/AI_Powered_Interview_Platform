ALTER TABLE "CodingChallenge" ADD COLUMN "pattern" TEXT NOT NULL DEFAULT '';
ALTER TABLE "CodingChallenge" ADD COLUMN "leetcodeId" INTEGER;
CREATE UNIQUE INDEX "CodingChallenge_leetcodeId_key" ON "CodingChallenge"("leetcodeId");
