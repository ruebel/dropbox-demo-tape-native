import React from 'react';
import styled from 'styled-components/native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const Wrapper = styled.TouchableOpacity`
  padding-left: 5;
  padding-bottom: 5;
  padding-top: 5;
  padding-right: 5;
`;

const IconButton = ({ color = 'white', icon, onPress, size = 32 }) => (
  <Wrapper onPress={onPress}>
    <MaterialIcons color={color} name={icon} size={size} />
  </Wrapper>
);

IconButton.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  size: PropTypes.number
};

export default IconButton;
