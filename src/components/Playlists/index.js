import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RefreshControl } from 'react-native';

import { Empty } from '../typography';
import NavButton from '../NavButton';
import Playlist from './Playlist';

import { actions as playlistActions } from '../../modules/playlists';
import { playlistsType } from '../../types';

const List = styled.FlatList`
  margin-bottom: 16;
`;

const Wrapper = styled.View`
  flex: 1;
`;

class Playlists extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerRight: <NavButton icon="menu" route="Menu" />,
    headerTitle: 'Playlists'
  });

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

  handlePlaylistPress = playlist => {
    console.log({ props: this.props });
    this.props.selectPlaylist(playlist.meta.id);
    this.props.navigation.navigate('Playlist');
  };

  refresh = () => {
    this.setState({
      refreshing: true
    });
    this.props.findPlaylists(true);
  };

  render() {
    const { deletePlaylist, playlists } = this.props;
    return (
      <Wrapper>
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
      </Wrapper>
    );
  }
}

Playlists.propTypes = {
  deletePlaylist: PropTypes.func.isRequired,
  findPlaylists: PropTypes.func.isRequired,
  navigation: PropTypes.object,
  pending: PropTypes.bool,
  playlists: playlistsType,
  selectPlaylist: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  pending: state.playlists.pending,
  playlists: state.playlists.data
});

export default connect(
  mapStateToProps,
  {
    deletePlaylist: playlistActions.deletePlaylist,
    findPlaylists: playlistActions.findPlaylists,
    selectPlaylist: playlistActions.selectPlaylist
  }
)(Playlists);
