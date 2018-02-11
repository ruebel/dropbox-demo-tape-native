import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components/native';

import { Back, Inner, SwipeRow } from '../SwipeRow';

import { playlistType } from '../../types';

const Name = styled.Text`
  color: ${p => p.theme.color.textPrimary};
`;

const Path = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 10px;
`;

const StyledInner = styled(Inner)`
  align-items: flex-start;
  flex-direction: column;
`;

const Wrapper = styled(SwipeRow)`
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px;
`;

const Playlist = ({ onDelete, onPress, playlist }) => {
  return (
    // <Wrapper onPress={() => onPress(playlist)}>
    //   <Name>{playlist.data.title}</Name>
    //   <Path>{playlist.meta.path_display}</Path>
    // </Wrapper>
    <Wrapper
      onRowPress={() => onPress(playlist)}
      underlayColor="#eee"
      rightOpenValue={-85}
    >
      <Back onPress={() => onDelete(playlist)} text="Remove" />
      <StyledInner>
        <Name>{playlist.data.title}</Name>
        <Path>{playlist.meta.path_display}</Path>
      </StyledInner>
    </Wrapper>
  );
};

Playlist.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onPress: PropTypes.func.isRequired,
  playlist: playlistType
};

export default Playlist;
