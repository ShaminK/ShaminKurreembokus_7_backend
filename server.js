const http = require('http');
// const app = require('./app');
var express = require('express');
var bodyParser = require('body-parser');
var apiRouter = require('./apiRouter').router;
const multer = require('multer');

var server = express();
const upload = multer()

server.use(bodyParser.urlencoded({ extended: true}));
server.use(bodyParser.json());

server.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});
// server.post('/api/posts/edit/' , upload.single('image'), (req, res, next) => {
//   const file = req.file;
//   const data = req.body;
//   console.log({file, data});
//    return res.status(200).send('ca marche')
// })
server.use('/api/', apiRouter);


server.get('/', function(req, res) {
  res.setHeader('Content-Type' , 'text/html')
  res.status(200).send('<h1>coucou</h1>')
})

const normalizePort = val => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};
const port = normalizePort(process.env.PORT || '4200');
// app.set('port', port);

const errorHandler = error => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};


server.listen(4200, function(){
  console.log('serveur en marche');
});
