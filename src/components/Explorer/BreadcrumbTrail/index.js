import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import Breadcrumb from './Breadcrumb';

const Trail = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  margin: 4px 0;

  ${'' /* & > :not(:last-of-type) {
    border-right-color: ${p => p.theme.color.borderPrimary};
    border-right-width: 1px;
  } */};
`;

const BreadcrumbTrail = ({ onPress, path }) => {
  const trail = path.split('/').map((folder, i, pathArray) => {
    const subPath = pathArray.slice(0, i + 1).join('/');
    return (
      <Breadcrumb
        key={i}
        name={folder || 'Home'}
        onPress={onPress}
        path={subPath}
      />
    );
  });
  return <Trail>{trail}</Trail>;
};

BreadcrumbTrail.propTypes = {
  onPress: PropTypes.func.isRequired,
  path: PropTypes.string
};

export default BreadcrumbTrail;
