const express = require('express');

const app = express();

app.get('/home', (req, res) => {
  return res.send('home');
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
