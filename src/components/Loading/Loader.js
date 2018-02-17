import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import { Bars } from 'react-native-loader';

const StyledBars = styled(Bars)`
  text-align: center;
  margin-right: 4px;
`;

const Loader = ({ theme }) => (
  <StyledBars size={3} color={theme.color.primary} />
);

Loader.propTypes = {
  theme: PropTypes.object
};

export default withTheme(Loader);
