import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import BaseSlider from 'react-native-slider';

const SliderControl = styled(BaseSlider)`
  width: 90%;
`;

const Slider = ({ disabled, onChange, value }) => {
  return (
    <SliderControl disabled={disabled} onValueChange={onChange} value={value} />
  );
};

Slider.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.number
};

export default Slider;
