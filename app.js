var express = require('express')
var app = express()
var path = require('path')
var mongojs = require('mongojs')
var db = mongojs('root:root@ds133338.mlab.com:33338/lostpump', ['pumps'])

app.use(express.static('public'))

app.set('port', (process.env.PORT || 5000));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
// in latest body-parser use like below.
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname + '/index.html'))
})

app.get('/pump/:id', function(req, res) {
  db.pumps.findOne({
    pumpid: req.params.id
  }, function(err, doc) {
    console.log('pump', doc);
    res.send(doc || {notfound: true});
  })
})
app.post('/save', function (req, res) {
  console.log(req.body);

  db.pumps.findOne({pumpid: req.body.pumpid}, function(err, doc) {
    if(doc) {
      doc.settings = req.body.settings;
    } else {
      doc = req.body;
    }

    db.pumps.save(doc);
  })

  res.send('ok')
});

app.use(function (req, res, next) {
  res.status(404).send('Sorry cant find that!')
})

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
