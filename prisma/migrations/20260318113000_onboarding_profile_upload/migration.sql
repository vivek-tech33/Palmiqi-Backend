CREATE TYPE "Personalize" AS ENUM (
    'CAREER_WORK',
    'MONEY_WEALTH',
    'LOVE_RELATIONSHIPS',
    'HEALTH_ENERGY',
    'MENTAL_PEACE',
    'PERSONAL_GROWTH',
    'BUSINESS'
);

ALTER TABLE "User"
ALTER COLUMN "password" DROP NOT NULL;

ALTER TABLE "Profile"
ADD COLUMN "personalizationOn" "Personalize"[] NOT NULL DEFAULT ARRAY[]::"Personalize"[];
