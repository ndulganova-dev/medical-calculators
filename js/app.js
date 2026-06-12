(function () {
  const STEPS = [
  {
    id: 'welcome',
    type: 'welcome',
    guide: 'Здравствуйте! Я помогу вам разобраться, стоит ли обсудить с врачом терапию статинами. Это займёт всего пару минут.',
  },
  {
    id: 'age',
    type: 'number',
    field: 'age',
    title: 'Сколько вам полных лет?',
    hint: 'Возраст — один из ключевых факторов оценки риска.',
    guide: 'Начнём с простого — укажите ваш возраст.',
    min: 18,
    max: 100,
    placeholder: 'Например, 58',
  },
  {
    id: 'sex',
    type: 'choice',
    field: 'sex',
    title: 'Укажите ваш пол',
    guide: 'Это нужно для корректной оценки риска.',
    options: [
      { value: 'female', label: 'Женский', icon: '👩' },
      { value: 'male', label: 'Мужской', icon: '👨' },
    ],
  },
  {
    id: 'cvd',
    type: 'choice',
    field: 'hadCardiovascularEvent',
    title: 'Были ли у вас серьёзные сердечно-сосудистые события?',
    hint: 'Инфаркт, инсульт, стентирование, шунтирование, транзиторная ишемическая атака.',
    guide: 'Если такие события уже были — это очень важная информация.',
    options: [
      { value: true, label: 'Да, были', icon: '⚠️' },
      { value: false, label: 'Нет, не было', icon: '✓' },
    ],
  },
  {
    id: 'diabetes',
    type: 'choice',
    field: 'diabetes',
    title: 'Есть ли у вас сахарный диабет?',
    guide: 'Диабет существенно влияет на решение о статинах.',
    options: [
      { value: true, label: 'Да', icon: '🩸' },
      { value: false, label: 'Нет', icon: '✓' },
    ],
    followUp: {
      when: (a) => a.diabetes === true,
      step: {
        id: 'diabetesComp',
        type: 'choice',
        field: 'diabetesComplications',
        title: 'Есть ли осложнения диабета?',
        hint: 'Поражение почек, сетчатки, нейропатия, ишемия нижних конечностей.',
        guide: 'Осложнения диабета повышают категорию риска.',
        options: [
          { value: true, label: 'Да, есть осложнения', icon: '⚠️' },
          { value: false, label: 'Нет осложнений', icon: '✓' },
        ],
      },
    },
  },
  {
    id: 'riskFactors',
    type: 'multi',
    title: 'Отметьте, что относится к вам',
    hint: 'Можно выбрать несколько пунктов или пропустить, если ничего нет.',
    guide: 'Теперь отметьте факторы, которые могут повышать риск.',
    fields: [
      { field: 'smoking', label: 'Курю или бросил(а) менее года назад', icon: '🚬' },
      { field: 'hypertension', label: 'Повышенное давление (на лечении)', icon: '💓', value: 'treated' },
      { field: 'hypertensionUntreated', label: 'Повышенное давление (не лечу)', icon: '📈', mapsTo: 'hypertension', value: 'untreated' },
      { field: 'familyEarlyCVD', label: 'Ранние инфаркт/инсульт у близких родственников', icon: '👨‍👩‍👧' },
      { field: 'familialHypercholesterolemia', label: 'Мне говорили о семейной гиперхолестеринемии', icon: '🧬' },
      { field: 'chronicKidney', label: 'Хроническая болезнь почек', icon: '🫘', value: 'moderate' },
    ],
  },
  {
    id: 'lipids',
    type: 'lipids',
    title: 'Знаете ли вы свой холестерин?',
    guide: 'Если есть результаты анализов — введите их. Если нет — это тоже нормально.',
  },
  {
    id: 'statin',
    type: 'choice',
    field: 'onStatin',
    title: 'Принимаете ли вы сейчас статины?',
    guide: 'Последний вопрос — и я подготовлю для вас персональную рекомендацию.',
    options: [
      { value: true, label: 'Да, принимаю', icon: '💊' },
      { value: false, label: 'Нет', icon: '—' },
    ],
  },
  ];

  const state = {
    stepIndex: 0,
    answers: {},
    expandedSteps: [],
  };

  const gamePanel = document.getElementById('gamePanel');
  const guideMessage = document.getElementById('guideMessage');
  const progressBar = document.getElementById('progressBar');
  const progressFill = document.getElementById('progressFill');
  const progressText = document.getElementById('progressText');

  function buildStepList() {
    const list = [];
    for (const step of STEPS) {
      list.push(step);
      if (step.followUp && step.followUp.when(state.answers)) {
        list.push(step.followUp.step);
      }
    }
    return list;
  }

  function getActiveSteps() {
    if (state.expandedSteps.length) return state.expandedSteps;
    state.expandedSteps = buildStepList();
    return state.expandedSteps;
  }

  function refreshSteps() {
    state.expandedSteps = buildStepList();
  }

  function currentStep() {
    return getActiveSteps()[state.stepIndex];
  }

  function totalQuestionSteps() {
    return getActiveSteps().filter((s) => s.type !== 'welcome').length;
  }

  function currentQuestionNumber() {
    const steps = getActiveSteps().slice(0, state.stepIndex + 1);
    return steps.filter((s) => s.type !== 'welcome').length;
  }

  function updateProgress() {
    const step = currentStep();
    if (!step || step.type === 'welcome') {
      progressBar.hidden = true;
      return;
    }
    progressBar.hidden = false;
    const total = totalQuestionSteps();
    const current = currentQuestionNumber();
    const pct = Math.round((current / total) * 100);
    progressFill.style.width = `${pct}%`;
    progressText.textContent = `Шаг ${current} из ${total}`;
  }

  function setGuide(text) {
    guideMessage.textContent = text;
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function renderWelcome(step) {
    return `
      <div class="screen screen--welcome fade-in">
        <div class="welcome-card">
          <div class="welcome-card__badge">🎮 Интерактивная игра</div>
          <h2 class="screen__title">Добро пожаловать!</h2>
          <p class="screen__text">
            Этот калькулятор поможет понять, <strong>пора ли вам обсудить со врачом статины</strong>.
            Отвечайте честно — результат увидите только вы.
          </p>
          <ul class="welcome-card__features">
            <li><span>⏱</span> 2–3 минуты</li>
            <li><span>🔒</span> Без регистрации</li>
            <li><span>📱</span> Работает на телефоне</li>
          </ul>
          <button type="button" class="btn btn--primary btn--large" data-action="next">
            Начать игру
            <span class="btn__arrow">→</span>
          </button>
        </div>
      </div>
    `;
  }

  function renderNumber(step) {
    const val = state.answers[step.field] ?? '';
    return `
      <div class="screen fade-in">
        <h2 class="screen__title">${escapeHtml(step.title)}</h2>
        ${step.hint ? `<p class="screen__hint">${escapeHtml(step.hint)}</p>` : ''}
        <div class="input-group">
          <input
            type="number"
            class="input input--large"
            id="field-${step.field}"
            min="${step.min}"
            max="${step.max}"
            placeholder="${escapeHtml(step.placeholder || '')}"
            value="${val}"
            inputmode="numeric"
          >
          <span class="input-group__suffix">лет</span>
        </div>
        <div class="screen__actions">
          <button type="button" class="btn btn--ghost" data-action="back">← Назад</button>
          <button type="button" class="btn btn--primary" data-action="next">Далее →</button>
        </div>
      </div>
    `;
  }

  function renderChoice(step) {
    const selected = state.answers[step.field];
    const options = step.options.map((opt) => {
      const isSelected = selected === opt.value;
      return `
        <button
          type="button"
          class="choice-card ${isSelected ? 'choice-card--selected' : ''}"
          data-choice="${opt.value}"
          data-field="${step.field}"
          data-bool="${typeof opt.value === 'boolean'}"
        >
          <span class="choice-card__icon">${opt.icon}</span>
          <span class="choice-card__label">${escapeHtml(opt.label)}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="screen fade-in">
        <h2 class="screen__title">${escapeHtml(step.title)}</h2>
        ${step.hint ? `<p class="screen__hint">${escapeHtml(step.hint)}</p>` : ''}
        <div class="choice-grid">${options}</div>
        <div class="screen__actions">
          <button type="button" class="btn btn--ghost" data-action="back">← Назад</button>
          <button type="button" class="btn btn--primary" data-action="next" ${selected === undefined ? 'disabled' : ''}>Далее →</button>
        </div>
      </div>
    `;
  }

  function renderMulti(step) {
    const a = state.answers;
    const cards = step.fields.map((f) => {
      let checked = false;
      if (f.mapsTo) {
        checked = a[f.mapsTo] === f.value;
      } else if (f.field === 'hypertension') {
        checked = a.hypertension === f.value;
      } else if (f.field === 'chronicKidney') {
        checked = a.chronicKidney === f.value;
      } else {
        checked = !!a[f.field];
      }
      return `
        <button type="button" class="multi-card ${checked ? 'multi-card--selected' : ''}" data-multi-field="${f.field}" data-maps-to="${f.mapsTo || ''}" data-value="${f.value !== undefined ? f.value : 'true'}">
          <span class="multi-card__icon">${f.icon}</span>
          <span class="multi-card__label">${escapeHtml(f.label)}</span>
          <span class="multi-card__check">${checked ? '✓' : ''}</span>
        </button>
      `;
    }).join('');

    return `
      <div class="screen fade-in">
        <h2 class="screen__title">${escapeHtml(step.title)}</h2>
        ${step.hint ? `<p class="screen__hint">${escapeHtml(step.hint)}</p>` : ''}
        <div class="multi-grid">${cards}</div>
        <div class="screen__actions">
          <button type="button" class="btn btn--ghost" data-action="back">← Назад</button>
          <button type="button" class="btn btn--primary" data-action="next">Далее →</button>
        </div>
      </div>
    `;
  }

  function renderLipids(step) {
    const ldl = state.answers.ldl ?? '';
    const totalChol = state.answers.totalChol ?? '';
    const knows = state.answers.knowsLipids;

    return `
      <div class="screen fade-in">
        <h2 class="screen__title">${escapeHtml(step.title)}</h2>
        <div class="lipid-toggle">
          <button type="button" class="lipid-toggle__btn ${knows !== false ? 'lipid-toggle__btn--active' : ''}" data-lipid-mode="yes">Знаю результаты</button>
          <button type="button" class="lipid-toggle__btn ${knows === false ? 'lipid-toggle__btn--active' : ''}" data-lipid-mode="no">Не сдавал(а) / не помню</button>
        </div>
        <div class="lipid-fields" ${knows === false ? 'hidden' : ''}>
          <label class="field-label">
            Холестерин ЛПНП (ммоль/л)
            <input type="text" class="input" id="field-ldl" placeholder="Например, 3,2" value="${escapeHtml(String(ldl))}" inputmode="decimal">
          </label>
          <label class="field-label">
            Общий холестерин (если ЛПНП не знаете)
            <input type="text" class="input" id="field-totalChol" placeholder="Например, 5,8" value="${escapeHtml(String(totalChol))}" inputmode="decimal">
          </label>
          <p class="screen__hint">Можно использовать запятую или точку. Достаточно одного показателя.</p>
        </div>
        <div class="screen__actions">
          <button type="button" class="btn btn--ghost" data-action="back">← Назад</button>
          <button type="button" class="btn btn--primary" data-action="next">Далее →</button>
        </div>
      </div>
    `;
  }

  function renderResult() {
    const result = getStatinRecommendation(state.answers);
    const { risk, ldl, title, summary, actions, emoji, level } = result;

    const levelClass = `result-card--${level}`;
    const reasons = risk.reasons.map((r) => `<li>${escapeHtml(r)}</li>`).join('');
    const actionItems = actions.map((a) => `<li>${escapeHtml(a)}</li>`).join('');

    const ldlBlock = ldl !== null
      ? `<p class="result-card__ldl">Ваш ЛПНП: <strong>${formatLdl(ldl)} ммоль/л</strong> · Цель для вашей категории: &lt; ${risk.ldlTarget} ммоль/л</p>`
      : `<p class="result-card__ldl">ЛПНП не указан — сдайте анализ для точной оценки</p>`;

    const riskMeter = ['low', 'moderate', 'high', 'veryHigh'].map((id) => {
      const info = RISK_LEVELS[id];
      const active = id === risk.id ? 'risk-meter__item--active' : '';
      return `<div class="risk-meter__item ${active}" style="--risk-color: ${info.color}">
        <span class="risk-meter__dot"></span>
        <span class="risk-meter__label">${info.label}</span>
      </div>`;
    }).join('');

    return `
      <div class="screen screen--result fade-in">
        <div class="result-card ${levelClass}">
          <div class="result-card__emoji">${emoji}</div>
          <p class="result-card__risk-label">Категория риска: ${escapeHtml(risk.label)}</p>
          <div class="risk-meter">${riskMeter}</div>
          ${ldlBlock}
          <h2 class="result-card__title">${escapeHtml(title)}</h2>
          <p class="result-card__summary">${escapeHtml(summary)}</p>
          <div class="result-card__reasons">
            <p class="result-card__reasons-title">На основании:</p>
            <ul>${reasons}</ul>
          </div>
          <div class="result-card__actions">
            <p class="result-card__actions-title">Что делать дальше:</p>
            <ol>${actionItems}</ol>
          </div>
        </div>
        <div class="screen__actions screen__actions--center">
          <button type="button" class="btn btn--primary" data-action="restart">Пройти заново</button>
        </div>
      </div>
    `;
  }

  function render() {
    if (state.stepIndex >= getActiveSteps().length) {
      gamePanel.innerHTML = renderResult();
      setGuide('Вот ваш результат! Помните: окончательное решение всегда принимает врач вместе с вами.');
      updateProgress();
      bindEvents();
      return;
    }

    const step = currentStep();
    setGuide(step.guide || step.title);

    let html = '';
    switch (step.type) {
      case 'welcome': html = renderWelcome(step); break;
      case 'number': html = renderNumber(step); break;
      case 'choice': html = renderChoice(step); break;
      case 'multi': html = renderMulti(step); break;
      case 'lipids': html = renderLipids(step); break;
      default: html = '<p>Неизвестный шаг</p>';
    }

    gamePanel.innerHTML = html;
    updateProgress();
    bindEvents();
  }

  function validateStep() {
    const step = currentStep();
    if (!step) return true;

    if (step.type === 'number') {
      const input = document.getElementById(`field-${step.field}`);
      const val = Number(input?.value);
      if (!val || val < step.min || val > step.max) {
        shake(input);
        return false;
      }
      state.answers[step.field] = val;
    }

    if (step.type === 'choice') {
      if (state.answers[step.field] === undefined) return false;
    }

    if (step.type === 'lipids') {
      if (state.answers.knowsLipids === false) {
        state.answers.ldl = null;
        state.answers.totalChol = null;
      } else {
        const ldlRaw = document.getElementById('field-ldl')?.value?.trim();
        const totalRaw = document.getElementById('field-totalChol')?.value?.trim();
        state.answers.ldl = ldlRaw ? parseNumber(ldlRaw) : null;
        state.answers.totalChol = totalRaw ? parseNumber(totalRaw) : null;
        state.answers.knowsLipids = true;
        if (!ldlRaw && !totalRaw) {
          state.answers.knowsLipids = false;
        }
      }
    }

    if (step.id === 'diabetes') {
      refreshSteps();
    }

    return true;
  }

  function shake(el) {
    if (!el) return;
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 500);
  }

  function goNext() {
    if (!validateStep()) return;
    state.stepIndex++;
    render();
  }

  function goBack() {
    if (state.stepIndex <= 0) return;
    state.stepIndex--;
    refreshSteps();
    render();
  }

  function restart() {
    state.stepIndex = 0;
    state.answers = {};
    state.expandedSteps = [];
    render();
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
        let value = btn.dataset.choice;
        if (btn.dataset.bool === 'true') {
          value = value === 'true';
        }
        state.answers[field] = value;
        gamePanel.querySelectorAll(`[data-field="${field}"]`).forEach((b) => {
          b.classList.toggle('choice-card--selected', b === btn);
        });
        const nextBtn = gamePanel.querySelector('[data-action="next"]');
        if (nextBtn) nextBtn.disabled = false;
      });
    });

    gamePanel.querySelectorAll('[data-multi-field]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const field = btn.dataset.multiField;
        const mapsTo = btn.dataset.mapsTo;
        const value = btn.dataset.value;
        const targetField = mapsTo || field;

        if (field === 'chronicKidney') {
          state.answers.chronicKidney = state.answers.chronicKidney === 'moderate' ? null : 'moderate';
        } else if (field === 'hypertension' || field === 'hypertensionUntreated') {
          const current = state.answers.hypertension;
          state.answers.hypertension = current === value ? null : value;
        } else {
          state.answers[field] = !state.answers[field];
        }

        render();
      });
    });

    gamePanel.querySelectorAll('[data-lipid-mode]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.lipidMode;
        state.answers.knowsLipids = mode === 'yes';
        render();
      });
    });

    const ageInput = document.getElementById('field-age');
    if (ageInput) {
      ageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') goNext();
      });
    }
  }

  render();
})();
