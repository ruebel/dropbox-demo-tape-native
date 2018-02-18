import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import moment from 'moment';

import Icon from '../Icon';
import { Subtitle, Title } from '../typography';

import { color } from '../../styles/theme';
import { accountType } from '../../types';

const Details = styled.View`
  margin-left: 8;
  flex: 1;
`;

const Name = styled(Title)`
  color: ${p =>
    p.selected ? p.theme.color.textSecondary : p.theme.color.primary};
`;

const Wrapper = styled.TouchableOpacity`
  align-items: center;
  background: ${p =>
    p.selected ? p.theme.color.secondary : p.theme.color.backgroundPrimary};
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px
  display: flex;
  flex-direction: row;
  padding: 12px;
`;

const Entry = ({ entry, onPress, selected = false, user }) => {
  const iconColor = selected ? color.textSecondary : color.primary;
  return (
    <Wrapper onPress={() => onPress(entry)} selected={selected}>
      <Icon
        color={iconColor}
        icon={entry.type === 'file' ? 'audiotrack' : 'folder'}
        size={24}
      />
      <Details>
        <Name selected={selected}>{entry.name}</Name>
        {entry.type === 'file' && (
          <Subtitle>
            {moment(entry.server_modified).fromNow()}
            {user ? ` by ${user.name.full}` : ''}
          </Subtitle>
        )}
      </Details>
    </Wrapper>
  );
};

Entry.propTypes = {
  entry: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool,
  user: accountType
};

export default Entry;
