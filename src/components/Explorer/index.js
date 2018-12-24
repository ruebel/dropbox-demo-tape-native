import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RefreshControl } from 'react-native';
import { connectActionSheet } from '@expo/react-native-action-sheet';

import BreadcrumbTrail from './BreadcrumbTrail';
import Container from '../Container';
import Entry from './Entry';
import { Message } from '../typography';

import * as files from '../../modules/files';

const List = styled.FlatList`
  flex: 1;
`;

class Explorer extends Component {
  static propTypes = {
    files: PropTypes.arrayOf(PropTypes.object),
    folder: PropTypes.bool,
    getFiles: PropTypes.func.isRequired,
    onSelectionChange: PropTypes.func,
    path: PropTypes.string,
    selected: PropTypes.array,
    setSortBy: PropTypes.func.isRequired,
    showActionSheetWithOptions: PropTypes.func.isRequired,
    users: PropTypes.array
  };

  static defaultProps = {
    selected: []
  };

  async componentDidMount() {
    this.props.getFiles(this.props.path);
  }

  handleEntryPress = entry => {
    if (entry.type === 'folder') {
      this.props.getFiles(entry.path);
    } else if (!this.props.folder) {
      this.toggleSelected(entry);
    }
  };

  handleSort = () => {
    const options = ['Modified', 'Name', 'Cancel'];
    const cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        cancelButtonIndex,
        options
      },
      buttonIndex => {
        if (buttonIndex < 2) {
          this.props.setSortBy(buttonIndex === 0 ? 'modified' : 'name');
        }
      }
    );
  };

  toggleSelected = entry => {
    const { onSelectionChange, selected } = this.props;
    if (onSelectionChange) {
      if (selected.some(e => e.id === entry.id)) {
        onSelectionChange(selected.filter(e => e.id !== entry.id));
      } else {
        onSelectionChange([...selected, entry]);
      }
    }
  };

  render() {
    const { files, folder, getFiles, path, selected, users } = this.props;
    return (
      <Container>
        <BreadcrumbTrail
          onPress={getFiles}
          onSort={this.handleSort}
          path={path}
        />
        <List
          data={files.filter(
            file =>
              file.isFolder || ((folder && file.isPlaylist) || file.isAudioFile)
          )}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Message>
              {folder ? 'Empty Folder' : 'There Are No Audio Files Here'}
            </Message>
          }
          refreshControl={
            <RefreshControl
              onRefresh={() => getFiles(this.props.path)}
              refreshing={false}
            />
          }
          renderItem={({ item }) => (
            <Entry
              entry={item}
              onPress={this.handleEntryPress}
              selected={selected.some(e => e.id === item.id)}
              user={users.find(u => u.id === item.user)}
            />
          )}
        />
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  files: files.selectors.getSortedFiles(state),
  path: state.files.path,
  users: state.files.users
});

export default connectActionSheet(
  connect(
    mapStateToProps,
    {
      getFiles: files.actions.getFiles,
      setSortBy: files.actions.setSortBy
    }
  )(Explorer)
);
