-- Alter Profile for onboarding and cached astro fields
ALTER TABLE "Profile"
  ALTER COLUMN "birthDate" TYPE DATE USING "birthDate"::date,
  ADD COLUMN "onboardingCompleted" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "currentStreak" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastCompletionDate" DATE,
  ADD COLUMN "sunSign" TEXT,
  ADD COLUMN "moonSign" TEXT,
  ADD COLUMN "lagnaSign" TEXT,
  ADD COLUMN "mulank" INTEGER,
  ADD COLUMN "rulingPlanet" TEXT,
  ADD COLUMN "mulankTitle" TEXT,
  ADD COLUMN "mulankDescription" JSONB,
  ADD COLUMN "mulankPros" JSONB,
  ADD COLUMN "mulankCons" JSONB;

-- Create daily insights table
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

CREATE UNIQUE INDEX "DailyInsight_userId_insightDate_language_key" ON "DailyInsight"("userId", "insightDate", "language");
CREATE INDEX "DailyInsight_userId_insightDate_idx" ON "DailyInsight"("userId", "insightDate");
ALTER TABLE "DailyInsight" ADD CONSTRAINT "DailyInsight_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create user credits table
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

CREATE UNIQUE INDEX "UserCredit_userId_key" ON "UserCredit"("userId");
ALTER TABLE "UserCredit" ADD CONSTRAINT "UserCredit_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate MulankReading to daily/language-aware structure
ALTER TABLE "MulankReading"
  ADD COLUMN "content" JSONB NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN "overallScore" INTEGER,
  ADD COLUMN "readingDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';

UPDATE "MulankReading"
SET "content" = jsonb_build_object(
  'insights', "insights",
  'mulankAnalysis', "mulankAnalysis",
  'luckyElements', "luckyElements"
);

DROP INDEX IF EXISTS "MulankReading_userId_key";

ALTER TABLE "MulankReading"
  DROP COLUMN "insights",
  DROP COLUMN "mulankAnalysis",
  DROP COLUMN "luckyElements";

CREATE UNIQUE INDEX "MulankReading_userId_readingDate_language_key" ON "MulankReading"("userId", "readingDate", "language");
CREATE INDEX "MulankReading_userId_readingDate_idx" ON "MulankReading"("userId", "readingDate");

-- Migrate DailyPrediction to daily/language-aware structure
ALTER TABLE "DailyPrediction"
  ADD COLUMN "predictionDate" DATE NOT NULL DEFAULT CURRENT_DATE,
  ADD COLUMN "language" TEXT NOT NULL DEFAULT 'en';

DROP INDEX IF EXISTS "DailyPrediction_userId_key";

CREATE UNIQUE INDEX "DailyPrediction_userId_predictionDate_language_key" ON "DailyPrediction"("userId", "predictionDate", "language");
CREATE INDEX "DailyPrediction_userId_predictionDate_idx" ON "DailyPrediction"("userId", "predictionDate");

-- Migrate MoodLog to daily unique structure
ALTER TABLE "MoodLog"
  ADD COLUMN "score" INTEGER,
  ADD COLUMN "loggedDate" DATE NOT NULL DEFAULT CURRENT_DATE;

UPDATE "MoodLog"
SET "loggedDate" = "loggedAt"::date
WHERE "loggedAt" IS NOT NULL;

CREATE UNIQUE INDEX "MoodLog_userId_loggedDate_key" ON "MoodLog"("userId", "loggedDate");
