/**
 * Оценка по ответам теста «Пора ли вам задуматься о статинах?»
 * Информационный калькулятор для пациентов.
 */

const RISK_LEVELS = {
  low: {
    id: 'low',
    label: 'Низкая вероятность',
    color: '#8FA892',
    minScore: 0,
    maxScore: 4,
  },
  moderate: {
    id: 'moderate',
    label: 'Умеренная вероятность',
    color: '#C9B07A',
    minScore: 5,
    maxScore: 8,
  },
  elevated: {
    id: 'elevated',
    label: 'Повышенная вероятность',
    color: '#C4A07A',
    minScore: 9,
    maxScore: 12,
  },
  high: {
    id: 'high',
    label: 'Высокая вероятность',
    color: '#A67C6B',
    minScore: 13,
    maxScore: 99,
  },
};

const ANSWER_LABELS = {
  q1_cholesterol: {
    recent: 'Недавно проверяли холестерин',
    old: 'Давно не проверяли холестерин',
    unknown: 'Не знаете уровень холестерина',
  },
  q2_bp: {
    normal: 'Давление обычно ниже 140/90',
    high: 'Давление часто выше 140/90',
    not_measured: 'Давление не измеряете',
  },
  q3_weight: {
    none: 'Лишнего веса нет',
    little: 'Небольшой лишний вес',
    much: 'Значительный лишний вес',
  },
  q4_activity: {
    daily: 'Двигаетесь каждый день',
    weekly: 'Двигаетесь несколько раз в неделю',
    sedentary: 'Мало двигаетесь',
  },
  q5_family: {
    yes: 'У родителей были инфаркт или инсульт',
    no: 'Семейного анамнеза нет',
    unknown: 'Семейный анамнез неизвестен',
  },
  q6_doctorChol: {
    yes: 'Врач говорил о повышенном холестерине',
    no: 'Врач не говорил о холестерине',
    forgot: 'Не помните, говорил ли врач',
  },
  q7_diabetes: {
    yes: 'Есть диабет или повышенный сахар',
    no: 'Сахар в норме',
    unknown: 'Уровень сахара неизвестен',
  },
  q8_concern: {
    bp: 'Беспокоит давление',
    cholesterol: 'Беспокоит холестерин',
    sugar: 'Беспокоит сахар',
    cvd_fear: 'Страх инфаркта или инсульта',
    checkup: 'Хотите проверить себя',
  },
};

const SCORE_MAP = {
  q1_cholesterol: { recent: 0, old: 1, unknown: 2 },
  q2_bp: { normal: 0, high: 3, not_measured: 1 },
  q3_weight: { none: 0, little: 1, much: 3 },
  q4_activity: { daily: 0, weekly: 1, sedentary: 2 },
  q5_family: { yes: 3, no: 0, unknown: 1 },
  q6_doctorChol: { yes: 3, no: 0, forgot: 1 },
  q7_diabetes: { yes: 4, no: 0, unknown: 2 },
};

const MAX_SCORE = 18;

function getScoreForAnswer(field, value) {
  return SCORE_MAP[field]?.[value] ?? 0;
}

function calculateTotalScore(answers) {
  return Object.keys(SCORE_MAP).reduce((sum, field) => {
    return sum + getScoreForAnswer(field, answers[field]);
  }, 0);
}

function getRiskByScore(score) {
  if (score >= RISK_LEVELS.high.minScore) return { ...RISK_LEVELS.high };
  if (score >= RISK_LEVELS.elevated.minScore) return { ...RISK_LEVELS.elevated };
  if (score >= RISK_LEVELS.moderate.minScore) return { ...RISK_LEVELS.moderate };
  return { ...RISK_LEVELS.low };
}

function buildReasons(answers) {
  const reasons = [];
  Object.keys(SCORE_MAP).forEach((field) => {
    const value = answers[field];
    const points = getScoreForAnswer(field, value);
    if (points > 0 && ANSWER_LABELS[field]?.[value]) {
      reasons.push(ANSWER_LABELS[field][value]);
    }
  });
  if (reasons.length === 0) {
    reasons.push('Мало факторов, которые обычно побуждают к обсуждению статинов');
  }
  return reasons;
}

