import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import arrayMove from 'array-move';

import Button from '../../Button';
import TrackList from './TrackList';

import {
  actions as playlistActions,
  selectors as playlistSelectors
} from '../../../modules/playlists';
import { actions as audioActions } from '../../../modules/audio';
import { playlistType } from '../../../types';

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

  render() {
    const { downloadTracks, match, play, playlist, savePlaylist } = this.props;
    return (
      <View>
        <Link to={`${match.url}/add`}>
          <Text>Add Tracks</Text>
        </Link>
        <Button
          disabled={!playlist.hasChanges}
          onPress={savePlaylist}
          text="Save"
        />
        <Button onPress={() => play(0)} text="Play" />
        {playlist.data.tracks.some(track => !track.downloadStatus) && (
          <Button onPress={downloadTracks} text="Download Tracks" />
        )}
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
  match: PropTypes.object,
  play: PropTypes.func.isRequired,
  playlist: playlistType,
  savePlaylist: PropTypes.func.isRequired,
  updateTracks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  playlist: playlistSelectors.getSelectedPlaylist(state)
});

export default withRouter(
  connect(mapStateToProps, {
    downloadTracks: playlistActions.downloadTracks,
    play: audioActions.play,
    savePlaylist: playlistActions.savePlaylist,
    updateTracks: playlistActions.updateTracks
  })(Details)
);
