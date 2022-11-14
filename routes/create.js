var express = require('express');
var router = express.Router();

/* GET create page. */
router.get('/', function(req, res, next) {
  res.render('pages/create', {title: 'About'})
});

module.exports = router;
