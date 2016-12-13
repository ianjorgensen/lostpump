var express = require('express')
var app = express()
var path = require('path')

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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
