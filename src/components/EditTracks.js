import React from 'react';
import { withTheme } from 'styled-components';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get } from 'dot-prop';

import Container from './Container';
import Explorer from './Explorer';
import IconButton from './IconButton';
import LoadingOrContent from './LoadingOrContent';

import { playlistType } from '../types';
import * as playlists from '../modules/playlists';

class EditTracks extends React.Component {
  static propTypes = {
    navigation: PropTypes.object,
    playlist: playlistType,
    theme: PropTypes.object,
    updateTracks: PropTypes.func.isRequired
  };

  static navigationOptions = ({ navigation }) => {
    return { headerTitle: `Tracks - ${navigation.getParam('name')}` };
  };

  state = {
    selected: [...this.props.playlist.data.tracks]
  };

  componentDidMount() {
    this.setNavName();
  }

  componentDidUpdate() {
    this.setNavName();
  }

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
    this.props.navigation.goBack();
  };

  handleSelectionChange = selected => {
    this.setState({ selected });
  };

  setNavName = () => {
    const { navigation, playlist } = this.props;
    const name = get(playlist, 'data.title');
    if (navigation.getParam('name') !== name) {
      navigation.setParams({ name });
    }
  };

  render() {
    const { playlist, theme } = this.props;
    return (
      <Container>
        <LoadingOrContent data={playlist}>
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
        </LoadingOrContent>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default withTheme(
  connect(
    mapStateToProps,
    {
      updateTracks: playlists.actions.updateTracks
    }
  )(EditTracks)
);
