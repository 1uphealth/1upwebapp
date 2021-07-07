import React from 'react';
import Link from 'next/link';
import fetch from 'isomorphic-fetch';
import { authenticate } from '../utils';
import Header from '../components/Header.js';
import Layout from '../components/layouts/Layout';
import { FhirResource } from 'fhir-react';
const {
  displayInOrder: resourcesListToDisplayInOrder,
} = require('../resourcesConfig');

export default class Dashboard extends React.Component {
  static async getInitialProps({ req, res }) {
    const user = await authenticate(req, res);
    if (typeof req === 'undefined') {
      let dashboard = await fetch(`http://localhost:3000/api/dashboard`, {
        credentials: 'include',
      }).then(r => r.json());
      return { dashboard, user };
    } else {
      let authHeader = {
        Authorization: 'Bearer ' + req.session.oneup_access_token,
      };
      let dashboard = await fetch(`http://localhost:3000/api/dashboard`, {
        headers: authHeader,
      }).then(r => r.json());
      return { dashboard, user };
    }
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
        <div className="container">
          <br />
          <h1>Your medical dashboard </h1>
          <br />
          <div>
            {typeof this.props.dashboard.resources.Patient !== 'undefined' &&
            this.props.dashboard.resources.Patient.entry.length > 0 ? (
              ''
            ) : (
              <div>
                <br />
                <br />
                <br />
                Looks like you have no patient data
                <br />
                <Link>
                  <a href="/">Connect some health systems</a>
                </Link>
              </div>
            )}
          </div>
          <div style={{ textAlign: 'left' }}>
            {resourcesListToDisplayInOrder.map(
              function(resourceType) {
                return (
                  <div>
                    {typeof this.props.dashboard.resources[resourceType] !=
                      'undefined' &&
                    this.props.dashboard.resources[resourceType].entry.length >
                      0 ? (
                      <h1>{resourceType}</h1>
                    ) : (
                      ''
                    )}
                    {typeof this.props.dashboard.resources[resourceType] !=
                    'undefined'
                      ? this.props.dashboard.resources[resourceType].entry.map(
                          function(resourceContainer) {
                            return (
                              <FhirResource
                                fhirResource={resourceContainer.resource}
                                fhirVersion={resourceContainer.fhirVersion}
                              />
                            );
                          },
                        )
                      : ''}
                    <br />
                  </div>
                );
              }.bind(this),
            )}
          </div>
        </div>
      </Layout>
    );
  }
}
