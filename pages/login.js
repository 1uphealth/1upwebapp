import React from 'react';
import 'isomorphic-fetch';
import Header from '../components/Header.js';
import Layout from '../components/layouts/Layout';

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      email: '',
    };
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.setState({
      submitted: true,
    });

    window.fetch('/sendtoken', {
      method: 'POST',
      body: JSON.stringify({ user: this.state.email }),
      headers: new window.Headers({
        'Content-Type': 'application/json',
      }),
    });
  };

  onEmailChange = (e) => {
    this.setState({
      email: e.target.value,
    });
  };

  welcomeText = () => {
    return (
      <div className="container">
        <div className="jumbotron bg-light">
          <h1>
            Welcome to the <a href="https://1up.health">1upHealth</a> Demo App.
          </h1>
          <p>
            You can sign in, connect your health systems, and view your medical
            record. Learn more about the tech behind this app in the{' '}
            <a href="https://github.com/1uphealth/1upwebapp">git repo</a>.
          </p>
        </div>
      </div>
    );
  };

  render() {
    if (this.state.submitted) {
      return (
        <Layout>
          <Header />
          <div className="container">
            <br />
            <br />
            <div className="row">
              {this.welcomeText()}
              <div className="container  text-center">
                <h1>
                  Check your email. <br />
                  We sent a magic link to log into your account :)
                </h1>
              </div>
            </div>
          </div>
          <br />
          <br />
          <br />
        </Layout>
      );
    }

    return (
      <Layout className="cent">
        <Header />
        <div className="container">
          <br />
          <br />
          <div className="row text-center">
            {this.welcomeText()}
            <div className="container">
              <form onSubmit={this.onSubmit}>
                <h3>Login using your email</h3>
                <input
                  onChange={this.onEmailChange}
                  value={this.state.email}
                  type="email"
                  className="form-control col-sm-4"
                  required
                  placeholder="email@domain.org"
                  autoFocus
                  style={{ display: 'unset' }}
                />
                <br />
                <input
                  type="submit"
                  className="btn btn-primary col-sm-4 mt-2"
                  value="Login"
                />
              </form>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}
