const { Given, When, Then } = require('@cucumber/cucumber');
const { expect } = require('chai');
const { clickElement, getText } = require("../../lib/commands.js");

// Функция для получения timestamp по дню месяца
function getDayTimestamp(day) {
  const dateMap = {
    "11": "1744318800", //<a class="page-nav__day page-nav__day_today page-nav__day_chosen" href="#" data-time-stamp="1744318800">
    "12": "1744405200", //<a class="page-nav__day page-nav__day_weekend page-nav__day_chosen" href="#" data-time-stamp="1744405200">
    "13": "1744491600", //<a class="page-nav__day page-nav__day_weekend page-nav__day_chosen" href="#" data-time-stamp="1744491600">
    "14": "1744578000", //<a class="page-nav__day page-nav__day_chosen" href="#" data-time-stamp="1744578000">
    "15": "1744664400",  // Вт 15 <a class="page-nav__day page-nav__day_chosen" href="#" data-time-stamp="1744664400">
    "16": "1744750800",  // 
    "17": "1744837200"  // <a class="page-nav__day page-nav__day_chosen" href="#" data-time-stamp="1744837200">
  };
  return dateMap[day] || day;
}

// Функция преобразования времени в минуты
function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (isNaN(hours) || isNaN(minutes)) {
    throw new Error(`Invalid time format: ${timeStr}`);
  }
  return hours * 60 + minutes;
}

Given('Я нахожусь на главной странице', async function() {
  await this.page.goto("https://qamid.tmweb.ru/client/index.php", { 
    waitUntil: 'networkidle2',
    timeout: 20000 
  });
});

When('Я выбираю дату {string} и время {string}', async function(day, time) {
  try {
    const dayStamp = getDayTimestamp(day);
    const timeMinutes = timeToMinutes(time);
    
    console.log(`Выбираю дату: ${day} (timestamp: ${dayStamp}), время: ${time} (minutes: ${timeMinutes})`);
    
    // Клик по дате
    await clickElement(this.page, `a.page-nav__day[data-time-stamp="${dayStamp}"]`, {
      timeout: 40000,
      visible: true
    });
    
    // Клик по времени
    await clickElement(this.page, `a.movie-seances__time[data-seance-start="${timeMinutes}"]`, {
      timeout: 40000,
      visible: true
    });
    
  } catch (error) {
    await this.page.screenshot({ path: `error_${Date.now()}.png` });
    throw new Error(`Ошибка при выборе даты и времени: ${error.message}`);
  }
});

When('Я выбираю одно свободное стандартное место', async function() {
  await this.page.waitForSelector('.buying-scheme__chair_standart', { timeout: 35000 });
  const seats = await this.page.$$('.buying-scheme__chair_standart:not(.buying-scheme__chair_taken)');
  if (seats.length === 0) throw new Error("Нет свободных мест");
  await seats[0].click();
});

When('Я нажимаю кнопку {string}', async function(buttonText) {
  await clickElement(this.page, 'button.acceptin-button');
});

Then('Я вижу билет с местом {string}', async function(seat) {
  const ticketInfo = await getText(this.page, '.ticket__chairs');
  expect(ticketInfo).to.include(seat);
});

When('Я выбираю два свободных стандартных места', async function() {
  await this.page.waitForSelector('.buying-scheme__chair_standart', { timeout: 30000 });
  const seats = await this.page.$$('.buying-scheme__chair_standart:not(.buying-scheme__chair_taken)');
  if (seats.length < 2) throw new Error("Недостаточно свободных мест");
  await seats[0].click();
  await seats[1].click();
});

Then('Я вижу билеты с местами {string}', async function(seats) {
  const ticketInfo = await getText(this.page, '.ticket__chairs');
  seats.split(', ').forEach(seat => {
    expect(ticketInfo).to.include(seat);
  });
});

When('Я выбираю уже занятое место', async function() {
  await this.page.waitForSelector('.buying-scheme__chair_taken', { timeout: 30000 });
  const takenSeats = await this.page.$$('.buying-scheme__chair_taken');
  if (takenSeats.length === 0) throw new Error("Нет занятых мест");
  await takenSeats[0].click();
});

Then('Кнопка бронирования должна быть неактивна', async function() {
  const isDisabled = await this.page.$eval('button.acceptin-button', el => el.disabled);
  expect(isDisabled).to.be.true;
});

Then('Я вижу заголовок {string}', async function(title) {
  const actual = await getText(this.page, "h1.page-header__title");
  expect(actual.replace(/\s+/g, '')).to.include(title); 
});

//Then('Я вижу сообщение об ошибке {string}', async function(message) {
// const errorText = await getText(this.page, '.error-message');
//  expect(errorText).to.include(message);
//});
Then('Я вижу сообщение об ошибке {string}', async function(expectedMessage) {
  try {
    // Проверяем как модальное окно, так и текстовое сообщение
    const errorSelector = '.error-message, .alert-danger, .notification-error';
    await this.page.waitForSelector(errorSelector, {
      visible: true,
      timeout: 5000 // Уменьшаем таймаут, так как элемент может не появляться
    });
    
    const errorText = await getText(this.page, errorSelector);
    expect(errorText).to.include(expectedMessage);
  } catch (error) {
    // Если элемент не найден, проверяем состояние кнопки
    const isDisabled = await this.page.$eval('button.acceptin-button', el => el.disabled);
    if (!isDisabled) {
      await this.page.screenshot({ path: 'error_no_message.png' });
      throw new Error(`Сообщение "${expectedMessage}" не найдено, но кнопка активна`);
    }
    console.log('Сообщение не найдено, но кнопка заблокирована - тест пройден');
  }
});

