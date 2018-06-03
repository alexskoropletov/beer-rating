import React, { Component } from 'react';

export default class BeerImage extends Component {
  handlePage() {
    this.props.handleFooter('admin');
  }

  render() {
    if (this.props.page !== 'admin') {
      return (
        <footer className="footer">
          <div className="container">
            <span className="text-muted">
              <button className="btn btn-outline-success admin-link" type="button" onClick={this.handlePage.bind(this)}>
                Управление
              </button>
            </span>
          </div>
        </footer>
      );
    }
    return '';
  }
}