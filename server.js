var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose = require('mongoose');
var methodOverride = require('method-override');
var router = express.Router();
var session = require('express-session');
var async = require('async');

var db = require('./db');

var Schema = mongoose.Schema,
    Character = require('./app/models/character.js');

// set our port
var port = process.env.PORT || 8080;
mongoose.connect(db.url);

app.use(bodyParser.json());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('X-HTTP-Method-Override'));
app.use(express.static(__dirname + '/public'));

router.get('/base', function(req, res) {
        console.log('get base');
        var text = "hello you have connection";
        res.send(text);
});

// ------------------ view multiple
router.get('/characters', function(req, res) {
    console.log('get characters', req.params);
    Character
    .find()
    .exec(function(err, result) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            console.log('success');
            res.send(result);
        }
    });
    console.log('after-get');
});

//--------------------- create one
 router.post('/character', function(req, res) {
    console.log('create one result');
    var character = new Character(req.body);
    character.save(function(err) {
      console.log('saved');
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('success');
            res.send(character);
        }
    });
});

//----------------update one
router.put('/characters/:character_id', function(req, res) {
    console.log('update character', req.params);
    var characters = req.body;
    Character.update({
        _id: req.params.character_id
    }, characters, function(err, characters) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            res.send("success");
        }
    });
});

//------------------delete one
router.delete('/characters/:character_id', function(req, res) {
    console.log('delete character', req.params);
    Character.remove({
        _id: req.params.character_id
    }, function(err) {
        if (err){
            console.log(err);
            return res.json(err);
        } else {
            console.log('deleted');
            res.send("success");
            //res.sendStatus(200).end();
        }
    });
});

//--------------------- create many
 router.post('/characters', function(req, res) {
    console.log('create many');
    Character.create(req.body, function(err){
      if(err)
        res.send(err);
      else
        res.json(req.body);
    });
});

 //-------------------- find by parameter
router.get('/characters/:parameter', function(req, res){
  console.log('find character by parameter');
  Character
  .find({
        $or: [{ name: {'$regex': req.params.parameter}}, {eyecolor: {'$regex': req.params.parameter}}, {haircolor: {'$regex': req.params.parameter}},
          {persona: {'$regex': req.params.parameter}}, {lands: {'$regex': req.params.parameter}}, {location: {'$regex': req.params.parameter}}]
    })
    .select({
        _id: 0,
        name: 1,
        eyecolor: 1,
        haircolor: 1
    })
    .exec(function(err, character) {
    if (err) {
        console.log(err);
        return res.json(err);
    } else {
        res.send(character);

    }
});
});

//---------------------- using async parallel
router.get('/character/:param1/:param2', function(req, res){
  console.log('async parallel');
  async.parallel([
     function(callback){
      Character
      .find({ name : req.params.param1})
      .count()
      .exec(function(err, character){
        if(err){
          console.log(err);
          callback(err);
        } else {
          console.log(character);
          callback(null, character);
      }
    });
  },
     function(callback){
      Character
      .find({eyecolor: req.params.param2})
      .count()
      .exec(function(err, character){
        if(err){
          callback(err);
        } else {
          callback(null, character);
      }
    });
  },
  function(callback){
   Character
   .find({})
   .count()
   .exec(function(err, character){
     if(err){
       callback(err);
     } else {
       var result = character*8;
       callback(null, result);
   }
 });
},
function(callback){
 Character
 .find({ name : req.params.param1})
 .exec(function(err, character){
   if(err){
     console.log(err);
     callback(err);
   } else {
     console.log(character);
     callback(null, character);
 }
});
},
function(callback){
 Character
 .find({ eyecolor : req.params.param2})
 .exec(function(err, character){
   if(err){
     console.log(err);
     callback(err);
   } else {
     console.log(character);
     callback(null, character);
 }
});
}
  ],
  function(error, results){
    var total = results[0] + results[1];
    res.send(results[3] + results[4] +  " " + total + " responses out of " + results[2] + " possibilities");
});

});

app.use('/api', router);
app.listen(port);
console.log('working on port  ' + port);
