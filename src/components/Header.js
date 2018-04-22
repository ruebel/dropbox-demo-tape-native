import React from 'react';
import PropTypes from 'prop-types';
import styled, { withTheme } from 'styled-components/native';
import { Switch, Route } from 'react-router-native';

import IconButton from './IconButton';
import Loading from './Loading';
import PlaylistTitle from './PlaylistTitle';

const Left = styled.View`
  position: absolute;
  left: 0;
  top: ${p => p.theme.size.statusBarHeight};
  z-index: 1;
`;

const Right = styled.View`
  position: absolute;
  right: 0;
  top: ${p => p.theme.size.statusBarHeight};
`;

const TitleWrapper = styled.View`
  align-items: center;
  display: flex;
  flex: 1;
  flex-direction: row;
  justify-content: center;
`;

const Wrapper = styled.View`
  align-items: center;
  background-color: ${p => p.theme.color.secondary};
  flex-direction: row;
  justify-content: center;
  height: 84px;
  padding-top: ${p => p.theme.size.statusBarHeight};
  position: relative;
`;

const Header = ({ theme }) => {
  const iconColor = theme.color.textSecondary;
  return (
    <Wrapper>
      <Left>
        <Switch>
          <Route
            exact
            path="/menu"
            render={({ history }) => (
              <IconButton
                color={iconColor}
                icon="close"
                onPress={history.goBack}
              />
            )}
          />
          <Route
            exact
            path="/"
            render={({ history }) => (
              <IconButton
                color={iconColor}
                icon="menu"
                onPress={() => history.push('/menu')}
              />
            )}
          />
          <Route
            render={({ history }) => (
              <IconButton
                color={iconColor}
                icon="chevron-left"
                onPress={history.goBack}
              />
            )}
          />
        </Switch>
      </Left>
      <TitleWrapper>
        <Switch>
          <Route path="/playlist" component={PlaylistTitle} />
          <Route render={() => <Loading color={iconColor} />} />
        </Switch>
      </TitleWrapper>
      <Right>
        <Switch>
          <Route
            exact
            path="/"
            render={({ history }) => (
              <IconButton
                color={iconColor}
                icon="add"
                onPress={() => history.push('/create')}
              />
            )}
          />
          <Route
            exact
            path="/playlist"
            render={({ history }) => (
              <IconButton
                color={iconColor}
                icon="add"
                onPress={() => history.push('/playlist/add')}
              />
            )}
          />
        </Switch>
      </Right>
    </Wrapper>
  );
};

Header.propTypes = {
  theme: PropTypes.object
};

export default withTheme(Header);
