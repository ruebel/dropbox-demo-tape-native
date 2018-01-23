import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const ButtonBase = styled.TouchableOpacity`
  align-items: center;
  background: ${p =>
    p.disabled ? p.theme.color.backgroundDisabled : p.theme.color.primary};
  display: flex;
  height: 60px;
  justify-content: center;
  width: 100%;
`;

const Text = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 14px;
  font-weight: 800;
`;

const Button = ({ disabled = false, onPress, text }) => {
  return (
    <ButtonBase disabled={disabled} onPress={onPress}>
      <Text>{text}</Text>
    </ButtonBase>
  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string
};

export default Button;
