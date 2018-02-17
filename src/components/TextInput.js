import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import styled, { withTheme } from 'styled-components/native';

const Input = styled.TextInput`
  border-bottom-color: ${p => p.theme.color.borderPrimary};
  border-bottom-width: ${StyleSheet.hairlineWidth};
  color: ${p => p.theme.color.textPrimary};
  flex: 1;
  font-size: 17px;
  height: 50px;
`;

const Title = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 16px;
`;

const Wrapper = styled.View`
  margin: 0 16px;
  max-width: 500px;
`;

const TextInput = ({ onChange, placeholder, theme, title, value }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Input
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={theme.color.textLight}
        value={value}
      />
    </Wrapper>
  );
};

TextInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  theme: PropTypes.object,
  title: PropTypes.string,
  value: PropTypes.string
};

export default withTheme(TextInput);
