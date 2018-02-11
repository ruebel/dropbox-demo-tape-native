import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

const BackText = styled.Text`
  color: ${p => p.theme.color.textExtraLight};
`;

const Wrapper = styled.TouchableOpacity`
  align-items: center;
  background-color: ${p => p.theme.color.error};
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  padding: 15px;
`;

const Back = ({ onPress, text }) => (
  <Wrapper onPress={onPress}>
    <BackText>{text}</BackText>
  </Wrapper>
);

Back.propTypes = {
  onPress: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired
};

export default Back;
