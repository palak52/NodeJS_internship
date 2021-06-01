const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
	res.send('Hello World!');
});

app.get('/about', (req, res) => {
	res.send('Hello About!');
});
app.get('/contact', (req, res) => {
	res.send('Hello Contact!');
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
