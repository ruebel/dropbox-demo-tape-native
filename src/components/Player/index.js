import React from 'react';
import PropTypes from 'prop-types';
import { Audio, KeepAwake } from 'expo';
import { connect } from 'react-redux';
import { Modal, View } from 'react-native';

import Control from './Control';
import Full from './Full';

import { playlistType, trackType } from '../../types';
import { getFilePath } from '../../modules/utils';
import { actions as audioActions } from '../../modules/audio';
import * as playlists from '../../modules/playlists';
import { getPlayingTrack } from '../../modules/playlists/selectors';

class Player extends React.Component {
  state = {
    currentTime: 0,
    duration: 0,
    fullScreen: false,
    isBuffering: false,
    isPlaying: false,
    isSeeking: false,
    position: 0,
    rate: 1.0,
    shouldPlay: false,
    volume: 1.0
  };

  componentDidMount() {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true
    });

    this.initializeSound();
  }

  componentWillReceiveProps(next) {
    if (next.track !== this.props.track) {
      this.initializeSound(next.track, next.isPlaying && !next.paused);
    } else if (
      next.isPlaying !== this.props.isPlaying ||
      next.paused !== this.props.paused
    ) {
      this.handlePause(next.isPlaying && !next.paused);
    }
  }

  handleAudioUpdate = status => {
    if (status.isLoaded) {
      this.setState(state => ({
        currentTime: status.positionMillis,
        duration: status.durationMillis,
        isBuffering: status.isBuffering,
        isPlaying: status.isPlaying,
        position: state.isSeeking
          ? state.position
          : status.positionMillis / status.durationMillis,
        rate: status.rate,
        shouldPlay: status.shouldPlay,
        volume: status.volume
      }));
      if (status.didJustFinish) {
        this.props.trackComplete();
      }
    } else if (status.error) {
      console.error(`Player Error: ${status.error}`);
      this.props.stop();
    }
  };

  handlePause = shouldPlay => {
    if (this.sound) {
      if (shouldPlay) {
        this.sound.playAsync();
      } else {
        this.sound.pauseAsync();
      }
    }
  };

  seekEnd = position => {
    if (this.sound) {
      const seekTo = position * this.state.duration;
      if (this.props.isPlaying && !this.props.paused) {
        this.sound.playFromPositionAsync(seekTo);
      } else {
        this.sound.setPositionAsync(seekTo);
      }
    }
    this.setState({
      isSeeking: false,
      position
    });
  };

  seeking = position => {
    this.setState({
      isSeeking: true,
      position
    });
  };

  initializeSound = async (trackOverride, shouldPlayOverride) => {
    if (this.sound) {
      try {
        await this.sound.unloadAsync();
        this.sound.setOnPlaybackStatusUpdate(null);
        this.sound = null;
      } catch (err) {
        console.error(err);
      }
    }
    const track = trackOverride || this.props.track;

    if (!track || !track.downloadStatus || track.downloadStatus < 100) {
      return;
    }

    const source = { uri: getFilePath(track) };

    const initialStatus = {
      rate: 1.0,
      shouldPlay:
        shouldPlayOverride || (this.props.isPlaying && !this.props.paused),
      volume: 1.0
    };

    try {
      const { sound } = await Audio.Sound.create(
        source,
        initialStatus,
        this.handleAudioUpdate
      );

      this.sound = sound;
    } catch (error) {
      this.sound = null;
    }
  };

  toggleFullScreen = () => {
    this.setState(state => ({
      fullScreen: !state.fullScreen
    }));
  };

  render() {
    const {
      changeTrack,
      id,
      isPlaying,
      pause,
      paused,
      playlist,
      track
    } = this.props;
    const trackName = track
      ? `${playlist.data.tracks.findIndex(t => t.id === id) + 1}. ${track.name}`
      : null;
    return (
      <View>
        {/* Using keep awake since expo does not support background audio */}
        {track && isPlaying && !paused && <KeepAwake />}
        {track && (
          <Modal
            animationType="slide"
            onRequestClose={this.toggleFullScreen}
            visible={this.state.fullScreen}
          >
            <Full
              canPlay={track.downloadStatus === 100}
              currentTime={this.state.currentTime}
              downloading={
                track.downloadStatus > 0 && track.downloadStatus < 100
              }
              duration={this.state.duration}
              name={trackName}
              onClose={this.toggleFullScreen}
              onDownload={this.props.downloadTracks}
              onNext={() => changeTrack(true)}
              onPause={pause}
              onPrevious={() => changeTrack(false)}
              onSeek={this.seeking}
              onSeekEnd={this.seekEnd}
              paused={paused}
              position={this.state.position}
              title={playlist.data.title}
            />
          </Modal>
        )}
        {track &&
          this.props.isPlaying &&
          !this.state.fullScreen && (
            <Control
              canPlay={track.downloadStatus === 100}
              downloading={
                track.downloadStatus > 0 && track.downloadStatus < 100
              }
              name={trackName}
              onDownload={this.props.downloadTracks}
              onNext={() => changeTrack(true)}
              onPause={pause}
              onPress={this.toggleFullScreen}
              onPrevious={() => changeTrack(false)}
              paused={paused}
            />
          )}
      </View>
    );
  }
}

Player.propTypes = {
  changeTrack: PropTypes.func.isRequired,
  downloadTracks: PropTypes.func.isRequired,
  id: PropTypes.string,
  isPlaying: PropTypes.bool,
  pause: PropTypes.func.isRequired,
  paused: PropTypes.bool,
  playlist: playlistType,
  stop: PropTypes.func.isRequired,
  track: trackType,
  trackComplete: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  id: state.audio.id,
  isPlaying: state.audio.isPlaying,
  paused: state.audio.paused,
  playlist: playlists.selectors.getSelectedPlaylist(state),
  track: getPlayingTrack(state)
});

export default connect(mapStateToProps, {
  changeTrack: audioActions.changeTrack,
  downloadTracks: playlists.actions.downloadTracks,
  pause: audioActions.pause,
  stop: audioActions.stop,
  trackComplete: audioActions.trackComplete
})(Player);
