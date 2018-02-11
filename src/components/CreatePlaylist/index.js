import React from 'react';
import { Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ButtonWrapper from '../ButtonWrapper';
import Container from '../Container';
import Explorer from '../Explorer';
import IconButton from '../IconButton';
import TextInput from '../TextInput';

import { color } from '../../styles/theme';
import { createPlaylist } from '../../modules/playlists/actions';

class CreatePlaylist extends React.Component {
  state = {
    name: ''
  };

  handleCancel = () => {
    this.props.history.goBack();
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handleSave = () => {
    this.props.createPlaylist(this.state.name);
  };

  render() {
    return (
      <Container>
        <Text>Create Playlist</Text>
        <TextInput
          onChange={this.handleNameChange}
          placeholder="Enter Playlist Name"
          title="Name"
          value={this.state.name}
        />
        <ButtonWrapper>
          <IconButton
            background={color.primary}
            icon="undo"
            onPress={this.handleCancel}
          />
          <IconButton
            background={color.primary}
            disabled={!this.state.name.length}
            icon="save"
            onPress={this.handleSave}
          />
        </ButtonWrapper>
        <Explorer folder />
      </Container>
    );
  }
}

CreatePlaylist.propTypes = {
  createPlaylist: PropTypes.func.isRequired,
  history: PropTypes.object
};

export default connect(null, {
  createPlaylist
})(CreatePlaylist);
