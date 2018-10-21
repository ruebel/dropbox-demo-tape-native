import React, { Component } from 'react';
import { StatusBar } from 'react-native';
import styled from 'styled-components';
import { createStackNavigator } from 'react-navigation';

import { color } from '../styles/theme';

import Container from './Container';
// import CreatePlaylist from './CreatePlaylist';
import Menu from './Menu';
import Player from './Player';
// import Playlist from './Playlist';
import Playlists from './Playlists';

const Body = styled.View`
  flex: 1;
  padding-top: 8px;
`;

const RootStack = createStackNavigator(
  {
    // CreatePlaylist: {
    //   screen: CreatePlaylist
    // },
    Menu: {
      screen: Menu
    },
    // PlayList: {
    //   screen: Playlist
    // },
    Playlists: {
      screen: Playlists
    }
  },
  {
    initialRouteName: 'Playlists',
    navigationOptions: {
      headerStyle: {
        backgroundColor: color.secondary
      },
      headerTintColor: color.textExtraLight,
      headerTitleStyle: {
        fontWeight: 'bold'
      }
    }
  }
);

class App extends Component {
  render() {
    return (
      <Container>
        <StatusBar barStyle="light-content" />
        <Body>
          <RootStack />
        </Body>
        <Player />
      </Container>
    );
  }
}

export default App;
