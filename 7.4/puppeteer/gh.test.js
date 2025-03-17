let page;

beforeEach(async () => {
  page = await browser.newPage();
});

  afterEach(async () => {
    page.close();
  });

describe("Github page tests Devops", () => {
  beforeEach(async () => {
    await page.goto("https://github.com/solutions/use-case/devops", { timeout: 20000 });
  });
  
  test("The page contains button 'Start a free trial'", async () => {
    const linkFree = ".Primer_Brand__Button-module__Button__text___Z3ocU"; 
    await page.waitForSelector(linkFree, { visible: true, timeout: 6000 });
    const actual = await page.$eval(linkFree, link => link.textContent);
    expect(actual).toContain("Start a free trial");
  }, 6000);
  
  test("The page contains link 'What is Git?'", async () => {
    const linkGit = 'a[href="/git-guides"]';
    await page.waitForSelector(linkGit); //{ visible: true, timeout: 20000 }
    const actual = await page.$eval(linkGit, link => link.textContent);
    expect(actual).toContain("What is Git?");
    await page.click(linkGit);
    await page.waitForSelector('h1'); //{ visible: true, timeout: 30000 }
    const title1 = await page.title();
    expect(title1).toEqual('Git · GitHub');
  }, 20000); 
});

describe("Github page tests", () => {
  beforeEach(async () => {
    await page.goto("https://github.com/team", { timeout: 10000 });
  });

  test("The h1 header content", async () => {
    const firstLink = await page.$("header div div a");
    await firstLink.click();
    await page.waitForSelector('h1');
    const title2 = await page.title();
    expect(title2).toEqual('GitHub · Build and ship software on a single, collaborative platform · GitHub');
  }, 13000);

  test("The first link attribute", async () => {
    const actual = await page.$eval("a", link => link.getAttribute('href'));
    expect(actual).toEqual("#start-of-content");
  }, 10000);

  test("The page contains Sign in button", async () => {
    const btnSelector = ".btn-large-mktg.btn-mktg";
    await page.waitForSelector(btnSelector, { visible: true, timeout: 5000 });
    const actual = await page.$eval(btnSelector, link => link.textContent.trim());
    expect(actual).toContain("Get started with Team");
  }, 10000);
});

describe("Check button 'Start free for 30 days'", () => {
  beforeEach(async () => {
    await page.goto("https://github.com/pricing", { timeout: 10000 });
  });

  test("The page contains button 'Start free for 30 days'", async () => {
    const btnStart = ".btn-mktg.mt-4";
    await page.waitForSelector(btnStart, { visible: true, timeout: 7000 });
    const actual = await page.$eval(btnStart, link => link.textContent.trim());
    expect(actual).toContain("Start free for 30 days");
  }, 17000);
});