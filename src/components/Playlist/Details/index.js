import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { Link, withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import arrayMove from 'array-move';

import TrackList from './TrackList';

import { updateTracks } from '../../../modules/playlists/actions';
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
    const { match, playlist } = this.props;
    return (
      <View>
        <Link to={`${match.url}/add`}>
          <Text>Add Tracks</Text>
        </Link>
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
  match: PropTypes.object,
  playlist: playlistType,
  updateTracks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  playlist: getSelectedPlaylist(state)
});

export default withRouter(
  connect(mapStateToProps, {
    updateTracks
  })(Details)
);
