import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';

import Loader from './Loader';

const LoadingOrContent = ({
  children,
  data,
  loading,
  message = 'Playlist Not Found'
}) => {
  if (loading) return <Loader color="secondary" size={24} />;
  if (data) return children;
  return <Text>{message}</Text>;
};

LoadingOrContent.propTypes = {
  children: PropTypes.node,
  data: PropTypes.any,
  loading: PropTypes.bool,
  message: PropTypes.string
};

export default LoadingOrContent;
