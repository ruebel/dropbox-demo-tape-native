import React from 'react';
import styled, { withTheme } from 'styled-components/native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Container from '../Container';
import Explorer from '../Explorer';
import IconButton from '../IconButton';
import { H2 } from '../typography';

import { playlistType } from '../../types';
import * as playlists from '../../modules/playlists';

const Title = styled(H2)`
  margin-bottom: 24;
`;

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

  handleSave = () => {
    this.props.updateTracks(this.state.selected);
    this.props.history.goBack();
  };

  handleSelectionChange = selected => {
    this.setState({ selected });
  };

  render() {
    const { theme } = this.props;
    return (
      <Container>
        <Title>Edit Tracks</Title>
        <Explorer
          onSelectionChange={this.handleSelectionChange}
          selected={this.state.selected}
        />
        <IconButton
          background={theme.color.primary}
          float
          icon="save"
          onPress={this.handleSave}
          size={42}
        />
      </Container>
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
