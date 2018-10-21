import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Icon from '../../Icon';

const Name = styled.Text`
  margin-left: 4px;
`;

const Wrapper = styled.TouchableOpacity`
  align-items: center;
  display: flex;
  flex-direction: row;
  padding: 0 6px;
`;

const Breadcrumb = ({ name = 'Home', onPress, path }) => {
  return (
    <Wrapper onPress={() => onPress(path)}>
      <Icon icon="folder" size={12} />
      <Name>{name}</Name>
    </Wrapper>
  );
};

Breadcrumb.propTypes = {
  name: PropTypes.string,
  onPress: PropTypes.func.isRequired,
  path: PropTypes.string
};

export default Breadcrumb;
