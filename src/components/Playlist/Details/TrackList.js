import React from 'react';
import PropTypes from 'prop-types';
import SortableListView from 'react-native-sortable-listview';
import styled from 'styled-components/native';
import Track from './Track';

import { trackList } from '../../../types';

const List = styled(SortableListView)`
  flex: 1;
  margin-top: 8px;
`;

const TrackList = ({ onRemove, onSortEnd, tracks }) => {
  const data = tracks.reduce(
    (tot, track, i) => ({
      ...tot,
      [track.id]: { ...track, position: i + 1 }
    }),
    {}
  );
  const order = tracks.map(track => track.id);
  return (
    <List
      data={data}
      onRowMoved={onSortEnd}
      order={order}
      renderRow={row => (
        <Track onRemove={onRemove} position={row.position} track={row} />
      )}
    />
  );
};

TrackList.propTypes = {
  onRemove: PropTypes.func.isRequired,
  onSortEnd: PropTypes.func.isRequired,
  tracks: trackList
};

export default TrackList;
