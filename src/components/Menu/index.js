import React from 'react';
import styled from 'styled-components/native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { actions as authActions } from '../../modules/auth';

import Button from '../Button';

const Wrapper = styled.View`
  flex: 1;
`;

const Menu = ({ logout }) => {
  return (
    <Wrapper>
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
  logout: PropTypes.func.isRequired
};

export default connect(null, {
  logout: authActions.logout
})(Menu);
