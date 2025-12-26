src="https://snipp.ru/cdn/jquery/2.1.1/jquery.min.js">
  console.log('Скрипт подключился!');
let mainExamples = [];    // Основной тест: a + b = ?, a − b − c = ?
let gapExamples = [];     // Новый тест: 1 + ? = 5, 5 − 2 − ? = 1
// Генерация основного теста (9 примеров: 6 с двумя числами, 3 с тремя)
function generateMainExamples() {
  mainExamples = [];
  const total = 9;
  const threeOperandCount = Math.round(total * 0.3); // 3 примера
  const twoOperandCount = total - threeOperandCount;    // 6 примеров
  // Примеры с двумя числами
  for (let i = 0; i < twoOperandCount; i++) {
    let a, b, result, op;
    op = Math.random() < 0.5 ? '+' : '−';

    if (op === '+') {
      do {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * 10) + 1;
        result = a + b;
      } while (result > 20);
    } else {
      do {
        a = Math.floor(Math.random() * 19) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        result = a - b;
      } while (result < 1);
    }
    mainExamples.push({
      expr: `${a} ${op} ${b} =`,
      correct: result,
      operation: op
    });
  }

  // Примеры с тремя числами
  for (let i = 0; i < threeOperandCount; i++) {
    let a, b, c, result, op;
    op = Math.random() < 0.5 ? '+' : '−';

    if (op === '+') {
      do {
        a = Math.floor(Math.random() * 8) + 1;
        b = Math.floor(Math.random() * 8) + 1;
        c = Math.floor(Math.random() * 8) + 1;
        result = a + b + c;
      } while (result > 20);
    } else {
      do {
        a = Math.floor(Math.random() * 15) + 3;
        b = Math.floor(Math.random() * (a - 2)) + 1;
        c = Math.floor(Math.random() * (a - b - 1)) + 1;
        result = a - b - c;
      } while (result < 1);
    }

    mainExamples.push({
      expr: `${a} ${op} ${b} ${op} ${c} =`,
      correct: result,
      operation: op
    });
  }
}

// Генерация теста с пропусками (9 примеров)
function generateGapExamples() {
  gapExamples = [];
  const total = 9;

  for (let i = 0; i < total; i++) {
    let expr, correct, op, a, b, c, result;
    const type = Math.random() < 0.5 ? 'two' : 'three'; // два или три числа
    op = Math.random() < 0.5 ? '+' : '−';

    if (type === 'two') {
      // Пример вида a + ? = result или a − ? = result
      if (op === '+') {
        a = Math.floor(Math.random() * 10) + 1;
        b = Math.floor(Math.random() * (20 - a)) + 1;
        result = a + b;
        expr = `${a} + ? = ${result}`;
        correct = b;
      } else {
        a = Math.floor(Math.random() * 19) + 2;
        b = Math.floor(Math.random() * (a - 1)) + 1;
        result = a - b;
        expr = `${a} − ? = ${result}`;
        correct = b;
      }
    } else {
      // Пример вида a + b + ? = result или a − b − ? = result
      if (op === '+') {
        a = Math.floor(Math.random() * 6) + 1;
        b = Math.floor(Math.random() * 6) + 1;
        c = Math.floor(Math.random() * (20 - a - b)) + 1;
        result = a + b + c;
        expr = `${a} + ${b} + ? = ${result}`;
        correct = c;
      } else {
        a = Math.floor(Math.random() * 15) + 3;
        b = Math.floor(Math.random() * (a - 2)) + 1;
        c = Math.floor(Math.random() * (a - b - 1)) + 1;
        result = a - b - c;
        expr = `${a} − ${b} − ? = ${result}`;
        correct = c;
      }
    }

    gapExamples.push({ expr, correct });
  }
}

// Отрисовка заданий
function renderTasks() {
  const mainTasksDiv = document.getElementById('main-tasks');
  const gapTasksDiv = document.getElementById('gap-tasks');


  // Явно скрываем модальное окно при генерации заданий
  const modal = document.getElementById('modal');
  if (modal) {
    modal.style.display = 'none';
  }

  generateMainExamples();
  generateGapExamples();

  mainTasksDiv.innerHTML = '';
  gapTasksDiv.innerHTML = '';

  // Отрисовываем основной тест (слева)
  mainExamples.forEach((ex, idx) => {
    mainTasksDiv.innerHTML += `
        <div class="task">
          <span class="task-label example-spacing">Пример ${idx + 1}:</span>
          <span>${ex.expr}</span>
          <input type="number" id="main_ans_${idx}" min="1" max="20" required>
        </div>
      `;
  });

  // Отрисовываем тест с пропусками (справа)
  gapExamples.forEach((ex, idx) => {
    gapTasksDiv.innerHTML += `
        <div class="task">
          <span class="task-label example-spacing">Пример ${idx + 1}:</span>
          <span>${ex.expr}</span>
          <input type="number" id="gap_ans_${idx}" min="1" max="20" required>
        </div>
      `;
  });
}



function showModal(correctCount) {
  const modal = document.getElementById('modal');
  const modalResult = document.getElementById('modal-result');

  if (!modal || !modalResult) {
    console.error('Элементы не найдены:', { modal, modalResult });
    return;
  }

  modal.style.display = 'flex';

  document.querySelector('.close-btn').onclick = () => {
    awardCrystals(correctCount);
    modal.style.display = 'none';
  };

  window.onclick = (event) => {
    if (event.target === modal) {
      awardCrystals(correctCount);
      modal.style.display = 'none';
    }
  };
}









