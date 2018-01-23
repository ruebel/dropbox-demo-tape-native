import React from 'react';
import PropTypes from 'prop-types';
import { View } from 'react-native';
import SwipeRow from './SwipeRow';
import styled from 'styled-components/native';

import { getFilePath, getFileName } from '../utils';

const Back = styled.TouchableOpacity`
  align-items: center;
  background-color: ${p => p.theme.color.error};
  flex: 1;
  flex-direction: row;
  justify-content: flex-end;
  padding: 15px;
`;

const BackText = styled.Text`
  color: ${p => p.theme.color.textExtraLight};
`;

const Inner = styled.View`
  align-items: center;
  background-color: white;
  display: flex;
  flex-direction: row;
  padding: 20px;
`;

const Name = styled.Text`
  color: ${p => p.theme.color.textPrimary};
`;

const Path = styled.Text`
  color: ${p => p.theme.color.textLight};
  font-size: 10px;
`;

const Position = styled.Text`
  color: ${p => p.theme.color.textPrimary};
  width: 23px;
`;

const Wrapper = styled(SwipeRow)`
  border-top-color: ${p => p.theme.color.borderPrimary};
  border-top-width: 1px;
`;

const Track = ({ onRemove, position, sortHandlers, track }) => (
  <Wrapper
    underlayColor="#eee"
    rightOpenValue={-85}
    sortHandlers={sortHandlers}
    {...sortHandlers}
  >
    <Back onPress={() => onRemove(track)}>
      <BackText>Remove</BackText>
    </Back>
    <Inner>
      <Position>{position}</Position>
      <View>
        <Name>{getFileName(track.path)}</Name>
        <Path>{getFilePath(track.path)}</Path>
      </View>
    </Inner>
  </Wrapper>
);

Track.propTypes = {
  onRemove: PropTypes.func.isRequired,
  position: PropTypes.number,
  sortHandlers: PropTypes.object,
  track: PropTypes.object
};

export default Track;
