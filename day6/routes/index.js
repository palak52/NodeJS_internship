var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('master');
});
router.get('/home', function(req, res, next) {
  res.render('master');
});
router.get('/service', function(req, res, next) {
  res.render('service');
});
router.get('/whyus', function(req, res, next) {
  res.render('why');
});
router.get('/contact', function(req, res, next) {
  res.render('contact');
});
router.get('/master', function(req, res, next) {
  res.render('master');
});
module.exports = router;
