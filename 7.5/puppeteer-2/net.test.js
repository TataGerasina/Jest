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
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1744750800"]');
  // Ср 16 <a class="page-nav__day page-nav__day_chosen" href="#" data-time-stamp="1744750800">
  
    await clickElement(page, 'a.movie-seances__time[data-seance-start="780"'); //13:00
    
    // Ждём загрузки схемы зала
    await page.waitForSelector('.buying-scheme__chair_standart', { visible: true, timeout: 45000 }); 
  
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
    expect(actual).toContain("3/6");
    }, 150000);

  test("Should select two chairs", async () => {
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1744664400"]');
    // Вт 15 <a class="page-nav__day page-nav__day_chosen" href="#" data-time-stamp="1744664400">
    
    await clickElement(page, 'a.movie-seances__time[data-seance-start="1080"');  //18:00
    
    // Ждём загрузки схемы зала
    await page.waitForSelector('.buying-scheme__chair_standart', { visible: true, timeout: 20000 });
  
    // Ищем свободные места
    const availableSeats = await page.$$('.buying-scheme__chair_standart:not(.buying-scheme__chair_taken)');
    console.log("Свободных мест:", availableSeats.length);
  
    // Если мест нет — пропускаем тест
    if (availableSeats.length === 0) {
        console.warn("Нет свободных мест!");
        return;
    }
  
    // Кликаем на два свободных места
    await availableSeats[8].click();
    await availableSeats[9].click();
    
    await page.waitForSelector('button.acceptin-button:not([disabled])');
    await clickElement(page, 'button.acceptin-button');
  
    const actual = await getText(page, '.ticket__chairs');//Проверяем информацию о билете
    console.log("Текст билета:", actual); // Для отладки
  
    //Проверяем, что текст содержит информацию о местах
    expect(actual).toContain("2/2, 2/3");
  }, 150000);

  test("Should block booking already purchased seat", async () => {
    // 1. Переходим на страницу и выбираем сеанс
    await clickElement(page, 'a.page-nav__day[data-time-stamp="1744664400"]');
    await clickElement(page, 'a.movie-seances__time[data-seance-start="1080"]');

    // 2. Ждём загрузки схемы зала
    await page.waitForSelector('.buying-scheme__wrapper', { visible: true, timeout: 50000 });
    
    // 3. Ждём появления хотя бы одного занятого места
    await page.waitForSelector('.buying-scheme__chair_taken', { timeout: 20000 });
    
    // 4. Получаем все занятые места
    const takenSeats = await page.$$('.buying-scheme__chair_taken');
    console.log(`Найдено занятых мест: ${takenSeats.length}`);

    // 5. Проверяем, что есть занятые места
    if (takenSeats.length === 0) {
        throw new Error("Нет занятых мест для тестирования!");
    }

    // 6. Кликаем на последнее занятое место (более безопасно, чем брать фиксированный индекс)
    await takenSeats[takenSeats.length - 1].click();

    // 7. Проверяем, что кнопка бронирования остаётся неактивной
    const isButtonDisabled = await page.$eval(
        'button.acceptin-button',
        (el) => el.disabled
    );
    expect(isButtonDisabled).toBe(true);

    // 8. Проверяем сообщение об ошибке (если есть)
    const errorMessage = await page.$('.error-message');
    if (errorMessage) {
        const errorText = await errorMessage.evaluate(el => el.textContent.trim());
        expect(errorText).toMatch(/Место уже занято|забронировано/i);
    }
}, 200000);
});
