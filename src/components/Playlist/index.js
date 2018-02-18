import React from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-native';
import styled, { withTheme } from 'styled-components/native';

import Details from './Details';
import EditTracks from './EditTracks';
import { H2 } from '../typography';
import IconButton from '../IconButton';
import TextInput from '../TextInput';

import * as playlists from '../../modules/playlists';
import { playlistType } from '../../types';

const TitleWrapper = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

class Playlist extends React.Component {
  state = {
    editTitle: false,
    title: ''
  };

  componentDidMount() {
    this.props.updateTrackInfo();
  }

  componentWillReceiveProps(next) {
    if (next.playlist !== this.props.playlist && this.state.editTitle) {
      this.setState({ editTitle: false });
    }
  }

  handleTitleChange = title => this.setState({ title });

  toggleEditTitle = () => {
    if (
      this.state.editTitle &&
      this.state.title !== this.props.playlist.data.title
    ) {
      this.props.updateTitle(this.state.title);
    }
    this.setState(state => ({
      editTitle: !state.editTitle,
      title: !state.editTitle ? this.props.playlist.data.title : state.title
    }));
  };

  render() {
    const { loading, match, playlist, theme } = this.props;
    const { editTitle } = this.state;
    return playlist && !loading ? (
      <View style={{ flex: 1 }}>
        <TitleWrapper>
          {editTitle ? (
            <TextInput
              onChange={this.handleTitleChange}
              placeholder="Enter Playlist Name"
              value={this.state.title}
            />
          ) : (
            <H2>{playlist.data.title}</H2>
          )}
          <IconButton
            color={theme.color.primary}
            icon={editTitle ? 'save' : 'edit'}
            onPress={this.toggleEditTitle}
            size={editTitle ? 32 : 20}
          />
        </TitleWrapper>
        <Switch>
          <Route path={`${match.url}/add`} component={EditTracks} />
          <Route path={match.url} component={Details} />
        </Switch>
      </View>
    ) : !playlist && !loading ? (
      <Text>Playlist Not Found</Text>
    ) : null;
  }
}

Playlist.propTypes = {
  loading: PropTypes.bool,
  match: PropTypes.object,
  playlist: playlistType,
  theme: PropTypes.object,
  updateTitle: PropTypes.func.isRequired,
  updateTrackInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.playlists.loading,
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default withTheme(
  connect(mapStateToProps, {
    updateTitle: playlists.actions.updateTitle,
    updateTrackInfo: playlists.actions.updateTrackInfo
  })(Playlist)
);
