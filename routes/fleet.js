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
router
    .get('/', function (req, res, next) {
        try {
            if(req.isAuthenticated()){
                res.render('pages/fleet', { title: 'Manage Fleet', "fleet": req.app.locals.fleet });
              } else {
                res.render('pages/login');
              }
        } catch (err) {
            console.log(err);
        }

    })
    .post('/', async (req, res) => {
        res.set({
            "Content-Type": "application/json"
        });
        //const client = {};
        const id = req.body.stock_number;
        const selectVQry = `SELECT * FROM VEHICLES WHERE stock_number = '${id}'`;
        let updateQry = "UPDATE VEHICLES SET ";
        const timeSql = "SELECT LOCALTIME;";
        let client = {};
        let vehicle = {};
        //const vehicle = {};
        const timeStamp = {};

        try {
            client = await pool.connect();
            vehicle = await client.query(selectVQry);
        } catch (err) {
            const response = {
                stock_number: req.body.stock_number,
                error: 'Select',
                msg: err
            };
            return res.json(response);
        }

        if (req.body.request === 'delete') { // Delete record from database
            try {
                const deleteQry = `DELETE FROM VEHICLES WHERE stock_number='${req.body.stock_number}';`;

                const delSql = await client.query(deleteQry);
                const response = {
                    stock_number: req.body.stock_number,
                    status: delSql.rowCount == 1 ? 'Deleted' : 'NonExist'
                };
                const fleet = await startupDataLoad(); // Reloads the fleet array with any changes.
                response.fleet = fleet;
                res.json(response);
                return client.release();
            } catch (err) {
                const response = {
                    stock_number: req.body.stock_number,
                    error: 'Delete',
                    msg: err
                };
                return res.json(response);
            }
        }

        if (vehicle && vehicle.rowCount > 0) {  // Update current record
            try {
                const bodyObj = {};
                for (let i in req.body) {
                    Object.assign(bodyObj, { [i]: req.body[i] });
                    updateQry += [i] + '=' + (isNaN(req.body[i]) ? "'" + req.body[i] + "'" : req.body[i]) +
                        (Object.keys(req.body).length !== Object.keys(bodyObj).length ? ', ' : ' ');
                }
                updateQry += `WHERE stock_number='${bodyObj.stock_number}' RETURNING stock_number AS stock_number;`;

                const updateSql = await client.query(updateQry);

                const response = {
                    stock_number: updateSql.rowCount ? updateSql.rows[0].stock_number : req.body.stock_number,
                    fleet: [],
                    status: 'Updated'
                };
                const fleet = await startupDataLoad(); // Reloads the fleet array with any changes.
                response.fleet = fleet;
                res.json(response);
                return client.release();
            } catch (err) {
                const response = {
                    stock_number: req.body.stock_number,
                    error: 'Update',
                    msg: err
                };
                return res.json(response);
            }
        }

        if (vehicle && vehicle.rowCount === 0) { // Add record to database
            try {
                const insertQry = `INSERT INTO VEHICLES (stock_number, year, make, model, color, vin, mileage, status) 
                        VALUES ('${req.body.stock_number}', ${req.body.year}, '${req.body.make}', '${req.body.model}', '${req.body.color}', '${req.body.vin}', ${req.body.mileage}, 
                        '${req.body.status}') RETURNING stock_number AS stock_number;`;
                const insertSql = await client.query(insertQry);
                const response = {
                    stock_number: req.body.stock_number,
                    fleet: [],
                    status: 'Added'
                };
                const fleet = await startupDataLoad(); // Reloads the fleet array with any changes.
                response.fleet = fleet;
                res.json(response);
                return client.release();
            } catch (err) {
                const response = {
                    stock_number: req.body.stock_number,
                    error: 'Insert',
                    msg: err
                };
                return res.json(response);
            }
        }

    });

module.exports = router;