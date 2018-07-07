/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb').MongoClient;

const apiHandler = require('../controller/apiHandler');
const dbHandler  = require('../controller/dbHandler');

const CONN_STR = process.env.DB;

module.exports = function (app) {

  app.route('/api/stock-prices')
    .get(function (req, res){
      if (!req.query.stock)
        return res.status(200)
                  .type('text')
                  .send('missing stock');
    
      let stock = req.query.stock;
      const ip = req.ip;
    
        
      MongoClient.connect(CONN_STR, async (err, db) => {
        if (stock.constructor == Array) {
          const stock1 = stock[0].toUpperCase();
          const stock2 = stock[1].toUpperCase();
          const stockData = [{}, {}];
          
          if (req.query.like && req.query.like == 'true') {
            try {
              await dbHandler.addLike(db, stock1, ip);
              await dbHandler.addLike(db, stock2, ip);
            } catch(e) {
              console.log(e);
            }
          }
          
          try {
            const stock1Likes = await dbHandler.getLikes(db, stock1);
            const stock2Likes = await dbHandler.getLikes(db, stock2);
            
            stockData[0].stock = stock1;
            stockData[1].stock = stock2;
            stockData[0].price = String(await apiHandler.getStockPrice(stock1));
            stockData[1].price = String(await apiHandler.getStockPrice(stock2));
            stockData[0].rel_likes = stock1Likes - stock2Likes;
            stockData[1].rel_likes = stock2Likes - stock1Likes;
            
            res.json({ stockData });
          } catch(e) {
            console.log(e);
          }
        
        } else if (stock.constructor == String) {
          const stockData = {}
          stock = stock.toUpperCase();
          
          if (req.query.like && req.query.like == 'true') {
            try {
              await dbHandler.addLike(db, stock, ip);
            } catch(e) {
              console.log(e);
            }
          }
          
          try {
            stockData.price = String(await apiHandler.getStockPrice(stock));
            stockData.likes = await dbHandler.getLikes(db, stock);
            stockData.stock = stock;
            
            res.json({ stockData });
          } catch(e) {
            console.log(e);
          }
        }
      });
    });
    
};
