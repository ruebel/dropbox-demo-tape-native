import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import arrayMove from 'array-move';
import { get } from 'dot-prop';

import Container from '../Container';
import LoadingOrContent from '../LoadingOrContent';
import NavButton from '../NavButton';
import TrackList from './TrackList';

import {
  actions as playlistActions,
  selectors as playlistSelectors
} from '../../modules/playlists';
import { actions as audioActions } from '../../modules/audio';
import { accountList, playlistType, trackType } from '../../types';

class Details extends React.Component {
  static propTypes = {
    downloadTracks: PropTypes.func.isRequired,
    isPaused: PropTypes.bool,
    isPlaying: PropTypes.bool,
    loading: PropTypes.bool,
    navigation: PropTypes.object.isRequired,
    pause: PropTypes.func.isRequired,
    play: PropTypes.func.isRequired,
    playingTrack: trackType,
    playlist: playlistType,
    updateTrackInfo: PropTypes.func.isRequired,
    updateTracks: PropTypes.func.isRequired,
    users: accountList
  };

  static navigationOptions = ({ navigation }) => {
    return {
      headerRight: <NavButton icon="edit" route="PlaylistSettings" />,
      headerTitle: navigation.getParam('name')
    };
  };

  componentDidMount() {
    this.props.updateTrackInfo();
    this.setNavName();
  }

  componentDidUpdate() {
    this.setNavName();
  }

  handleRemove = track => {
    if (track) {
      this.props.updateTracks(
        this.props.playlist.data.tracks.filter(t => t.id !== track.id)
      );
      this.savePlaylist();
    }
  };

  handleSortEnd = ({ from, to }) => {
    if (from !== to) {
      this.props.updateTracks(
        arrayMove(this.props.playlist.data.tracks, from, to)
      );
      this.savePlaylist();
    }
  };

  handleTrackPress = track => {
    if (!track.downloadStatus) {
      this.props.downloadTracks();
    } else {
      this.isTrackPlaying(track)
        ? this.props.pause()
        : this.props.play(track.id);
    }
  };

  isTrackPlaying = track => {
    const { isPlaying, playingTrack } = this.props;
    return isPlaying && track.id === get(playingTrack, 'id');
  };

  setNavName = () => {
    const { navigation, playlist } = this.props;
    const name = get(playlist, 'data.title');
    if (navigation.getParam('name') !== name) {
      navigation.setParams({ name });
    }
  };

  render() {
    const { isPaused, loading, playingTrack, playlist, users } = this.props;

    return (
      <Container>
        <LoadingOrContent data={playlist} loading={loading}>
          <TrackList
            isPaused={isPaused}
            onPress={this.handleTrackPress}
            onRemove={this.handleRemove}
            onSortEnd={this.handleSortEnd}
            tracks={playlist.data.tracks.map(t =>
              t === playingTrack
                ? {
                  ...t,
                  playing: true
                }
                : t
            )}
            users={users}
          />
        </LoadingOrContent>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  isPaused: state.audio.isPaused,
  isPlaying: state.audio.isPlaying,
  loading: state.playlists.loading,
  playingTrack: playlistSelectors.getPlayingTrack(state),
  playlist: playlistSelectors.getSelectedPlaylist(state),
  users: state.files.users
});

export default connect(
  mapStateToProps,
  {
    downloadTracks: playlistActions.downloadTracks,
    pause: audioActions.pause,
    play: audioActions.play,
    savePlaylist: playlistActions.savePlaylist,
    updateTrackInfo: playlistActions.updateTrackInfo,
    updateTracks: playlistActions.updateTracks
  }
)(Details);
