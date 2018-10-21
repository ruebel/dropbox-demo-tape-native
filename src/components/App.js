import React, { Component } from 'react';
import { createStackNavigator } from 'react-navigation';

import { color } from '../styles/theme';

import Container from './Container';
import CreatePlaylist from './CreatePlaylist';
import Menu from './Menu';
import Player from './Player';
import Playlist from './Playlist';
import Playlists from './Playlists';

const RootStack = createStackNavigator(
  {
    CreatePlaylist: {
      screen: CreatePlaylist
    },
    Menu: {
      screen: Menu
    },
    Playlist: {
      screen: Playlist
    },
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
        <RootStack />
        <Player />
      </Container>
    );
  }
}

export default App;
