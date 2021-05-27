var http = require('http');
http
	.createServer(function(req, res) {
		res.end('welcome to nodejs');
	})
	.listen(3000);
console.log('server is start at 3000');
