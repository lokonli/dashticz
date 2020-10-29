//https://medium.com/@tariqul.islam.rony/automated-ui-ux-testing-with-puppeteer-mocha-and-chai-800cfb028ab9

const puppeteer = require('puppeteer');
const { expect } = require('chai');

//(async () => {
  /*
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      'no-sandbox',
      'disable-setuid-sandbox',
    ]
  });
  const page = await browser.newPage();
  await page.goto('http://localhost:8083/?cfg=CONFIG.dials.js');
  await waitFor(5000);
  await page.screenshot({path: 'test.png'});
  await browser.close();  
})();
*/

  describe('Dashticz test', () => {
    const waitFor = delay => new Promise(resolve => setTimeout(resolve, delay));
    let browser;
    let page;

    before(async () => {
      browser = await puppeteer.launch({
        headless: true,
        args: ['no-sandbox', 'disable-setuid-sandbox'],
      });
      page = await browser.newPage();
      await page.goto('http://localhost:8083/?cfg2=CONFIG.colorpicker.js');
      await waitFor(5000);
    });

    after(async () => {
      await browser.close();
    });

    it('should have the correct page title', async () => {
      expect(await page.title()).to.eql('colorpicker');
    });

    it('should have received Domoticz devices', async () => {
//      console.log(await page.evaluate(() => Domoticz.getAllDevices()[10]));
        await page.evaluate(() => Domoticz.getAllDevices())
      expect(await page.evaluate(() => Domoticz.getAllDevices())).to.be.an('object').that.include.all.keys('1','2','3','4','10');
    });

    it('should have a moon image', async () => {
      var imgArray = await page.evaluate( () => Array.from(document.querySelectorAll('[data-id="moon"].button img'), el => el.src) );
      expect(imgArray.length).to.be.eql(1);
      expect(imgArray[0]).to.contain('.png');
    });

    /*
  it('should show a list of results when searching actual word', async () => {
      await page.type('input[id=search_form_input_homepage]', 'puppeteer');
      await page.click('input[type="submit"]');
      await page.waitForSelector('h2 a');
      const links = await page.evaluate(() => {
          return Array.from(document.querySelectorAll('h2 a'));
      });
      expect(links.length).to.be.greaterThan(0);
  });

  it('should show a warning when searching fake word', async () => {
      await page.type('input[id=search_form_input_homepage]', 'pupuppeppeteerteer');
      await page.click('input[type="submit"]');
      await page.waitForSelector('div[class=msg__wrap]');
      const text = await page.evaluate(() => {
          return document.querySelector('div[class=msg__wrap]').textContent;
      });
      expect(text).to.contain('Not many results contain');
  });
*/
  });
//});
