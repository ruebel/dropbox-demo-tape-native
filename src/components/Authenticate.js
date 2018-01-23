import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import Button from './Button';

const Wrapper = styled.View`
  align-items: center;
  flex: 1;
  justify-content: center;
`;

class Authenticate extends React.Component {
  render() {
    return (
      <Wrapper>
        <Button onPress={this.props.onLoginPress} text="Log In To DropBox" />
      </Wrapper>
    );
  }
}

Authenticate.propTypes = {
  onLoginPress: PropTypes.func.isRequired
};

export default Authenticate;
