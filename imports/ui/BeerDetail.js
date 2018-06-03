import React, { Component } from 'react';
import { Meteor } from 'meteor/meteor';

import BeerImage from './BeerImage';

export default class BeerDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showThankYou: false
    };
  }

  handleVote(vote, event) {
    event.preventDefault();
    Meteor.call('beers.vote', this.props.beer, vote);
    this.setState({
      showThankYou: true
    });
  }

  render() {
    if (this.state.showThankYou) {
      return (
        <div className="col-md-12 beer-item beer-item-detail">
          <div>
            <h1>Спасибо!</h1>
          </div>
        </div>
      );
    }
    return (
      <div className="col-md-12 beer-item beer-item-detail">
        <div>
          <BeerImage beer={this.props.beer} />
        </div>
        <div>
          <h1>{this.props.beer.name}</h1>
        </div>
        <div>
          <button type="button" className="btn btn-outline-success btn-lg" onClick={this.handleVote.bind(this, 'good')}>
            Понравилось
          </button>
          <button type="button" className="btn btn-outline-secondary btn-lg" onClick={this.handleVote.bind(this, 'bad')}>
            Не понравилось
          </button>
        </div>
      </div>
    );
  }
};

