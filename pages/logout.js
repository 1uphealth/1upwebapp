import React from 'react';
import Header from '../components/Header.js';

export default class Logout extends React.Component {
  static async getInitialProps({ req }) {
    const user = req ? req.user : null;
    return { user };
  }

  componentDidMount() {
    if (this.props.user) {
      try {
        window.localStorage.setItem('user', this.props.user);
      } catch (err) {}
    } else if (typeof this.props.user !== 'undefined') {
      window.localStorage.removeItem('user');
    }
  }

  render() {
    return (
      <div>
        <Header />
        <h1>Logged out!</h1>
      </div>
    );
  }
}
