const fs = require('fs');

const cheerio = require('cheerio');
const format = require('date-fns/format');
const zipObject = require('lodash/zipObject');
const rp = require('request-promise');

const options = {
  startDate: '2010-04-15',
  endDate: format(new Date(), 'YYYY-MM-DD'),
  'stock-symbol': 0,
  _limit: 4000,
};

const parseHtml = selector => $ => $(selector);
const findHtml = selector => html => cheerio(html).find(selector);
const parseText = item =>
  cheerio(item)
    .text()
    .trim();
const parseNumber = item => parseFloat(parseText(item));
const parseRows = allItems => {
  const filteredHeaderFooters = allItems.slice(2, allItems.length - 1);
  return filteredHeaderFooters.map((i, item) => findHtml('td')(item)).get();
};
const stockPrices = items => {
  const stockPrices = [];
  for (let rows of items) {
    stockPrices.push({
      date: parseText(rows[1]),
      totalTransactions: parseNumber(rows[2]),
      totalTradeShares: parseNumber(rows[3]),
      totalTradeAmount: parseNumber(rows[4]),
      maxPrice: parseNumber(rows[5]),
      minPrice: parseNumber(rows[6]),
      closePrice: parseNumber(rows[7]),
    });
  }
  return stockPrices;
};
const writeStockwisePrice = id => items => {
  if (!fs.existsSync('data')) {
    fs.mkdirSync('data');
  }
  fs.writeFileSync(
    `data/stockwisePrice.${id}.json`,
    JSON.stringify(items, null, 2),
    'utf-8'
  );
};

stockwisePriceScraper = (url, id) => {
  console.log(id);
  rp(url, {qs: Object.assign(options, {'stock-symbol': id})})
    .then(cheerio.load)
    .then(parseHtml('#home-contents table tr'))
    .then(parseRows)
    .then(stockPrices)
    .then(writeStockwisePrice(id))
    .catch(console.error);
};

module.exports = stockwisePriceScraper;
