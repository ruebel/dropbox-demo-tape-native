import React from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const Wrapper = styled.TouchableOpacity`
  background-color: ${p =>
    !p.disabled || p.bg === 'transparent'
      ? p.bg
      : p.theme.color.backgroundDisabled};
  border-radius: ${p => (p.bg === 'transparent' ? 0 : 50)};
  padding-left: 8;
  padding-bottom: 8;
  padding-top: 8;
  padding-right: 8;
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
  size = 32
}) => (
  <Wrapper
    bg={background}
    disabled={disabled}
    float={float}
    onPress={onPress}
    size={size}
  >
    <MaterialIcons color={color} name={icon} size={size} />
  </Wrapper>
);

IconButton.propTypes = {
  background: PropTypes.string,
  color: PropTypes.string,
  disabled: PropTypes.bool,
  float: PropTypes.bool,
  icon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number
};

export default IconButton;
