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

/* GET create page. */
router.get('/', function(req, res, next) {
  res.render('pages/create', {title: 'Open Agreement', 'fleet': req.app.locals.fleet})
}).post("/", async(req, res) => {
  res.set({
    "Content-Type": "application/json"
  });

  try {
    const client = await pool.connect(); // connects to postgres client
    const f_name = req.body.f_name;
    const l_name = req.body.l_name;
    const address = req.body.address;
    const city = req.body.city;
    const state = req.body.state;
    const zip = req.body.zip;
    const phone = req.body.phone;
    const email = req.body.email;
    const birthday = req.body.birthday;
    const license_num = req.body.license_num;
    const license_exp = req.body.license_exp;
    const stock_number = req.body.stock_number;
    const mileage_out = req.body.mileage_out;
    const ins_name = req.body.ins_name;
    const ins_policy = req.body.ins_policy;
    const ins_exp = req.body.ins_exp;
    const date = new Date();

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const selectCustId = `SELECT id FROM customers WHERE f_name = '${f_name}' AND l_name = '${l_name}';`; 
    const custId = await client.query(selectCustId);

    const createSql = `INSERT INTO agreements (cust_id, stock_number, date_out, mileage_out) 
      VALUES (${custId.rows[0].id}, '${stock_number}', '${year}-${month}-${day}', ${mileage_out});`

    const createAgreement = await client.query(createSql);

    const response = {
      select: custId ? custId.rows[0] : null,
      create: createAgreement ? createAgreement.rows[0] : null 
    };

    res.json(response);
    client.release();
  }
  catch (err) {
    console.error(err);
    res.json({
      error: err
    });
  }
})

module.exports = router;
