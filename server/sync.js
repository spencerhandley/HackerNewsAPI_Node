var request = require('request');
var Firebase = require("firebase");
var mongoose = require('mongoose');
var Events = require('minivents');

var User = require('./mongoose/models/user');
var Story = require('./mongoose/models/story');
var Poll = require('./mongoose/models/poll');
var Comment = require('./mongoose/models/comment');
var Pollopt = require('./mongoose/models/pollopt');
var Job = require('./mongoose/models/job');
var ref = new Firebase("https://hacker-news.firebaseio.com/v0/");
var maxRef = ref.child('maxitem')

exports.syncData = function(req, res, next){
  var sandbox = new Events();
  console.log("syncing data ....");
  var setStack = [];
  var setSize = 200;
  var setIndex = 1;
  maxRef.once('value', function(maxIt){
    var setsCount = Math.round(maxIt.val()/setSize)
    for (var i = setIndex; i < setsCount; i++) {
      setStack.push(i*setSize);
    };
    var returnCount = setIndex * setSize;

    function loopSet(){
      var min = setStack[0];
      var max = setStack[1];

      console.log(min, max)
      for (var i = min; i < max; i++) {
        (function go(i){
          console.log(i, 'invoked go')
          request('https://hacker-news.firebaseio.com/v0/item/'+ i +'.json', function(error, response, body){
            if(error) {

              returnCount++;
              if(returnCount === max){
                console.log("EMIT");
                sandbox.emit("nextSet");
              }
              throw error;
            };
            if(body === null){
              conosle.log("response was empty")
              returnCount++;
              if(returnCount === max){
                console.log("EMIT");
                sandbox.emit("nextSet");
              }
              return
            }
            var item = JSON.parse(body)

            if(item["type"] === "story"){
              var story = new Story(item);
              story.hnId = item.id;
              return story.save(function(err, story){
                if(err) throw err;
                returnCount++;
                if(returnCount === max){
                  console.log("EMIT");
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max);
                return;
              });
            }
            if(item["type"] === "poll"){
              var poll = new Poll(item);
              poll.hnId = item.id;
              return poll.save(function(err, poll){
                if(err) throw err;
                returnCount++;
                if(returnCount === max){
                  console.log("EMIT");
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, item.id, "SAVED", max);
                return;
              });
            }
            if(item["type"] === "comment"){
              var comment = new Comment(item);
              comment.hnId = item.id;
              return comment.save(function(err, comment){
                if(err) throw err;
                returnCount++;
                if(returnCount === max){
                  console.log("EMIT");
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max);
                return;
              });
            }
            if(item["type"] === "job"){
              var job = new Job(item);
              job.hnId = item.id;
              return job.save(function(err, job){
                if(err) throw err;
                returnCount++;
                if(returnCount === max){
                  console.log("EMIT");
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max);
                return;
              });
            }
            if(item["type"] === "pollopt"){
              var pollopt = new Pollopt(item);
              pollopt.hnId = item.id;
              return pollopt.save(function(err, pollopt){
                if(err) throw err;
                returnCount++;
                if(returnCount === max){
                  console.log("EMIT");
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max);
                return;
              });
            } else {
              returnCount++
              if(returnCount === max){
                console.log("EMIT");
                sandbox.emit("nextSet");
              }
            }
          });
        })(i);
      }
      return
    }
    sandbox.on("nextSet", function(){
      console.log("EVENT SENT")
      setStack.shift();
      setIndex++;
      if(setStack.length > 0){
        loopSet();
      }
    });
    loopSet();

  });
};
