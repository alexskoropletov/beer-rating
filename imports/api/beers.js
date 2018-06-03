import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';
import {FilesCollection} from 'meteor/ostrio:files';

class Beer {
  constructor(doc) {
    _.extend(this, doc);
  }

  pro() {
    return BeerVotes.find({'beerId': this._id, 'vote': 'good'}).count();
  }

  contra() {
    return BeerVotes.find({'beerId': this._id, 'vote': 'bad'}).count();
  }
}

export const Beers = new Mongo.Collection('beers', {
  transform: (doc) => new Beer(doc)
});

export const Images = new FilesCollection({
  debug: true,
  collectionName: 'images',
  storagePath: () => {
    return `${process.env.PWD}/public`;
  },
  onBeforeUpload: (file) => {
    // Allow upload files under 10MB, and only in png/jpg/jpeg formats
    if (file.size <= 1024 * 1024 * 10 && /png|jpe?g/i.test(file.extension)) {
      return true;
    }
    return 'Please upload image, with size equal or less than 10MB';
  }
});

export const BeerVotes = new Mongo.Collection('beer_votes');

if (Meteor.isServer) {
  // This code only runs on the server
  // Only publish beers that are public or belong to the current user
  Meteor.publish('beers', function beersPublication() {
    return Beers.find({});
  });
  Meteor.publish('files.images.all', function imagesPublication() {
    return Images.find().cursor;
  });
  Meteor.publish('beer_votes', function beerVotesPublication() {
    return BeerVotes.find({});
  });
}

Meteor.methods({
  'beers.insert'(name, image) {
    check(name, String);
    check(image, Object);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }

    console.log('p[]', image);

    Beers.insert({
      name: name,
      image: image,
      createdAt: new Date(),
      owner: this.userId,
      username: Meteor.users.findOne(this.userId).username,
      isActive: true
    });
  },
  'beers.remove'(beer) {
    check(beer, Object);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized');
    }
    Beers.update(beer._id, {$set: {isActive: false}});
  },
  'beers.vote'(beer, vote) {
    check(beer, Object);
    check(vote, String);
    const insertedVote = BeerVotes.insert({
      beerId: beer._id,
      vote: vote,
      createdAt: new Date()
    });
  }
});