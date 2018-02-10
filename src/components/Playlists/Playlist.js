import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { playlistType } from '../../types';

const Name = styled.Text`
  color: ${p => p.theme.color.textPrimary};
`;

const Path = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 10px;
`;

const Wrapper = styled.TouchableOpacity`
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px;
  padding-left: 8;
  padding-right: 8;
  padding-top: 8;
  padding-bottom: 8;
`;

const Playlist = ({ onPress, playlist }) => {
  return (
    <Wrapper onPress={() => onPress(playlist)}>
      <Name>{playlist.data.title}</Name>
      <Path>{playlist.meta.path_display}</Path>
    </Wrapper>
  );
};

Playlist.propTypes = {
  onPress: PropTypes.func.isRequired,
  playlist: playlistType
};

export default Playlist;
