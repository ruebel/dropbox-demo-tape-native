import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'dot-prop';
import styled from 'styled-components';
import { playlistType } from '../../types';
import * as playlists from '../../modules/playlists';

import ButtonBase from '../Button';
import Container from '../Container';
import IconButton from '../IconButton';
import TextInput from '../TextInput';

const Button = styled(ButtonBase)`
  margin-top: 40;
`;

class Settings extends React.Component {
  static propTypes = {
    deletePlaylist: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    playlist: playlistType,
    updateTitle: PropTypes.func.isRequired
  };

  state = {
    hasChange: false,
    title: get(this.props, 'playlist.data.title')
  };

  componentWillReceiveProps(next) {
    if (next.playlist !== this.props.playlist) {
      this.setState({
        title: get(next, 'playlist.data.title')
      });
    }
  }

  handleDelete = () => {
    this.props.deletePlaylist(this.props.playlist);
    this.props.history.push('/');
  };

  handleTitleChange = title => this.setState({ hasChange: true, title });

  saveTitle = () => {
    if (
      this.state.title.length &&
      this.state.title !== get(this.props, 'playlist.data.title')
    ) {
      this.props.updateTitle(this.state.title);
    }
  };

  render() {
    return (
      <Container>
        <TextInput
          onChange={this.handleTitleChange}
          placeholder="Enter Playlist Name"
          title="Name"
          value={this.state.title}
        />
        <Button onPress={this.handleDelete} text="Delete Playlist" />
        {this.state.hasChange && (
          <IconButton
            background="primary"
            float
            icon="save"
            onPress={this.saveTitle}
            size={32}
          />
        )}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default connect(mapStateToProps, {
  deletePlaylist: playlists.actions.deletePlaylist,
  updateTitle: playlists.actions.updateTitle
})(Settings);
