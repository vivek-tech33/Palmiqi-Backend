/*
  Warnings:

  - You are about to drop the column `insights` on the `MulankReading` table. All the data in the column will be lost.
  - You are about to drop the column `luckyElements` on the `MulankReading` table. All the data in the column will be lost.
  - You are about to drop the column `mulankAnalysis` on the `MulankReading` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,predictionDate,language]` on the table `DailyPrediction` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,loggedDate]` on the table `MoodLog` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,readingDate,language]` on the table `MulankReading` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `predictionDate` to the `DailyPrediction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `loggedDate` to the `MoodLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `MulankReading` table without a default value. This is not possible if the table is not empty.
  - Added the required column `readingDate` to the `MulankReading` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "DailyPrediction_userId_key";

-- DropIndex
DROP INDEX "MulankReading_userId_key";

-- AlterTable
ALTER TABLE "DailyPrediction" ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "predictionDate" DATE NOT NULL;

-- AlterTable
ALTER TABLE "MoodLog" ADD COLUMN     "loggedDate" DATE NOT NULL,
ADD COLUMN     "score" INTEGER;

-- AlterTable
ALTER TABLE "MulankReading" DROP COLUMN "insights",
DROP COLUMN "luckyElements",
DROP COLUMN "mulankAnalysis",
ADD COLUMN     "content" JSONB NOT NULL,
ADD COLUMN     "language" TEXT NOT NULL DEFAULT 'en',
ADD COLUMN     "overallScore" INTEGER,
ADD COLUMN     "readingDate" DATE NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "currentStreak" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lagnaSign" TEXT,
ADD COLUMN     "lastCompletionDate" DATE,
ADD COLUMN     "moonSign" TEXT,
ADD COLUMN     "mulank" INTEGER,
ADD COLUMN     "mulankCons" JSONB,
ADD COLUMN     "mulankDescription" JSONB,
ADD COLUMN     "mulankPros" JSONB,
ADD COLUMN     "mulankTitle" TEXT,
ADD COLUMN     "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "rulingPlanet" TEXT,
ADD COLUMN     "sunSign" TEXT,
ALTER COLUMN "birthDate" SET DATA TYPE DATE;

-- CreateTable
CREATE TABLE "DailyInsight" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "insightDate" DATE NOT NULL,
    "language" TEXT NOT NULL DEFAULT 'en',
    "energyLevelMin" INTEGER NOT NULL,
    "energyLevelMax" INTEGER NOT NULL,
    "energyMorning" TEXT NOT NULL,
    "energyMidday" TEXT NOT NULL,
    "energyEvening" TEXT NOT NULL,
    "summaryHeadline" TEXT NOT NULL,
    "summaryDescription" TEXT NOT NULL,
    "favorableWindows" JSONB NOT NULL,
    "dos" JSONB NOT NULL,
    "donts" JSONB NOT NULL,
    "luckyColor" TEXT NOT NULL,
    "luckyColorHex" TEXT NOT NULL,
    "luckyNumber" INTEGER NOT NULL,
    "luckyGem" TEXT NOT NULL,
    "luckyElement" TEXT NOT NULL,
    "opportunity" TEXT NOT NULL,
    "whyExplanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyInsight_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserCredit" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalCredits" INTEGER NOT NULL DEFAULT 2,
    "usedCredits" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserCredit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DailyInsight_userId_insightDate_idx" ON "DailyInsight"("userId", "insightDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyInsight_userId_insightDate_language_key" ON "DailyInsight"("userId", "insightDate", "language");

-- CreateIndex
CREATE UNIQUE INDEX "UserCredit_userId_key" ON "UserCredit"("userId");

-- CreateIndex
CREATE INDEX "DailyPrediction_userId_predictionDate_idx" ON "DailyPrediction"("userId", "predictionDate");

-- CreateIndex
CREATE UNIQUE INDEX "DailyPrediction_userId_predictionDate_language_key" ON "DailyPrediction"("userId", "predictionDate", "language");

-- CreateIndex
CREATE UNIQUE INDEX "MoodLog_userId_loggedDate_key" ON "MoodLog"("userId", "loggedDate");

-- CreateIndex
CREATE INDEX "MulankReading_userId_readingDate_idx" ON "MulankReading"("userId", "readingDate");

-- CreateIndex
CREATE UNIQUE INDEX "MulankReading_userId_readingDate_language_key" ON "MulankReading"("userId", "readingDate", "language");

-- AddForeignKey
ALTER TABLE "DailyInsight" ADD CONSTRAINT "DailyInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCredit" ADD CONSTRAINT "UserCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
