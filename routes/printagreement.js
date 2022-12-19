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

        const args = {
            title: 'Express',
            jsonForm: formJson

        }
        if(req.isAuthenticated()){
            res.render('pages/printagreement', args);
          } else {
            res.render('pages/login');
          }
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