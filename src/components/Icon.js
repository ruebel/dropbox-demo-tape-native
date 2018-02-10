import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const Icon = ({ color, icon, size }) => {
  return <MaterialIcons color={color} name={icon} size={size} />;
};

Icon.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.number
};

export default Icon;
