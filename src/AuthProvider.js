import React from 'react';
import { connect } from 'react-redux';
// import { push } from 'react-router-redux';
import PropTypes from 'prop-types';
import Dropbox from 'dropbox';
// import queryString from 'query-string';
import { AuthSession } from 'expo';

import Authenticate from './components/Authenticate';
import { userType } from './types';
import { actions } from './modules/auth';

class AuthProvider extends React.Component {
  state = {
    authUrl: null
  };

  handleLogin = async () => {
    const dbx = new Dropbox({ clientId: 'ie394xarjsfdxr0' });
    const redirectUrl = AuthSession.getRedirectUrl();
    const authUrl = dbx.getAuthenticationUrl(redirectUrl);
    const result = await AuthSession.startAsync({
      authUrl
    });
    console.log(result);
    this.props.setUser(result);
  };

  render() {
    return this.props.user ? (
      this.props.children
    ) : (
      <Authenticate onLoginPress={this.handleLogin} />
    );
  }
}

AuthProvider.propTypes = {
  children: PropTypes.node,
  // push: PropTypes.func.isRequired,
  setUser: PropTypes.func.isRequired,
  user: userType
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {
  // push,
  setUser: actions.setUser
})(AuthProvider);
