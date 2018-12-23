import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Constants } from 'expo';
import { get } from 'dot-prop';

import * as auth from '../../modules/auth';
import { accountType } from '../../types';

import Button from '../Button';
import Container from '../Container';
import Field from '../Field';
import { H1 } from '../typography';

const Title = styled(H1)`
  margin-bottom: 32;
  margin-top: 20;
`;

const Menu = ({ logout, user }) => {
  return (
    <Container pad>
      <Title>Demo Tape</Title>
      <Field title="Version" value={Constants.manifest.version} />
      <Field title="User" value={get(user, 'name.full')} />
      <Field title="Email" value={get(user, 'email')} />
      <Button
        iconFamily="Entypo"
        icon="dropbox"
        onPress={logout}
        text="Logout"
      />
    </Container>
  );
};

Menu.propTypes = {
  logout: PropTypes.func.isRequired,
  user: accountType
};

Menu.navigationOptions = {
  headerTitle: 'Settings'
};

const mapStateToProps = state => ({
  user: auth.selectors.getCurrentUser(state)
});

export default connect(
  mapStateToProps,
  {
    logout: auth.actions.logout
  }
)(Menu);
