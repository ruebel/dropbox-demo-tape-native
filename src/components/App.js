import React, { Component } from 'react';
import { View } from 'react-native';
import { Link, Switch, Route } from 'react-router-native';
import styled from 'styled-components/native';

import { H1 } from './typography';
import Container from './Container';
import CreatePlaylist from './CreatePlaylist';
import Loading from './Loading';
import Player from './Player';
import Playlist from './Playlist';
import Playlists from './Playlists';

const Title = styled(H1)`
  font-size: 12px;
  text-align: center;
  margin-right: 4px;
`;

const TitleWrapper = styled.View`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

class App extends Component {
  render() {
    return (
      <Container>
        <View>
          <Link to="/">
            <TitleWrapper>
              <Title>Demo Tape</Title>
              <Loading />
            </TitleWrapper>
          </Link>
        </View>
        <View style={{ flex: 1 }}>
          <Switch>
            <Route exact path="/" component={Playlists} />
            <Route path="/create" component={CreatePlaylist} />
            <Route path="/playlist" component={Playlist} />
          </Switch>
        </View>
        <Player />
      </Container>
    );
  }
}

export default App;
