const fs = require('fs');

const companyParse = require('./companyParse.mjs');

if (require.main === module) {
  const config = JSON.parse(fs.readFileSync('./config.json'));
  companyParse(config['COMPANY_SYMBOL']);
}