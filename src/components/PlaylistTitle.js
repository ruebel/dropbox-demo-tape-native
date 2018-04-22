import React from 'react';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { selectors } from '../modules/playlists';
import { playlistType } from '../types';

const Title = styled.Text`
  color: ${p => p.theme.color.textSecondary};
  font-size: 20px;
  margin-left: 8px;
  margin-right: 8px;
  text-align: center;
`;

const PlaylistTitle = ({ playlist }) => {
  return playlist ? <Title>{playlist.data.title}</Title> : null;
};

PlaylistTitle.propTypes = {
  playlist: playlistType
};

const mapStateToProps = state => ({
  playlist: selectors.getSelectedPlaylist(state)
});

export default connect(mapStateToProps)(PlaylistTitle);
