/**
 * Упрощённая оценка сердечно-сосудистого риска и рекомендаций по статинам
 * на основе принципов рекомендаций ЕАК/НОА (2023–2025) и ESC/EAS.
 * Для пациентского информационного калькулятора.
 */

const RISK_LEVELS = {
  veryHigh: {
    id: 'veryHigh',
    label: 'Очень высокий',
    color: '#C45C4A',
    ldlTarget: 1.4,
    ldlThreshold: 1.4,
    statinAdvice: 'strong',
  },
  high: {
    id: 'high',
    label: 'Высокий',
    color: '#D4845C',
    ldlTarget: 1.8,
    ldlThreshold: 1.8,
    statinAdvice: 'likely',
  },
  moderate: {
    id: 'moderate',
    label: 'Умеренный',
    color: '#C9A86C',
    ldlTarget: 2.6,
    ldlThreshold: 2.6,
    statinAdvice: 'consider',
  },
  low: {
    id: 'low',
    label: 'Низкий',
    color: '#7BAE8E',
    ldlTarget: 3.0,
    ldlThreshold: 3.0,
    statinAdvice: 'lifestyle',
  },
};

function parseNumber(value) {
  if (value === '' || value === null || value === undefined) return null;
  const n = Number(String(value).replace(',', '.'));
  return Number.isFinite(n) ? n : null;
}

/**
 * Определяет категорию ССР по ответам пациента.
 */
function assessRiskCategory(answers) {
  const {
    hadCardiovascularEvent,
    diabetes,
    diabetesComplications,
    familialHypercholesterolemia,
    chronicKidney,
    ldl,
    totalChol,
    age,
    sex,
    smoking,
    hypertension,
    familyEarlyCVD,
  } = answers;

  if (hadCardiovascularEvent) {
    return { ...RISK_LEVELS.veryHigh, reasons: ['Перенесённое сердечно-сосудистое заболевание (вторичная профилактика)'] };
  }

  if (familialHypercholesterolemia) {
    return { ...RISK_LEVELS.high, reasons: ['Семейная гиперхолестеринемия'] };
  }

  if (diabetes && diabetesComplications) {
    return { ...RISK_LEVELS.veryHigh, reasons: ['Сахарный диабет с осложнениями или поражением органов-мишеней'] };
  }

  if (chronicKidney === 'severe') {
    return { ...RISK_LEVELS.veryHigh, reasons: ['Тяжёлая хроническая болезнь почек'] };
  }

  if (diabetes) {
    return { ...RISK_LEVELS.high, reasons: ['Сахарный диабет'] };
  }

  if (chronicKidney === 'moderate') {
    return { ...RISK_LEVELS.high, reasons: ['Умеренная хроническая болезнь почек'] };
  }

  const ldlValue = ldl ?? estimateLdlFromTotal(totalChol);
  if (ldlValue !== null && ldlValue >= 4.9) {
    return { ...RISK_LEVELS.high, reasons: ['Выраженное повышение холестерина ЛПНП (≥ 4,9 ммоль/л)'] };
  }

  const riskFactors = countRiskFactors({ age, sex, smoking, hypertension, familyEarlyCVD, ldl: ldlValue, totalChol });
  const scoreRisk = estimateScoreRisk({ age, sex, smoking, hypertension });

  if (riskFactors >= 3 || scoreRisk === 'high') {
    return {
      ...RISK_LEVELS.high,
      reasons: buildRiskFactorReasons({ smoking, hypertension, familyEarlyCVD, age, sex, riskFactors }),
    };
  }

  if (riskFactors >= 2 || scoreRisk === 'moderate' || (age >= 50 && (smoking || hypertension))) {
    return {
      ...RISK_LEVELS.moderate,
      reasons: buildRiskFactorReasons({ smoking, hypertension, familyEarlyCVD, age, sex, riskFactors }),
    };
  }

  return {
    ...RISK_LEVELS.low,
    reasons: ['Незначительное количество факторов риска при отсутствии тяжёлых состояний'],
  };
}

function estimateLdlFromTotal(totalChol) {
  const tc = parseNumber(totalChol);
  if (tc === null) return null;
  return Math.round((tc * 0.65) * 10) / 10;
}

function countRiskFactors({ age, sex, smoking, hypertension, familyEarlyCVD, ldl, totalChol }) {
  let count = 0;
  if (smoking) count++;
  if (hypertension === 'treated' || hypertension === 'untreated') count++;
  if (familyEarlyCVD) count++;
  const ldlVal = ldl ?? estimateLdlFromTotal(totalChol);
  if (ldlVal !== null && ldlVal >= 3.0) count++;
  if (age >= 55 && sex === 'female') count++;
  if (age >= 45 && sex === 'male') count++;
  return count;
}

function estimateScoreRisk({ age, sex, smoking, hypertension }) {
  if (age < 40) return 'low';
  const hasHTN = hypertension === 'treated' || hypertension === 'untreated';
  if (sex === 'male') {
    if (age >= 65 && (smoking || hasHTN)) return 'high';
    if (age >= 55 && smoking && hasHTN) return 'high';
    if (age >= 50 && (smoking || hasHTN)) return 'moderate';
  } else {
    if (age >= 70 && (smoking || hasHTN)) return 'high';
    if (age >= 60 && smoking && hasHTN) return 'moderate';
    if (age >= 55 && (smoking || hasHTN)) return 'moderate';
  }
  return 'low';
}

