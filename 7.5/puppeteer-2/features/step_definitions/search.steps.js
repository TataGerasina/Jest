const puppeteer = require("puppeteer");
const chai = require("chai");
const expect = chai.expect;
const { 
  Given, 
  When, 
  Then, 
  Before, 
  After, 
  //setDefaultTimeout, 
} = require("cucumber");
const { putText, getText, clickElement } = require("../../lib/commands.js");

//setDefaultTimeout(70000);

Before(async function () {
  const browser = await puppeteer.launch({ headless: false, slowMo: 1000, args: ['--window-size=1920,1080']});
  const page = await browser.newPage();
  await page.setViewport({width: 1920, height: 1080});
  this.browser = browser;
  this.page = page;
});

After(async function () {
  if (this.browser) {
    await this.browser.close();
  }
});

Given("user is on {string} page", async function (string) {
  return await this.page.goto(`https://qamid.tmweb.ru/client/index.php${string}`, { 
    setTimeout: 20000,
  });
});

When("user search by {string}", async function (string) {
  return await putText(this.page, 
    "input", string);
});

Then('user sees the film proposed {string}', async function (string) {
  const actual = await getText(this.page, "a[movie-seances__time]");
  const expected = await string;
  expect(actual).contains(expected);
  return 'pending';
  });  
