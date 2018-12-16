import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'dot-prop';
import moment from 'moment';
import styled from 'styled-components';

import { playlistType } from '../types';
import * as playlists from '../modules/playlists';

import ButtonBase from './Button';
import Container from './Container';
import IconButton from './IconButton';
import LoadingOrContent from './LoadingOrContent';
import TextInput from './TextInput';
import { Message } from './typography';

const Button = styled(ButtonBase)`
  margin-top: 40;
`;

class Settings extends React.Component {
  static propTypes = {
    deletePlaylist: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    playlist: playlistType,
    updateTitle: PropTypes.func.isRequired
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
    const { navigation, playlist } = this.props;
    const { title } = this.state;

    return (
      <Container padTop>
        <LoadingOrContent data={playlist}>
          <TextInput
            onChange={this.handleTitleChange}
            placeholder="Enter Playlist Name"
            title="Name"
            value={title}
          />
          <Message>{playlist.meta.path_display}</Message>
          <Message>
            Last updated {moment(playlist.data.server_modified).fromNow()}
          </Message>
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
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default connect(
  mapStateToProps,
  {
    deletePlaylist: playlists.actions.deletePlaylist,
    updateTitle: playlists.actions.updateTitle
  }
)(Settings);