function buildRiskFactorReasons({ smoking, hypertension, familyEarlyCVD, age, sex, riskFactors }) {
  const reasons = [];
  if (smoking) reasons.push('Курение');
  if (hypertension === 'treated') reasons.push('Артериальная гипертония (на лечении)');
  if (hypertension === 'untreated') reasons.push('Повышенное артериальное давление');
  if (familyEarlyCVD) reasons.push('Семейный анамнез ранних сердечно-сосудистых заболеваний');
  if (age >= 55 && sex === 'female') reasons.push('Возраст 55 лет и старше');
  if (age >= 45 && sex === 'male') reasons.push('Возраст 45 лет и старше');
  if (reasons.length === 0) reasons.push(`Совокупность факторов риска (${riskFactors})`);
  return reasons;
}

/**
 * Формирует итоговую рекомендацию для пациента.
 */
function getStatinRecommendation(answers) {
  const risk = assessRiskCategory(answers);
  const ldl = parseNumber(answers.ldl) ?? estimateLdlFromTotal(answers.totalChol);
  const onStatin = answers.onStatin === true;

  let level;
  let title;
  let summary;
  let actions;
  let emoji;

  if (risk.id === 'veryHigh') {
    if (onStatin) {
      level = 'info';
      title = 'Вы уже принимаете статины — это правильный шаг';
      summary = 'При очень высоком риске статины — основа терапии. Обсудите с врачом, достигнут ли ваш целевой уровень холестерина ЛПНП.';
      emoji = '✅';
      actions = [
        'Проверьте, достигли ли вы цели по ЛПНП (< 1,4 ммоль/л)',
        'Не прекращайте приём без согласования с врачом',
        'Контролируйте анализы каждые 6–12 месяцев',
      ];
    } else {
      level = 'urgent';
      title = 'Да, обсудите статины с врачом как можно скорее';
      summary = 'У вас очень высокий сердечно-сосудистый риск. Статины, как правило, рекомендованы независимо от уровня холестерина.';
      emoji = '❤️‍🩹';
      actions = [
        'Запишитесь на приём к терапевту или кардиологу',
        'Обсудите начало или продолжение терапии статинами',
        'Параллельно важны отказ от курения, питание и физическая активность',
      ];
    }
  } else if (ldl === null) {
    level = 'info';
    title = 'Сначала нужен анализ крови';
    summary = `Ваша предварительная категория риска — «${risk.label}». Без уровня холестерина ЛПНП точную рекомендацию дать нельзя.`;
    emoji = '🩺';
    actions = [
      'Сдайте липидный профиль (холестерин, ЛПНП, ЛПВП, триглицериды)',
      `При риске «${risk.label}» врач ориентируется на порог ЛПНП ≥ ${risk.ldlThreshold} ммоль/л`,
      'Принесите результаты на консультацию',
    ];
  } else if (ldl >= risk.ldlThreshold) {
    if (onStatin) {
      level = 'info';
      title = 'Возможно, нужна коррекция терапии';
      summary = `Ваш ЛПНП ${formatLdl(ldl)} ммоль/л выше целевого для категории «${risk.label}» (< ${risk.ldlTarget} ммоль/л).`;
      emoji = '📋';
      actions = [
        'Обсудите с врачом усиление терапии или добавление других препаратов',
        'Пересмотрите питание и физическую активность',
        'Повторите анализ через 6–8 недель после изменения лечения',
      ];
    } else {
      level = risk.id === 'low' ? 'consider' : 'likely';
      title = risk.id === 'low'
        ? 'Стоит обсудить статины с врачом'
        : 'Скорее всего, вам стоит задуматься о статинах';
      summary = `При риске «${risk.label}» и ЛПНП ${formatLdl(ldl)} ммоль/л (порог ≥ ${risk.ldlThreshold}) терапия статинами обычно рассматривается после 3–6 месяцев изменения образа жизни.`;
      emoji = '💬';
      actions = [
        'Сначала попробуйте модификацию образа жизни 3–6 месяцев',
        'Ограничьте насыщенные жиры, увеличьте овощи, клетчатку и движение',
        'Если ЛПНП не снизится — обсудите статины с врачом',
      ];
    }
  } else {
    level = 'positive';
    title = 'Пока статины, скорее всего, не нужны';
    summary = `Ваш ЛПНП ${formatLdl(ldl)} ммоль/л ниже порога ${risk.ldlThreshold} ммоль/л для категории «${risk.label}».`;
    emoji = '🌿';
    actions = [
      'Продолжайте здоровый образ жизни',
      'Контролируйте холестерин раз в 1–2 года',
      'При появлении новых факторов риска — пересмотрите с врачом',
    ];
  }

  return {
    risk,
    ldl,
    level,
    title,
    summary,
    actions,
    emoji,
    onStatin,
  };
}

function formatLdl(value) {
  return String(value).replace('.', ',');
}

if (typeof window !== 'undefined') {
  window.assessRiskCategory = assessRiskCategory;
  window.getStatinRecommendation = getStatinRecommendation;
  window.RISK_LEVELS = RISK_LEVELS;
  window.parseNumber = parseNumber;
  window.formatLdl = formatLdl;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { assessRiskCategory, getStatinRecommendation, RISK_LEVELS, parseNumber, formatLdl };
}
