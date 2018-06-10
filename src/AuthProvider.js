import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Dropbox } from 'dropbox';
import { AuthSession, Constants } from 'expo';

import Authenticate from './components/Authenticate';
import { userType } from './types';
import { actions } from './modules/auth';

class AuthProvider extends React.Component {
  state = {
    authUrl: null
  };

  handleLogin = async () => {
    // Create dropbox client
    const dbx = new Dropbox({ clientId: Constants.manifest.extra.dbClientId });
    // Get a redirect URL back to this app
    const redirectUrl = AuthSession.getRedirectUrl();
    // Get an auth URL for OAuth
    const authUrl = dbx.getAuthenticationUrl(redirectUrl);
    // Authenticate the user using Dropbox OAuth
    const result = await AuthSession.startAsync({
      authUrl
    });
    if (result && result.type === 'success') {
      // Success 🎉
      this.props.setUser(result);
    }
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
  setUser: PropTypes.func.isRequired,
  user: userType
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {
  setUser: actions.setUser
})(AuthProvider);
