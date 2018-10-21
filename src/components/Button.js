import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

import Icon from './Icon';

const ButtonBase = styled.TouchableOpacity`
  align-items: center;
  background: ${p =>
    p.disabled ? p.theme.color.backgroundDisabled : p.theme.color.primary};
  flex-direction: row;
  height: 60px;
  justify-content: center;
  width: 100%;
`;

const Text = styled.Text`
  color: ${p => p.theme.color.textSecondary};
  font-size: 14px;
  font-weight: 800;
  margin-left: 8;
`;

const Button = ({
  disabled = false,
  icon,
  iconFamily,
  onPress,
  style,
  text,
  theme
}) => {
  return (
    <ButtonBase disabled={disabled} onPress={onPress} style={style}>
      {icon && (
        <Icon
          color={theme.color.textSecondary}
          family={iconFamily}
          icon={icon}
        />
      )}
      <Text>{text}</Text>
    </ButtonBase>
  );
};

Button.propTypes = {
  disabled: PropTypes.bool,
  icon: PropTypes.string,
  iconFamily: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  style: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  text: PropTypes.string,
  theme: PropTypes.object
};

export default withTheme(Button);
