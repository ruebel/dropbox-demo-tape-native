import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { playlistType } from '../../types';

import BreadcrumbTrail from './BreadcrumbTrail';
import Button from '../Button';
import Entry from './Entry';
import { Message } from '../typography';

import { actions as fileActions } from '../../modules/files';
import * as playlists from '../../modules/playlists';

const ButtonWrapper = styled.View``;

const Entries = styled.ScrollView`
  ${'' /* & > :last-of-type {
    border-bottom-color: ${p => p.theme.color.borderPrimary};
    border-bottom-width: 1px;
  } */};
`;

const Wrapper = styled.View``;

class Explorer extends Component {
  state = {
    selected: []
  };

  async componentDidMount() {
    this.props.getFiles(this.props.path);
    this.selectTracks(this.props.playlist);
  }

  componentWillReceiveProps(next) {
    if (!next.playlist || next.playlist.id !== this.props.playlist.id) {
      this.selectTracks(next.playlist);
    }
  }

  handleAdd = () => {
    this.props.updateTracks(this.state.selected);
    this.handleBack();
  };

  handleBack = () => {
    this.props.history.goBack();
  };

  handleEntryPress = entry => {
    if (entry.type === 'folder') {
      this.props.getFiles(entry.path);
    } else {
      this.toggleSelected(entry);
    }
  };

  selectTracks = playlist => {
    this.setState({
      selected: playlist ? [...playlist.data.tracks] : []
    });
  };

  toggleSelected = entry => {
    this.setState(state => {
      if (state.selected.some(e => e.id === entry.id)) {
        return {
          selected: state.selected.filter(e => e.id !== entry.id)
        };
      }
      return {
        selected: [...state.selected, entry]
      };
    });
  };

  render() {
    const { files, getFiles, path } = this.props;
    return (
      <Wrapper>
        <ButtonWrapper>
          <Button onPress={this.handleBack} text="Cancel" />
          <Button onPress={this.handleAdd} text="Done" />
        </ButtonWrapper>
        <BreadcrumbTrail path={path} onPress={getFiles} />
        <Entries>
          {files.map((entry, i) => (
            <Entry
              key={i}
              entry={entry}
              onPress={this.handleEntryPress}
              selected={this.state.selected.some(e => e.id === entry.id)}
            />
          ))}
        </Entries>
        {files.length === 0 && <Message>There's nothing here</Message>}
      </Wrapper>
    );
  }
}

Explorer.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  getFiles: PropTypes.func.isRequired,
  history: PropTypes.object,
  path: PropTypes.string,
  playlist: playlistType,
  updateTracks: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  files: state.files.data || [],
  path: state.files.path,
  playlist: playlists.selectors.getSelectedPlaylist(state)
});

export default connect(mapStateToProps, {
  getFiles: fileActions.getFiles,
  updateTracks: playlists.actions.updateTracks
})(Explorer);
