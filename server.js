var express = require('express');
var fs=require('fs');
var MongoClient=require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;

/*
 * body-parser is a piece of express middleware that
 *   reads a form's input and stores it as a javascript
 *   object accessible through `req.body`
 *
 * 'body-parser' must be installed (via `npm install --save body-parser`)
 * For more info see: https://github.com/expressjs/body-parser
 */
var bodyParser = require('body-parser');

// create our app
var app = express();

//function to insert an object in a document
var insertDocument = function(db, callback, object) {
   db.collection('speakers').insertOne(object, function(err, result) {

    console.log("Inserted a document into the speakers collection.");
    callback();
  });
};


//function to find all odocuments in a collection
var findRestaurants = function(db, callback) {
   var cursor =db.collection('speakers').find( );
   cursor.each(function(err, doc) {
      /*assert.equal(err, null);*/
      if (doc != null) {
         console.dir(doc);
      } else {
         callback();
      }
   });
};

//optional function to remove all documents in a function
var removeRestaurants = function(db, callback) {
   db.collection('speakers').deleteMany( {}, function(err, results) {
      console.log(results);
      callback();
   });
};

// instruct the app to use the `bodyParser()` middleware for all routes
app.use(bodyParser.urlencoded({
   extended: true
}));


/*app.use('/static', express.static('public'));*/
app.use(express.static(__dirname + '/'));
/*app.use(express.static('css'));
app.use(express.static('js'));
app.use(express.static('images'));
app.use(express.static('fonts'));*/

// A browser's default method is 'GET', so this
// is the route that express uses when we visit
// our site initially.
app.get('/team.html',function(req,res){
  fs.readFile('team.html',function(err,data){
    res.writeHead(200, {
              'Content-Type': 'text/html',
                  'Content-Length' : data.length
                });
                res.write(data);
                res.end();
  });


});
app.get('/', function(req, res){
  // The form's action is '/' and its method is 'POST',
  // so the `app.post('/', ...` route will receive the
  // result of our form
  /*var html = '<form action="/" method="post">' +
               'Enter your name:' +
               '<input type="text" name="userName" placeholder="..." />' +
               '<br>' +
               '<button type="submit">Submit</button>' +
            '</form>';

  res.send(html);*/

  fs.readFile('speaker_application.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });/*
fs.readFile('studentForm.css', function (err, data) {
        if (err) console.log(err);
        res.writeHead(200, {'Content-Type': 'text/css'});
        res.write(data);
        res.end();
      });*/
});

// This route receives the posted form.
// As explained above, usage of 'body-parser' means
// that `req.body` will be filled in with the form elements
app.post('/index.html', function(req, res){
  var firstName = req.body.first_name;
  var lastName = req.body.last_name;
  var phoneNumber  =req.body.user_contact;
  var email = req.body.user_email;
  var description = req.body.user_description;
  var referenceLink = req.body.user_references;
  var idea = req.body.user_idea;
  var speaker = new Object();

  speaker.firstName = firstName;
  speaker.lastName = lastName;
  speaker.phoneNumber = phoneNumber;
  speaker.email = email;
  speaker.description = description;
  speaker.referenceLink = referenceLink;
  speaker.idea = idea;

  fs.readFile('index.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });/*
  var html = 'Hello: ' + userName + '.<br>'+'phone number: ' + phoneNumber+
             '<a href="/">Try again.</a>';
  res.send(html);*/
  var url = 'mongodb://localhost:27017/test';
  MongoClient.connect(url, function(err, db) {
  /*assert.equal(null, err);*/
  console.log("Connected correctly to server.");
  insertDocument(db, function() {
    findRestaurants(db, function() {
    db.close();
});
  },speaker);
});

});

app.listen(8080);
