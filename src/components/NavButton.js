import React from 'react';
import PropTypes from 'prop-types';
import { withNavigation } from 'react-navigation';

import IconButton from './IconButton';

const NavButton = ({ icon, navigation, route }) => {
  return <IconButton icon={icon} onPress={() => navigation.navigate(route)} />;
};

NavButton.propTypes = {
  icon: PropTypes.string,
  navigation: PropTypes.object,
  route: PropTypes.string
};

export default withNavigation(NavButton);
