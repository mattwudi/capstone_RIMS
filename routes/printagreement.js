var express = require('express');
var router = express.Router();
const { Pool } = require('pg');
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

router.get('/', async (req, res) => {
    try {
        //Get info fron URL encode
        formJson = JSON.parse(decodeURIComponent(req.query.form));
        console.log(formJson);
        
        //const client = await pool.connect();

        const args = {
            title: 'Express',
            jsonForm: formJson

        }
        res.render('pages/printagreement', args);
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