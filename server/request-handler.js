var request = require('request');
var Firebase = require("firebase");
var mongoose = require('mongoose');
var Promise = require('bluebird');
var Events = require('minivents');

// var _ = require('underscore')
// var util = require('../lib/utility');

var User = require('./mongoose/models/user');
var Story = require('./mongoose/models/story');
var Poll = require('./mongoose/models/poll');
var Comment = require('./mongoose/models/comment');
var Pollopt = require('./mongoose/models/pollopt');
var Job = require('./mongoose/models/job');
var ref = new Firebase("https://hacker-news.firebaseio.com/v0/");
var users = ref.child('user');
var maxRef = ref.child('maxitem')

// var updateUser = function(username){
//   users.child(username).once('value', function(user){
    
//   })
// }
exports.syncUsers = function(req, res, next){

  Comment.find({}, function(err, comment){
    var users = []
    for (var i = 0; i < comment.length; i++) {
      users.push(comment[i].by)
    };
    res.send(_.unique(users))
  })
}
exports.syncData = function(req, res, next){
  var sandbox = new Events()
  console.log("syncing data ....");
  var setStack = [1]
  maxRef.once('value', function(maxIt){
    var setsCount = Math.round(maxIt.val()/200)
    for (var i = 1; i < setsCount; i++) {
      setStack.push(i*200);
    };
    var returnCount = 0


    function loopSet(){
      var min = setStack[0];
      var max = setStack[1]

      console.log(min, max)
      for (var i = min; i < max+3; i++) {
        (function go(i){
          console.log(i, 'invoked go')
          request('https://hacker-news.firebaseio.com/v0/item/'+ i +'.json', function(error, response, body){

            var item = JSON.parse(body)
            if(item["type"] === "user"){
              var user = new User(item);
              user.hnId = item.id;
              return user.save(function(err, user){
                if(err) throw err;
                returnCount++
                if(returnCount === max){
                  console.log("EMIT")
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max)
                return
              });
            }
            if(item["type"] === "story"){
              var story = new Story(item);
              story.hnId = item.id;
              return story.save(function(err, story){
                if(err) throw err;
                returnCount++
                if(returnCount === max){
                  console.log("EMIT")
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max)
                return
              });
            }
            if(item["type"] === "poll"){
              var poll = new Poll(item);
              poll.hnId = item.id
              return poll.save(function(err, poll){
                if(err) throw err;
                returnCount++
                if(returnCount === max){
                  console.log("EMIT")
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max)
                return
              });
            }
            if(item["type"] === "comment"){
              var comment = new Comment(item);
              comment.hnId = item.id;
              return comment.save(function(err, comment){
                if(err) throw err;
                returnCount++
                if(returnCount === max){
                  console.log("EMIT")
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max)
                return
              });
            }
            if(item["type"] === "job"){
              var job = new Job(item);
              job.hnId = item.id;
              return job.save(function(err, job){
                if(err) throw err;
                returnCount++
                if(returnCount === max){
                  console.log("EMIT")
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max)
                return
              });
            }
            if(item["type"] === "pollopt"){
              var pollopt = new Pollopt(item);
              pollopt.hnId = item.id
              return pollopt.save(function(err, pollopt){
                if(err) throw err;
                returnCount++
                if(returnCount === max){
                  console.log("EMIT")
                  sandbox.emit("nextSet");
                }
                console.log(returnCount, "SAVED", max)
                return
              });
            }
          });
        })(i);
      }
      return
    }
    sandbox.on("nextSet", function(){
      console.log("EVENT SENT")
      setStack.shift();
      if(setStack.length > 0){
        loopSet()
      }
    });
    loopSet()

  });
};
exports.getTopStories = function(req, res, next){
  console.log("hey")
  Story.find({}, function(err, stories){
    if(err) throw err;
    res.send(stories);
  });
};
exports.getComment = function(req, res, next){
  Comment.find({hnId: req.params.commentId}, function(err, comment){
    if(err) throw err;
    res.send(comment[0]);
  });
};
exports.getCommentsKids = function(req, res, next){
  Comment.find({hnId: req.params.commentId}, function(err, comment){
    var commentKids = comment[0].kids;
    var children = []
    for (var i = 0; i < commentKids.length; i++) {
      Comment.find({hnId: commentKids[i]}, function(err, comment) {
        children.push(comment[0])
      });
    };
    res.send(children);
  });
};
exports.getAllUserData = function(req, res, next){
  Story.find({hnId: req.params.userId}, function(err, userData){
    if(err) throw err;
    res.send(userData[0]);
  });
};
exports.getAllCommentsByUser = function(req, res, next){
  Comments.find({by: req.params.userId}, function(err, comments){
    if(err) throw err;
    res.send(comments);
  });
};
exports.getAllJobs = function(req, res, next){
  Job.find({}, function(err, jobs){
    if(err) throw err;
    res.send(jobs);
  });
};
exports.getJob = function(req, res, next){
  Job.find({hnId: req.params.jobId}, function(err, job){
    if(err) throw err;
    res.send(job[0]);
  });
};
exports.getJobComments = function(req, res, next){
  Job.find({hnId: req.params.jobId}, function(err, job){
    if(err) throw err;
    var results = [];
    var jobKids = job[0].kids;
    var findChildComments = function(children){
      if(children.length === 0){
        return;
      }
      for (var i = 0; i < children.length; i++) {
        Comment.find({hnId: children[i]}, function(err, comment){
          results.push(comment[0]);
          findChildComments(comment[0].kids);
        });
      };
    }
    findChildComments(jobKids);
    res.send(results);

  });
};
exports.getAllPolls = function(req, res, next){
  Poll.find({}, function(err, polls){
    if(err) throw err;
    res.send(polls);
  })
};
exports.getPoll = function(req, res, next){
  Poll.find({hnId: req.params.pollId}, function(err, poll){
    if(err) throw err;
    res.send(poll);
  });
};
exports.getPollComments = function(req, res, next){
  Poll.find({hnId: req.params.pollId}, function(err, poll){
    if(err) throw err;
    var results = [];
    var pollKids = poll[0].kids;
    var findChildComments = function(children){
      if(children.length === 0){
        return;
      }
      for (var i = 0; i < children.length; i++) {
        Comment.find({hnId: children[i]}, function(err, comment){
          results.push(comment[0]);
          findChildComments(comment[0].kids);
        });
      };
    }
    findChildComments(pollKids);
    res.send(results);

  });
};
exports.getAllStories = function(req, res, next){
  Story.find({}, function(err, stories){
    if(err) throw err;
    res.send(stories);
  });
};
exports.getStory = function(req, res, next){
  Story.find({hnId: req.params.storyId}, function(err, story){
    if(err) throw err;
    res.send(story[0]);
  })
};
exports.getStoryComments = function(req, res, next){
  Story.find({hnId: req.params.storyId}, function(err, story){
    if(err) throw err;
    var results = [];
    var storyKids = story[0].kids;
    var findChildComments = function(children){
      if(children.length === 0){
        return;
      }
      for (var i = 0; i < children.length; i++) {
        Comment.find({hnId: children[i]}, function(err, comment){
          results.push(comment[0]);
          findChildComments(comment[0].kids);
        });
      };
    }
    findChildComments(storyKids);
    res.send(results);

  });
};
exports.getAllPollopts = function(req, res, next){
  Pollopt.find({}, function(err, pollots){
    if(err) throw err;
    res.send(pollots);
  });
};
exports.getPollopt = function(req, res, next){
  Pollopt.find({hnId: req.params.polloptId}, function(err, pollopt){
    if(err) throw err;
    res.send(pollopt[0])
  });
};
exports.getPolloptComments = function(req, res, next){
};

