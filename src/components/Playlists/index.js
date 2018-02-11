import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RefreshControl } from 'react-native';

import IconButton from '../IconButton';
import { Empty, H2 } from '../typography';
import Playlist from './Playlist';

import { actions as playlistActions } from '../../modules/playlists';
import { playlistsType } from '../../types';
import { color } from '../../styles/theme';

const List = styled.FlatList`
  margin-top: 16;
  margin-bottom: 16;
`;

const Wrapper = styled.View`
  flex: 1;
`;

class Playlists extends React.Component {
  state = {
    refreshing: false
  };

  componentDidMount() {
    this.props.findPlaylists();
  }

  componentWillReceiveProps(next) {
    if (!next.pending && this.props.pending && this.state.refreshing) {
      this.setState({
        refreshing: false
      });
    }
  }

  handleAdd = () => {};

  handlePlaylistPress = playlist => {
    this.props.selectPlaylist(playlist.meta.id);
    this.props.history.push('/playlist');
  };

  refresh = () => {
    this.setState({
      refreshing: true
    });
    this.props.findPlaylists();
  };

  render() {
    const { deletePlaylist, playlists } = this.props;
    return (
      <Wrapper>
        <H2>Playlists</H2>
        <List
          data={playlists}
          keyExtractor={item => item.meta.id}
          ListEmptyComponent={<Empty>No Playlists</Empty>}
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this.refresh}
            />
          }
          renderItem={({ item }) => (
            <Playlist
              onDelete={deletePlaylist}
              onPress={this.handlePlaylistPress}
              playlist={item}
            />
          )}
        />
        <IconButton
          background={color.primary}
          float
          icon="add"
          onPress={this.handleAdd}
        />
      </Wrapper>
    );
  }
}

Playlists.propTypes = {
  deletePlaylist: PropTypes.func.isRequired,
  findPlaylists: PropTypes.func.isRequired,
  history: PropTypes.object,
  pending: PropTypes.bool,
  playlists: playlistsType,
  selectPlaylist: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pending: state.playlists.pending,
  playlists: state.playlists.data
});

export default connect(mapStateToProps, {
  deletePlaylist: playlistActions.deletePlaylist,
  findPlaylists: playlistActions.findPlaylists,
  selectPlaylist: playlistActions.selectPlaylist
})(Playlists);
