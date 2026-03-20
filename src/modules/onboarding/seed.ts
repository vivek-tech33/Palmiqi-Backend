const ZODIAC_SIGNS = [
  'Capricorn',
  'Aquarius',
  'Pisces',
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
] as const;

const RULING_PLANETS: Record<number, string> = {
  1: 'Sun',
  2: 'Moon',
  3: 'Jupiter',
  4: 'Rahu',
  5: 'Mercury',
  6: 'Venus',
  7: 'Ketu',
  8: 'Saturn',
  9: 'Mars',
};

const MULANK_PROFILES: Record<
  number,
  {
    title: string;
    summary: string;
    pros: string[];
    cons: string[];
  }
> = {
  1: {
    title: 'The Pioneer',
    summary: 'Independent, bold, and driven to lead.',
    pros: ['Strong initiative', 'Clear ambition', 'Takes ownership'],
    cons: ['Can be impatient', 'May resist advice'],
  },
  2: {
    title: 'The Harmonizer',
    summary: 'Sensitive, intuitive, and relationship-oriented.',
    pros: ['Diplomatic', 'Emotionally aware', 'Supportive'],
    cons: ['Can overthink', 'Needs reassurance'],
  },
  3: {
    title: 'The Creator',
    summary: 'Expressive, optimistic, and naturally inspiring.',
    pros: ['Creative thinker', 'Strong communicator', 'Positive energy'],
    cons: ['Can lose focus', 'May avoid routine'],
  },
  4: {
    title: 'The Builder',
    summary: 'Grounded, practical, and disciplined under pressure.',
    pros: ['Reliable', 'Detail-oriented', 'Works steadily'],
    cons: ['Can be rigid', 'Resists sudden change'],
  },
  5: {
    title: 'The Explorer',
    summary: 'Curious, adaptive, and energized by movement.',
    pros: ['Quick learner', 'Flexible', 'Social charm'],
    cons: ['Can get restless', 'May scatter energy'],
  },
  6: {
    title: 'The Nurturer',
    summary: 'Warm, responsible, and naturally drawn to care.',
    pros: ['Protective', 'Balanced', 'Aesthetic sense'],
    cons: ['Can carry too much', 'Needs boundaries'],
  },
  7: {
    title: 'The Seeker',
    summary: 'Reflective, wise, and spiritually tuned.',
    pros: ['Deep insight', 'Observant', 'Thoughtful'],
    cons: ['Can withdraw', 'May seem distant'],
  },
  8: {
    title: 'The Strategist',
    summary: 'Persistent, resilient, and built for long games.',
    pros: ['Strong endurance', 'Practical judgement', 'Serious focus'],
    cons: ['Can feel heavy', 'May become overly cautious'],
  },
  9: {
    title: 'The Warrior',
    summary: 'Passionate, courageous, and action-led.',
    pros: ['Brave', 'Protective', 'High conviction'],
    cons: ['Can react sharply', 'Needs patience'],
  },
};

const FOCUS_LABELS: Record<string, string> = {
  CAREER_WORK: 'career and work',
  MONEY_WEALTH: 'money and wealth',
  LOVE_RELATIONSHIPS: 'love and relationships',
  HEALTH_ENERGY: 'health and energy',
  MENTAL_PEACE: 'mental peace',
  PERSONAL_GROWTH: 'personal growth',
  BUSINESS: 'business',
};

type SeedAstroProfile = {
  sunSign: string;
  moonSign: string;
  lagnaSign: string;
  mulank: number;
  rulingPlanet: string;
  mulankTitle: string;
  mulankDescription: {
    summary: string;
  };
  mulankPros: string[];
  mulankCons: string[];
};

type SeedInsight = {
  energyLevelMin: number;
  energyLevelMax: number;
  energyMorning: string;
  energyMidday: string;
  energyEvening: string;
  summaryHeadline: string;
  summaryDescription: string;
  favorableWindows: Array<{
    time: string;
    activity: string;
    energy: string;
  }>;
  dos: string[];
  donts: string[];
  luckyColor: string;
  luckyColorHex: string;
  luckyNumber: number;
  luckyGem: string;
  luckyElement: string;
  opportunity: string;
  whyExplanation: string;
};

