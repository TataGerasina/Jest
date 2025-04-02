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

  test("Should select one chair", async () => {
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1743627600"]');
    await clickElement(page, 'a.movie-seances__time[data-seance-start="780"');
    
    // Ждём загрузки схемы зала
    await page.waitForSelector('.buying-scheme__chair_standart', { visible: true, timeout: 10000 }); 
  
    // Ищем свободные места
    const availableSeats = await page.$$('.buying-scheme__chair_standart:not(.buying-scheme__chair_taken)');
    console.log("Свободных мест:", availableSeats.length);
  
    // Если мест нет — пропускаем тест
    if (availableSeats.length === 0) {
        console.warn("Нет свободных мест!");
        return;
    }
  
    // Кликаем на первое свободное место
    await availableSeats[21].click();
    
    await page.waitForSelector('button.acceptin-button:not([disabled])');
    await clickElement(page, 'button.acceptin-button');
  
    const actual = await getText(page, '.ticket__chairs');//Проверяем информацию о билете
    console.log("Текст билета:", actual); // Для отладки
  
    // Проверяем, что текст содержит информацию о месте
    expect(actual).toContain("3/7");
    }, 150000);

  test("Should select two chairs", async () => {
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1743714000"]'); //4 апреля
    await clickElement(page, 'a.movie-seances__time[data-seance-start="1200"');
    
    // Ждём загрузки схемы зала
    await page.waitForSelector('.buying-scheme__chair_standart', { visible: true, timeout: 10000 });
  
    // Ищем свободные места
    const availableSeats = await page.$$('.buying-scheme__chair_standart:not(.buying-scheme__chair_taken)');
    console.log("Свободных мест:", availableSeats.length);
  
    // Если мест нет — пропускаем тест
    if (availableSeats.length === 0) {
        console.warn("Нет свободных мест!");
        return;
    }
  
    // Кликаем на два свободных места
    await availableSeats[21].click();
    await availableSeats[22].click();
    
    await page.waitForSelector('button.acceptin-button:not([disabled])');
    await clickElement(page, 'button.acceptin-button');
  
    const actual = await getText(page, '.ticket__chairs');//Проверяем информацию о билете
    console.log("Текст билета:", actual); // Для отладки
  
    //Проверяем, что текст содержит информацию о местах
    expect(actual).toContain("3/2, 3/3");
  }, 150000);

  test("Should block booking already purchased seat", async () => {
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1743627600"]');
    await clickElement(page, 'a.movie-seances__time[data-seance-start="780"]');

    // Ждём загрузки схемы зала и занятых мест
    await page.waitForSelector('.buying-scheme__wrapper', { visible: true });
    const takenSeats = await page.$$('.buying-scheme__chair_taken');

    if (takenSeats.length === 0) {
        console.log("Нет занятых мест. Тест пропущен.");
        return;
    }

    // Кликаем на занятое место
    await takenSeats[0].click();

    // Проверяем, что кнопка бронирования НЕ активна
    const isButtonEnabled = await page.$eval(
        'button.acceptin-button',
        (el) => !el.disabled
    );
    expect(isButtonEnabled).toBe(false);

    // Проверяем сообщение об ошибке (если есть)
    const errorMessage = await page.$('.error-message');
    if (errorMessage) {
        expect(await errorMessage.evaluate((el) => el.textContent)).toContain(
            "Место уже занято"
        );
    }
}, 200000);
});
