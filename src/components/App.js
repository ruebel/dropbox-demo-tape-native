import React, { Component } from 'react';
import { View } from 'react-native';
import { Link, Switch, Route } from 'react-router-native';
import styled from 'styled-components/native';

import { H1 } from './typography';
import Container from './Container';
import Loading from './Loading';
import Player from './Player';
import Playlist from './Playlist';
import Playlists from './Playlists';

const Title = styled(H1)`
  text-align: center;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <View>
          <Link to="/">
            <Title>Demo Tape</Title>
          </Link>
          <Loading />
        </View>
        <View style={{ flex: 1 }}>
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
