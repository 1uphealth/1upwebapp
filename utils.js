import Router from 'next/router';
import 'isomorphic-fetch';

export const authenticate = async (req, res) => {
  const user = req
    ? { email: req.user, oneup_access_token: req.session.oneup_access_token }
    : getAuthUser();
  if (user) {
    return user;
  } else {
    req ? res.redirect('/login') : Router.push('/login');
    return null;
  }
};

export const logoutEvent = (eve, url) => {
  if (eve.key === 'logout') {
    logout();
  }
};

export const logout = () => {
  console.log('clearinglocalstorage');
  window.localStorage.removeItem('email');
  window.localStorage.removeItem('oneup_access_token');
  window.localStorage.setItem('logout', new Date());
  window.fetch('/logout', { method: 'POST' });
  Router.push('/logout');
};

const getAuthUser = () => {
  try {
    return {
      email: window.localStorage.getItem('email'),
      oneup_access_token: window.localStorage.getItem('oneup_access_token'),
    };
  } catch (err) {
    return null;
  }
};