function awardCrystals(correctCount) {
  const crystalsPerCorrect = 5;
  const totalCrystals = correctCount * crystalsPerCorrect;

  let storedData;
  try {
    const raw = localStorage.getItem('crystals');
    storedData = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Ошибка парсинга localStorage:', e);
    return;
  }

  // Инициализация storedData, если его нет
  if (!storedData) {
    storedData = {
      total: 0,
      math: 0,
      reading: 0,
      quarantine: 0,
      history: []
    };
  }

  // Гарантируем, что history существует и является массивом
  if (!Array.isArray(storedData.history)) {
    storedData.history = [];
  }

  // Начисляем кристаллы
  storedData.quarantine += totalCrystals;
  storedData.math += totalCrystals;

  // Добавляем запись в историю
  storedData.history.push({
    timestamp: new Date().toISOString(),
    type: 'test',
    correct: correctCount,
    total: mainExamples.length + gapExamples.length,
    crystals: totalCrystals
  });

  // Сохраняем в localStorage
  localStorage.setItem('crystals', JSON.stringify(storedData));
  updateBalanceDisplay();
}



















function checkResults() {
  let correctCount = 0;
  const total = mainExamples.length + gapExamples.length;

  // Буферы для двух колонок
  let leftColContent = '<h3>Основной тест</h3>';
  let rightColContent = '<h3>Тест с пропусками</h3>';

  // === БЛОК ЧТЕНИЯ И ИНИЦИАЛИЗАЦИИ STOREDDATA ===
  let storedData;
  try {
    const raw = localStorage.getItem('crystals');
    storedData = raw ? JSON.parse(raw) : null;
  } catch (e) {
    console.error('Ошибка парсинга localStorage:', e);
    storedData = null;
  }

  if (!storedData) {
    storedData = { total: 0, math: 0, reading: 0, quarantine: 0, history: [] };
  }
  if (!Array.isArray(storedData.history)) {
    storedData.history = [];
  }
  // === КОНЕЦ БЛОКА ===

  // Проверка основного теста (левая колонка)
  mainExamples.forEach((ex, idx) => {
    const userAnswer = parseInt(document.getElementById(`main_ans_${idx}`).value);
    if (!isNaN(userAnswer) && userAnswer === ex.correct) {
      correctCount++;
      leftColContent += `<p class="correct">Пример ${idx + 1}: верно (${ex.correct})</p>`;
    } else {
      const displayAnswer = isNaN(userAnswer) ? '—' : userAnswer;
      leftColContent += `<p class="incorrect">Пример ${idx + 1}: неверно. Ваш ответ: ${displayAnswer}, правильный: ${ex.correct}</p>`;
    }
  });

  // Проверка теста с пропусками (правая колонка)
  gapExamples.forEach((ex, idx) => {
    const userAnswer = parseInt(document.getElementById(`gap_ans_${idx}`).value);
    if (!isNaN(userAnswer) && userAnswer === ex.correct) {
      correctCount++;
      rightColContent += `<p class="correct">Пример ${idx + 1} (пропуск): верно (${ex.correct})</p>`;
    } else {
      const displayAnswer = isNaN(userAnswer) ? '—' : userAnswer;
      rightColContent += `<p class="incorrect">Пример ${idx + 1} (пропуск): неверно. Ваш ответ: ${displayAnswer}, правильный: ${ex.correct}</p>`;
    }
  });

  // Формируем итоговый отчёт (под колонками)
  const crystalsPerCorrect = 5;
  const totalCrystals = correctCount * crystalsPerCorrect;

  let summary = `
    <div class="modal-summary">
      <h3>Итого: ${correctCount} из ${total} верно</h3>
      <p>Правильных ответов: ${correctCount} из ${total}</p>
      <p>Начислено кристаллов: ${totalCrystals}</p>
  `;

  // Добавляем ссылку на новый уровень, если правильных ответов 10 или больше
  if (correctCount >= 10) {
    summary += `
      <div style="margin-top: 20px; text-align: center;">
      <a
  href="progres.html"
  onclick="event.preventDefault(); awardCrystals(${correctCount}); window.location.href='progres.html';"
  style="..."
>
ЗАЧИСЛИТЬ КРИСТАЛЛЫ И ПЕРЕЙТИ НА УРОВЕНЬ 2
        </a>
      </div>
    `;
  }

  summary += '</div>'; // закрываем modal-summary

  // Передаём готовые колонки в модальное окно
  const modalResult = document.getElementById('modal-result');
  if (modalResult) {
    modalResult.innerHTML = `
      <div class="modal-results-container">
        <div class="modal-column left">${leftColContent}</div>
        <div class="modal-column right">${rightColContent}</div>
      </div>
      ${summary}
    `;
  } else {
    console.error('Элемент #modal-result не найден');
  }

  showModal(correctCount); // передаём количество правильных ответов

}








window.onload = renderTasks;



function initCrystalStorage() {
  const defaultData = {
    total: 0,
    quarantine: 0,
    math: 0,
    reading: 0,
    history: []
  };

  const existingData = localStorage.getItem('crystals');
  if (!existingData) {
    localStorage.setItem('crystals', JSON.stringify(defaultData));
    console.log('localStorage инициализирован');
  } else {
    console.log('Данные уже существуют, инициализация не требуется');
  }
}
function updateBalanceDisplay() {
  const storedDataStr = localStorage.getItem('crystals');

  if (!storedDataStr) {
    console.error('Данные не найдены в localStorage');
    return;
  }

  try {
    const storedData = JSON.parse(storedDataStr);

    // Здесь можно добавить логику, если позже появятся элементы для отображения
    // Пока функция просто проверяет целостность данных и молчит при успехе

  } catch (e) {
    console.error('Ошибка при парсинге JSON:', e);
  }
}



const quarantineCrystals = JSON.parse(localStorage.getItem('crystals'))?.quarantine ?? 0;
console.log('Кристаллов в карантине:', quarantineCrystals);
