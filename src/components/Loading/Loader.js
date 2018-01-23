import React from 'react';
import styled from 'styled-components/native';

const Wrapper = styled.Text`
  height: 5px;
  position: relative;
  overflow: hidden;
  width: 100%;
`;

const Loader = () => <Wrapper>Loading...</Wrapper>;

export default Loader;
