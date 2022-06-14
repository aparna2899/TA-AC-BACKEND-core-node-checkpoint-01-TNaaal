var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var qs = require('querystring');

var server = http.createServer(handleRequest);

var contactDir = path.join(__dirname, 'contacts/');

function handleRequest(req, res) {
  var parsedUrl = url.parse(req.url, true);
  var store = '';
  req.on('data', (chunk) => {
    store += chunk;
  });
  req.on('end', () => {
    if (req.method === 'GET') {
      var fileUrl;
      if (req.url == '/') fileUrl = '/index.html';
      else if (req.url == '/about') fileUrl = '/about.html';
      else if (req.url == '/contact') fileUrl = '/contact.html';
      else fileUrl = req.url;
      var filePath = path.resolve('./block-BNaaep' + fileUrl);
      const fileExt = path.extname(filePath);
      if (fileExt == '.html') {
        res.setHeader('Content-Type', 'text/html');
        fs.readFile('.' + fileUrl, (err, content) => {
          if (err) return console.log(err);
          res.end(content);
        });
      }
      if (fileExt == '.css') {
        res.setHeader('Content-Type', 'text/css');
        fs.readFile('./assets/stylesheet/style.css', (err, content) => {
          if (err) return console.log(err);
          res.end(content);
        });
      }
      if (fileExt == '.jpg' || fileExt == '.png') {
        res.setHeader('Content-Type', 'image/jpg');
        fs.readFile('.' + req.url, (err, content) => {
          if (err) return console.log(err);
          res.end(content);
        });
      }
    }
    if (req.method === 'POST' && req.url === '/contact') {
      var username = qs.parse(store).username;
      store = JSON.stringify(qs.parse(store));
      fs.open(contactDir + '/' + username + '.json', 'wx', (err, fd) => {
        if (err) return console.log(err);
        fs.write(fd, store, (err) => {
          if (err) return console.log(err);
          fs.close(fd, (err) => {
            if (err) return console.log(err);
            res.end(`${username} contact saved!`);
          });
        });
      });
    }
    if (req.method === 'GET' && parsedUrl.pathname === '/contacts') {
      var username = parsedUrl.query.username;
      fs.readFile(contactDir + username + '.json', (err, content) => {
        if (err) return console.log(err);
        var contactInfo = JSON.parse(content);
        res.setHeader('Content-Type', 'text/html');
        res.write(`<h3>${contactInfo.name}</h3>`);
        res.write(`<h3>${contactInfo.email}</h3>`);
        res.write(`<h3>${contactInfo.username}</h3>`);
        res.write(`<h3>${contactInfo.age}</h3>`);
        res.end();
      });
    }
  });
}

server.listen(4000, () => {
  console.log('server is listening on port 4000');
});
