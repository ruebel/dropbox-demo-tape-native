import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components';

const SliderControl = styled.Slider`
  width: 100%;
`;

const Slider = ({ disabled, onChange, onSlidingComplete, theme, value }) => {
  return (
    <SliderControl
      disabled={disabled}
      maximumTrackTintColor={theme.color.backgroundPrimary}
      minimumTrackTintColor={theme.color.secondary}
      onSlidingComplete={onSlidingComplete}
      onValueChange={onChange}
      thumbTintColor={theme.color.secondary}
      value={value}
    />
  );
};

Slider.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  onSlidingComplete: PropTypes.func,
  theme: PropTypes.object,
  value: PropTypes.number
};

export default withTheme(Slider);
