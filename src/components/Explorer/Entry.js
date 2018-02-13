import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import moment from 'moment';

import Icon from '../Icon';
import { Subtitle, Title } from '../typography';

import { color } from '../../styles/theme';

const Details = styled.View`
  margin-left: 8;
`;

const Wrapper = styled.TouchableOpacity`
  align-items: center;
  background: ${p =>
    p.selected ? p.theme.color.tertiary : p.theme.color.backgroundPrimary};
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px
  display: flex;
  flex-direction: row;
  padding: 12px;
`;

const Entry = ({ entry, onPress, selected = false }) => {
  const iconColor = selected ? color.primary : color.textPrimary;
  return (
    <Wrapper onPress={() => onPress(entry)} selected={selected}>
      <Icon
        color={iconColor}
        icon={entry.type === 'file' ? 'insert-drive-file' : 'folder'}
        size={24}
      />
      <Details>
        <Title>{entry.name}</Title>
        {entry.type === 'file' && (
          <Subtitle>{moment(entry.server_modified).fromNow()}</Subtitle>
        )}
      </Details>
    </Wrapper>
  );
};

Entry.propTypes = {
  entry: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default Entry;
