const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config/app');
const router = require('./router/index');
const http = require('http');
const SocketServer = require('./socket');

const app = express();

// for images
app.use(bodyParser.urlencoded({ extended: true }));
// for json
app.use(bodyParser.json());
app.use(router);
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/uploads'));

const port = config.appPort;
const server = http.createServer(app);
SocketServer(server);

server.listen(port, () => {
  console.log(`Server listening to port ${port}`);
});
