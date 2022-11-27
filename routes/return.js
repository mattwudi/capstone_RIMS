const { application } = require('express');
var express = require('express');
var router = express.Router();

require('dotenv').config();
const { Pool } = require('pg');
const app = require('../app');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

const fleetSql = "SELECT * FROM vehicles WHERE status = 'Loaned Out';";
const agreementSql = "SELECT * from agreements WHERE date_in is null;";

var onLoan;
var agreements;

agreementDataLoad = async function() {
    try {
        const client = await pool.connect();

        onLoan = (await client.query(fleetSql)).rows;
        agreements = (await client.query(agreementSql)).rows;
        
        console.log(agreements);
      
        client.release();
    } catch (err) {
        console.log(err);
    }
}
agreementDataLoad();

/* GET return page. */
router.get('/', function(req, res, next) {
  res.render('pages/return', {title: 'Return', 'onLoan': onLoan, 'agreements': agreements});
}).post('/', async(req, res) => {
  res.set({
    "Content-Type": "application/json"
  });

  const agreement_num = req.body.agreement_num;
})

module.exports = router;
