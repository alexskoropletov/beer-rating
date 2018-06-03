import React, { Component } from 'react';
import {Meteor} from "meteor/meteor";
import {Beers, Images, BeerVotes} from "../api/beers";
import { withTracker } from 'meteor/react-meteor-data';

import BeerImage from './BeerImage';

class Admin extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showDeleted: false
    };
  }

  getFilteredBeers() {
    return this.props.beers
      .filter((beer) => {
        if (!this.state.showDeleted) {
          return beer.isActive;
        }
        return true;
      }).sort((a, b) => (b.pro() - b.contra()) - (a.pro() - a.contra()));
  }

  handleNewBeer(event) {
    event.preventDefault();
    const beerName = this.beerNameInput.value.trim();
    const beerImage = this.beerImageInput.files[0];

    let uploadInstance = Images.insert({
      file: beerImage,
      streams: 'dynamic',
      chunkSize: 'dynamic'
    }, false);

    uploadInstance.on('start', function () {
      console.log('[!] started');
    });

    uploadInstance.on('end', function (error, fileObj) {
      if (error) {
        console.error(error);
      }
      Meteor.call('beers.insert', beerName, fileObj);
      this.beerNameInput.value = '';
      this.beerImageInput.value = '';
    });

    uploadInstance.start();
  }

  handleBeerDeleteClick(beer, event) {
    event.preventDefault();
    Meteor.call('beers.remove', beer);
  }

  renderBeerTable() {
    return this.getFilteredBeers().map((beer) => {
      return (
        <tr key={beer._id}>
          <th scope="row">{beer._id}</th>
          <td>{beer.name}</td>
          <td><BeerImage beer={beer} /></td>
          <td>{beer.pro()}</td>
          <td>{beer.contra()}</td>
          <td>
            <button className="btn btn-outline-danger" onClick={this.handleBeerDeleteClick.bind(this, beer)} type="submit">
              Удалить
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <div className="col-md-12">
        <form onSubmit={this.handleNewBeer.bind(this)} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="beerName">Название</label>
            <input type="text"
                   className="form-control"
                   id="beerName"
                   ref={beerNameInput => {this.beerNameInput = beerNameInput;}}
                   placeholder="Название" />
          </div>
          <div className="form-group">
            <label htmlFor="beerName">Название</label>
            <input type="file" id="beerImage" ref={beerImageInput => {this.beerImageInput = beerImageInput;}}/>
          </div>
          <button type="submit" className="btn btn-outline-primary">Добавить</button>
        </form>
        <br/>
        <table className="table table-striped">
          <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Название</th>
            <th scope="col">Кратинка</th>
            <th scope="col">За</th>
            <th scope="col">Против</th>
            <th scope="col">&nbsp;</th>
          </tr>
          </thead>
          <tbody>
            {this.renderBeerTable()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default withTracker(() => {
  Meteor.subscribe('beers');
  Meteor.subscribe('beer_votes');
  Meteor.subscribe('images');

  return {
    beers: Beers.find({}, { sort: { createdAt: -1 } }).fetch(),
    beer_votes: BeerVotes.find({}).fetch(),
    currentUser: Meteor.user()
  };
})(Admin);