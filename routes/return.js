var express = require('express');
var router = express.Router();

/* GET return page. */
router.get('/', function(req, res, next) {
  res.render('pages/return', {title: 'Return'});
});

module.exports = router;
