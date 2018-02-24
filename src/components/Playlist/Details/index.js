import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-native';
import { connect } from 'react-redux';
import arrayMove from 'array-move';
import { get } from 'dot-prop';

import ButtonWrapper from '../../ButtonWrapper';
import Container from '../../Container';
import IconButton from '../../IconButton';
import TitleEdit from './TitleEdit';
import TrackList from './TrackList';

import {
  actions as playlistActions,
  selectors as playlistSelectors
} from '../../../modules/playlists';
import { actions as audioActions } from '../../../modules/audio';
import { accountList, playlistType, trackType } from '../../../types';
import { color } from '../../../styles/theme';

class Details extends React.Component {
  state = {
    editTitle: false,
    title: ''
  };

  componentWillReceiveProps(next) {
    if (next.playlist !== this.props.playlist) {
      this.setState({
        editTitle: false,
        title: get(next, 'playlist.data.title')
      });
    }
  }

  handleRemove = track => {
    if (track) {
      this.props.updateTracks(
        this.props.playlist.data.tracks.filter(t => t.id !== track.id)
      );
    }
  };

  handleSortEnd = ({ from, to }) => {
    if (from !== to) {
      this.props.updateTracks(
        arrayMove(this.props.playlist.data.tracks, from, to)
      );
    }
  };

  handleTitleChange = title => this.setState({ title });

  handleTrackPress = track => {
    this.props.play(track.id);
  };

  showAdd = () => {
    this.props.history.push(this.props.match.url + '/add');
  };

  toggleEditTitle = () => {
    if (
      this.state.editTitle &&
      this.state.title !== this.props.playlist.data.title
    ) {
      this.props.updateTitle(this.state.title);
    }
    this.setState(state => ({
      editTitle: !state.editTitle,
      title: !state.editTitle ? this.props.playlist.data.title : state.title
    }));
  };

  render() {
    const {
      downloadTracks,
      isPlaying,
      play,
      playingTrack,
      playlist,
      savePlaylist,
      stop,
      users
    } = this.props;
    const { editTitle, title } = this.state;
    return (
      <Container>
        <TitleEdit
          editTitle={editTitle}
          onTitleChange={this.handleTitleChange}
          title={editTitle ? title : playlist.data.title}
          toggleEditTitle={this.toggleEditTitle}
        />
        <ButtonWrapper>
          <IconButton
            background={color.primary}
            icon="add"
            onPress={this.showAdd}
          />
          <IconButton
            background={color.primary}
            disabled={!playlist.hasChanges}
            icon="save"
            onPress={savePlaylist}
          />
          <IconButton
            background={color.primary}
            icon={isPlaying ? 'stop' : 'play-arrow'}
            onPress={() => (isPlaying ? stop() : play())}
          />
          {playlist.data.tracks.some(track => !track.downloadStatus) && (
            <IconButton
              background={color.primary}
              disabled={playlist.downloading}
              icon="file-download"
              onPress={downloadTracks}
            />
          )}
        </ButtonWrapper>
        <TrackList
          onPress={this.handleTrackPress}
          onRemove={this.handleRemove}
          onSortEnd={this.handleSortEnd}
          tracks={playlist.data.tracks.map(
            t =>
              t === playingTrack
                ? {
                  ...t,
                  playing: true
                }
                : t
          )}
          users={users}
        />
      </Container>
    );
  }
}

Details.propTypes = {
  downloadTracks: PropTypes.func.isRequired,
  history: PropTypes.object,
  isPlaying: PropTypes.bool,
  match: PropTypes.object,
  play: PropTypes.func.isRequired,
  playingTrack: trackType,
  playlist: playlistType,
  savePlaylist: PropTypes.func.isRequired,
  stop: PropTypes.func.isRequired,
  updateTitle: PropTypes.func.isRequired,
  updateTracks: PropTypes.func.isRequired,
  users: accountList
};

const mapStateToProps = state => ({
  isPlaying: state.audio.isPlaying,
  playingTrack: playlistSelectors.getPlayingTrack(state),
  playlist: playlistSelectors.getSelectedPlaylist(state),
  users: state.files.users
});

export default withRouter(
  connect(mapStateToProps, {
    downloadTracks: playlistActions.downloadTracks,
    play: audioActions.play,
    savePlaylist: playlistActions.savePlaylist,
    stop: audioActions.stop,
    updateTitle: playlistActions.updateTitle,
    updateTracks: playlistActions.updateTracks
  })(Details)
);
