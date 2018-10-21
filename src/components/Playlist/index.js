import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { createStackNavigator } from 'react-navigation';
import { get } from 'dot-prop';

import Container from '../Container';
import Details from './Details';
import EditTracks from './EditTracks';
import Loader from '../Loader';
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
    headerMode: 'none',
    initialRouteName: 'Details'
  }
);

class Playlist extends React.Component {
  static router = PlaylistStack.router;

  static navigationOptions = ({ navigation }) => {
    return { headerTitle: navigation.getParam('name') };
  };

  componentDidMount() {
    this.props.updateTrackInfo();
    this.setName();
  }

  componentDidUpdate() {
    this.setName();
  }

  setName = () => {
    const { navigation, playlist } = this.props;
    const name = get(playlist, 'data.title');
    if (navigation.getParam('name') !== name) {
      navigation.setParams({ name });
    }
  };

  render() {
    const { loading, navigation, playlist } = this.props;

    return playlist && !loading ? (
      <Container>
        <PlaylistStack navigation={navigation} />
      </Container>
    ) : !playlist && !loading ? (
      <Text>Playlist Not Found</Text>
    ) : (
      <Loader color="secondary" size={24} />
    );
  }
}

Playlist.propTypes = {
  loading: PropTypes.bool,
  navigation: PropTypes.object,
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
