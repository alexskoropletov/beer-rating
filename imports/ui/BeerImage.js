import React, { Component } from 'react';

export default class BeerImage extends Component {
  render() {
    if (!this.props.beer.image || !this.props.beer.image.path) {
      return '';
    }
    const path = this.props.beer.image._id + this.props.beer.image.extensionWithDot;
    return (
      <img src={path} />
    );
  }
}