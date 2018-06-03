import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base'
import '../imports/api/beers.js';

Meteor.startup(() => {
  // code to run on server at startup
  // Meteor.users.find({}).fetch().map((user) => {
  //   Meteor.users.remove(user._id);
  // });
  if (!Meteor.users.find({}).fetch().length) {
    Accounts.createUser({
      username: Meteor.settings.INITIAL_USERNAME,
      email: Meteor.settings.INITIAL_EMAIL,
      password: Meteor.settings.INITIAL_PASSWORD
    });
  }
});
