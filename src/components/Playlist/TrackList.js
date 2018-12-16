import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import SortableListView from 'react-native-sortable-listview';
import styled from 'styled-components';

import { Empty } from '../typography';
import NavButtonBase from '../NavButton';
import Track from './Track';

import { accountList, trackList } from '../../types';

const List = styled(SortableListView)`
  flex: 1;
`;

const NavButton = styled(NavButtonBase)`
  margin-top: 12px;
`;

const TrackList = ({
  isPaused,
  onPress,
  onRemove,
  onSortEnd,
  tracks,
  users = []
}) => {
  const data = tracks.reduce(
    (tot, track, i) => ({
      ...tot,
      [track.id]: { ...track, position: i + 1 }
    }),
    {}
  );
  const order = tracks.map(track => track.id);
  return tracks.length > 0 ? (
    <List
      activeOpacity={0.8}
      data={data}
      onRowMoved={onSortEnd}
      order={order}
      renderRow={row => (
        <Track
          isPaused={isPaused}
          onPress={onPress}
          onRemove={onRemove}
          position={row.position}
          track={row}
          user={users.find(u => u.id === row.user)}
        />
      )}
    />
  ) : (
    <View>
      <Empty>No Tracks</Empty>
      <NavButton isButton route="EditTracks" text="Add Tracks" />
    </View>
  );
};

TrackList.propTypes = {
  isPaused: PropTypes.bool,
  onPress: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  tracks: trackList,
  users: accountList
};

export default TrackList;
