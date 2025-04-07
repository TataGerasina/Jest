module.exports = {
  
  clickElement: async function (page, selector, options = {}) {
    const { timeout = 30000, visible = true } = options;
    
    try {
      await page.waitForSelector(selector, { 
        timeout,
        visible
      });
      await page.click(selector);
    } catch (error) {
      await page.screenshot({ path: `error_click_${Date.now()}.png` });
      throw new Error(`Failed to click on selector "${selector}": ${error.message}`);
    }
  },

  
  getText: async function (page, selector, options = {}) {
    const { timeout = 30000 } = options;
    
    try {
      await page.waitForSelector(selector, { timeout });
      return await page.$eval(selector, el => el.textContent.trim());
    } catch (error) {
      await page.screenshot({ path: `error_getText_${Date.now()}.png` });
      throw new Error(`Failed to get text from selector "${selector}": ${error.message}`);
    }
  },


  putText: async function (page, selector, text, options = {}) {
    const { timeout = 30000, clear = false } = options;
    
    try {
      await page.waitForSelector(selector, { timeout });
      const input = await page.$(selector);
      
      if (clear) {
        await input.click({ clickCount: 3 }); // Выделяем весь текст
        await page.keyboard.press('Backspace');
      }
      
      await input.type(text, { delay: 100 }); // Добавляем задержку для имитации реального ввода
    } catch (error) {
      await page.screenshot({ path: `error_putText_${Date.now()}.png` });
      throw new Error(`Failed to type text in selector "${selector}": ${error.message}`);
    }
  },

  isElementVisible: async function (page, selector, timeout = 30000) {
    try {
      await page.waitForSelector(selector, { 
        timeout,
        visible: true
      });
      return true;
    } catch (error) {
      return false;
    }
  }
};


