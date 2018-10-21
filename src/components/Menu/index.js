import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Constants } from 'expo';
import { get } from 'dot-prop';

import * as auth from '../../modules/auth';
import { accountType } from '../../types';

import Button from '../Button';
import { H1, Message } from '../typography';

const Line = styled(Message)`
  margin-bottom: 20px;
  margin-top: 10px;
`;

const Title = styled(H1)`
  margin-bottom: 10;
  margin-top: 20;
`;

const Wrapper = styled.View`
  align-items: center;
  flex: 1;
`;

const Menu = ({ logout, user }) => {
  return (
    <Wrapper>
      <Title>Demo Tape ({Constants.manifest.version})</Title>
      <Line>{get(user, 'name.full')}</Line>
      <Line>{get(user, 'email')}</Line>
      <Button
        iconFamily="Entypo"
        icon="dropbox"
        onPress={logout}
        text="Logout"
      />
    </Wrapper>
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