type SeedPrediction = {
  energy: number;
  predictions: {
    career: { summary: string; score: number; color_hex: string };
    love: { summary: string; score: number; color_hex: string };
    wealth: { summary: string; score: number; color_hex: string };
    finance: { summary: string; score: number; color_hex: string };
    health: { summary: string; score: number; color_hex: string };
  };
  tomorrowPreview: string;
};

type SeedReading = {
  content: {
    title: string;
    subtitle: string;
    intro_line: string;
    overall_feel: {
      emoji: string;
      title: string;
      points: string[];
    };
    kaam_focus: {
      emoji: string;
      title: string;
      points: string[];
    };
    emotions_people: {
      emoji: string;
      title: string;
      points: string[];
    };
    caution: {
      emoji: string;
      title: string;
      points: string[];
    };
    overall_score: number;
    score_summary: string;
  };
  overallScore: number;
};

export type OnboardingSeedData = {
  astroProfile: SeedAstroProfile;
  insight: SeedInsight;
  prediction: SeedPrediction;
  reading: SeedReading;
};

function computeMulank(birthDate: Date) {
  let total = birthDate.getUTCDate();

  while (total > 9) {
    total = total
      .toString()
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }

  return total || 1;
}

function getSunSign(birthDate: Date) {
  const month = birthDate.getUTCMonth() + 1;
  const day = birthDate.getUTCDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
}

function getShiftedSign(baseSign: string, shift: number) {
  const index = ZODIAC_SIGNS.indexOf(baseSign as (typeof ZODIAC_SIGNS)[number]);
  if (index === -1) {
    return baseSign;
  }

  return ZODIAC_SIGNS[(index + shift) % ZODIAC_SIGNS.length];
}

function buildAstroProfile(birthDate: Date): SeedAstroProfile {
  const mulank = computeMulank(birthDate);
  const sunSign = getSunSign(birthDate);
  const moonSign = getShiftedSign(sunSign, mulank % ZODIAC_SIGNS.length);
  const lagnaSign = getShiftedSign(sunSign, (mulank + 3) % ZODIAC_SIGNS.length);
  const profile = MULANK_PROFILES[mulank];

  return {
    sunSign,
    moonSign,
    lagnaSign,
    mulank,
    rulingPlanet: RULING_PLANETS[mulank],
    mulankTitle: profile.title,
    mulankDescription: {
      summary: profile.summary,
    },
    mulankPros: profile.pros,
    mulankCons: profile.cons,
  };
}

function getFocusSummary(personalizationOn: string[]) {
  return personalizationOn
    .map((item) => FOCUS_LABELS[item] || item.toLowerCase())
    .join(', ');
}

function buildInsight(astroProfile: SeedAstroProfile, personalizationOn: string[]): SeedInsight {
  const focusSummary = getFocusSummary(personalizationOn);
  const baseEnergy = 58 + astroProfile.mulank * 3;
  const energyLevelMin = Math.min(baseEnergy, 82);
  const energyLevelMax = Math.min(baseEnergy + 12, 94);

  return {
    energyLevelMin,
    energyLevelMax,
    energyMorning: `The day begins with grounded ${astroProfile.rulingPlanet.toLowerCase()} energy and a need for clear priorities.`,
    energyMidday: `Midday supports confident decisions around ${focusSummary || 'your main goals'}.`,
    energyEvening: 'The evening is better for reflection, lighter conversations, and emotional reset.',
    summaryHeadline: `A steady day for ${astroProfile.mulankTitle.toLowerCase()} energy`,
    summaryDescription: `Your profile favors focused progress, especially in ${focusSummary || 'the areas you chose'}.`,
    favorableWindows: [
      {
        time: '10:00-12:00',
        activity: personalizationOn[0] ? (FOCUS_LABELS[personalizationOn[0]] || personalizationOn[0]) : 'Focused work',
        energy: 'high',
      },
      {
        time: '16:00-18:00',
        activity: 'Planning and alignment',
        energy: 'steady',
      },
    ],
    dos: [
      'Complete one important task before noon.',
      'Keep your communication direct and calm.',
      'Use momentum on your top priority rather than multitasking.',
    ],
    donts: [
      'Do not overcommit emotionally.',
      'Avoid impulsive spending or rushed promises.',
      'Do not dilute your focus across too many priorities.',
    ],
    luckyColor: astroProfile.mulank % 2 === 0 ? 'Emerald' : 'Gold',
    luckyColorHex: astroProfile.mulank % 2 === 0 ? '#10B981' : '#D4AF37',
    luckyNumber: astroProfile.mulank,
    luckyGem: astroProfile.mulank % 2 === 0 ? 'Emerald' : 'Citrine',
    luckyElement: astroProfile.mulank % 3 === 0 ? 'air' : astroProfile.mulank % 3 === 1 ? 'fire' : 'earth',
    opportunity: `A useful opening may appear through disciplined action in ${focusSummary || 'your chosen focus areas'}.`,
    whyExplanation: `Your mulank ${astroProfile.mulank} profile blends well with today's pace, making consistency more powerful than intensity.`,
  };
}

