import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export default class Login extends Component {
  handleSubmit(event) {
    event.preventDefault();
    Meteor
      .loginWithPassword(
        this.usernameInput.value.trim(),
        this.passwordInput.value.trim()
      )
    ;
  }

  render() {
    return (
      <div className="col-md-12">
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label htmlFor="login">Логин</label>
            <input
              type="text"
              className="form-control"
              ref={usernameInput => {this.usernameInput = usernameInput;}}
              placeholder="Логин" />
          </div>
          <div className="form-group">
            <label htmlFor="password">Пароль</label>
            <input
              type="password"
              className="form-control"
              ref={passwordInput => {this.passwordInput = passwordInput;}}
              placeholder="Пароль" />
          </div>
          <button type="submit" className="btn btn-primary">Войти</button>
        </form>
      </div>
    );
  }
}