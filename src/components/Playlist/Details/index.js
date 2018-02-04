import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import arrayMove from 'array-move';

import Button from '../../Button';
import TrackList from './TrackList';

import {
  downloadTracks,
  savePlaylist,
  updateTracks
} from '../../../modules/playlists/actions';
import { getSelectedPlaylist } from '../../../modules/playlists/selectors';
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
    const { downloadTracks, match, playlist, savePlaylist } = this.props;
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
  playlist: playlistType,
  savePlaylist: PropTypes.func.isRequired,
  updateTracks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  playlist: getSelectedPlaylist(state)
});

export default withRouter(
  connect(mapStateToProps, {
    downloadTracks,
    savePlaylist,
    updateTracks
  })(Details)
);
