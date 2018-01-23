import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';
import File from '../../icons/File';
import Folder from '../../icons/Folder';
import { color } from '../../styles/theme';

const Title = styled.Text`
  margin-left: 10px;
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
      {entry.type === 'file' ? (
        <File color={iconColor} height={24} width={24} />
      ) : (
        <Folder color={iconColor} height={24} width={24} />
      )}
      <Title>{entry.name}</Title>
    </Wrapper>
  );
};

Entry.propTypes = {
  entry: PropTypes.object,
  onPress: PropTypes.func.isRequired,
  selected: PropTypes.bool
};

export default Entry;
