const fs = require('fs');

const companyScraper = require('./companyScraper.mjs');

if (require.main === module) {
  const config = JSON.parse(fs.readFileSync('./config.json'));
  companyScraper(config['COMPANY_SYMBOL']);
}