Accounts.ui.config({
   passwordSignupFields: 'USERNAME_AND_EMAIL'
});
Deps.autorun(function(){
    Meteor.subscribe("chatrooms");
    Meteor.subscribe("onlusers");
});

//need to modify this function and the data models for users so there is a "friend" type connection, and we only display from this pool
Template.sidebar.helpers({
    'onlusr':function(){
        return Meteor.users.find({ "status.online": true , _id: {$ne: Meteor.userId()} });
    }
});

Template.sidebar.events({
    'click .user':function(){
        Session.set('currentId',this._id);
        var res=ChatRooms.findOne({chatIds:{$all:[this._id,Meteor.userId()]}});
        if(res)
        {
            //already room exists
            Session.set("roomid",res._id);
        }
        else{
            //no room exists
            var newRoom= ChatRooms.insert({chatIds:[this._id , Meteor.userId()],messages:[]});
            Session.set('roomid',newRoom);
        }
    }
});



Template.messages.helpers({
    'msgs':function(){
        var result=ChatRooms.findOne({_id:Session.get('roomid')});
        
        return result.messages;
    }
});


Template.messages.onRendered(function () {
      console.log('rendered');
      console.log("scrolltop is " + $('#list').scrollTop());
      $('#list').scrollTop( $('#list').prop("scrollHeight") );
});

Template.input.events = {
  'keydown input#message' : function (event) {
    if (event.which == 13) { 
        if (Meteor.user())
        {
              var name = Meteor.user().username;
              var message = document.getElementById('message');
              
              //message processing
              if (message.value !== '') {
               

                //set regex for URLs and images
                var url_exp = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
                var url_regex = new RegExp(url_exp);
                var img_exp = /.+\.(?:jpg|gif|png)$/gi;
                var img_regex = new RegExp(img_exp)
                
                //check if message is a URL
                if (message.value.match(url_regex)) {
                 
                  //check if URL is an image URL
                  if (!message.value.match(img_regex)) {
                    console.log('not an image url');
                    Meteor.call('CrawlUrl',message.value, function(err,data) {
                      if (err) {
                         throw err
                      } else {
                          var type = 'img';
                          var isImg = true;
                          var de=ChatRooms.update({"_id":Session.get("roomid")},{$push:{messages:{
                          name: name,
                          type: type, 
                          isImg: isImg,
                          content: data,
                          createdAt: Date.now() 
                          }}});
                       }});
                     
                  } else {
                    //content is an image URL
                   console.log('content is an image URL')
                    var content = message.value;
                    var type = "img";
                    var isImg = true;
                    var de=ChatRooms.update({"_id":Session.get("roomid")},{$push:{messages:{
                      name: name,
                      type: type, 
                      isImg: isImg,
                      content: content,
                      createdAt: Date.now()
                         
                   }}});
                 }
               } else {
                  //content is text
                  console.log('content is text')
                  var type = "text";
                  var isImg = false;
                  var content = message.value; 
                  var de=ChatRooms.update({"_id":Session.get("roomid")},{$push:{messages:{
                    name: name,
                    type: type, 
                    isImg: isImg,
                    content: content,
                    createdAt: Date.now()
                }}});
                }
                document.getElementById('message').value = '';
                message.value = '';
              
             }
        }
        else
        {
           alert("login to chat");
        }
       
    }
  }
}
