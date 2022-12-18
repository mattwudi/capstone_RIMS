var express = require('express');
var router = express.Router();

// GET about page
router.get('/', function(req, res, next) {

  if(req.isAuthenticated()){
    res.render('pages/about', {title: 'About'})
  } else {
    res.render('pages/login');
  }
});

module.exports = router;