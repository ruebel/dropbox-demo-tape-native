import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';

import Container from '../Container';
import Details from './Details';
import EditTracks from './EditTracks';
import Settings from './Settings';

import * as playlists from '../../modules/playlists';
import { playlistType } from '../../types';

const PlaylistStack = createStackNavigator(
  {
    Details: {
      screen: Details
    },
    EditTracks: {
      screen: EditTracks
    },
    PlaylistSettings: {
      screen: Settings
    }
  },
  {
    initialRouteName: 'Details'
  }
);

class Playlist extends React.Component {
  componentDidMount() {
    this.props.updateTrackInfo();
  }

  render() {
    const { loading, playlist } = this.props;

    return playlist && !loading ? (
      <Container>
        <PlaylistStack />
      </Container>
    ) : !playlist && !loading ? (
      <Text>Playlist Not Found</Text>
    ) : null;
  }
}

Playlist.propTypes = {
  loading: PropTypes.bool,
  playlist: playlistType,
  updateTrackInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.playlists.loading,
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default connect(
  mapStateToProps,
  {
    updateTrackInfo: playlists.actions.updateTrackInfo
  }
)(Playlist);
