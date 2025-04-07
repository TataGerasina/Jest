const { Given, When, Then } = require('@cucumber/cucumber');
const { clickElement, getText } = require("../../lib/commands.js");

Given('Я нахожусь на главной странице', async function() {
  await this.page.goto("https://qamid.tmweb.ru/client/index.php", { 
    waitUntil: 'networkidle2',
    timeout: 20000 
  });
});

When('Я выбираю дату {string} и время {string}', async function(day, time) {
  await clickElement(this.page, `a.page-nav__day[data-time-stamp="${dayToWeek(day)}"]`); //"1743973200"
  await clickElement(this.page, `a.movie-seances__time[data-seance-start="${timeToMinutes(time)}"]`);
});

When('Я выбираю одно свободное стандартное место', async function() {
  await this.page.waitForSelector('.buying-scheme__chair_standart', { timeout: 30000 });
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
  const expected = 'Идёмвкино';
  const actual = await getText(this.page, "h1.page-header__title");
  expect(actual.replace(/\s+/g, '')).to.include(expected);
});

Then('Я вижу сообщение об ошибке {string}', async function(message) {
  const errorText = await getText(this.page, '.error-message');
  expect(errorText).to.include(message);
});

function timeToMinutes(timeStr) {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

function dayToWeek(dayStr) {
  const[days, weeks] = dayStr.split(',').map(Number);
  return days * 7 + weeks;
}