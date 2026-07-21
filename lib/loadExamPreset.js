function loadExamPreset(examCode) {
  if (!examCode || typeof examCode !== 'string') return null;
  const code = examCode.trim().toUpperCase();
  if (!code) return null;
  const presets = {
    'USMLE_STEP1': {
      topics: {
        'Anatomy': 0.15,
        'Biochemistry': 0.12,
        'Microbiology': 0.10,
        'Pathology': 0.20,
        'Pharmacology': 0.13,
        'Physiology': 0.15,
        'Behavioral Sciences': 0.10,
        'Immunology': 0.05
      },
      defaultSchedule: { hoursPerWeek: 30, sessionDuration: 60 }
    },
    'SAT_MATH': {
      topics: {
        'Algebra': 0.35,
        'Problem Solving & Data Analysis': 0.30,
        'Advanced Math': 0.25,
        'Geometry & Trigonometry': 0.10
      },
      defaultSchedule: { hoursPerWeek: 8, sessionDuration: 45 }
    },
    'MCAT': {
      topics: {
        'Biology': 0.25,
        'Chemistry': 0.20,
        'Physics': 0.15,
        'Psychology': 0.15,
        'Sociology': 0.10,
        'Critical Analysis': 0.15
      },
      defaultSchedule: { hoursPerWeek: 25, sessionDuration: 90 }
    }
  };
  return presets[code] || null;
}
module.exports = { loadExamPreset };
