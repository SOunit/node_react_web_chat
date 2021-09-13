const express = require('express');
const config = require('./config/app');
const router = require('./router/index');

const app = express();

app.use(router);

const port = config.appPort;

app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
