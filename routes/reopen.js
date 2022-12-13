var express = require('express');
var router = express.Router();

require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const availableSql = "SELECT stock_number FROM vehicles WHERE status = 'Available';";
var reopenSql;

dataLoad = async function() {
  try {
    const client = await pool.connect();

    stockNumbers = (await client.query(availableSql)).rows;

    console.log(stockNumbers);
  } catch (err) {
    console.log(err);
  }
};

// GET reopen page
router.get('/', async function(req, res, next) {
  await dataLoad();
  res.render('pages/reopen', {title: 'Reopen'})
}).post('/', async(req, res) => {
  res.set({
    "Content-Type": "application/json"
  });


});

module.exports = router;