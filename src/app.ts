import express = require('express');
import bodyParser = require('body-parser');
import https = require('https');
import fs = require('fs');
import path = require('path');
import apn = require('apn');

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
    // Send the package file
    res.set('Content-type', 'application/zip');
    res.sendFile( path.resolve(__dirname, `../private/${pushPackage}`) );
  } else {
    // Sorry, no package file found
    res.status(404);
    res.end();
  }
});

// Log messages from Safari push API
app.post('/v(\\d)/log', function (req, res) {
  console.log('log: ', req.body.logs);
  res.end();
});

app.post('/push', function(req, res){

  console.log('push', req.body);
  const { title, message, token } = req.body;
  if ( !title || !message || !token ) {
    res
      .status(400)
      .json({
        message: 'Parameter is missing'
      })
      .end();
  }

  // Create push provider
  var options = {
    gateway: "gateway.sandbox.push.apple.com",
    cert: path.resolve(__dirname, '../private/aps.cert/web_aps_prod_cert.pem'),
    key:  path.resolve(__dirname, '../private/aps.cert/web_aps_prod_key.pem'),
    production: true
  };
  var apnProvider = new apn.Provider(options);


  // Create note with payload
  const note = new apn.Notification();
  note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
  note.urlArgs = ["my_url_argument"];
  note.alert = {
    title,
    body: message
  };
  note.topic = "web.com.leocode.login"; // my app bundle
  
  // Send notification
  apnProvider.send(note, token).then( (result) => {
    if ( result.failed && result.failed.length ) {
      res.json({
        message: 'Message send failed',
        reason: result.failed.pop().response.reason
      });
    } else {
      res.json({
        message: "Message sent!"
      });
    }
    res.end();
  });

})


// Serve via https
const httpsOptions = {
  key: fs.readFileSync('./private/ssl/key.pem'),
  cert: fs.readFileSync('./private/ssl/cert.pem')
}
const server = https.createServer(httpsOptions, app).listen(3000, () => {
  console.log('Example app listening on port https://HOSTNAME:3000');
})
