import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'dot-prop';
import moment from 'moment';
import styled from 'styled-components';

import { accountType, playlistType } from '../types';
import * as files from '../modules/files';
import * as playlists from '../modules/playlists';

import ButtonBase from './Button';
import Container from './Container';
import Field from './Field';
import IconButton from './IconButton';
import LoadingOrContent from './LoadingOrContent';
import TextInput from './TextInput';

const Button = styled(ButtonBase)`
  margin-top: 40;
`;

class Settings extends React.Component {
  static propTypes = {
    deletePlaylist: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    playlist: playlistType,
    updateTitle: PropTypes.func.isRequired,
    user: accountType
  };

  static navigationOptions = ({ navigation }) => {
    const canSave = navigation.getParam('hasChange', false);
    return {
      headerRight: canSave ? (
        <IconButton
          icon="save"
          onPress={() => navigation.getParam('saveTitle')()}
        />
      ) : null,
      headerTitle: navigation.getParam('name')
    };
  };

  state = {
    hasChange: false,
    title: get(this.props, 'playlist.data.title')
  };

  componentDidMount() {
    this.props.navigation.setParams({ saveTitle: this.saveTitle });
    this.setNavName();
  }

  componentDidUpdate() {
    this.setNavName();
  }

  componentWillReceiveProps(next) {
    if (next.playlist !== this.props.playlist) {
      this.setState({
        title: get(next, 'playlist.data.title')
      });
    }
  }

  handleDelete = () => {
    this.props.deletePlaylist(this.props.playlist);
    this.props.navigation.navigate('Playlists');
  };

  handleTitleChange = title => {
    this.setState({ hasChange: true, title });
    this.props.navigation.setParams({ hasChange: true });
  };

  saveTitle = () => {
    if (
      this.state.title.length &&
      this.state.title !== get(this.props, 'playlist.data.title')
    ) {
      this.props.updateTitle(this.state.title);
      this.setState({ hasChange: false });
      this.props.navigation.setParams({ hasChange: false });
    }
  };

  setNavName = () => {
    const { navigation, playlist } = this.props;
    const name = get(playlist, 'data.title');
    if (navigation.getParam('name') !== name) {
      navigation.setParams({ name });
    }
  };

  render() {
    const { navigation, playlist, user } = this.props;
    const { title } = this.state;

    return (
      <Container pad>
        <LoadingOrContent data={playlist}>
          <TextInput
            onChange={this.handleTitleChange}
            placeholder="Enter Playlist Name"
            title="Name"
            value={title}
          />
          <Field title="Path" value={playlist.meta.path_display} />
          <Field
            title="Last Updated"
            value={moment(playlist.meta.server_modified).fromNow()}
          />
          {user && <Field title="Updated By" value={user.name.full} />}
          <Button
            onPress={() => navigation.navigate('EditTracks')}
            text="Edit Tracks"
          />
          <Button
            onPress={this.handleDelete}
            text="Delete Playlist"
            type="error"
          />
        </LoadingOrContent>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlist: playlists.selectors.getSelectedPlaylist(state),
  user: files.selectors.getCurrentPlaylistModifiedUser(state)
});

export default connect(
  mapStateToProps,
  {
    deletePlaylist: playlists.actions.deletePlaylist,
    updateTitle: playlists.actions.updateTitle
  }
)(Settings);
