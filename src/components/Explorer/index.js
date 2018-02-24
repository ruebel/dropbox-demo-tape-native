import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styled from 'styled-components/native';
import { RefreshControl } from 'react-native';

import BreadcrumbTrail from './BreadcrumbTrail';
import Container from '../Container';
import Entry from './Entry';
import { Message } from '../typography';

import { actions as fileActions } from '../../modules/files';

const List = styled.FlatList`
  flex: 1;
`;

class Explorer extends Component {
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
        <BreadcrumbTrail path={path} onPress={getFiles} />
        <List
          data={folder ? files.filter(f => f.type === 'folder') : files}
          keyExtractor={item => item.id}
          ListEmptyComponent={
            <Message>{folder ? '' : 'There Are No Audio Files Here'}</Message>
          }
          refreshControl={
            <RefreshControl
              refreshing={this.props.pending}
              onRefresh={() => getFiles(this.props.path)}
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

Explorer.propTypes = {
  files: PropTypes.arrayOf(PropTypes.object),
  folder: PropTypes.bool,
  getFiles: PropTypes.func.isRequired,
  onSelectionChange: PropTypes.func,
  path: PropTypes.string,
  pending: PropTypes.bool,
  selected: PropTypes.array,
  users: PropTypes.array
};

Explorer.defaultProps = {
  selected: []
};

const mapStateToProps = state => ({
  files: state.files.data || [],
  path: state.files.path,
  pending: state.files.pending,
  users: state.files.users
});

export default connect(mapStateToProps, {
  getFiles: fileActions.getFiles
})(Explorer);
