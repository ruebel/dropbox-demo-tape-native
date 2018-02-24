import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';

import Explorer from '../Explorer';
import IconButton from '../IconButton';
import TextInput from '../TextInput';
import { H2 } from '../typography';

import { color } from '../../styles/theme';
import { createPlaylist } from '../../modules/playlists/actions';

const Text = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 16px;
  margin-bottom: 8;
  margin-left: 8
  margin-top: 32;
`;

const TitleWrapper = styled.View`
  margin-bottom: 32;
`;

const Wrapper = styled.View`
  flex: 1;
`;

class CreatePlaylist extends React.Component {
  state = {
    name: ''
  };

  handleNameChange = name => {
    this.setState({ name });
  };

  handleSave = async () => {
    await this.props.createPlaylist(this.state.name);
    this.props.history.push('/playlist');
  };

  render() {
    return (
      <Wrapper>
        <TitleWrapper>
          <H2>Create Playlist</H2>
        </TitleWrapper>
        <TextInput
          onChange={this.handleNameChange}
          placeholder="Enter Playlist Name"
          title="Name"
          value={this.state.name}
        />
        <Text>Choose Location</Text>
        <Explorer folder />
        <IconButton
          background={color.primary}
          disabled={!this.state.name.length}
          float
          icon="save"
          onPress={this.handleSave}
          size={42}
        />
      </Wrapper>
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
