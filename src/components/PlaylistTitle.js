import React from 'react';
import { connect } from 'react-redux';
import { selectors } from '../modules/playlists';
import { playlistType } from '../types';
import { TopTitle } from './typography';

const PlaylistTitle = ({ playlist }) => {
  return playlist ? <TopTitle>{playlist.data.title}</TopTitle> : null;
};

PlaylistTitle.propTypes = {
  playlist: playlistType
};

const mapStateToProps = state => ({
  playlist: selectors.getSelectedPlaylist(state)
});

export default connect(mapStateToProps)(PlaylistTitle);
