import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';

import IconButton from '../IconButton';
import { H2 } from '../typography';
import Playlist from './Playlist';

import { actions as playlistActions } from '../../modules/playlists';
import { playlistsType } from '../../types';
import { color } from '../../styles/theme';

const List = styled.FlatList`
  margin-top: 16;
  margin-bottom: 16;
  margin-left: 16;
  margin-right: 16;
`;

const Wrapper = styled.View`
  flex: 1;
`;

class Playlists extends React.Component {
  componentDidMount() {
    this.props.findPlaylists();
  }

  handleAdd = () => {};

  handlePlaylistPress = playlist => {
    this.props.selectPlaylist(playlist.meta.id);
    this.props.history.push('/playlist');
  };

  render() {
    const { playlists } = this.props;
    return (
      <Wrapper>
        <H2>Playlists</H2>
        <List
          data={playlists}
          keyExtractor={item => item.meta.id}
          renderItem={({ item }) => (
            <Playlist onPress={this.handlePlaylistPress} playlist={item} />
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
