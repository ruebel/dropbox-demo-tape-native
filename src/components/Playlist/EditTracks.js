import React from 'react';
import { View } from 'react-native';
import { withTheme } from 'styled-components/native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ButtonWrapper from '../ButtonWrapper';
import Explorer from '../Explorer';
import IconButton from '../IconButton';

import { playlistType } from '../../types';
import * as playlists from '../../modules/playlists';

class EditTracks extends React.Component {
  state = {
    selected: [...this.props.playlist.data.tracks]
  };

  componentWillReceiveProps(next) {
    if (
      !next.playlist ||
      !this.props.playlist ||
      next.playlist.meta.id !== this.props.playlist.meta.id
    ) {
      this.setState({
        selected: next.playlist ? next.playlist.data.tracks : []
      });
    }
  }

  handleCancel = () => {
    this.props.history.goBack();
  };

  handleSave = () => {
    this.props.updateTracks(this.state.selected);
    this.handleCancel();
  };

  handleSelectionChange = selected => {
    this.setState({ selected });
  };

  render() {
    const { theme } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <ButtonWrapper>
          <IconButton
            background={theme.color.primary}
            icon="undo"
            onPress={this.handleCancel}
          />
          <IconButton
            background={theme.color.primary}
            icon="save"
            onPress={this.handleSave}
          />
        </ButtonWrapper>
        <Explorer
          onSelectionChange={this.handleSelectionChange}
          selected={this.state.selected}
        />
      </View>
    );
  }
}

EditTracks.propTypes = {
  history: PropTypes.object,
  playlist: playlistType,
  theme: PropTypes.object,
  updateTracks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default withTheme(
  connect(mapStateToProps, {
    updateTracks: playlists.actions.updateTracks
  })(EditTracks)
);
