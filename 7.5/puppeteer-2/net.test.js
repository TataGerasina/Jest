const { clickElement, putText, getText } = require("./lib/commands.js");
const { generateName } = require("./lib/util.js");

let page;

beforeAll(async () => {
  // Увеличиваем глобальный таймаут для всех тестов
  jest.setTimeout(60000);
});

beforeEach(async () => {
  page = await browser.newPage();
  await page.setDefaultNavigationTimeout(150000);
  await page.goto("https://qamid.tmweb.ru/client/index.php",{ timeout: 20000 });
});

afterEach(async () => {
  await page.close();
});

describe("Go to cinema tests", () => {
  test("The first link text 'Идёмвкино'", async () => {
    const expected = "Идёмвкино";
    const actual = await getText(page, "h1.page-header__title");
    expect(actual.replace(/\s+/g, '')).toContain(expected);
  });

  test("Should select correct day", async () => {
    const daySelector = 'a.page-nav__day[data-time-stamp="1743282000"]';
    await clickElement(page, daySelector);
    
    const chosenDay = await getText(page, '.page-nav__day_chosen .page-nav__day-number');
    expect(chosenDay).toContain("30");
  });

  test("Should select movie time", async () => {
    // Выбираем день
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1743282000"]');
    
    // Выбираем время сеанса
    await clickElement(page, 'a.movie-seances__time');
    
    // Проверяем время на странице бронирования
    const actual = await getText(page, 'p.buying__info-start');
    expect(actual).toContain("Начало сеанса: 13:00");
  });

  test("Should select one chair", async () => {
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1743627600"]');   // Выбираем день
    await clickElement(page, 'a.movie-seances__time'); // Выбираем время сеанса
    await page.waitForSelector('.buying-scheme__wrapper', { visible: true, timeout:10000 });// Ждем загрузки схемы зала
  
    const availableSeats = await page.$$('.buying-scheme__chair_standart:not(.buying-scheme__chair_taken)'); //Выбираем первое доступное стандартное место
    await availableSeats[0].click();
   
    await page.waitForSelector('button.acceptin-button:not([disabled])');// 5. Проверяем, что кнопка бронирования активна
   
    await clickElement(page, 'button.acceptin-button'); //Нажимаем кнопку "Забронировать"
   
    await page.waitForSelector('.ticket__chairs', { visible: true, timeout: 10000 });//Ждем перехода на страницу с билетом
    const actual = await getText(page, '.ticket__chairs');//Проверяем информацию о билете //<span class="ticket__details ticket__chairs">
    //console.log("Текст билета:", actual); // Для отладки
  
    // Проверяем, что текст содержит информацию о месте
    expect(actual).toContain("1/1");
  }, 150000);
});
