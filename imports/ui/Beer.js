import React, { Component } from 'react';

import BeerImage from './BeerImage';

// Beer component - represents a single todo item
export default class Beer extends Component {
  render() {
    return (
      <div>
        <div className="col-md-1">&nbsp;</div>
        <div className="col-md-4 beer-item">
          <div>
            <BeerImage beer={this.props.beer} />
          </div>
          <div>
            {this.props.beer.name}
          </div>
        </div>
        <div className="col-md-1">&nbsp;</div>
      </div>
    );
  }
}