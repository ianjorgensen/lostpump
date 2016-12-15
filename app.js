var express = require('express')
var app = express()
var path = require('path')

app.set('port', (process.env.PORT || 5000));

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
