import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Text, TouchableOpacity, View } from 'react-native';

import { H2 } from './typography';

import { actions as playlistActions } from '../modules/playlists';
import { playlistsType } from '../types';

class Playlists extends React.Component {
  componentDidMount() {
    this.props.findPlaylists();
  }

  handlePlaylistPress = playlist => {
    this.props.selectPlaylist(playlist.data.id);
    this.props.history.push('/playlist');
  };

  render() {
    const { playlists } = this.props;
    return (
      <View>
        <H2>Playlists</H2>
        <View>
          {playlists.map((playlist, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => this.handlePlaylistPress(playlist)}
            >
              <Text>{playlist.data.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  }
}

Playlists.propTypes = {
  findPlaylists: PropTypes.func.isRequired,
  history: PropTypes.object,
  playlists: playlistsType,
  selectPlaylist: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  playlists: state.playlists.data
});

export default connect(mapStateToProps, {
  findPlaylists: playlistActions.findPlaylists,
  selectPlaylist: playlistActions.selectPlaylist
})(Playlists);
