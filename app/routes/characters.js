var mongoose = require('mongoose');
var router = require('express').Router();

var Schema = mongoose.Schema,
    Character = require('../models/character');

    // ----- test
router.get('/base', function(req, res) {
        console.log('get base');
        var text = "hello you have connection";
        res.send(text);
});

// ------------------ view multiple
router.get('/characters', function(req, res) {
    console.log('get characters', req.params);
    Character
    .find({
       'name': req.params.name
    })
    .populate()
    .exec(function(err, character) {
        if (err) {
            console.log(err);
            return res.json(err);
        } else {
            console.log('success');
            res.send(character);
        }
    });
});

// ------------------ create one
router.post('/characters', function(req, res) {
    console.log('create one result', req.params);
    var character = new Character(req.body);

    console.log(character);
    character.save(function(err, result) {
      console.log('saved');
        if (err) {
            console.log(err);
            res.send(err);
        } else {
            console.log('success');
            res.send(result);
        }
    });
});

module.exports = router;
