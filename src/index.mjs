const fs = require('fs');
// const promise = require('Promise');

const companySymbolScraper = require('./companyScraper.mjs');
const stockwisePriceScraper = require('./stockwisePriceScraper.mjs');
const todayPriceScraper = require('./todayPriceScraper.mjs');

const stockPriceScraper = async url => {
  companies = JSON.parse(fs.readFileSync('./data/symbol.json', 'utf-8'));
  /**
   * name
   * symbol
   * sector
   * companyID
   */
  priceRequests = companies.map(company =>
    stockwisePriceScraper(url, company.companyID)
  );
  await Promise.all(priceRequests);
};

if (require.main === module) {
  const config = JSON.parse(fs.readFileSync('./config.json'));
  // console.log('Scraping Company Symbol ID');
  // companySymbolScraper(config['COMPANY_SYMBOL_URL']);
  console.log('Scraping Stockwise Price');
  stockPriceScraper(config['STOCKWISE_PRICES_URL']);
  // todayPriceScraper({
  //   'uri':config['TODAY_PRICE'],
  //   'payload': config['data']
  // });
}
