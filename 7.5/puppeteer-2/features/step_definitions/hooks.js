const { Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const puppeteer = require('puppeteer');

setDefaultTimeout(60000);

Before(async function() {
  this.browser = await puppeteer.launch({
    headless: false,
    slowMo: 100,
    args: ['--window-size=1920,1080']
  });
  this.page = await this.browser.newPage();
  await this.page.setViewport({ width: 1920, height: 1080 });
});

After(async function() {
  if (this.browser) {
    await this.browser.close();
  }
});