function scoreValue(base: number) {
  return Math.max(50, Math.min(base, 92));
}

function buildPrediction(astroProfile: SeedAstroProfile): SeedPrediction {
  const base = 55 + astroProfile.mulank * 4;

  return {
    energy: scoreValue(base),
    predictions: {
      career: {
        summary: 'Good momentum for practical progress and visible output.',
        score: scoreValue(base + 8),
        color_hex: '#22C55E',
      },
      love: {
        summary: 'Relationships improve when your tone stays softer and more present.',
        score: scoreValue(base - 4),
        color_hex: '#EF4444',
      },
      wealth: {
        summary: 'Stable decisions are favored over risky moves.',
        score: scoreValue(base + 3),
        color_hex: '#F59E0B',
      },
      finance: {
        summary: 'Keep spending intentional and avoid emotional purchases.',
        score: scoreValue(base),
        color_hex: '#EAB308',
      },
      health: {
        summary: 'Energy stays balanced if you avoid mental overload.',
        score: scoreValue(base + 5),
        color_hex: '#3B82F6',
      },
    },
    tomorrowPreview: 'Tomorrow opens with clearer emotional rhythm and stronger social flow.',
  };
}

function buildMulankReading(astroProfile: SeedAstroProfile, personalizationOn: string[]): SeedReading {
  const focusSummary = getFocusSummary(personalizationOn) || 'your priorities';
  const overallScore = scoreValue(60 + astroProfile.mulank * 4);

  return {
    content: {
      title: `Mulank ${astroProfile.mulank}: ${astroProfile.mulankTitle}`,
      subtitle: 'Your personal guidance for today',
      intro_line: `Your energy supports grounded progress in ${focusSummary}.`,
      overall_feel: {
        emoji: '?',
        title: 'Overall Feel',
        points: [
          astroProfile.mulankDescription.summary,
          `Your ruling planet, ${astroProfile.rulingPlanet}, favors clarity over rush today.`,
        ],
      },
      kaam_focus: {
        emoji: '??',
        title: 'Work & Focus',
        points: [
          `Use your strongest energy on ${focusSummary}.`,
          'A single well-finished task will matter more than scattered movement.',
        ],
      },
      emotions_people: {
        emoji: '??',
        title: 'Emotions & People',
        points: [
          'Be calm, direct, and less reactive in conversations.',
          'Supportive exchanges will open more easily in the second half of the day.',
        ],
      },
      caution: {
        emoji: '??',
        title: 'Caution',
        points: [
          astroProfile.mulankCons[0],
          'Do not promise more than your energy can actually hold today.',
        ],
      },
      overall_score: overallScore,
      score_summary: 'A balanced day with strong upside when you stay focused.',
    },
    overallScore,
  };
}

export function buildOnboardingSeedData(
  birthDate: Date,
  personalizationOn: string[],
): OnboardingSeedData {
  const astroProfile = buildAstroProfile(birthDate);

  return {
    astroProfile,
    insight: buildInsight(astroProfile, personalizationOn),
    prediction: buildPrediction(astroProfile),
    reading: buildMulankReading(astroProfile, personalizationOn),
  };
}
