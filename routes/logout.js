var express = require('express');
var router = express.Router();

// GET about page
router.get('/', function(req, res, next) {
  req.logout(function(err){
    if(err) {
      return next(err);
    }
    res.render('pages/logout', {title: 'Logout'})
  })
});

module.exports = router;