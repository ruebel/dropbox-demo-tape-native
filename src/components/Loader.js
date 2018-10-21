import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';
import { Bars } from 'react-native-loader';

const StyledBars = styled(Bars)`
  text-align: center;
`;

const Loader = ({ color, size = 6, theme }) => (
  <StyledBars color={theme.color[color] || color} size={size} />
);

Loader.propTypes = {
  color: PropTypes.string,
  size: PropTypes.number,
  theme: PropTypes.object
};

export default withTheme(Loader);
