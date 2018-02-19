import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Dropbox from 'dropbox';
import { AuthSession, Constants } from 'expo';

import Authenticate from './components/Authenticate';
import { userType } from './types';
import { actions } from './modules/auth';

class AuthProvider extends React.Component {
  state = {
    authUrl: null
  };

  handleLogin = async () => {
    const dbx = new Dropbox({ clientId: Constants.manifest.extra.dbClientId });
    const redirectUrl = AuthSession.getRedirectUrl();
    const authUrl = dbx.getAuthenticationUrl(redirectUrl);
    const result = await AuthSession.startAsync({
      authUrl
    });
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
  setUser: PropTypes.func.isRequired,
  user: userType
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, {
  setUser: actions.setUser
})(AuthProvider);
