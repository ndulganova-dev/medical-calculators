(function () {
  const STATIN_FACTS = [
    {
      icon: '🎯',
      text: 'Статины назначают не из-за цифры холестерина, а из-за общего риска инфаркта и инсульта.',
    },
    {
      icon: '✅',
      text: 'Многие люди принимают статины годами без серьёзных побочных эффектов.',
    },
    {
      icon: '💪',
      text: 'Статины снижают риск инфаркта и инсульта даже у людей, которые чувствуют себя абсолютно здоровыми.',
    },
    {
      icon: '💊',
      text: 'Если одного статина недостаточно, врач может добавить эзетимиб для более эффективного снижения ЛПНП.',
    },
    {
      icon: '⚠️',
      text: 'Отмена статинов без консультации врача может увеличить риск сердечно-сосудистых осложнений.',
    },
  ];

  const STEPS = [
    {
      id: 'welcome',
      type: 'welcome',
      guide: 'Здравствуйте! Ответьте на 8 простых вопросов — и я помогу понять, стоит ли обсудить с врачом статины.',
    },
    {
      id: 'q1',
      type: 'choice',
      number: 1,
      field: 'q1_cholesterol',
      title: 'Знаете ли вы свой холестерин?',
      guide: 'Начнём! Холестерин — ключевой показатель при решении о статинах.',
      options: [
        { value: 'recent', label: 'Да, недавно проверял(а)', icon: '📋' },
        { value: 'old', label: 'Проверял(а) давно', icon: '🕐' },
        { value: 'unknown', label: 'Не знаю', icon: '❓' },
      ],
    },
    {
      id: 'q2',
      type: 'choice',
      number: 2,
      field: 'q2_bp',
      title: 'Что чаще всего показывает ваш тонометр?',
      guide: 'Давление тесно связано с риском для сосудов и сердца.',
      options: [
        { value: 'normal', label: 'Обычно ниже 140/90', icon: '✅' },
        { value: 'high', label: 'Часто выше 140/90', icon: '📈' },
        { value: 'not_measured', label: 'Не измеряю давление', icon: '—' },
      ],
    },
    {
      id: 'q3',
      type: 'choice',
      number: 3,
      field: 'q3_weight',
      title: 'Есть ли у вас лишний вес?',
      guide: 'Вес влияет на холестерин, давление и общий риск.',
      options: [
        { value: 'none', label: 'Нет', icon: '👍' },
        { value: 'little', label: 'Немного есть', icon: '〰️' },
        { value: 'much', label: 'Да, значительно', icon: '⚖️' },
      ],
    },
    {
      id: 'q4',
      type: 'choice',
      number: 4,
      field: 'q4_activity',
      title: 'Как часто вы двигаетесь?',
      guide: 'Движение — один из лучших способов защитить сердце.',
      options: [
        { value: 'daily', label: 'Каждый день', icon: '🚶' },
        { value: 'weekly', label: 'Несколько раз в неделю', icon: '🏃' },
        { value: 'sedentary', label: 'Почти не двигаюсь', icon: '🛋️' },
      ],
    },
    {
      id: 'q5',
      type: 'choice',
      number: 5,
      field: 'q5_family',
      title: 'Были ли у ваших родителей инфаркт или инсульт?',
      guide: 'Семейная история помогает оценить ваш личный риск.',
      options: [
        { value: 'yes', label: 'Да', icon: '👨‍👩‍👧' },
        { value: 'no', label: 'Нет', icon: '✓' },
        { value: 'unknown', label: 'Не знаю', icon: '❓' },
      ],
    },
    {
      id: 'q6',
      type: 'choice',
      number: 6,
      field: 'q6_doctorChol',
      title: 'Говорил ли вам врач когда-нибудь о повышенном холестерине?',
      guide: 'Если врач уже обращал внимание — это важная подсказка.',
      options: [
        { value: 'yes', label: 'Да', icon: '👩‍⚕️' },
        { value: 'no', label: 'Нет', icon: '✓' },
        { value: 'forgot', label: 'Не помню', icon: '🤔' },
      ],
    },
    {
      id: 'q7',
      type: 'choice',
      number: 7,
      field: 'q7_diabetes',
      title: 'Есть ли у вас сахарный диабет или повышенный сахар?',
      guide: 'Сахар и холестерин часто требуют комплексного подхода.',
      options: [
        { value: 'yes', label: 'Да', icon: '🩸' },
        { value: 'no', label: 'Нет', icon: '✓' },
        { value: 'unknown', label: 'Не знаю', icon: '❓' },
      ],
    },
    {
      id: 'q8',
      type: 'choice',
      number: 8,
      field: 'q8_concern',
      title: 'Что вас беспокоит больше всего?',
      guide: 'Последний вопрос! Ответ поможет дать более точный совет.',
      options: [
        { value: 'bp', label: 'Высокое давление', icon: '💓' },
        { value: 'cholesterol', label: 'Холестерин', icon: '🧪' },
        { value: 'sugar', label: 'Повышенный сахар', icon: '🍬' },
        { value: 'cvd_fear', label: 'Боюсь инфаркта или инсульта', icon: '💭' },
        { value: 'checkup', label: 'Просто хочу проверить себя', icon: '🔍' },
      ],
    },
  ];

  const LIPID_MARKERS = [
    {
      id: 'ldl',
      icon: '🔴',
      title: 'ЛПНП (липопротеины низкой плотности)',
      tag: '«плохой холестерин»',
      paragraphs: [
        'Именно ЛПНП откладывается в стенках сосудов и может приводить к образованию атеросклеротических бляшек.',
        'Чем выше ЛПНП, тем выше риск инфаркта и инсульта.',
      ],
      targetsTitle: 'Желательный уровень:',
      targets: [
        'менее 3,0 ммоль/л — для большинства людей',
        'менее 1,8 ммоль/л — для пациентов высокого риска',
        'менее 1,4 ммоль/л — для очень высокого риска',
      ],
    },
    {
      id: 'hdl',
      icon: '🟢',
      title: 'ЛПВП (липопротеины высокой плотности)',
      tag: '«хороший холестерин»',
      paragraphs: [
        'Он помогает удалять избыток холестерина из сосудов.',
        'Чем выше ЛПВП, тем лучше.',
      ],
      targetsTitle: 'Желательный уровень:',
      targets: [
        'Мужчины: выше 1,0 ммоль/л',
        'Женщины: выше 1,2 ммоль/л',
      ],
    },
    {
      id: 'tg',
      icon: '🟡',
      title: 'Триглицериды',
      tag: null,
      paragraphs: [
        'Это жиры, которые циркулируют в крови.',
        'Высокий уровень часто связан с лишним весом, сахарным диабетом, избытком сладкого и злоупотреблением алкоголем.',
      ],
      targetsTitle: 'Желательный уровень:',
      targets: ['менее 1,7 ммоль/л'],
    },
    {
      id: 'vldl',
      icon: '🟠',
      title: 'ЛПОНП (липопротеины очень низкой плотности)',
      tag: null,
      paragraphs: [
        'Переносят триглицериды.',
        'При повышении могут способствовать развитию атеросклероза.',
        'Обычно оцениваются вместе с триглицеридами.',
      ],
      targetsTitle: null,
      targets: [],
    },
    {
      id: 'total',
      icon: '📊',
      title: 'Общий холестерин',
      tag: null,
      paragraphs: [
        'Это суммарный показатель.',
        'Сам по себе общий холестерин не всегда позволяет оценить риск — важно смотреть всю липидограмму.',
      ],
      targetsTitle: 'Желательный уровень:',
      targets: ['менее 5,0 ммоль/л'],
    },
    {
      id: 'atherogenic',
      icon: '⚖️',
      title: 'Коэффициент атерогенности',
      tag: null,
      paragraphs: [
        'Показывает соотношение «плохих» и «хороших» жиров крови.',
        'Чем выше показатель, тем выше риск атеросклероза.',
      ],
      targetsTitle: 'Желательно:',
      targets: ['менее 3'],
    },
  ];

  const CHECKLIST_ITEMS = [
    { id: 'ldl', label: 'ЛПНП' },
    { id: 'hdl', label: 'ЛПВП' },
    { id: 'tg', label: 'Триглицериды' },
    { id: 'total', label: 'Общий холестерин' },
    { id: 'glucose', label: 'Глюкоза' },
    { id: 'hba1c', label: 'Гликированный гемоглобин (HbA1c)' },
  ];

  const IMPORTANT_FACTORS = [
    'возраст',
    'давление',
    'сахарный диабет',
    'курение',
    'перенесённые заболевания',
    'семейную историю',
    'сердечно-сосудистый риск',
  ];

  const AUDIO_BENEFITS = [
    'есть ли повод для беспокойства',
    'насколько высокий ваш риск',
    'нужно ли обсуждать статины с врачом',
    'какие анализы желательно досдать',
    'на что обратить внимание в первую очередь',
  ];

  const state = {
    stepIndex: 0,
    answers: {},
    direction: 'forward',
    factsIndex: 0,
    lipidOpen: 'ldl',
    checklist: {},
  };

  const gamePanel = document.getElementById('gamePanel');
  const guideMessage = document.getElementById('guideMessage');
  const hintBar = document.getElementById('hintBar');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  function currentStep() {
    return STEPS[state.stepIndex];
  }

  function totalQuestions() {
    return STEPS.length - 1;
  }

  function updateProgress() {
    const step = currentStep();
    if (!step || step.type === 'welcome') {
      progressBar.hidden = true;
      return;
    }
    progressBar.hidden = false;
    const current = step.number || 0;
    const pct = Math.round((current / totalQuestions()) * 100);
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `Вопрос ${current} из ${totalQuestions()}`;
  }

  function setGuide(text, show = true) {
    if (!guideMessage || !hintBar) return;
    guideMessage.textContent = text;
    hintBar.hidden = !show || !text;
    if (show && text) {
      hintBar.classList.remove('hint-bar--pop');
      void hintBar.offsetWidth;
      hintBar.classList.add('hint-bar--pop');
    }
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function slideClass() {
    return state.direction === 'forward' ? 'slide-in-forward' : 'slide-in-back';
  }

  function renderFactsCarousel() {
    const i = state.factsIndex;
    const fact = STATIN_FACTS[i];
    const dots = STATIN_FACTS.map((_, idx) => `
      <button
        type="button"
        class="facts-dots__dot ${idx === i ? 'facts-dots__dot--active' : ''}"
        data-fact-dot="${idx}"
        aria-label="Факт ${idx + 1}"
      ></button>
    `).join('');

    return `
      <div class="facts-carousel">
        <div class="facts-carousel__visual scroll-reveal">
          <img src="assets/audience-consultation.png" alt="Врач обсуждает лечение с пациентом" loading="lazy">
        </div>
        <p class="facts-carousel__heading">5 фактов о статинах</p>
        <div class="facts-carousel__card fact-flip">
          <span class="facts-carousel__num">${i + 1} / 5</span>
          <span class="facts-carousel__icon">${fact.icon}</span>
          <p class="facts-carousel__text">${escapeHtml(fact.text)}</p>
        </div>
        <div class="facts-carousel__nav">
          <button type="button" class="facts-carousel__btn" data-fact-prev aria-label="Предыдущий факт">←</button>
          <div class="facts-dots">${dots}</div>
          <button type="button" class="facts-carousel__btn" data-fact-next aria-label="Следующий факт">→</button>
        </div>
      </div>
    `;
  }

  function renderLipidAccordionItem(marker, index) {
    const isOpen = state.lipidOpen === marker.id;
    const targetsHtml = marker.targets.length
      ? `<p class="lipid-card__targets-title">${escapeHtml(marker.targetsTitle)}</p>
         <ul class="lipid-card__targets">
           ${marker.targets.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}
         </ul>`
      : '';

    return `
      <div class="lipid-card lipid-animate ${isOpen ? 'lipid-card--open' : ''}" style="--i:${index}" data-lipid-id="${marker.id}">
        <button type="button" class="lipid-card__header" data-lipid-toggle="${marker.id}" aria-expanded="${isOpen}">
          <span class="lipid-card__icon">${marker.icon}</span>
          <span class="lipid-card__titles">
            <span class="lipid-card__title">${escapeHtml(marker.title)}</span>
            ${marker.tag ? `<span class="lipid-card__tag">${escapeHtml(marker.tag)}</span>` : ''}
          </span>
          <span class="lipid-card__chevron" aria-hidden="true"></span>
        </button>
        <div class="lipid-card__body">
          <div class="lipid-card__inner">
            ${marker.paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join('')}
            ${targetsHtml}
          </div>
        </div>
      </div>
    `;
  }

  function renderChecklistProgress() {
    const checked = CHECKLIST_ITEMS.filter((item) => state.checklist[item.id]).length;
    const total = CHECKLIST_ITEMS.length;
    const pct = Math.round((checked / total) * 100);
    return { checked, total, pct };
  }

  function renderLipidogramSection() {
    const accordion = LIPID_MARKERS.map((m, i) => renderLipidAccordionItem(m, i)).join('');
    const { checked, total, pct } = renderChecklistProgress();

    const checklistHtml = CHECKLIST_ITEMS.map((item, i) => {
      const isChecked = !!state.checklist[item.id];
      return `
        <button
          type="button"
          class="lipid-check__item lipid-animate ${isChecked ? 'lipid-check__item--checked' : ''}"
          style="--i:${i}"
          data-check-id="${item.id}"
        >
          <span class="lipid-check__box" aria-hidden="true">${isChecked ? '✓' : ''}</span>
          <span class="lipid-check__label">${escapeHtml(item.label)}</span>
        </button>
      `;
    }).join('');

    const missingHint = checked < total
      ? '<p class="lipid-check__hint lipid-check__hint--warn">Если каких-то показателей нет, возможно, стоит обсудить с врачом необходимость дополнительного обследования.</p>'
      : '<p class="lipid-check__hint lipid-check__hint--ok">Отлично! У вас есть все основные показатели — принесите их на консультацию к врачу.</p>';

    const factorsHtml = IMPORTANT_FACTORS.map((f) => `<li>${escapeHtml(f)}</li>`).join('');
    const benefitsHtml = AUDIO_BENEFITS.map((b) => `<li>${escapeHtml(b)}</li>`).join('');

    return `
      <section class="lipid-section lipid-section-reveal" id="lipidogram">
        <div class="lipid-section__header lipid-animate">
          <span class="lipid-section__badge">📋 Справочник</span>
          <h2 class="lipid-section__title">Разбираемся в вашей липидограмме простым языком</h2>
          <p class="lipid-section__intro">
            Перед тем как обсуждать статины, важно понимать свои анализы.
            Проверьте, сдавали ли вы следующие показатели.
          </p>
        </div>

        <div class="lipid-accordion">${accordion}</div>

        <div class="lipid-check lipid-animate">
          <h3 class="lipid-check__title">Проверьте себя</h3>
          <p class="lipid-check__subtitle">Есть ли у вас результаты:</p>
          <div class="lipid-check__progress">
            <div class="lipid-check__progress-track">
              <div class="lipid-check__progress-fill" style="width: ${pct}%"></div>
            </div>
            <span class="lipid-check__progress-text">${checked} из ${total}</span>
          </div>
          <div class="lipid-check__grid">${checklistHtml}</div>
          ${missingHint}
        </div>

        <div class="lipid-important lipid-animate">
          <h3 class="lipid-important__title">Важно</h3>
          <p>Решение о назначении статинов принимается <strong>не только по цифре холестерина</strong>. Врач учитывает:</p>
          <ul>${factorsHtml}</ul>
          <p class="lipid-important__note">
            Поэтому одинаковый уровень холестерина у двух разных людей может требовать совершенно разных решений.
          </p>
        </div>

        <div class="lipid-cta lipid-animate">
          <div class="lipid-cta__glow" aria-hidden="true"></div>
          <h3 class="lipid-cta__title">Хотите понять свои анализы простым языком?</h3>
          <p class="lipid-cta__text">
            Получите персональный аудиоразбор анализов от врача Надежды Дулгановой.
          </p>
          <p class="lipid-cta__subtitle">В аудиоразборе вы узнаете:</p>
          <ul class="lipid-cta__list">${benefitsHtml}</ul>
          <a
            href="https://drdulganova.ru/audiorazbor"
            class="btn btn--cta-green btn--large"
            target="_blank"
            rel="noopener noreferrer"
          >
            Получить персональный аудиоразбор анализов
            <span class="btn__arrow">→</span>
          </a>
        </div>
      </section>
    `;
  }

  function renderFactsBlock() {
    const items = STATIN_FACTS.map((fact, i) => `
      <li class="facts-list__item stagger-item" style="--i:${i}">
        <span class="facts-list__num" aria-hidden="true">${i + 1}</span>
        <span class="facts-list__icon" aria-hidden="true">${fact.icon}</span>
        <p class="facts-list__text">${escapeHtml(fact.text)}</p>
      </li>
    `).join('');

    return `
      <div class="facts-block scroll-reveal">
        <div class="facts-block__header">
          <div class="facts-block__visual">
            <img src="assets/audience-couple.png" alt="Пациенты на консультации у врача" loading="lazy">
          </div>
          <h3 class="facts-block__title">5 фактов о статинах</h3>
        </div>
        <ol class="facts-list">${items}</ol>
      </div>
    `;
  }

  function renderWelcome() {
    return `
      <div class="screen screen--welcome ${slideClass()}">
        <div class="welcome-card">
          <div class="welcome-visual welcome-visual--top scroll-reveal">
            <img
              src="assets/audience-bp.png"
              alt="Мужчина старше 50 лет измеряет давление тонометром"
              loading="lazy"
            >
          </div>
          <div class="welcome-card__badge pulse-badge">🎮 Интерактивный тест</div>
          <h2 class="screen__title">Готовы начать тест?</h2>
          <p class="welcome-visual__caption">Начните с простых вопросов о вашем здоровье</p>
          <p class="screen__text">
            8 простых вопросов помогут понять, <strong>пора ли обсудить со врачом статины</strong>.
            Отвечайте честно — это займёт около двух минут.
          </p>
          <ul class="welcome-card__features">
            <li class="stagger-item" style="--i:0"><span>⏱</span> 2 минуты</li>
            <li class="stagger-item" style="--i:1"><span>📝</span> 8 вопросов</li>
            <li class="stagger-item" style="--i:2"><span>📱</span> На телефоне и ПК</li>
          </ul>
          <div class="welcome-card__cta-wrap">
            <button type="button" class="btn btn--primary btn--large btn--test" data-action="next">
              Пройти тест
              <span class="btn__arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    `;
  }

  function renderChoice(step) {
    const selected = state.answers[step.field];
    const options = step.options.map((opt, i) => {
      const isSelected = selected === opt.value;
      return `
        <button
          type="button"
          class="choice-card choice-card--list stagger-item ${isSelected ? 'choice-card--selected' : ''}"
          style="--i:${i}"
          data-choice="${opt.value}"
          data-field="${step.field}"
        >
          <span class="choice-card__icon">${opt.icon}</span>
          <span class="choice-card__label">${escapeHtml(opt.label)}</span>
          <span class="choice-card__radio" aria-hidden="true"></span>
        </button>
      `;
    }).join('');

    return `
      <div class="screen ${slideClass()}">
        <span class="question-badge">Вопрос ${step.number}</span>
        <h2 class="screen__title">${escapeHtml(step.title)}</h2>
        <div class="choice-list">${options}</div>
        <div class="screen__actions">
          <button type="button" class="btn btn--ghost" data-action="back">← Назад</button>
          <button type="button" class="btn btn--primary" data-action="next" ${selected === undefined ? 'disabled' : ''}>
            ${step.number === 8 ? 'Узнать результат' : 'Далее →'}
          </button>
        </div>
      </div>
    `;
  }

  function renderResult() {
    const result = getStatinRecommendation(state.answers);
    const { score, maxScore, percent, risk, title, summary, actions, emoji, level, reasons, concernTip, concernLabel } = result;

    const levelClass = `result-card--${level}`;
    const reasonItems = reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('');
    const actionItems = actions.map((a) => `<li>${escapeHtml(a)}</li>`).join('');

    const riskMeter = Object.values(RISK_LEVELS).map((info) => {
      const active = info.id === risk.id ? 'risk-meter__item--active' : '';
      return `<div class="risk-meter__item ${active}" style="--risk-color: ${info.color}">
        <span class="risk-meter__dot"></span>
        <span class="risk-meter__label">${info.label}</span>
      </div>`;
    }).join('');

    const dashOffset = 283 - (283 * percent) / 100;

    return `
      <div class="screen screen--result ${slideClass()}">
        <div class="result-card ${levelClass} result-reveal">
          <div class="score-ring" style="--score-color: ${risk.color}">
            <svg class="score-ring__svg" viewBox="0 0 100 100">
              <circle class="score-ring__bg" cx="50" cy="50" r="45"/>
              <circle class="score-ring__fill" cx="50" cy="50" r="45"
                style="stroke-dashoffset: ${dashOffset}"/>
            </svg>
            <div class="score-ring__inner">
              <span class="score-ring__value">${score}</span>
              <span class="score-ring__of">из ${maxScore}</span>
            </div>
          </div>
          <div class="result-card__emoji pop-in">${emoji}</div>
          <p class="result-card__risk-label">Индекс внимания к статинам</p>
          <div class="risk-meter">${riskMeter}</div>
          <h2 class="result-card__title">${escapeHtml(title)}</h2>
          <p class="result-card__summary">${escapeHtml(summary)}</p>
          ${concernLabel ? `<p class="result-card__concern">💡 ${escapeHtml(concernTip)}</p>` : ''}
          <div class="result-card__reasons">
            <p class="result-card__reasons-title">Что повлияло на результат:</p>
            <ul>${reasonItems}</ul>
          </div>
          <div class="result-card__actions">
            <p class="result-card__actions-title">Что делать дальше:</p>
            <ol>${actionItems}</ol>
          </div>
        </div>
        ${renderFactsBlock()}
        ${renderLipidogramSection()}
        <div class="screen__actions screen__actions--center">
          <button type="button" class="btn btn--primary" data-action="restart">Пройти заново</button>
        </div>
      </div>
    `;
  }

  function toggleLipidAccordion(id) {
    state.lipidOpen = state.lipidOpen === id ? null : id;
    gamePanel.querySelectorAll('.lipid-card').forEach((card) => {
      const open = card.dataset.lipidId === state.lipidOpen;
      card.classList.toggle('lipid-card--open', open);
      card.querySelector('.lipid-card__header')?.setAttribute('aria-expanded', open);
    });
  }

  function updateChecklistUI() {
    const { checked, total, pct } = renderChecklistProgress();

    gamePanel.querySelectorAll('[data-check-id]').forEach((btn) => {
      const isChecked = !!state.checklist[btn.dataset.checkId];
      btn.classList.toggle('lipid-check__item--checked', isChecked);
      const box = btn.querySelector('.lipid-check__box');
      if (box) box.textContent = isChecked ? '✓' : '';
    });

    const fill = gamePanel.querySelector('.lipid-check__progress-fill');
    const text = gamePanel.querySelector('.lipid-check__progress-text');
    if (fill) fill.style.width = `${pct}%`;
    if (text) text.textContent = `${checked} из ${total}`;

    const hint = gamePanel.querySelector('.lipid-check__hint');
    if (hint) {
      const isComplete = checked >= total;
      hint.className = `lipid-check__hint ${isComplete ? 'lipid-check__hint--ok' : 'lipid-check__hint--warn'}`;
      hint.textContent = isComplete
        ? 'Отлично! У вас есть все основные показатели — принесите их на консультацию к врачу.'
        : 'Если каких-то показателей нет, возможно, стоит обсудить с врачом необходимость дополнительного обследования.';
    }
  }

  function toggleChecklistItem(id) {
    state.checklist[id] = !state.checklist[id];
    updateChecklistUI();
  }

  function initScrollAnimations() {
    const targets = document.querySelectorAll(
      '.lipid-animate:not(.lipid-animate--visible), .scroll-reveal:not(.scroll-reveal--visible)'
    );
    if (!targets.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('lipid-animate--visible', 'scroll-reveal--visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  function setFactsIndex(index) {
    state.factsIndex = (index + STATIN_FACTS.length) % STATIN_FACTS.length;
    const carousel = gamePanel.querySelector('.facts-carousel');
    if (carousel) {
      carousel.outerHTML = renderFactsCarousel();
      bindFactsEvents();
    }
  }

  function render() {
    if (state.stepIndex >= STEPS.length) {
      gamePanel.innerHTML = renderResult();
      setGuide('Ниже — простой разбор липидограммы. Отметьте, какие анализы у вас есть, и при необходимости закажите аудиоразбор.', true);
      progressBar.hidden = false;
      progressFill.style.width = '100%';
      progressText.textContent = 'Результат';
      bindEvents();
      requestAnimationFrame(() => initScrollAnimations());
      return;
    }

    const step = currentStep();
    setGuide(step.guide || step.title, step.type !== 'welcome');

    let html = '';
    if (step.type === 'welcome') html = renderWelcome();
    else if (step.type === 'choice') html = renderChoice(step);

    gamePanel.innerHTML = html;
    updateProgress();
    bindEvents();
  }

  function validateStep() {
    const step = currentStep();
    if (!step || step.type === 'welcome') return true;
    if (step.type === 'choice' && state.answers[step.field] === undefined) {
      const list = gamePanel.querySelector('.choice-list');
      if (list) {
        list.classList.add('shake');
        setTimeout(() => list.classList.remove('shake'), 500);
      }
      return false;
    }
    return true;
  }

  function goNext() {
    if (!validateStep()) return;
    state.direction = 'forward';
    state.stepIndex++;
    render();
  }

  function goBack() {
    if (state.stepIndex <= 0) return;
    state.direction = 'back';
    state.stepIndex--;
    render();
  }

  function restart() {
    state.stepIndex = 0;
    state.answers = {};
    state.direction = 'forward';
    state.factsIndex = 0;
    state.lipidOpen = 'ldl';
    state.checklist = {};
    render();
  }

  function bindLipidEvents() {
    gamePanel.querySelectorAll('[data-lipid-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleLipidAccordion(btn.dataset.lipidToggle);
      });
    });
    gamePanel.querySelectorAll('[data-check-id]').forEach((btn) => {
      btn.addEventListener('click', () => {
        toggleChecklistItem(btn.dataset.checkId);
      });
    });
  }

  function bindFactsEvents() {
    gamePanel.querySelector('[data-fact-prev]')?.addEventListener('click', () => {
      setFactsIndex(state.factsIndex - 1);
    });
    gamePanel.querySelector('[data-fact-next]')?.addEventListener('click', () => {
      setFactsIndex(state.factsIndex + 1);
    });
    gamePanel.querySelectorAll('[data-fact-dot]').forEach((dot) => {
      dot.addEventListener('click', () => {
        setFactsIndex(Number(dot.dataset.factDot));
      });
    });
  }

  function bindEvents() {
    gamePanel.querySelectorAll('[data-action="next"]').forEach((btn) => {
      btn.addEventListener('click', goNext);
    });
    gamePanel.querySelectorAll('[data-action="back"]').forEach((btn) => {
      btn.addEventListener('click', goBack);
    });
    gamePanel.querySelectorAll('[data-action="restart"]').forEach((btn) => {
      btn.addEventListener('click', restart);
    });

    gamePanel.querySelectorAll('[data-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.field;
        const value = btn.dataset.choice;
        state.answers[field] = value;

        gamePanel.querySelectorAll(`[data-field="${field}"]`).forEach((b) => {
          b.classList.toggle('choice-card--selected', b === btn);
        });

        const nextBtn = gamePanel.querySelector('[data-action="next"]');
        if (nextBtn) {
          nextBtn.disabled = false;
          nextBtn.classList.add('btn--pulse-once');
          setTimeout(() => nextBtn.classList.remove('btn--pulse-once'), 600);
        }
      });
    });

    bindFactsEvents();
    bindLipidEvents();
    initScrollAnimations();
  }

  render();
  initScrollAnimations();
})();
