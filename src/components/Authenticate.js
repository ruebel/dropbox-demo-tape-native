import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';

import Icon from './Icon';

const IconWrapper = styled.View`
  flex-direction: row;
`;

const Title = styled.Text`
  color: ${p => p.theme.color.textSecondary};
  font-size: 32px;
  margin-bottom: 16;
`;

const Subtitle = styled(Title)`
  font-size: 16px;
  margin-top: 16;
`;

const Wrapper = styled.TouchableOpacity`
  align-items: center;
  background-color: ${p => p.theme.color.primary};
  flex: 1;
  justify-content: center;
`;

class Authenticate extends React.Component {
  render() {
    return (
      <Wrapper onPress={this.props.onLoginPress}>
        <Title>Demo Tape</Title>
        <IconWrapper>
          <Icon
            color={this.props.theme.color.textSecondary}
            icon="voicemail"
            size={48}
          />
          <Icon
            color={this.props.theme.color.textSecondary}
            icon="add"
            size={48}
          />
          <Icon
            color={this.props.theme.color.textSecondary}
            family="Entypo"
            icon="dropbox"
            size={48}
          />
        </IconWrapper>
        <Subtitle>Log In to Dropbox</Subtitle>
      </Wrapper>
    );
  }
}

Authenticate.propTypes = {
  onLoginPress: PropTypes.func.isRequired,
  theme: PropTypes.object
};

export default withTheme(Authenticate);
