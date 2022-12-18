const { application } = require('express');
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

const onLoanSql = "SELECT * FROM vehicles WHERE status = 'Loaned Out';";
const agreementSql = "SELECT agreement_num, cust_id, stock_number, f_name, l_name, mileage_out, mileage_in FROM agreements INNER JOIN customers ON customers.id = agreements.cust_id WHERE date_in is null;";

var onLoan;
var agreements;

agreementDataLoad = async function() {
    try {
        const client = await pool.connect();

        onLoan = (await client.query(onLoanSql)).rows;
        agreements = (await client.query(agreementSql)).rows;
        
        console.log(onLoan);

        client.release();
    } catch (err) {
        console.log(err);
    }
};

/* GET return page. */
router.get('/', async function(req, res, next) {
  await agreementDataLoad();
  if(req.isAuthenticated()){
    res.render('pages/return', {title: 'Return', 'onLoan': onLoan, 'agreements': agreements});
  } else {
    res.render('pages/login');
  }
}).post('/', async(req, res) => {
  res.set({
    "Content-Type": "application/json"
  });

  try {
    const client = await pool.connect();
    const button = req.body.button;
    const agreement_num = req.body.agreement_num;
    const stock_number = req.body.stock_number;
    const status = req.body.status;
    const mileage_in = req.body.mileage_in;
    const date = new Date();
    
    
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    let args = {};
    var updateStatusSql;
    var updateStatus;

    if (button == 'save') {
      const closeAgreementSql = `UPDATE agreements SET date_in = '${year}-${month}-${day}', mileage_in = ${mileage_in} 
      WHERE agreement_num = ${agreement_num};`;

      updateStatusSql = `UPDATE vehicles SET status = '${status}', mileage = ${mileage_in} WHERE stock_number = '${stock_number}';`

      const closeAgreement = await client.query(closeAgreementSql);
      updateStatus = await client.query(updateStatusSql)

      args.message = `${stock_number} was sucessfully returned!`;

    } else if (button == 'reopen') {
      const reopenSql = `UPDATE agreements SET date_in = NULL, mileage_in = NULL WHERE agreement_num = '${agreement_num}';`
      const updateStatusSql = `UPDATE vehicles SET status = 'Loaned Out' WHERE stock_number = '${stock_number}';`;

      const reopenAgreement = await client.query(reopenSql);
      updateStatus = await client.query(updateStatusSql);

      args.message = `Agreement ${agreement_num} was succesfully reopened.`;
    }


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
