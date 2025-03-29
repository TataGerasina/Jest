const {test, expect} = require ("@playwright/test");
const {chromium} = require("playwright");
const {email, password, InvEmail,InvPassword} = require("../user.js");


test('Successful authorization', async ({page}) => {
  const browser = await chromium.launch(); 

	await page.goto("https://netology.ru/?modal=sign_in/");
  // Проверка, что перешли на нужную страницу
  await expect(page).toHaveURL("https://netology.ru/?modal=sign_in/");
  await page.getByRole('textbox', {name: 'Email'}).click();
  //await page.getByRole('textbox', {name: 'Email'}).fill(email);
  await page.getByLabel('Email').fill(email); // Заполняем поле email
  await page.getByTestId('cookies-submit-btn').click();
  await expect(page.getByTestId('cookies-submit-btn')).toContainText("OK");
	await page.getByRole('textbox', {name: 'Пароль'}).click();
	await page.getByRole('textbox', {name: 'Пароль'}).fill(password);
	await page.getByTestId('login-submit-btn').click();
  await page.getByRole('link', { name: 'Моё обучение' }).click();
  await page.getByTestId('menu-userface').getByText('ТГ').click();
	await expect(page.getByTestId('profile/8962153')).toContainText('Привет, Татьяна! Вы вошли в аккаунт');
  await browser.close();
});

test('Not successful authorization email', async ({ page }) => {
  const browser = await chromium.launch();
  await page.goto('https://netology.ru/?modal=sign_in');
  await page.getByTestId('cookies-submit-btn').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(InvEmail);
  await page.getByTestId('login-submit-btn').click();

  await expect(page.getByTestId('[data-testid="login-error-hint"]')).toContainText('Неверный email');
  await browser.close();
  
});

test('Not successful authorization password', async ({ page }) => {
  const browser = await chromium.launch();
  await page.goto('https://netology.ru/?modal=sign_in');
  await page.getByTestId('cookies-submit-btn').click();
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(InvEmail);
  await page.getByRole('textbox', { name: 'Пароль'}).click();
  await page.getByRole('textbox', { name: 'Пароль' }).fill(InvPassword);
  await page.getByTestId('login-submit-btn').click();

  await expect(page.getByTestId('[data-testid="login-error-hint"]')).toContainText('Вы ввели неправильно логин или пароль.');
  await browser.close();
});