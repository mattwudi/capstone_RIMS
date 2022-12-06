var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// GET history page
router.get('/', function(req, res, next) {
  res.render('pages/history', {title: 'History'})
});

module.exports = router;