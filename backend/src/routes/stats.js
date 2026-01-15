const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const DATA_PATH = path.join(__dirname, '../../data/items.json');

let cachedStats = null;

function invalidateStatsCache() {
  cachedStats = null;
}

// GET /api/stats
router.get('/', (req, res, next) => {
  if (cachedStats) {
    return res.json(cachedStats);
  }

  fs.readFile(DATA_PATH, (err, raw) => {
    if (err) return next(err);

    const items = JSON.parse(raw);
    const stats = {
      total: items.length,
      averagePrice: items.reduce((acc, cur) => acc + cur.price, 0) / items.length,
      lastCalculated: new Date().toISOString()
    };

    cachedStats = stats;
    res.json(stats);
  });
});

module.exports = router;
module.exports.invalidateStatsCache = invalidateStatsCache;