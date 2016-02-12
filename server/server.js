//perms n shit
Meteor.startup(function(){
   ChatRooms.allow({
        'insert':function(userId,doc){
            return true;
        },
        'update':function(userId,doc,fieldNames, modifier){
            return true;
        },
        'remove':function(userId,doc){
            return false;
        }
    });
});

//methods n shiz
Meteor.methods({
  'CrawlUrl' : function(url) {
   //method to scrape images from URLs that are for some page, and not directly of an image


    // load future npm
    Future =  Npm.require('fibers/future');
    var myFuture = new Future();
    
    //load opengrapher npm
    var opengrapher = Meteor.npmRequire('opengrapher');
    
    //run opengrapher, use future to wait for results
    opengrapher.parse(url, function(err, ogDict) {
      if (err) {
        myFuture.throw(err);
      } else {
	var url = ogDict['image'].split('?');
	var image = url[0];
        myFuture.return(image)
        console.log(ogDict['image'])
    }});
     return myFuture.wait();
  } 
 });
