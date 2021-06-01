// function
// function greet(name, callback) {
// 	console.log('hi' + ' ' + name);
// 	callback();
// }
// callback function
// function callme() {
// 	console.log('hi i am callback function ');
// }
// passing function as an argument
// greet('Palak', callme);

//  program that shows delay in execution time setTimeout()
// function greet() {
// 	console.log('hello world');
// }
// function sayName(name) {
// 	console.log('hello ' + ' ' + name);
// }
// calling The function
// setTimeout(greet, 2000);
// sayName('Palak');
// fs
// const fs = require('fs');
// const path = require('path');

// fs.mkdir(path.join(__dirname, 'test'), (err) => {
// 	if (err) {
// 		return console.error(err);
// 	}
// 	console.log('directory created successfully');
// });
// file open in write mode
// var fs = require('fs');
// fs.open('demo.txt', 'w', function(err, file) {
// 	if (err) throw err;
// 	console.log('this file is open in write mode');
// });
// file created
// var fs = require('fs');
// fs.writeFile('test.txt', 'hello palak!!', function(err) {
// 	if (err) throw err;
// 	console.log('File Created');
// });
// file content updated
// var fs = require('fs');
// fs.appendFile('test.txt', 'hello palak how are you!', function(err) {
// 	if (err) throw err;
// 	console.log('File content Updated');
// });
// file rename
// var fs = require('fs');
// fs.rename('demo.txt', 'demo1.txt', function(err) {
// 	if (err) throw err;
// 	console.log('File renamed!!');
// });
// file deleted
// var fs = require('fs');
// fs.unlink('demo1.txt', function(err) {
// 	if (err) throw err;
// 	console.log('File deleted');
// });
// file readfile
// var fs = require('fs');

// fs.readFile('demo.txt', 'utf-8', function(err, data) {
// 	if (err) throw err;
// 	console.log('data');
// });
// create file
// var fs = require('fs');
// fs.writeFile('demo.txt', 'hello plk ', function(err, data) {
// 	console.log('file created');
// });
// sync
// var fs = require('fs');
// sync
// var data = fs.readFileSync('demo.html');
// console.log('sync read:' + data.toString());
// console.log('program ended');
//  create file
// var fs = require('fs');
// fs.writeFile('demo.html', 'hello plk ', function(err, data) {
// 	console.log('file created');
// });
// server
// var fs = require('fs');
// var http = require('http');

// http
// 	.createServer(function(req, res) {
// 		fs.readFileSync('demo.html', function(err, data) {
// 			res.writeHead(200, { 'Content-Type': text / html });
// 			res.write(data);
// 			res.end();
// 		});
// 	})
// 	.listen(3000);
// console.log('server started');
// get infromation
var fs = require('fs');
// get info using stats
fs.stat('demo.txt', function(err, stats) {
	if (err) {
		return console.error(err);
	}
	// check file information

	console.log(stats);
	// check file type
	console.log('isFile ?' + stats.isFile());
	console.log('isDirectory ?' + stats.isDirectory());
});
