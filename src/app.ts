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

// Send back the pushPackage
app.get('/v(\\d)/pushPackages/web.com.leocode.login', function (req, res) {
  // Search for the latest zipped pushPackage
  let pushPackage = fs.readdirSync(path.resolve(__dirname, '../private')).reverse().find( (name) => !!name.match(/^.*\.zip$/) );
  if ( pushPackage ) {
    // Send back the package
    res.set('Content-type', 'application/zip');
    res.sendFile( path.resolve(__dirname, `../private/${pushPackage}`) );
  } else {
    // Sorry, no package found
    res.status(404);
    res.end();
  }
});

// Log messages from Safari push API
app.post('/v(\\d)/log', function (req, res) {
  console.log('log: ', req.body.logs);
  res.end();
});

// Serve via https
const httpsOptions = {
  key: fs.readFileSync('./private/ssl/key.pem'),
  cert: fs.readFileSync('./private/ssl/cert.pem')
}
const server = https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('Example app listening on port https://HOSTNAME:3000');
})
