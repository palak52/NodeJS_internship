var express = require('express');
var mysql = require('mysql');
var router = express.Router();

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'demo-web'
});
connection.connect(function(err) {
	if (!err) {
		console.log('Db connected');
	} else {
		console.log('Db connection issue');
	}
});

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
	console.log('A value is ' + a + ' B value is ' + b);
	res.render('ans', { mya: a, myb: b });
});

router.get('/add', function(req, res, next) {
	res.render('login-form', { title: 'Express' });
});

//insert route
router.post('/add-process', function(req, res, next) {
	console.log(req.body);

	const mybodydata = {
		Email_id: req.body.txt1,
		Password: req.body.txt2
	};

	connection.query('insert into login set ?', mybodydata, function(err, result) {
		if (err) throw err;
		res.redirect('/add');
	});
});

//display route
router.get('/display', function(req, res, next) {
	connection.query('select * from login', function(err, db_rows) {
		if (err) throw err;
		console.log(db_rows);
		res.render('display', { db_rows_array: db_rows });
	});
});

//delete route
router.get('/delete/:id', function(req, res, next) {
	var deleteid = req.params.id;
	console.log(deleteid);
	connection.query('delete from login where Id = ?', [ deleteid ], function(err, db_rows) {
		if (err) throw err;
		console.log(db_rows);
		res.redirect('/display');
	});
});

//edit route
router.get('/edit/:id', function(req, res, next) {
	var editid = req.params.id;
	console.log(editid);
	connection.query('select * from login where Id = ?', [ editid ], function(err, db_rows) {
		if (err) throw err;
		console.log(db_rows);
		res.render('edit', { db_rows_array: db_rows });
	});
});

//route post
router.post('/edit/:id', function(req, res, next) {
	var editid = req.params.id;

	var Email_id = req.body.txt1;
	var Password = req.body.txt2;

	console.log(editid);
	connection.query(
		'update login set Email_id = ?,Password = ? where Id = ?',
		[ Email_id, Password, editid ],
		function(err, db_rows) {
			if (err) throw err;
			res.redirect('/display');
		}
	);
});

module.exports = router;
