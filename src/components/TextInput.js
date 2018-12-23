import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import styled, { withTheme } from 'styled-components';

const Input = styled.TextInput`
  border-color: ${p => p.theme.color.borderSecondary};
  border-width: ${StyleSheet.hairlineWidth};
  color: ${p => p.theme.color.textPrimary};
  font-size: 17px;
  height: 46px;
  margin-bottom: 16px;
  padding: 0 16px;
`;

const Title = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 16px;
  margin-left: 8px;
`;

const Wrapper = styled.View`
  align-items: stretch;
  display: flex;
  max-width: 500px;
  flex-direction: column;
`;

const TextInput = ({
  disabled,
  onChange,
  placeholder,
  theme,
  title,
  value
}) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Input
        disabled={disabled}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.color.textLight}
        value={value}
      />
    </Wrapper>
  );
};

TextInput.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  theme: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.string
};

export default withTheme(TextInput);
