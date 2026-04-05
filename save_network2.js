const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('request', request => {
      const url = request.url();
      if ((request.resourceType() === 'fetch' || request.resourceType() === 'xhr') && url.includes('vendizap.com')) {
          console.log(request.method(), url);
      }
  });

  await page.goto('https://brandcollectionfabricasp.vendizap.com/categoria/tester-original-perfume', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 6000));
  await browser.close();
})();
