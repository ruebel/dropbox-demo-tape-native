import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import arrayMove from 'array-move';

import ButtonWrapper from '../../ButtonWrapper';
import IconButton from '../../IconButton';
import TrackList from './TrackList';

import {
  actions as playlistActions,
  selectors as playlistSelectors
} from '../../../modules/playlists';
import { actions as audioActions } from '../../../modules/audio';
import { playlistType } from '../../../types';
import { color } from '../../../styles/theme';

class Details extends React.Component {
  handleRemove = track => {
    if (track) {
      this.props.updateTracks(
        this.props.playlist.data.tracks.filter(t => t.id !== track.id)
      );
    }
  };

  handleSortEnd = ({ from, to }) => {
    if (from !== to) {
      this.props.updateTracks(
        arrayMove(this.props.playlist.data.tracks, from, to)
      );
    }
  };

  showAdd = () => {
    this.props.history.push(this.props.match.url + '/add');
  };

  render() {
    const {
      downloadTracks,
      isPlaying,
      play,
      playlist,
      savePlaylist,
      stop
    } = this.props;
    return (
      <View>
        <ButtonWrapper>
          <IconButton
            background={color.primary}
            icon="add"
            onPress={this.showAdd}
          />
          <IconButton
            background={color.primary}
            disabled={!playlist.hasChanges}
            icon="save"
            onPress={savePlaylist}
          />
          <IconButton
            background={color.primary}
            icon={isPlaying ? 'stop' : 'play-arrow'}
            onPress={() => (isPlaying ? stop() : play(0))}
          />
          {playlist.data.tracks.some(track => !track.downloadStatus) && (
            <IconButton
              background={color.primary}
              icon="file-download"
              onPress={downloadTracks}
            />
          )}
        </ButtonWrapper>
        <TrackList
          onRemove={this.handleRemove}
          onSortEnd={this.handleSortEnd}
          tracks={playlist.data.tracks}
        />
      </View>
    );
  }
}

Details.propTypes = {
  downloadTracks: PropTypes.func.isRequired,
  history: PropTypes.object,
  isPlaying: PropTypes.bool,
  match: PropTypes.object,
  play: PropTypes.func.isRequired,
  playlist: playlistType,
  savePlaylist: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  updateTracks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  isPlaying: state.audio.isPlaying,
  playlist: playlistSelectors.getSelectedPlaylist(state)
});

export default withRouter(
  connect(mapStateToProps, {
    downloadTracks: playlistActions.downloadTracks,
    play: audioActions.play,
    savePlaylist: playlistActions.savePlaylist,
    stop: audioActions.stop,
    updateTracks: playlistActions.updateTracks
  })(Details)
);
