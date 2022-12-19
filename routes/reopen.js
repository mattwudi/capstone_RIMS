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

const closedAgreementsSql = `SELECT DISTINCT ON (stock_number) agreement_num, cust_id, stock_number, f_name, l_name, stock_number
  FROM agreements 
  INNER JOIN customers ON customers.id = agreements.cust_id
  WHERE date_in IS NOT NULL
  ORDER BY stock_number, agreement_num DESC;`;

var closedAgreements;

dataLoad = async function() {
  try {
    const client = await pool.connect();

    closedAgreements = (await client.query(closedAgreementsSql)).rows;

    client.release();
  } catch (err) {
    console.log(err);
  }
};

// GET reopen page
router.get('/', async function(req, res, next) {
  await dataLoad();
  res.render('pages/reopen', {title: 'Reopen', 'closedAgreements': closedAgreements})
}).post('/', async(req, res) => {
  res.set({
    "Content-Type": "application/json"
  });
  try {
    const client = await pool.connect();
    const agreement_num  = req.body.agreement_num;
    const stock_number = req.body.stock_number;

    let args = {};

    const reopenSql = `UPDATE agreements SET date_in = NULL, mileage_in = NULL WHERE agreement_num = '${agreement_num}';`
    const updateStatusSql = `UPDATE vehicles SET status = 'Loaned Out' WHERE stock_number = '${stock_number}';`;

    const reopenAgreement = await client.query(reopenSql);
    updateStatus = await client.query(updateStatusSql);

    args.message = `Agreement ${agreement_num} was succesfully reopened.`;

    const response = args;

    res.json(response);
    client.release();
  } catch (err) {
    console.error(err);
    res.json({
      error: err
    });
  }

});

module.exports = router;