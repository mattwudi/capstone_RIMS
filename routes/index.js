var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});
const buttonSql = "SELECT * FROM buttons ORDER BY id ASC;";

/* GET home page. */
router.get('/', async (req, res) => {
    try {
        const client = await pool.connect();
        const buttons = await client.query(buttonSql);

        //Query database for vehicles
        const vehicleSql = "SELECT * FROM vehicles ORDER BY stock_number ASC;";
        const vehicles = await client.query(vehicleSql);

        //Query database to get recent rentals
        const rentalSql = "SELECT v.stock_number, v.year, v.make, v.model, v.color, v.vin, v.mileage, c.id, c.f_name, c.l_name, a.date_out FROM vehicles v INNER JOIN agreements a ON v.stock_number = a.stock_number INNER JOIN customers c ON a.cust_id = c.id ORDER BY a.date_out LIMIT 10;";
        const recentRentals = await client.query(rentalSql);

        const args = {
            title: 'Express',
            "buttons": buttons ? buttons.rows : null,
            "vehicles": vehicles.rows,
            "recentRentals": recentRentals.rows
        };
        res.render('pages/index', args);
        client.release();
    } catch (err) {
        console.error(err);
        res.set({ 
            "Content-Type": "application/json"
        });
        res.json({
            error: err
        });
    }
  
}).post("/log", async (req, res) => {
    res.set({
        "Content-Type": "application/json"
    });

    try {
        const client = await pool.connect();
        const id = req.body.id;
        const insertSql = `INSERT INTO buttons (name)
            VALUES (concat('Child of ', $1::text))
            RETURNING id AS new_id;`;
        const selectSql = "SELECT LOCALTIME;";

        const insert = await client.query(insertSql, [id]);
        const select = await client.query(selectSql);

        const response = {
            newId: insert ? insert.rows[0] : null,
            when: select ? select.rows[0] : null
        };
        res.json(response);
        client.release();
    } catch (err) {
        console.log(err);
        res.json({
            error: err
        });
    }
});



module.exports = router;
