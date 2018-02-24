import React, { Component } from 'react';
import { Switch, Route } from 'react-router-native';
import styled from 'styled-components/native';

import Container from './Container';
import CreatePlaylist from './CreatePlaylist';
import Header from './Header';
import Menu from './Menu';
import Player from './Player';
import Playlist from './Playlist';
import Playlists from './Playlists';

const Body = styled.View`
  flex: 1;
  padding-top: 8px;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Body>
          <Switch>
            <Route exact path="/" component={Playlists} />
            <Route path="/create" component={CreatePlaylist} />
            <Route path="/menu" component={Menu} />
            <Route path="/playlist" component={Playlist} />
          </Switch>
        </Body>
        <Player />
      </Container>
    );
  }
}

export default App;
