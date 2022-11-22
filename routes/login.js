var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

// GET about page
router.get('/', function(req, res, next) {
  res.render('pages/login', {title: 'Login'})
});

module.exports = router;