function getConcernTip(concern) {
  const tips = {
    bp: 'Начните с контроля давления дома и записи показаний. На приёме обсудите и давление, и холестерин — они часто идут вместе.',
    cholesterol: 'Сдайте липидный профиль (общий холестерин и ЛПНП) и принесите результаты врачу — это главный аргумент для решения о статинах.',
    sugar: 'Проверьте уровень глюкозы и гликированный гемоглобин. При диабете статины часто рекомендуют для защиты сосудов.',
    cvd_fear: 'Ваше беспокойство понятно. Лучший способ снизить страх — пройти обследование и обсудить с врачом персональный план профилактики.',
    checkup: 'Отличный повод для профилактического визита: анализы крови, давление и разговор о статинах, если они действительно нужны.',
  };
  return tips[concern] || tips.checkup;
}

function getStatinRecommendation(answers) {
  const score = calculateTotalScore(answers);
  const risk = getRiskByScore(score);
  const percent = Math.min(100, Math.round((score / MAX_SCORE) * 100));
  const reasons = buildReasons(answers);
  const concernTip = getConcernTip(answers.q8_concern);
  const concernLabel = ANSWER_LABELS.q8_concern[answers.q8_concern] || '';

  let level;
  let title;
  let summary;
  let actions;
  let emoji;

  switch (risk.id) {
    case 'high':
      level = 'urgent';
      title = 'Да, вам стоит серьёзно задуматься о статинах';
      summary = 'По вашим ответам накопилось несколько важных факторов риска. Скорее всего, врач порекомендует обследование и обсуждение терапии статинами.';
      emoji = '❤️‍🩹';
      actions = [
        'Запишитесь к терапевту или кардиологу в ближайшие недели',
        'Сдайте липидный профиль и проверьте сахар крови',
        'Расскажите врачу о давлении, весе и семейном анамнезе',
        'Не откладывайте — профилактика работает лучше всего вовремя',
      ];
      break;
    case 'elevated':
      level = 'likely';
      title = 'Скорее всего, пора обсудить статины с врачом';
      summary = 'У вас есть заметные факторы риска. Даже если статины не понадобятся сразу, визит к врачу и анализы — необходимый шаг.';
      emoji = '💬';
      actions = [
        'Сдайте анализ крови на холестерин (ЛПНП)',
        'Измеряйте давление несколько дней подряд',
        'Обсудите с врачом пользу статинов именно для вас',
        'Начните с изменения питания и движения — это тоже лечение',
      ];
      break;
    case 'moderate':
      level = 'consider';
      title = 'Есть повод навести врача';
      summary = 'Пока ситуация не выглядит критичной, но некоторые ответы говорят: стоит провериться и поговорить о профилактике.';
      emoji = '🩺';
      actions = [
        'Проверьте холестерин, если давно не сдавали',
        'Контролируйте давление и вес',
        'На приёме спросите: нужны ли вам статины сейчас или пока нет',
        'Увеличьте ежедневную активность — это снижает риск',
      ];
      break;
    default:
      level = 'positive';
      title = 'Пока поводов для статинов немного';
      summary = 'По вашим ответам риск выглядит невысоким. Но профилактический осмотр и анализы раз в 1–2 года всё равно полезны.';
      emoji = '🌿';
      actions = [
        'Продолжайте двигаться и следить за питанием',
        'Периодически проверяйте холестерин и давление',
        'Если что-то изменится — пересдайте тест или обратитесь к врачу',
      ];
      break;
  }

  if (answers.q7_diabetes === 'yes' && risk.id !== 'high') {
    summary += ' Учитывая сахарный диабет или его риск, врач может рекомендовать статины даже при умеренном холестерине.';
  }

  return {
    score,
    maxScore: MAX_SCORE,
    percent,
    risk,
    reasons,
    concernTip,
    concernLabel,
    level,
    title,
    summary,
    actions,
    emoji,
  };
}

if (typeof window !== 'undefined') {
  window.getStatinRecommendation = getStatinRecommendation;
  window.RISK_LEVELS = RISK_LEVELS;
  window.calculateTotalScore = calculateTotalScore;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { getStatinRecommendation, RISK_LEVELS, calculateTotalScore };
}
