var express = require('express');
var mysql      = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nodedemo'
});

connection.connect(function(err){
  if(!err){
    console.log('Db connected');
  }
  else{
    console.log('Db connection issue')
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/add', function(req, res, next) {
  res.render('add-form', { title: 'Express' });
});

router.post('/add-process', function(req, res, next) {
  console.log(req.body);
  const mybodydata = {
    product_name : req.body.txt1,
    product_details : req.body.txt2,
    product_price : req.body.txt3
  }

  connection.query("insert into tbl_product set ?",mybodydata,function(err,result){
    if(err) throw err;
    res.redirect('/add');
  });

});

router.get('/display', function(req, res, next) {
  connection.query("select * from tbl_product",function(err,db_rows){
    if(err) throw err;
    console.log(db_rows);
    res.render('display',{db_rows_array:db_rows});
  });
});
module.exports = router;
