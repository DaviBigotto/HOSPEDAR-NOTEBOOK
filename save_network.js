const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('request', request => {
      const url = request.url();
      if (url.includes('carregarVitrine')) {
          console.log('====== REQUEST ======');
          console.log(url);
          console.log(request.method());
          console.log(request.postData());
      }
  });

  page.on('response', async (response) => {
    const url = response.url();
    if (url.includes('carregarVitrine')) {
          console.log('====== RESPONSE ======');
          try {
             fs.writeFileSync('vitrine.json', await response.text());
             console.log('Saved to vitrine.json');
          } catch(e) {}
    }
  });
  
  await page.goto('https://brandcollectionfabricasp.vendizap.com/', { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 4000));
  await browser.close();
})();
