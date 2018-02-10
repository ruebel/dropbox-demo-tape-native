import React, { Component } from 'react';
import { View } from 'react-native';
import { Link, Switch, Route } from 'react-router-native';

import { H1 } from './typography';
import Container from './Container';
import Loading from './Loading';
import Player from './Player';
import Playlist from './Playlist';
import Playlists from './Playlists';

class App extends Component {
  render() {
    return (
      <Container>
        <View>
          <Link to="/">
            <H1>Demo Tape</H1>
          </Link>
          <Loading />
        </View>
        <View>
          <Switch>
            <Route exact path="/" component={Playlists} />
            <Route path="/playlist" component={Playlist} />
          </Switch>
        </View>
        <Player />
      </Container>
    );
  }
}

export default App;
