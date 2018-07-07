'use strict';

async function addLike(db, stock, ip) {
  const col = db.collection('stock_likes');
  
  return new Promise((resolve, reject) => {
    col.findOneAndUpdate({
      stock,
      like_ip: ip
    }, {
      stock,
      like_ip: ip
    }, {
      upsert: true,
      returnOriginal: false
    }, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

module.exports.addLike = addLike;

async function getLikes(db, stock) {
  const col = db.collection('stock_likes');
  
  return new Promise((resolve, reject) => {
    col.count({ stock }, (err, res) => {
      if (err) reject(err);
      resolve(res);
    });
  });
}

module.exports.getLikes = getLikes;