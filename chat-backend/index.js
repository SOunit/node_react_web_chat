const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/app');
const router = require('./router/index');

const app = express();
// for images
app.use(bodyParser.urlencoded({ extended: true }));
// for json
app.use(bodyParser.json());
app.use(router);
app.use(express.static(__dirname + '/public'));

const port = config.appPort;
app.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
