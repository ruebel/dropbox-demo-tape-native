import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import { Bars } from 'react-native-loader';

const StyledBars = styled(Bars)`
  text-align: center;
`;

const Loader = ({ color }) => <StyledBars size={6} color={color} />;

Loader.propTypes = {
  color: PropTypes.string
};

export default Loader;
