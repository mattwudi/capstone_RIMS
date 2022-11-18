var express = require('express');
var router = express.Router();

// GET about page
router.get('/', function (req, res, next) {
    try {
        res.render('pages/fleet', { title: 'Manage Fleet', "fleet": req.app.locals.fleet });
    } catch (err) {
        console.log(err);
    }
    
});

module.exports = router;