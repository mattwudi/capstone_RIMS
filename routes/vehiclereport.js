var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

/* GET home page. */
router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        //Query database for vehicles
        const vehicleSql = "SELECT * FROM vehicles ORDER BY stock_number ASC;";
        const vehicles = await client.query(vehicleSql);

        const args = {
            title: 'Express',
            "vehicles": vehicles.rows
        }
        res.render('pages/vehiclereport', args);
    } catch (err) {
        console.error(err);
        res.set({
            "Content-Type": "application/json"
        });
        res.json({
            error: err
        });
    }
  
});

module.exports = router;
