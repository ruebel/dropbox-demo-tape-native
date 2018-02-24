import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';

import Breadcrumb from './Breadcrumb';
import IconButton from '../../IconButton';

const Sort = styled(IconButton)`
  margin-bottom: -8;
`;

const Trail = styled.View`
  align-items: center;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  margin: 4px 0;
`;

const Wrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

const BreadcrumbTrail = ({ onPress, path, theme }) => {
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
  return (
    <Wrapper>
      <Trail>{trail}</Trail>
      <Sort
        color={theme.color.primary}
        icon="sort"
        onPress={() => 1}
        size={18}
      />
    </Wrapper>
  );
};

BreadcrumbTrail.propTypes = {
  onPress: PropTypes.func.isRequired,
  path: PropTypes.string,
  theme: PropTypes.object
};

export default withTheme(BreadcrumbTrail);
