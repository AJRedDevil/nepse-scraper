const fs = require('fs');

const companySymbolScraper = require('./companyScraper.mjs');
const todayPriceScraper = require('./todayPriceScraper.mjs') ;

if (require.main === module) {
  const config = JSON.parse(fs.readFileSync('./config.json'));
  // companySymbolScraper(config['COMPANY_SYMBOL']);
  todayPriceScraper({
    'uri':config['TODAY_PRICE'],
    'payload': config['data']
  });
}