const fs = require('fs');
/**
  const util = require('util');
  fs.readFileAsync = util.promisify(fs.readFile);
  fs.readFileAsync('sources/companySymbol.html', 'utf-8')
 */

const rp = require('request-promise');
const cheerio = require('cheerio');

const options = {
  _limit: 1000,
};

const parseHtml = selector => $ => $(selector);
const findHtml = selector => html => cheerio(html).find(selector);
const parseText = item =>
  cheerio(item)
    .text()
    .trim();
const parseHref = item =>
  cheerio(item)
    .find('a')
    .attr('href')
    .split('/')
    .reverse()[0];
const parseRows = allItems => {
  const filteredHeaderFooters = allItems.slice(2, allItems.length - 1);
  return filteredHeaderFooters.map((i, item) => findHtml('td')(item)).get();
};
const companyListing = items => {
  const companies = [];
  for (let rows of items) {
    companies.push({
      name: parseText(rows[2]),
      symbol: parseText(rows[3]),
      sector: parseText(rows[4]),
      companyId: parseHref(rows[5]),
    });
  }
  return companies;
};
const printSymbol = items => {
  for (let item of items) {
    console.log(item);
  }
};
const writeSymbol = items => {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  fs.writeFileSync('data/symbol.json', JSON.stringify(items, null, 2), 'utf-8');
};

companySymbolScraper = url =>
  rp(url, {qs: options})
    .then(cheerio.load)
    .then(parseHtml('#company-list tr'))
    .then(parseRows)
    .then(companyListing)
    .then(writeSymbol)
    .catch(console.error);

module.exports = companySymbolScraper;
