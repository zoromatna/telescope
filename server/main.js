import { Meteor } from 'meteor/meteor';
import '../imports/api/tasks.js';
import FacebookOAuthInit from './imports/oauth-facebook';

Meteor.startup(() => {
  FacebookOAuthInit();
  // code to run on server at startup
});
