import express = require('express');
import bodyParser = require('body-parser');
import https = require('https');
import fs = require('fs');
import path = require('path');

const app: express.Application = express();

app.use(bodyParser.json());
app.use(express.static('public'))

// Render main site
app.get('/', function (req, res) {
  res.send(`
    <html><head><title>Safari Push Example</title></head><body><h1>Safari Push Example</h1><div id="log"></div><script src="/js/index.js" type="text/javascript"></script></body></html>
  `);
});

// Serve via https
const httpsOptions = {
  key: fs.readFileSync('./private/ssl/key.pem'),
  cert: fs.readFileSync('./private/ssl/cert.pem')
}
const server = https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('Example app listening on port https://HOSTNAME:3000');
})
