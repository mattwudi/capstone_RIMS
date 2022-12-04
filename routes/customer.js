var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// GET about page
router.get('/', function(req, res, next) {
  res.render('pages/customer', {title: 'Customer Page'});
})
.post('/addUser', async function (req, res, next) {
  res.set({
    "Content-Type": "application/json"
  });

  try {
    const selectSql = `SELECT * FROM CUSTOMERS WHERE l_name='${req.body.l_name}'
              and f_name='${req.body.f_name}' and birthday='${req.body.birthday}';`;
    var client = await pool.connect();
    var selResp = await client.query(selectSql);
    const response = {};
    console.log(selResp.rowCount);
    if (selResp.rowCount === 0) {
      const sqlQry = `INSERT INTO CUSTOMERS 
      (f_name, l_name, phone, address, city, state, zip_code, 
        birthday, license_num, license_exp, ins_name, ins_policy, 
        ins_exp) VALUES ('${req.body.f_name}', '${req.body.l_name}', 
        '${req.body.phone}', '${req.body.address}', '${req.body.city}', 
        '${req.body.state}', '${req.body.zip_code}', '${req.body.birthday}', 
        '${req.body.license_num}', '${req.body.license_exp}', 
        '${req.body.ins_name}', '${req.body.ins_policy}', '${req.body.ins_exp}'
      ) RETURNING id as id;`;

      const insResp = await client.query(sqlQry);
      
      Object.assign(response, { 
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        status: 'NotExist',
        id: insResp.rowCount ? insResp.rows[0].id : null
      });
    } else {
      Object.assign(response, { 
        f_name: req.body.f_name,
        l_name: req.body.l_name,
        status: 'Exist'
      });
    }
    res.json(response);
    return client.release();
  } catch (err) {
    console.log(err);
    const response = {
      error: err
    };
    return res.json(response);
  }

  const response = req.body;
  res.json(response);
  
})
.post('/searchCustomer', async (req, res, next) => {
  res.set({
    "Content-Type": "application/json"
  });

  try {
    const selectSql = `SELECT id, birthday, l_name, f_name FROM CUSTOMERS WHERE lower(l_name) LIKE '%${req.body.l_name.toLowerCase()}%'
      and lower(f_name) LIKE '%${req.body.f_name.toLowerCase()}%' ORDER BY l_name ASC, f_name ASC;`;
    var client = await pool.connect();
    var selResp = await client.query(selectSql);
    const response = {
      results: selResp.rowCount ? selResp.rows : null
    };
    res.json(response);
    return client.release();
  } catch (err) {
    const response = {
      error: err
    };
    res.json(response);
  } 
})
.post('/loadCustomer', async (req, res, next) => {
  res.set({
    "Content-Type": "application/json"
  });

  try {
    const selectSql = `SELECT * FROM CUSTOMERS WHERE id=${req.body.id};`;
    var client = await pool.connect();
    var selResp = await client.query(selectSql);
    const response = {
      results: selResp.rows[0]
    };
    res.json(response);
    return client.release();
  } catch (err) {
    const response = {
      error: err
    };
    res.json(response);
  }
});

module.exports = router;