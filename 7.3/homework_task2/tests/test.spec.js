import {test, expect} from "@playwright/test";
const {chromium} = require("playwright");
const {email, password} = require("../user.js");
const {InvEmail,InvPassword} = require("../user.js");

test('Successful authorization', async ({page}) => {
  const browser = await chromium.launch();
	await page.goto('https://netology.ru/?modal=sign_in');
	await page.getByRole('textbox', {name: 'Email'}).click();
	await page.locator('textbox', {name: 'Email'}).fill(email);
	await page.getByRole('textbox', {name: 'Пароль'}).click();
	await page.getByRole('textbox', {name: 'Пароль'}).fill(password);
	await page.getByTestId('login-submit-btn').click();

	await expect(page.getByTestId('[userId="8962153"]')).toContainText(`Привет, Татьяна! Вы вошли в аккаунт`);
  await browser.close();
});

test('Not successful authorization email', async ({ page }) => {
  const browser = await chromium.launch();
  await page.goto('https://netology.ru/?modal=sign_in');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(InvEmail);
  await page.getByTestId('[data-testid="login-submit-btn"]').click();

  await expect(page.getByTestId(`[data-testid="login-error-hint"]`)).toContainText(`Неверный email`);
  await browser.close();
});

test('Not successful authorization password', async ({ page }) => {
  const browser = await chromium.launch();
  await page.goto('https://netology.ru/?modal=sign_in');
  await page.getByRole('textbox', { name: 'Email' }).click();
  await page.getByRole('textbox', { name: 'Email' }).fill(InvEmail);
  await page.getByRole('textbox', { name: 'Пароль' }).click();
  await page.getByRole('textbox', { name: 'Пароль' }).fill(InvPassword);
  await page.getByTestId('[data-testid="login-submit-btn"]').click();

  await expect(page.getByTestId(`[data-testid="login-error-hint"]`)).toContainText(`Вы ввели неправильно логин или пароль.`);
  await browser.close();
});