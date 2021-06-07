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
router.get('/myform', function(req, res, next) {
  res.render('form');
});
router.post('/form-process', function(req, res, next) {
  var a = req.body.txt1;
  var b = req.body.txt2;
  console.log(req.body);
  console.log("A value is "+ a + " B value is "+b);
  res.render('ans',{mya:a,myb:b});
});
module.exports = router;
