/**
 * @file
 * Contains server utilities for this application.
 */

Meteor.startup(function () {
  ChatRooms.allow({
    'insert': function() {
      return true;
    },
    'update': function() {
      return true;
    },
    'remove': function() {
      return false;
    }
  });
});

Meteor.methods({
  /**
   * Returns url to image.
   * @param {String} url in which to search for image path.
   * @returns {String} url to image.
   */
  'CrawlUrl' : function(url) {
    // Load dependencies.
    var opengrapher = Meteor.npmRequire('opengrapher');
    let Future =  Npm.require('fibers/future');

    // Create a new future.
    var myFuture = new Future();

    // Run opengrapher, and resolve this method on completion.
    opengrapher.parse(url, function (err, ogDict) {
      if (err) {
        myFuture.throw(err);
        return;
      }

      var url = ogDict['image'].split('?');
      myFuture.return(url[0]);
    });

    // Return deferred future.
    return myFuture.wait();
  }
});
