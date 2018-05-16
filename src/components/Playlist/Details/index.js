import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import arrayMove from 'array-move';
import throttle from 'lodash.throttle';

import ButtonWrapper from '../../ButtonWrapper';
import Container from '../../Container';
import IconButton from '../../IconButton';
import TrackList from './TrackList';

import {
  actions as playlistActions,
  selectors as playlistSelectors
} from '../../../modules/playlists';
import { actions as audioActions } from '../../../modules/audio';
import { accountList, playlistType, trackType } from '../../../types';
import { color } from '../../../styles/theme';

class Details extends React.Component {
  handleRemove = track => {
    if (track) {
      this.props.updateTracks(
        this.props.playlist.data.tracks.filter(t => t.id !== track.id)
      );
      this.savePlaylist();
    }
  };

  handleSortEnd = ({ from, to }) => {
    if (from !== to) {
      this.props.updateTracks(
        arrayMove(this.props.playlist.data.tracks, from, to)
      );
      this.savePlaylist();
    }
  };

  handleTrackPress = track => {
    this.props.play(track.id);
  };

  savePlaylist = throttle(this.props.savePlaylist, 5000, {
    leading: false
  });

  render() {
    const {
      downloadTracks,
      history,
      isPlaying,
      play,
      playingTrack,
      playlist,
      stop,
      users
    } = this.props;
    return (
      <Container>
        <ButtonWrapper>
          <IconButton
            background={color.primary}
            icon={isPlaying ? 'stop' : 'play-arrow'}
            onPress={() => (isPlaying ? stop() : play())}
          />
          {playlist.data.tracks.some(track => !track.downloadStatus) && (
            <IconButton
              background={color.primary}
              disabled={playlist.downloading}
              icon="file-download"
              onPress={downloadTracks}
            />
          )}
          <IconButton
            background={color.primary}
            icon="edit"
            onPress={() => history.push('/playlist/settings')}
          />
          <IconButton
            background={color.primary}
            disabled={!playlist.hasChanges}
            icon="save"
            onPress={this.savePlaylist}
          />
        </ButtonWrapper>
        <TrackList
          onPress={this.handleTrackPress}
          onRemove={this.handleRemove}
          onSortEnd={this.handleSortEnd}
          tracks={playlist.data.tracks.map(
            t =>
              t === playingTrack
                ? {
                  ...t,
                  playing: true
                }
                : t
          )}
          users={users}
        />
      </Container>
    );
  }
}

Details.propTypes = {
  downloadTracks: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  isPlaying: PropTypes.bool,
  play: PropTypes.func.isRequired,
  playingTrack: trackType,
  playlist: playlistType,
  savePlaylist: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  updateTracks: PropTypes.func.isRequired,
  users: accountList
};

const mapStateToProps = state => ({
  isPlaying: state.audio.isPlaying,
  playingTrack: playlistSelectors.getPlayingTrack(state),
  playlist: playlistSelectors.getSelectedPlaylist(state),
  users: state.files.users
});

export default connect(mapStateToProps, {
  downloadTracks: playlistActions.downloadTracks,
  play: audioActions.play,
  savePlaylist: playlistActions.savePlaylist,
  stop: audioActions.stop,
  updateTracks: playlistActions.updateTracks
})(Details);
