import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import Button from './Button';
import IconButton from './IconButton';

const NavButton = ({ navigation, route, isButton = false, ...rest }) => {
  const handlePress = () => navigation.navigate(route);
  return isButton ? (
    <Button onPress={handlePress} {...rest} />
  ) : (
    <IconButton onPress={handlePress} {...rest} />
  );
};

NavButton.propTypes = {
  isButton: PropTypes.bool,
  navigation: PropTypes.object,
  route: PropTypes.string
};

export default withNavigation(NavButton);
