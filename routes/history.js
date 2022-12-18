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
router.get('/', async (req, res) => {
  try{

    res.render('pages/history');

  } catch (err){
      res.set({ 
          "Content-Type": "application/json"
      });
      res.json({
          error: err
      });
  }
})
.post('/searchHistory', async (req, res) => {

  res.set({
    "Content-Type": "application/json"
  });

  try {

    const client = await pool.connect();

    const selectSql = `SELECT v.stock_number, v.year, v.model, v.make, v.color, v.vin, v.mileage, c.id, c.f_name, c.l_name, a.date_out 
                       FROM customers c 
                       INNER JOIN agreements a ON a.cust_id = c.id
                       INNER JOIN vehicles v ON v.stock_number = a.stock_number
                       WHERE lower(l_name) LIKE '%${req.body.l_name.toLowerCase()}%'
                       and lower(f_name) LIKE '%${req.body.f_name.toLowerCase()}%'
                       ORDER BY l_name ASC, f_name ASC;`;

    var selectResponse = await client.query(selectSql);

    console.log(req.body.l_name.toLowerCase());

    const response = {
      results: selectResponse.rowCount ? selectResponse.rows : null,
      searchOutput : selectResponse.rows
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


module.exports = router;