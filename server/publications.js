/**
 * @file
 * Contains all publications for this application.
 */

/**
 * Publishes all chatroom documents.
 */
Meteor.publish('chatrooms', function() {
  return ChatRooms.find({});
});

/**
 * Publishes all online users.
 */
Meteor.publish('onlusers', function() {
  return Meteor.users.find({ 'status.online': true }, { username: 1 });
})
