'use strict';

const https = require('https');

const API_URI = 'https://api.iextrading.com/1.0';

function getStockPrice(symbol) {
  const API_ENDPOINT = `${API_URI}/stock/${symbol}/price`;

  return new Promise((resolve, reject) => {
    https.get(API_ENDPOINT, (res) => {
      let data = '';

      res.on('data', chunk => { 
        data += chunk;
      });

      res.on('end', () => { 
        resolve(JSON.parse(data));
      });
    }).on('error', e => { 
      reject(e);
    });
  });
}

module.exports.getStockPrice = getStockPrice;

async function getStockPrices(symbolsArray) {
  const prices = [];
  
  for (let s of symbolsArray) {
    try {
      let p = await getStockPrice(s);
      prices.push(p);
    } catch(e) {
      console.log(e);
    }
  }
  
  return prices;
}

module.exports.getStockPrices = getStockPrices;