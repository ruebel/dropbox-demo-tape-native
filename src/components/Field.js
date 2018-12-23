import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Value = styled.Text`
  color: ${p => p.theme.color.textPrimary};
  font-size: 17px;
  height: 46px;
  line-height: 30px;
  margin-bottom: 16px;
  padding: 8px 16px;
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

const Field = ({ title, value }) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Value>{value}</Value>
    </Wrapper>
  );
};

Field.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string
};

export default Field;
