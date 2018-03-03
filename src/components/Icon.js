import React from 'react';
import Icons from '@expo/vector-icons';
import PropTypes from 'prop-types';

const Icon = ({ color, family = 'MaterialIcons', icon, size = 32, style }) => {
  const IconComp = Icons[family];
  return (
    <IconComp
      color={color}
      name={icon}
      size={size}
      style={
        style ||
        (icon === 'voicemail' && {
          transform: [{ rotate: '180deg' }]
        })
      }
    />
  );
};

Icon.propTypes = {
  color: PropTypes.string,
  family: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.number,
  style: PropTypes.object
};

export default Icon;
