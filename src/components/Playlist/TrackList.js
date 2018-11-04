import React from 'react';
import PropTypes from 'prop-types';
import SortableListView from 'react-native-sortable-listview';
import styled from 'styled-components';
import Track from './Track';
import { Empty } from '../typography';

import { accountList, trackList } from '../../types';

const List = styled(SortableListView)`
  flex: 1;
  margin-top: 8px;
`;

const TrackList = ({ onPress, onRemove, onSortEnd, tracks, users = [] }) => {
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
          onPress={onPress}
          onRemove={onRemove}
          position={row.position}
          track={row}
          user={users.find(u => u.id === row.user)}
        />
      )}
    />
  ) : (
    <Empty>No Tracks</Empty>
  );
};

TrackList.propTypes = {
  onPress: PropTypes.func,
  onRemove: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  tracks: trackList,
  users: accountList
};

export default TrackList;
