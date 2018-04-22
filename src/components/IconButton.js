import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const Wrapper = styled.TouchableOpacity`
  background-color: ${p =>
    !p.disabled || p.bg === 'transparent'
      ? p.bg
      : p.theme.color.backgroundDisabled};
  border-radius: ${p => (p.bg === 'transparent' ? 0 : 50)};
  padding: 8px;
  margin-left: 8;
  margin-right: 8;
  margin-top: 8;
  margin-bottom: 8;
  width: ${p => p.size + 16};
  height: ${p => p.size + 16};
  ${p =>
    p.float &&
    `
    position: absolute;
    bottom: 48;
    right: 24;
    shadow-color: #000;
    shadow-opacity: 0.5;
    shadow-radius: 10;
    shadow-offset: 0px 10px;
  `};
`;

const IconButton = ({
  background = 'transparent',
  color = 'white',
  disabled,
  float,
  icon,
  onPress,
  size = 32,
  theme
}) => (
  <Wrapper
    bg={theme.color[background] || background}
    disabled={disabled}
    float={float}
    onPress={onPress}
    size={size}
  >
    <MaterialIcons
      color={theme.color[color] || color}
      name={icon}
      size={size}
    />
  </Wrapper>
);

IconButton.propTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  float: PropTypes.bool,
  icon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number,
  theme: PropTypes.object.isRequired
};

export default withTheme(IconButton);
