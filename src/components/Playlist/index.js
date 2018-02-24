import React from 'react';
import PropTypes from 'prop-types';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-native';

import Container from '../Container';
import Details from './Details';
import EditTracks from './EditTracks';

import * as playlists from '../../modules/playlists';
import { playlistType } from '../../types';

class Playlist extends React.Component {
  componentDidMount() {
    this.props.updateTrackInfo();
  }

  render() {
    const { loading, match, playlist } = this.props;

    return playlist && !loading ? (
      <Container>
        <Switch>
          <Route path={`${match.url}/add`} component={EditTracks} />
          <Route path={match.url} component={Details} />
        </Switch>
      </Container>
    ) : !playlist && !loading ? (
      <Text>Playlist Not Found</Text>
    ) : null;
  }
}

Playlist.propTypes = {
  loading: PropTypes.bool,
  match: PropTypes.object,
  playlist: playlistType,
  updateTrackInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  loading: state.playlists.loading,
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default connect(mapStateToProps, {
  updateTrackInfo: playlists.actions.updateTrackInfo
})(Playlist);
