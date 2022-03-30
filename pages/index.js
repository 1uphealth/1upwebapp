import React from 'react';
import Link from 'next/link';
import Layout from '../components/layouts/Layout';
import Header from '../components/Header.js';
import { authenticate } from '../utils';

var createReactClass = require('create-react-class');

// TODO decide: is Iframe component useful
// eslint-disable-next-line no-unused-vars
var Iframe = createReactClass({
  render: function () {
    return <div></div>;
  },
});

export default class Home extends React.Component {
  static async getInitialProps({ req, res }) {
    const user = await authenticate(req, res);
    return { user };
  }

  componentDidMount() {
    if (this.props.user) {
      try {
        window.localStorage.setItem('email', this.props.user.email);
        window.localStorage.setItem(
          'oneup_access_token',
          this.props.user.oneup_access_token,
        );
      } catch (err) {}
    } else {
      window.localStorage.remove('email');
      window.localStorage.remove('oneup_access_token');
    }
  }

  render() {
    return (
      <Layout>
        <Header user={this.props.user} />
        <div className="text-center">
          <h1>{`Welcome to 1upHealth's Demo App`}</h1>
          <h2 className="text-center">Link your providers</h2>
        </div>
        <iframe
          title="Search"
          style={{ border: '0px solid #fff' }}
          src={`https://system-search.1up.health/search/?access_token=${this.props.user.oneup_access_token}`}
          height={500}
          width="100%"
        />
        <br />
        <div className="text-center">
          <Link href="/dashboard">
            <h3>Go to your medical dashboard</h3>
          </Link>
        </div>
        <style jsx>{`
          div {
            text-align: center;
          }
          ul {
            list-style: none;
          }
        `}</style>
      </Layout>
    );
  }
}
