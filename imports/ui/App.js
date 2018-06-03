import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Meteor } from 'meteor/meteor';
import { withTracker } from 'meteor/react-meteor-data';

import { Beers } from '../api/beers';

import Beer from './Beer';
import BeerDetail from './BeerDetail';
import Login from './Login';
import Admin from './Admin';
import Footer from './Footer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideCompleted: false,
      currentPage: 'beers',
      currentBeer: null,
    };
  }

  handlePage(page) {
    this.setState({
      currentPage: page
    });
  }

  handleBeerClick(beer, event) {
    event.preventDefault();
    this.setState({
      currentPage: 'beer',
      currentBeer: beer,
    });
  }

  renderPage() {
    if (!Meteor.userId()) {
      return (
        <Login/>
      );
    } else {
      if (this.state.currentPage === 'admin') {
        return this.renderAdmin();
      }
      if (this.state.currentPage === 'beer' && this.state.currentBeer) {
        return this.renderBeer();
      }
      return this.renderBeers();
    }
  }

  renderBeers() {
    let filteredBeers = this.props.beers;
    return filteredBeers.map((beer) => {
      return (
        <a href='#' key={beer._id} onClick={this.handleBeerClick.bind(this, beer)}>
          <Beer beer={beer}/>
        </a>
      );
    });
  }

  renderBeer() {
    if (this.state.currentPage === 'beer') {
      return (
        <div className="row">
          <BeerDetail beer={this.state.currentBeer}/>
        </div>
      );
    }
    return (
      <div className="row">
        <Beer beer={this.state.currentBeer}/>
      </div>
    );
  }

  renderAdmin() {
    return (
      <div className="row">
        <Admin />
      </div>
    );
  }

  render() {
    return (
      <div className="app">
        <img src="/images/logo.png" className="logo" onClick={this.handlePage.bind(this, 'beers')}/>
        <div className="container">
          {this.renderPage()}
        </div>
        <Footer page={this.state.currentPage} handleFooter={this.handlePage}/>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('beers');

  return {
    beers: Beers.find({isActive: true}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);