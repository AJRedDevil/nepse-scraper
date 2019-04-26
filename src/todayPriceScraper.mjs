const fs = require('fs');

const cheerio = require('cheerio');
const rp = require('request-promise');
const {format} = require('date-fns');

const parseHtml = selector => $ => $(selector);
const findHtml = selector => html => cheerio(html).find(selector);
const parseText = item => cheerio(item).text().trim();
const parseRows = allItems => {
  const filteredHeaderFooters = allItems.slice(2, allItems.length - 4)
  return filteredHeaderFooters
    .map((i, item) => findHtml('td')(item))
    .get();
};
const priceListing = items => {
  const prices = [];
  for (let rows of items) {
    prices.push({
      company: parseText(rows[1]),
      numOfTransactions: parseText(rows[2]),
      maxPrice: parseText(rows[3]),
      minPrice: parseText(rows[4]),
      closingPrice: parseText(rows[5]),
      tradedShares: parseText(rows[6]),
      amount: parseText(rows[7]),
      prevClosing: parseText(rows[8]),
      difference: parseText(rows[9]),
    })
  }
  return prices;
}
const printSymbol = items => {
  for (let item of items) {
    console.log(item)
  }
}
const writeSymbol = items => {
  const stats = fs.statSync('data');
  if (!stats.isDirectory()) {
    fs.mkdirSync('data');
  }
  fs.writeFileSync(`data/${format(new Date(), 'YYYY-MM-DD')}.json`, JSON.stringify(items), 'utf-8');
}
const getOptions = ({uri, payload}) => ({
  method: 'POST',
  uri: uri,
  form: payload,
  headers: {
  }
})

todayPriceScraper = props => rp(getOptions(props))
  .then(cheerio.load)
  .then(parseHtml('#home-contents tr'))
  .then(parseRows)
  .then(priceListing)
  .then(writeSymbol)
  .catch(console.error)

module.exports = todayPriceScraper;
