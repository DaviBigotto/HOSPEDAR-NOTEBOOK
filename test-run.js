const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const slugs = [
     'perfume-original-100',
     'victoria-s-secret-100-original',
     'victorias-secret-100-original'
  ];
  
  for (const s of slugs) {
      await page.goto(`https://brandcollectionfabricasp.vendizap.com/categoria/${s}`, { waitUntil: 'networkidle2' });
      await new Promise(r => setTimeout(r, 3000));
      const pageText = await page.evaluate(() => document.body.innerText);
      const r = (pageText.match(/R\S/g) || []).length;
      console.log(s, r);
  }

  await browser.close();
})();
