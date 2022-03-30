// TODO fix linter warnings in the file
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import Link from 'next/link';

import { logout, logoutEvent } from '../utils';

export default class Header extends React.Component {
  componentDidMount() {
    this.onLogout = (eve) => logoutEvent(eve, this.props.url);
    window.addEventListener('storage', this.onLogout, false);
  }

  componentWillUnmount() {
    window.removeEventListener('storage', this.onLogout, false);
  }
  render() {
    return (
      <header>
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <a className="navbar-brand" href="https://1up.health/dev">
            1upHealth
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggsler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">
              {typeof this.props.user === 'undefined' ||
              this.props.user.email === 'null' ? (
                ''
              ) : (
                <li className="nav-item">
                  <a className="nav-link">
                    <Link href="/">Connect Data</Link>&nbsp;{' '}
                    <span className="sr-only">(current)</span>
                  </a>
                </li>
              )}
              {typeof this.props.user === 'undefined' ||
              this.props.user.email === 'null' ? (
                <a className="nav-link" href="">
                  <Link href="/login">Login</Link>
                </a>
              ) : (
                <li className="nav-item">
                  <a className="nav-link" href="">
                    <Link href="/logout" onClick={logout}>
                      Logout
                    </Link>
                  </a>
                </li>
              )}
              {typeof this.props.user === 'undefined' ||
              this.props.user.email === 'null' ? (
                ''
              ) : (
                <li className="nav-item">
                  <a className="nav-link" href="">
                    <Link href="/dashboard">{this.props.user.email}</Link>
                  </a>
                </li>
              )}
              <li className="nav-item">
                <a className="nav-link" href="">
                  <Link href="/test">Test Data</Link>&nbsp;{' '}
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </header>
    );
  }
}
